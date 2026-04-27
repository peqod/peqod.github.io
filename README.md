# ontodesign

Obsidian vault + static site in one repo. Vault opens at the repo root. The site renders only `writing/published/`, bucketed into `about` / `projects` / `log`.

## Write a post

Drop a `.md` file into one of:

- `writing/published/about/`
- `writing/published/projects/`
- `writing/published/log/`

Frontmatter example:

```yaml
---
title: hello
status: published
created: 2026-04-27
---
```

`title` and `created` are read by the build. Other fields (`threads`, `language`, etc.) are ignored by the site.

## Build

Requires Node 18+.

```
npm install
npm run build
```

Output goes to `site/`. Open `site/index.html` directly in any browser — no server, no JS required at runtime.

## What's tracked vs ignored

Tracked: `writing/published/`, `site/`, `.obsidian/` core configs, `package.json`, `.gitignore`, `README.md`.

Ignored (see `.gitignore`): `journal/`, `reference/`, `threads/`, `_templates/`, `projects/`, `writing/drafts/`, `writing/fragments/`, `writing/ready/`, Obsidian local state, `node_modules/`.
