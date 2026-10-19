# pedley.org

This is my personal website, built with Astro. Available as a template (see below). This site is set up to be managed using [Pages CMS](https://pagescms.org) if you wish.

## I want to use this as a template!

You're able to use this website as a template with little config required to make it your own.

### Create a new repo with the template

Click the big green button in the top right of this GitHub repository, or [click here](https://github.com/alecks/pedleyorg/generate). Choose a nice name.

### Edit the boring stuff

Here's a list of files that you should change:

- `astro.config.mjs`: replace my site URL with your own;
- `wrangler.jsonc`: change the deployment name if you're using Cloudflare Pages, or set up GitHub Pages, Vercel, etc.;
- `public/favicon.*`, `public/apple-touch-icon.svg`, `public/safari-pinned-tab.svg`: add your own favicon.

### Set up Pages CMS, or don't

You have two options for how you'd like to make the website your own: edit it yourself, or use [Pages CMS](https://pagescms.org). Pages allows you to edit your blog on-the-go, including uploading media and changing titles/descriptions. It adds zero overhead, as it's basically just an interface over the top of Git. Read ["A CMS for People Who Don't Want a CMS"](https://pedley.org/blog/a-cms-for-people-who-dont-want-a-cms/).

To set up Pages, simply head to its website and add it as an app on your GitHub repo. If you've done it correctly, you should see "Site settings", "Projects", "Blog posts" and "About". Go through these tabs to make the site your own.

### Deploy it

I suggest Cloudflare Pages (this is pre-configured for you), GitHub Pages, Vercel or Netlify. Anything will work.

Before deploying, make sure you've changed everything you need to.

### If you don't want Pages CMS

Edit:

- `src/data/site.json`;
- `src/data/projects.json`;
- `src/pages/about.md`;
- `src/content/blog`;
- `public/uploads`.

(You're missing out)

## License

Copyright © 2026 Alex Pedley.

The source code for this website is licensed under the
[GNU Affero General Public License v3.0](LICENSE).

Unless otherwise stated, all blog posts, photographs,
and other original editorial content are © 2026
Alex Pedley. All rights reserved.

The AGPL does not grant permission to reproduce or
redistribute this content.

## Acknowledgements

This website uses the [Flexoki](https://github.com/kepano/flexoki)
colour palette by Steph Ango, licensed under the MIT License.
