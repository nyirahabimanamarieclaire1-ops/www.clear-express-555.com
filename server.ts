import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/api.ts';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Request logger
  app.use((req, res, next) => {
    if (req.url.startsWith('/api')) {
      console.log(`[API] ${req.method} ${req.url}`);
    }
    next();
  });

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Clear Express 555 Logistics API',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      country: 'Rwanda',
      phone: '0798010110',
      email: 'clearexpress555@gmail.com',
    });
  });

  // API router
  app.use('/api', apiRouter);

  // Vite middleware in development vs Static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`CLEAR EXPRESS 555 - Logistics Engine`);
    console.log(`"Anything. Anywhere. Fast."`);
    console.log(`Server running at: http://0.0.0.0:${PORT}`);
    console.log(`Hotline: 0798010110 | clearexpress555@gmail.com`);
    console.log(`==================================================`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
