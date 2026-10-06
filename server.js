import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), "public");
const port = Number(process.env.PORT || 3000);
const mime = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".pdf": "application/pdf",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".webp": "image/webp",
  ".xml": "application/xml; charset=utf-8",
};

function safePath(urlPath) {
  const pathname = decodeURIComponent(new URL(urlPath, "http://localhost").pathname);
  const normalized = path.normalize(pathname).replace(/^([.][.][/\\])+/, "");
  return path.join(root, normalized.replace(/^[/\\]+/, ""));
}

async function send(filePath, response, status = 200) {
  const extension = path.extname(filePath).toLowerCase();
  response.writeHead(status, {
    "Cache-Control": extension === ".html" ? "no-cache" : "public, max-age=31536000, immutable",
    "Content-Type": mime[extension] || "application/octet-stream",
  });
  response.end(await readFile(filePath));
}

async function sendNotFound(response) {
  const notFound = path.join(root, "404.html");
  const exists = await stat(notFound).catch(() => null);
  if (exists?.isFile()) {
    await send(notFound, response, 404);
    return;
  }
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Page not found");
}

const server = createServer(async (request, response) => {
  try {
    const requested = safePath(request.url || "/");
    const info = await stat(requested).catch(() => null);
    if (info?.isFile()) {
      await send(requested, response);
      return;
    }
    if (info?.isDirectory()) {
      const indexFile = path.join(requested, "index.html");
      const indexInfo = await stat(indexFile).catch(() => null);
      if (indexInfo?.isFile()) {
        await send(indexFile, response);
        return;
      }
    }
    await sendNotFound(response);
  } catch (error) {
    console.error(error);
    response.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    response.end("Internal server error");
  }
});

server.listen(port, "0.0.0.0", () => {
  console.log(`ZEENACADEMIA listening on ${port}`);
});
