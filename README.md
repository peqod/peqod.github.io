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

### Images

Both Obsidian-native syntaxes work:

```
![[macintsh.gif]]              # wikilink embed (Obsidian default paste)
![[macintsh.gif|small mac]]    # wikilink with custom alt
![alt text](macintsh.gif)      # standard markdown
```

The build searches the whole vault for the referenced filename, copies it to `site/posts/_assets/<post-slug>/`, and rewrites the URL. Drop images anywhere in the vault (Obsidian's default paste lands them in `reference/attachments/`) — the build will find them by filename.

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
