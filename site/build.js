import {
  readdirSync,
  readFileSync,
  writeFileSync,
  mkdirSync,
  existsSync,
  rmSync,
  copyFileSync,
} from "node:fs";
import { join, basename, dirname, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const publishedDir = join(repoRoot, "writing", "published");
const siteDir = here;
const categories = ["about", "projects", "log"];

const imageExts = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".avif", ".ico",
]);

const skipDirs = new Set([".git", ".obsidian", "node_modules", ".trash"]);
const skipRelDirs = new Set([
  "site/posts",
  "site/about",
  "site/projects",
  "site/log",
]);

const slugify = (s) =>
  s.toLowerCase().replace(/\.md$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtDate = (d) => {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d);
};

const buildImageIndex = () => {
  const byBasename = new Map();
  const byRelPath = new Map();
  const walk = (dir) => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (skipDirs.has(entry.name)) continue;
      const p = join(dir, entry.name);
      const rel = p.slice(repoRoot.length + 1).replace(/\\/g, "/");
      if (entry.isDirectory()) {
        if (skipRelDirs.has(rel)) continue;
        walk(p);
      } else if (imageExts.has(extname(entry.name).toLowerCase())) {
        byRelPath.set(rel, p);
        if (!byBasename.has(entry.name)) byBasename.set(entry.name, p);
      }
    }
  };
  walk(repoRoot);
  return { byBasename, byRelPath };
};

const expandWikilinkEmbeds = (md) =>
  md.replace(/!\[\[([^\]|]+?)(?:\|([^\]]+))?\]\]/g, (_, target, alt) => {
    const t = target.trim();
    const a = (alt || basename(t, extname(t))).trim();
    return `![${a}](${encodeURI(t)})`;
  });

const resolveImage = (src, postSourceDir, imageIndex) => {
  if (/^(https?:|data:|\/\/|#)/i.test(src)) return null;
  const decoded = decodeURI(src.split("#")[0].split("?")[0]);
  const tryRel = resolve(postSourceDir, decoded);
  if (existsSync(tryRel) && imageExts.has(extname(tryRel).toLowerCase())) return tryRel;
  const asRepoRel = decoded.replace(/^\/+/, "").replace(/\\/g, "/");
  if (imageIndex.byRelPath.has(asRepoRel)) return imageIndex.byRelPath.get(asRepoRel);
  const base = basename(decoded);
  if (imageIndex.byBasename.has(base)) return imageIndex.byBasename.get(base);
  return null;
};

const copyAndRewrite = (html, postSlug, postSourceDir, imageIndex) => {
  const destDir = join(siteDir, "posts", "_assets", postSlug);
  let copied = false;
  const out = html.replace(/(<img\s+[^>]*?\bsrc=)"([^"]+)"/g, (match, prefix, src) => {
    if (/^(https?:|data:)/i.test(src)) return match;
    const abs = resolveImage(src, postSourceDir, imageIndex);
    if (!abs) {
      console.warn(`  image not found in vault: ${src}  (post: ${postSlug})`);
      return match;
    }
    if (!copied) {
      mkdirSync(destDir, { recursive: true });
      copied = true;
    }
    const dest = join(destDir, basename(abs));
    if (!existsSync(dest)) copyFileSync(abs, dest);
    return `${prefix}"_assets/${postSlug}/${basename(abs)}"`;
  });
  return out;
};

const page = ({ title, body, depth }) => {
  const cssPath = "../".repeat(depth) + "styles.css";
  const homePath = "../".repeat(depth) + "index.html";
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${cssPath}">
</head>
<body>
<header><a href="${homePath}">ontodesign</a></header>
<main>
${body}
</main>
</body>
</html>
`;
};

const collectPosts = (cat, imageIndex) => {
  const dir = join(publishedDir, cat);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = readFileSync(join(dir, f), "utf8");
      const { data, content } = matter(raw);
      const slug = slugify(f);
      const expanded = expandWikilinkEmbeds(content);
      const rendered = marked.parse(expanded);
      const html = copyAndRewrite(rendered, slug, dir, imageIndex);
      return {
        slug,
        sourceFile: f,
        category: cat,
        title: data.title || basename(f, ".md"),
        created: data.created || "",
        html,
        frontmatter: data,
      };
    })
    .sort((a, b) => fmtDate(b.created).localeCompare(fmtDate(a.created)));
};

const emptyDir = (dir) => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
    return;
  }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    rmSync(join(dir, entry.name), {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 100,
    });
  }
};

const cleanGenerated = () => {
  for (const cat of categories) emptyDir(join(siteDir, cat));
  emptyDir(join(siteDir, "posts"));
};

const writePost = (post) => {
  const body = `<article>
<h1>${escapeHtml(post.title)}</h1>
${post.created ? `<p class="meta">${escapeHtml(fmtDate(post.created))} &middot; <a href="../${post.category}/index.html">${post.category}</a></p>` : ""}
${post.html}
</article>`;
  writeFileSync(
    join(siteDir, "posts", `${post.slug}.html`),
    page({ title: post.title, body, depth: 1 })
  );
};

const writeCategoryIndex = (cat, posts) => {
  const items = posts
    .map(
      (p) =>
        `<li><a href="../posts/${p.slug}.html">${escapeHtml(p.title)}</a>${p.created ? ` <span class="meta">${escapeHtml(fmtDate(p.created))}</span>` : ""}</li>`
    )
    .join("\n");
  const body = `<h1>${cat}</h1>
<ul class="post-list">
${items || "<li><em>nothing here yet</em></li>"}
</ul>`;
  writeFileSync(
    join(siteDir, cat, "index.html"),
    page({ title: cat, body, depth: 1 })
  );
};

const writeHome = (allByCat) => {
  const sections = categories
    .map((cat) => {
      const recent = allByCat[cat].slice(0, 5);
      const items = recent
        .map(
          (p) =>
            `<li><a href="posts/${p.slug}.html">${escapeHtml(p.title)}</a>${p.created ? ` <span class="meta">${escapeHtml(fmtDate(p.created))}</span>` : ""}</li>`
        )
        .join("\n");
      return `<section>
<h2><a href="${cat}/index.html">${cat}</a></h2>
<ul class="post-list">
${items || "<li><em>nothing here yet</em></li>"}
</ul>
</section>`;
    })
    .join("\n");
  const body = `<h1>ontodesign</h1>
${sections}`;
  writeFileSync(join(siteDir, "index.html"), page({ title: "ontodesign", body, depth: 0 }));
};

const main = () => {
  cleanGenerated();
  const imageIndex = buildImageIndex();
  console.log(`indexed ${imageIndex.byRelPath.size} image(s) in vault`);
  const byCat = {};
  for (const cat of categories) {
    const posts = collectPosts(cat, imageIndex);
    byCat[cat] = posts;
    for (const p of posts) writePost(p);
    writeCategoryIndex(cat, posts);
    console.log(`${cat}: ${posts.length} post(s)`);
  }
  writeHome(byCat);
  console.log("done.");
};

main();
