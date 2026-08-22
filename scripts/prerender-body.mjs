/**
 * vite build 이후 dist 를 로컬로 띄워 실제 Chrome 으로 열고,
 * #root 의 렌더 결과를 dist/index.html 에 굳힌다.
 *
 * 왜: 이 데모는 SPA 라 JS 실행 전에는 본문이 없다. 링크 미리보기와
 * JS 없는 읽기에는 빈 페이지였다 (webcare 진단 실측: JS 전 본문 1단어).
 *
 * 빌드를 Chrome 에 묶지 않는다: 못 찾으면 경고만 남기고 건너뛴다.
 * GitHub Actions ubuntu 러너에는 /usr/bin/google-chrome 이 있다.
 */
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { spawn, execSync } from "node:child_process";
import { mkdtempSync, rmSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "gh-pages-dist");

const CHROME =
  process.env.CHROME_PATH ||
  ["/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
   "/usr/bin/google-chrome", "/usr/bin/chromium-browser", "/usr/bin/chromium"]
    .find((p) => existsSync(p));

if (!CHROME) {
  console.warn("prerender-body: Chrome 을 찾지 못해 본문 스냅숏을 건너뛴다 (head 프리렌더는 완료됨).");
  process.exit(0);
}


// dist 를 그대로 서빙하는 최소 서버. Cloudflare 의 flat-html 규칙과 같게
// /pricing → pricing.html 을 돌려준다.
const MIME = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css",
  ".svg": "image/svg+xml", ".png": "image/png", ".webp": "image/webp",
  ".woff2": "font/woff2", ".json": "application/json", ".txt": "text/plain", ".xml": "application/xml" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let f = join(DIST, p);
  if (p.endsWith("/")) f = join(DIST, p, "index.html");
  if (!existsSync(f) || statSync(f).isDirectory()) {
    if (existsSync(f + ".html")) f = f + ".html";
    else if (existsSync(join(f, "index.html"))) f = join(f, "index.html");
    else { res.writeHead(404); res.end(); return; }
  }
  res.writeHead(200, { "content-type": MIME[extname(f)] || "application/octet-stream" });
  res.end(readFileSync(f));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const PORT = server.address().port;

// Chrome 을 CDP 로 직접 연다. 의존성 없음 — Node 의 전역 WebSocket 을 쓴다.
const profile = mkdtempSync(join(tmpdir(), "prerender-"));
const chrome = spawn(CHROME, ["--headless=new", "--disable-gpu", "--no-first-run",
  `--user-data-dir=${profile}`, "--remote-debugging-port=0"], { stdio: "ignore" });
let port = null;
for (let i = 0; i < 150; i++) {
  const f = join(profile, "DevToolsActivePort");
  if (existsSync(f)) { port = +readFileSync(f, "utf8").split("\n")[0]; if (port) break; }
  await new Promise((r) => setTimeout(r, 100));
}
if (!port) { console.error("prerender-body: Chrome 이 뜨지 않았다"); process.exit(1); }

async function openPage() {
  const t = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(t.webSocketDebuggerUrl);
  await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
  let id = 0; const waits = new Map();
  ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && waits.has(m.id)) { waits.get(m.id)(m); waits.delete(m.id); } };
  const send = (method, params = {}) => new Promise((res) => { const i = ++id; waits.set(i, res); ws.send(JSON.stringify({ id: i, method, params })); });
  return { send, close: () => ws.close() };
}

// 라우트 → dist 의 flat 파일명 (prerender-head 와 같은 규칙)
const fileFor = (path) => {
  if (path === "/") return "index.html";
  return path.replace(/^\//, "").replace(/\/$/, "") + ".html";
};

const page = await openPage();
await page.send("Page.enable");
let done = 0, skipped = 0;

for (const path of ["/"]) {
  const file = join(DIST, fileFor(path));
  if (!existsSync(file)) {
    // case-studies/xxx.html 처럼 디렉터리 판이 있으면 그쪽을 본다
    console.warn(`prerender-body: ${fileFor(path)} 없음 — 건너뜀`);
    skipped++;
    continue;
  }
  await page.send("Page.navigate", { url: `http://127.0.0.1:${PORT}${path}` });
  // 렌더 완료 대기: #root 에 자식이 생기고, 두 프레임 연속 같은 길이면 안정으로 본다.
  let html = "";
  for (let i = 0; i < 40; i++) {
    await new Promise((r) => setTimeout(r, 250));
    const r1 = await page.send("Runtime.evaluate", {
      expression: "document.getElementById('root')?.innerHTML?.length || 0",
      returnByValue: true,
    });
    const len1 = r1.result?.result?.value ?? 0;
    if (len1 > 200) {
      const prev = len1;
      await new Promise((r) => setTimeout(r, 350));
      const again = await page.send("Runtime.evaluate", {
        expression: "document.getElementById('root').innerHTML.length", returnByValue: true });
      if ((again.result?.result?.value ?? -1) === prev) {
        const got = await page.send("Runtime.evaluate", {
          expression: "document.getElementById('root').innerHTML", returnByValue: true });
        html = got.result?.result?.value || "";
        break;
      }
    }
  }
  if (!html) { console.warn(`prerender-body: ${path} 렌더를 못 받았다 — 건너뜀`); skipped++; continue; }

  const doc = readFileSync(file, "utf8");
  // 빈 <div id="root"></div> 에만 넣는다. 이미 내용이 있으면(재실행) 갈아끼운다.
  // Vite 는 스크립트를 head 에 두므로 body 의 root div 는 </body> 로 닫힌다.
  const re = /(<div id="root">)([\s\S]*?)(<\/div>\s*<\/body>)/;
  if (!re.test(doc)) { console.warn(`prerender-body: ${fileFor(path)} 에서 root 마커를 못 찾았다 — 건너뜀`); skipped++; continue; }
  writeFileSync(file, doc.replace(re, `$1${html}$3`), "utf8");
  done++;
}

page.close();
chrome.kill();
server.close();
// Chrome 이 프로필에 마지막 쓰기를 끝낼 때까지 잠깐 기다린다. 못 지워도 빌드는 성공이다.
await new Promise((r) => setTimeout(r, 700));
try { rmSync(profile, { recursive: true, force: true, maxRetries: 3, retryDelay: 300 }); } catch { /* tmp 는 OS 가 치운다 */ }
console.log(`prerender-body: ${done}개 라우트 본문 굳힘, ${skipped}개 건너뜀`);
