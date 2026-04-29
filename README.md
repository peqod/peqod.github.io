# ontodesign

Obsidian vault + Jekyll site in one repo. Vault opens at the repo root. The site renders posts in the `_log/`, `_projects/`, and `_about/` collections.

## Write a post

Drop a `.md` file into one of:

- `_about/`
- `_projects/`
- `_log/`

Frontmatter example:

```yaml
---
title: hello
status: published
created: 2026-04-27
---
```

`title` and `created` are read by the site. Other fields (`threads`, `language`, etc.) are passed through but ignored.

### Images

Both Obsidian-native syntaxes work:

```
![[macintsh.gif]]              # wikilink embed (Obsidian default paste)
![[macintsh.gif|small mac]]    # wikilink with custom alt
![alt text](macintsh.gif)      # standard markdown
```

The `_plugins/wikilinks.rb` plugin expands wikilinks to standard markdown before kramdown sees them. The `_plugins/vault_images.rb` plugin scans the whole vault for the referenced filename, copies it to `/posts/_assets/<post-slug>/`, and rewrites the URL. Drop images anywhere in the vault — the build will find them by basename.

## Build

Requires Ruby 3.x and Bundler.

```
bundle install
bundle exec jekyll serve
```

Output goes to `_site/`. `jekyll serve` runs a local server at `http://localhost:4000`.

## Deploy

GitHub Actions builds the site on every push to `main` and deploys to GitHub Pages (`.github/workflows/pages.yml`). The repo Pages source must be set to "GitHub Actions" in repo Settings → Pages.

## What's tracked vs ignored

Tracked: `_log/`, `_projects/`, `_about/`, `_layouts/`, `_includes/`, `_plugins/`, `assets/`, top-level pages, `_config.yml`, `Gemfile`, `Gemfile.lock`, `.obsidian/` core configs, `.gitignore`, `README.md`.

Ignored (see `.gitignore`): `journal/`, `reference/`, `threads/`, `_templates/`, `projects/`, `writing/drafts/`, `writing/fragments/`, `writing/ready/`, Obsidian local state, `_site/`, `.jekyll-cache/`, `vendor/`.
