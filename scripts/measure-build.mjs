import { readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
const base = '/erdenvaux-bags-next';
async function walk(directory) {
  return (
    await Promise.all(
      (await readdir(directory, { withFileTypes: true })).map((entry) =>
        entry.isDirectory()
          ? walk(`${directory}/${entry.name}`)
          : `${directory}/${entry.name}`,
      ),
    )
  ).flat();
}
const files = await walk('out');
const entries = await Promise.all(
  files.map(async (file) => {
    const buffer = await readFile(file);
    return {
      file,
      bytes: buffer.length,
      gzipBytes: /\.(js|css|html|txt)$/.test(file)
        ? gzipSync(buffer).length
        : null,
    };
  }),
);
const sum = (extension) => {
  const selected = entries.filter((entry) => entry.file.endsWith(extension));
  return {
    files: selected.length,
    bytes: selected.reduce((total, entry) => total + entry.bytes, 0),
    gzipBytes: selected.every((entry) => entry.gzipBytes !== null)
      ? selected.reduce((total, entry) => total + entry.gzipBytes, 0)
      : null,
  };
};
const byFile = new Map(entries.map((entry) => [entry.file, entry]));
const routes = await Promise.all(
  entries
    .filter((entry) => entry.file.endsWith('.html'))
    .map(async (entry) => {
      const html = await readFile(entry.file, 'utf8');
      const scripts = [
        ...new Set(
          [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*>/g)]
            .filter((match) => !/\bnomodule\b/i.test(match[0]))
            .map(
              (match) => new URL(match[1], 'https://example.invalid').pathname,
            ),
        ),
      ];
      const metrics = scripts.map((url) => {
        const file = `out${url.startsWith(base) ? url.slice(base.length) : url}`;
        const asset = byFile.get(file);
        if (!asset)
          throw new Error(`Referenced script missing from export: ${url}`);
        return asset;
      });
      return {
        file: entry.file,
        htmlBytes: entry.bytes,
        htmlGzipBytes: entry.gzipBytes,
        modernInitialScripts: scripts.length,
        modernInitialJsBytes: metrics.reduce(
          (total, asset) => total + asset.bytes,
          0,
        ),
        modernInitialJsGzipBytes: metrics.reduce(
          (total, asset) => total + (asset.gzipBytes ?? 0),
          0,
        ),
      };
    }),
);
console.log(
  JSON.stringify(
    {
      totals: {
        javascript: sum('.js'),
        css: sum('.css'),
        html: sum('.html'),
        routePayloads: sum('.txt'),
        images: sum('.webp'),
        fonts: sum('.woff2'),
      },
      fonts: entries.filter((entry) => entry.file.endsWith('.woff2')),
      largestImage: entries
        .filter((entry) => entry.file.endsWith('.webp'))
        .sort((a, b) => b.bytes - a.bytes)[0],
      routes,
    },
    null,
    2,
  ),
);
