import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync, rmSync } from "node:fs";
import { join, basename, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";
import { marked } from "marked";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "..");
const publishedDir = join(repoRoot, "writing", "published");
const siteDir = here;
const categories = ["about", "projects", "log"];

const slugify = (s) =>
  s.toLowerCase().replace(/\.md$/, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const escapeHtml = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const fmtDate = (d) => {
  if (!d) return "";
  if (d instanceof Date) return d.toISOString().slice(0, 10);
  return String(d);
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

const collectPosts = (cat) => {
  const dir = join(publishedDir, cat);
  if (!existsSync(dir)) return [];
  return readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => {
      const raw = readFileSync(join(dir, f), "utf8");
      const { data, content } = matter(raw);
      return {
        slug: slugify(f),
        sourceFile: f,
        category: cat,
        title: data.title || basename(f, ".md"),
        created: data.created || "",
        html: marked.parse(content),
        frontmatter: data,
      };
    })
    .sort((a, b) => fmtDate(b.created).localeCompare(fmtDate(a.created)));
};

const cleanGenerated = () => {
  for (const cat of categories) {
    const d = join(siteDir, cat);
    if (existsSync(d)) rmSync(d, { recursive: true, force: true });
    mkdirSync(d, { recursive: true });
  }
  const postsDir = join(siteDir, "posts");
  if (existsSync(postsDir)) rmSync(postsDir, { recursive: true, force: true });
  mkdirSync(postsDir, { recursive: true });
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
  const byCat = {};
  for (const cat of categories) {
    const posts = collectPosts(cat);
    byCat[cat] = posts;
    for (const p of posts) writePost(p);
    writeCategoryIndex(cat, posts);
    console.log(`${cat}: ${posts.length} post(s)`);
  }
  writeHome(byCat);
  console.log("done.");
};

main();
