# Deployment notes

The site is configured for the default GitHub Pages URL:

```text
https://dithob.github.io
```

A real custom domain is intentionally not written into `public/CNAME` because the domain value has not been supplied yet. Before binding a custom domain:

1. Verify the domain in GitHub account settings.
2. Replace `public/CNAME.example` with `public/CNAME` containing only the verified domain.
3. Update `site` in `astro.config.mjs` and the URLs in `public/robots.txt` and `public/sitemap.xml`.
4. Configure DNS at the provider and enable HTTPS in GitHub Pages.

Do not commit a placeholder such as `YOUR_DOMAIN` as an active `CNAME` file.

## Publishing the Profile README

The `profile/` directory is a reviewable source copy. To publish it as the actual GitHub Profile README, copy its two files into the root of the public `Dithob/Dithob` repository:

```text
README.md
README.en.md
```

GitHub's profile renderer uses the non-empty root `README.md`; `README.en.md` is the manual language-switch target.
