---
title: From a List of Players to Live Payslips With Ash and Phoenix
description: How depart.cloud turns basic data from a game server into live
  payslips by using GenServers for background work, Ash to enforce access
  policies, and Phoenix LiveViews to update the page, without writing
  client-side code.
pubDate: 2026-10-20
---
I've recently been working on [depart.cloud](https://depart.cloud), a multiplayer network for OMSI 2 using [openOMSI](https://openomsi.org). Alongside the game servers, I wanted a website with live driving statistics that gave people a reason to return.

It needed to be quick to build, reliable and affordable to run. Elixir, Ash and Phoenix LiveView fitted those requirements well. The payroll system is a useful example: it turns basic observations from a game server into monthly virtual payslips that update while the driver has the page open.

The [Ash Framework](https://ash-hq.org) is probably the most intuitive backend framework I have used. The idea is simple: you have *resources*, which are things your application understands. Then you have *actions*, representing operations on these resources. And perhaps most importantly, you have *policies*, which determine whether or not an *actor* can perform an *action* on a *resource*.

[Phoenix LiveView](https://www.phoenixframework.org) keeps interactive page state and event handling on the server. Each connected LiveView runs in an Elixir process, receiving browser events and server messages. When its state changes, LiveView sends the relevant rendered changes to its small JS client, which updates the page.

In this article I'll focus on the live payroll section of [depart.cloud](http://depart.cloud) -- and why Elixir with Ash and Phoenix turned out to work really well.

## How payroll works

depart.cloud's payroll system turns recorded driving sessions into monthly virtual payslips. It tracks each session's contribution to a month, including driving time and tours, and maintains totals with a breakdown by map. This is done based on a heuristic from the OMSI server's player list API. As an ongoing session gains confirmed time, payroll applies the difference from its previous contribution, avoiding counting the whole session again.

### The `Players` GenServer

A *GenServer* in Elixir is a stateful background process which communicates using message passing. [depart.cloud](http://depart.cloud) has multiple GenServers running constantly, polling data from the OMSI game servers and maintaining a cache. One of these, `Departcloud.Players`, polls an OMSI server for player data, matches player names to registered accounts, and caches it. The following code schedules the next `:poll` message and announces the latest player state to `PubSub` subscribers:

```ex
timer = Process.send_after(self(), :poll, state.interval_s * 1_000)

Phoenix.PubSub.broadcast(
  Departcloud.PubSub,
  topic(state.server_id),
  {:players_updated, state.server_id, state.frames, state.interval_s, state.last_ok_at}
)

{:noreply, %{state | timer: timer}}
```

This server keeps watching the game regardless of whether anyone has the website open and the rest of the application shares the cached results. Each successful poll compares the latest player observations with the duties already being tracked. Recognised drivers starting a tour get a new session; changing tours or leaving the game closes an existing session. These stored sessions are what payroll (and our wider stats system) accounts for.

### The `Payroll.Worker` GenServer

Next, we have a worker for our payroll system. This GenServer mostly just listens for messages and coördinates payroll work. It listens for player updates, as sent by our `Players` server above, runs its own reconciliation timer, and performs final accounting when a duty ends. This is its handler for the aforementioned `:players_updated` broadcast:

```ex
def handle_info({:players_updated, server_id, _, _, fetched_at}, state) do
  safely(fn ->
    if fetched_at do
      Session
      |> Ash.Query.filter(server_id == ^server_id and is_nil(ended_at))
      |> Ash.read!(actor: Departcloud.Tracking.recorder())
      |> Enum.each(fn session ->
        :ok = Departcloud.Payroll.account(session, fetched_at)
      end)
    end
  end)

  {:noreply, state}
end
```

We read the server's *open sessions* from Ash, and account for their time up to the latest successful observation. Note that the actor used here is `Tracking.recorder()` -- active sessions belong to the `Tracking` system, so we use this to describe our authority in reading this data.

Once our payroll transaction succeeds, we broadcast a notification identifying the affected month to the user's `PubSub` topic:

```ex
{:ok, months} ->
  Enum.each(
    months,
    &Phoenix.PubSub.broadcast(
      Departcloud.PubSub,
      topic(session.user_id),
      {:payroll_updated, &1}
    )
  )
```

### It all comes together: a payroll update reaches the page

We have a Phoenix LiveView, served at `https://depart.cloud/payslips`. This listens for `:payroll_updated` messages on the user's topic, renders the relevant HTML and pushes updates to the browser. LiveView's JS client applies the update without a full page reload. Here's the code: the LiveView checks whether the change concerns the currently-open month or the list of payslips, and sends the rendered changes to the browser:

```ex
def handle_info({:payroll_updated, month}, socket) do
  if socket.assigns[:loaded_month] in [nil, Calendar.strftime(month, "%Y-%m")],
    do: reload(socket),
    else: {:noreply, socket}
end
```

`reload` is our own helper which chooses how to update the page with new data, whether it be for the payslip list or a specific payslip. After fetching the updated payslip, we replace its main figures in the socket assigns and reset the streamed map breakdown. LiveView tracks these changes and sends the resulting update to the browser.

```ex
socket
|> assign(:payslip, Map.delete(payslip, :maps))
|> stream(:map_pay, payslip.maps, reset: true)
```

And my favourite part is that all of our actions are under Ash policies. We define authorisation alongside the resource, so the LiveView and background worker use the same access rules. Payroll operations pass this internal actor:

```ex
def actor, do: ${payroll?: true}
```

The policy allows it to read and update payslips, while drivers can only read their own, subject to the owner check:

```ex
policies do
  policy action_type(:read) do
    authorize_if actor_attribute_equals(:payroll?, true)
    authorize_if Departcloud.Checks.PayslipOwner
  end

  policy action_type([:create, :update]) do
    authorize_if actor_attribute_equals(:payroll?, true)
  end
end
```

Ash applies these access rules when its actions run. The owner check becomes a filter restricting which payslips the query can return. That keeps the access rules always attached to the resource, wherever we call it.

The whole flow is ordinary Elixir message passing: the player process announces an observation, the payroll worker accounts for it through Ash, and the LiveView receives a notification and updates the state. The browser gets an updated payslips without its own implementation of the payroll rules. All of this is done with one cached poll per interval to the game server's player list API, regardless of how many users are visiting.