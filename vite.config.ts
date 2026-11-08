import { defineConfig } from 'vitest/config'
import { loadEnv, type Plugin } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

function devApiPlugin(): Plugin {
  return {
    name: 'dev-api-middleware',
    configureServer(server) {
      const loadedEnv = loadEnv('development', process.cwd(), '');
      Object.assign(process.env, loadedEnv);

      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split('?')[0];
        if (!url || !url.startsWith('/api/')) {
          return next();
        }

        try {
          if (url.startsWith('/api/auth/')) {
            const authHandler = (await import('./api/auth/[...auth]')).default;
            return authHandler(req, res);
          }
          if (url === '/api/projects') {
            const projectsHandler = (await import('./api/projects')).default;
            return projectsHandler(req, res);
          }
          if (url === '/api/startups') {
            const startupsHandler = (await import('./api/startups')).default;
            return startupsHandler(req, res);
          }
          if (url === '/api/admin/projects') {
            const adminProjectsHandler = (await import('./api/admin/projects')).default;
            return adminProjectsHandler(req, res);
          }
          if (url === '/api/admin/startups') {
            const adminStartupsHandler = (await import('./api/admin/startups')).default;
            return adminStartupsHandler(req, res);
          }
        } catch (err: unknown) {
          console.error('[Vite Dev API Error]:', err);
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          const errorMsg = err instanceof Error ? err.message : String(err);
          res.end(JSON.stringify({ error: errorMsg }));
          return;
        }

        next();
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] }),
    devApiPlugin(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
  },
})
