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
const siteDir = join(repoRoot, "docs");
const categories = ["about", "projects", "log"];

const imageExts = new Set([
  ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp", ".bmp", ".avif", ".ico",
]);

const skipDirs = new Set([".git", ".obsidian", "node_modules", ".trash"]);
const skipRelDirs = new Set([
  "docs",
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

const excerpt = (html, max = 240) => {
  const m = html.match(/<p>([\s\S]*?)<\/p>/);
  if (!m) return "";
  const text = m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  return text.slice(0, max).replace(/\s+\S*$/, "") + "…";
};

let aboutLinkTarget = "about/index.html";

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

const navCats = ["projects", "log"];

const buildSideNav = (byCat, { depth, activeCat, activeSlug }) => {
  const rel = "../".repeat(depth);
  const homePath = rel + "index.html";
  const renderCat = (cat) => {
    const posts = byCat[cat] || [];
    const isOpen = activeCat === cat;
    const items = posts
      .map((p) => {
        const isCurrent = activeCat === cat && activeSlug === p.slug;
        return `<li${isCurrent ? ' class="current"' : ""}><a href="${rel}posts/${p.slug}.html">${escapeHtml(p.title)}</a></li>`;
      })
      .join("\n");
    return `<details${isOpen ? " open" : ""}>
<summary><a href="${rel}${cat}/index.html">${cat}</a></summary>
<ul>
${items || "<li><em>nothing here yet</em></li>"}
</ul>
</details>`;
  };
  return `<a class="brand" href="${homePath}">ontodesign</a>
${navCats.map(renderCat).join("\n")}`;
};

const page = ({ title, body, depth, byCat, activeCat, activeSlug }) => {
  const rel = "../".repeat(depth);
  const cssPath = rel + "styles.css";
  const aside = buildSideNav(byCat, { depth, activeCat, activeSlug });
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${escapeHtml(title)}</title>
<link rel="stylesheet" href="${cssPath}">
</head>
<body>
<div class="layout">
<aside>
${aside}
</aside>
<main>
${body}
</main>
</div>
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

const writePost = (post, siblings, idx, byCat) => {
  const prev = idx > 0 ? siblings[idx - 1] : null;
  const next = idx < siblings.length - 1 ? siblings[idx + 1] : null;
  const linkOrSpan = (p, label) =>
    p ? `<a href="${p.slug}.html">${label}</a>` : `<span class="disabled">${label}</span>`;
  const body = `<article>
<h1>${escapeHtml(post.title)}</h1>
${post.created ? `<p class="meta">${escapeHtml(fmtDate(post.created))} &middot; <a href="../${post.category}/index.html">${post.category}</a></p>` : ""}
${post.html}
<p class="postnav">
${linkOrSpan(prev, "prev")} | <a href="../${post.category}/index.html">home</a> | ${linkOrSpan(next, "next")}
</p>
</article>`;
  writeFileSync(
    join(siteDir, "posts", `${post.slug}.html`),
    page({
      title: post.title,
      body,
      depth: 1,
      byCat,
      activeCat: post.category,
      activeSlug: post.slug,
    })
  );
};

const writeCategoryIndex = (cat, posts, byCat) => {
  const items = posts
    .map(
      (p) => `<article class="preview">
<h2><a href="../posts/${p.slug}.html">${escapeHtml(p.title)}</a></h2>
${p.created ? `<p class="meta">${escapeHtml(fmtDate(p.created))}</p>` : ""}
<p>${escapeHtml(excerpt(p.html))}</p>
<p class="more"><a href="../posts/${p.slug}.html">more &rarr;</a></p>
</article>`
    )
    .join("\n");
  const body = `<h1>${cat}</h1>
${items || "<p><em>nothing here yet</em></p>"}`;
  writeFileSync(
    join(siteDir, cat, "index.html"),
    page({ title: cat, body, depth: 1, byCat, activeCat: cat })
  );
};

const writeHome = (byCat) => {
  const rawAbout = byCat.about[0]?.html ?? "<p><em>no about yet</em></p>";
  const aboutHtml = rawAbout.replace(/(\bsrc=)"_assets\//g, '$1"posts/_assets/');
  const recent = [...byCat.log, ...byCat.projects]
    .sort((a, b) => fmtDate(b.created).localeCompare(fmtDate(a.created)))
    .slice(0, 10);
  const recentItems = recent
    .map(
      (p) => `<article class="preview">
<h2><a href="posts/${p.slug}.html">${escapeHtml(p.title)}</a></h2>
${p.created ? `<p class="meta">${escapeHtml(fmtDate(p.created))} &middot; ${p.category}</p>` : ""}
<p>${escapeHtml(excerpt(p.html))}</p>
<p class="more"><a href="posts/${p.slug}.html">more &rarr;</a></p>
</article>`
    )
    .join("\n");
  const body = `<article class="about">
${aboutHtml}
</article>
<section class="recent">
<h2>recent</h2>
${recentItems || "<p><em>nothing here yet</em></p>"}
</section>`;
  writeFileSync(
    join(siteDir, "index.html"),
    page({
      title: "ontodesign",
      body,
      depth: 0,
      byCat,
      activeCat: "about",
      activeSlug: byCat.about[0]?.slug,
    })
  );
};

const main = () => {
  if (!existsSync(siteDir)) mkdirSync(siteDir, { recursive: true });
  cleanGenerated();
  copyFileSync(join(here, "styles.css"), join(siteDir, "styles.css"));
  writeFileSync(join(siteDir, ".nojekyll"), "");
  const imageIndex = buildImageIndex();
  console.log(`indexed ${imageIndex.byRelPath.size} image(s) in vault`);
  const byCat = {};
  for (const cat of categories) byCat[cat] = collectPosts(cat, imageIndex);
  if (byCat.about.length === 1) {
    aboutLinkTarget = `posts/${byCat.about[0].slug}.html`;
  }
  for (const cat of categories) {
    byCat[cat].forEach((p, i) => writePost(p, byCat[cat], i, byCat));
    writeCategoryIndex(cat, byCat[cat], byCat);
    console.log(`${cat}: ${byCat[cat].length} post(s)`);
  }
  writeHome(byCat);
  console.log("done.");
};

main();
