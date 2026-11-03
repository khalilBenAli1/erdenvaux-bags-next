import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
const root = resolve('out');
const base = '/erdenvaux-bags-next';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.txt': 'text/plain; charset=utf-8',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.xml': 'application/xml',
  '.ico': 'image/x-icon',
};
createServer(async (req, res) => {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    res.writeHead(405).end();
    return;
  }
  let path;
  try {
    path = decodeURIComponent(
      new URL(req.url ?? '/', 'http://localhost').pathname,
    );
  } catch {
    res.writeHead(400).end();
    return;
  }
  if (path === '/') {
    res.writeHead(302, { Location: `${base}/` }).end();
    return;
  }
  if (!path.startsWith(`${base}/`)) {
    res.writeHead(404).end('Not found');
    return;
  }
  let file = resolve(root, `.${path.slice(base.length)}`);
  if (file !== root && !file.startsWith(`${root}${sep}`)) {
    res.writeHead(400).end();
    return;
  }
  try {
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const body = await readFile(file);
    res
      .writeHead(200, {
        'Content-Type': types[extname(file)] ?? 'application/octet-stream',
      })
      .end(req.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (
      error &&
      typeof error === 'object' &&
      'code' in error &&
      (error.code === 'ENOENT' || error.code === 'ENOTDIR')
    ) {
      const body = await readFile(resolve(root, '404.html')).catch(() =>
        Buffer.from('Not found'),
      );
      res
        .writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' })
        .end(req.method === 'HEAD' ? undefined : body);
    } else {
      console.error('Static preview read failed');
      res.writeHead(500).end();
    }
  }
}).listen(4202, '127.0.0.1', () =>
  console.log(`ErdenVaux preview: http://127.0.0.1:4202${base}/`),
);
