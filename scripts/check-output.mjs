import { readFile, stat, readdir } from "node:fs/promises";
import path from "node:path";
import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";

const prefix = (process.env.SITE_PATH_PREFIX || "/").replace(/\/$/, "");
const output = fileURLToPath(new URL("../dist/", import.meta.url));
async function findPages(directory) {
  const result = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...await findPages(file));
    else if (entry.name.endsWith(".html")) result.push(path.relative(output, file).split(path.sep).join("/"));
  }
  return result.sort();
}
const pages = await findPages(output);
assert(pages.length > 0, "dist contains no HTML pages; run build first");
let references = 0;
for (const file of pages) {
  const html = await readFile(path.join(output, file), "utf8");
  assert(!/\{%|\{\{/.test(html), `${file}: 템플릿 미전개`);
  assert.equal((html.match(/<h1(?:\s|>)/g) || []).length, 1, `${file}: h1 count`);
  const standalone = /<body\b[^>]*class="[^"]*\bstandalone-page\b/.test(html);
  for (const nav of html.matchAll(/<nav\b[^>]*>[\s\S]*?<\/nav>/g)) {
    assert((nav[0].match(/aria-current="page"/g) || []).length <= 1, `${file}: multiple current pages in one navigation`);
  }
  if (standalone) {
    assert(!html.includes('class="site-header"') && !html.includes('class="site-footer"'), `${file}: independent layout`);
    assert(!html.includes(`href="${prefix}/assets/css/layout.css"`), `${file}: shared layout CSS excluded`);
  }
  assert(html.includes('href="#main-content"') && html.includes('id="main-content"'), `${file}: skip link`);
  const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(new Set(ids).size, ids.length, `${file}: duplicate id`);
  for (const match of html.matchAll(/(?:aria-labelledby|aria-describedby|aria-controls|for)="([^"]+)"/g)) {
    for (const id of match[1].split(/\s+/)) assert(ids.includes(id), `${file}: missing ID reference ${id}`);
  }
  for (const match of html.matchAll(/(?:href|src)="([/#][^"]*)"/g)) {
    const [pathname, fragment] = match[1].split("#");
    if (pathname) assert(pathname.startsWith(prefix + "/"), `${file}: URL outside site prefix: ${pathname}`);
    let resource = pathname ? decodeURI(pathname.slice(prefix.length)) : `/${file}`;
    if (resource.endsWith("/")) resource += "index.html";
    assert((await stat(path.join(output, resource))).isFile(), `${file}: missing ${resource}`);
    if (fragment) {
      const target = await readFile(path.join(output, resource), "utf8");
      assert(target.includes(`id="${fragment}"`), `${file}: missing fragment ${match[1]}`);
    }
    references++;
  }
}

let fonts = 0;
async function checkAssets(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) await checkAssets(file);
    else if (entry.name.endsWith(".css")) {
      const css = await readFile(file, "utf8");
      for (const match of css.matchAll(/url\(["']?([^\s"')]+)["']?\)/g)) {
        if (/^(data:|https?:)/.test(match[1])) continue;
        const asset = path.resolve(path.dirname(file), match[1]);
        assert((await stat(asset)).isFile(), `${file}: missing CSS resource ${match[1]}`);
        references++;
      }
    } else if (entry.name.endsWith(".woff2")) {
      const bytes = await readFile(file);
      assert.equal(bytes.subarray(0, 4).toString("ascii"), "wOF2", `${file}: invalid WOFF2 signature`);
      fonts++;
    }
  }
}
await checkAssets(path.join(output, "assets"));
console.log(`PASS: ${pages.length} pages; ${references} local references; ${fonts} WOFF2 fonts; headings, IDs, ARIA references, navigation, template expansion.`);
