// scripts/dev-server.ts
// Minimal static dev server using Bun. Serve index.html, /public, and /demo-dist.

const port = Number(process.env.PORT || 5173);

function notFound() {
  return new Response('Not Found', { status: 404 });
}

function fileResponse(path: string, type?: string) {
  try {
    const f = Bun.file(path);
    if (!f.size) return notFound();
    return new Response(f, type ? { headers: { 'Content-Type': type } } : {});
  } catch (e) {
    return notFound();
  }
}

function guessType(p: string): string | undefined {
  if (p.endsWith('.js')) return 'application/javascript';
  if (p.endsWith('.css')) return 'text/css';
  if (p.endsWith('.svg')) return 'image/svg+xml';
  if (p.endsWith('.png')) return 'image/png';
  if (p.endsWith('.ico')) return 'image/x-icon';
  if (p.endsWith('.map')) return 'application/json';
  if (p.endsWith('.html')) return 'text/html; charset=utf-8';
  return;
}

const server = Bun.serve({
  port,
  async fetch(req) {
    const url = new URL(req.url);
    const p = url.pathname;

    if (p === '/' || p === '/index.html') {
      return fileResponse('index.html', 'text/html; charset=utf-8');
    }

    // Serve favicon.ico from public directory
    if (p === '/favicon.ico') {
      return fileResponse('public/favicon.ico', 'image/x-icon');
    }

    if (p.startsWith('/public/')) {
      const local = p.slice('/'.length);
      return fileResponse(local, guessType(local));
    }

    if (p.startsWith('/demo-dist/')) {
      const local = p.slice('/'.length);
      return fileResponse(local, guessType(local));
    }

    return notFound();
  },
});

console.log(`Dev server running at http://localhost:${server.port}`);

