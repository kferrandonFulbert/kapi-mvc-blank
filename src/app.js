import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import fs from 'node:fs';
import path from 'node:path';
import { pinoMiddleware } from './utils/logger.js';
import { rateLimit } from 'express-rate-limit'
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger.js';
import { initializePrisma } from './services/prisma.service.js';

dotenv.config();

// Initialize Prisma globally
initializePrisma();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const UPLOAD_DIR = process.env.UPLOAD_DIR || 'uploads';

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})
app.use(limiter);

app.use(cors());
app.use(pinoMiddleware);
app.use(express.json());

// Serve uploaded files statically
app.use(`/${UPLOAD_DIR}`, express.static(UPLOAD_DIR));

// Swagger UI
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/docs.json', (req, res) => res.json(swaggerSpec));

// Export function to initialize routes
export async function initializeRoutes() {
  const versionsDir = path.join(__dirname, './');
  console.log(versionsDir);
  const versionDirs = fs.readdirSync(versionsDir).filter(file => {
    const fullPath = path.join(versionsDir, file);
    return fs.statSync(fullPath).isDirectory() && /^v\d+$/.test(file);
  });


  // Sort versions numerically (v1, v2, v3, etc.)
  versionDirs.sort((a, b) => {
    const numA = Number.parseInt(a.slice(1), 10);
    const numB = Number.parseInt(b.slice(1), 10);
    return numA - numB;
  });

  // Load routes for each version
  for (const version of versionDirs) {
    const versionPath = path.join(__dirname, version);
    const routesPath = path.join(versionPath, 'routes');
   
    if (fs.existsSync(routesPath)) {
      const routeFiles = fs.readdirSync(routesPath).filter(f => f.endsWith('.routes.js'));
       console.log(routeFiles);
      for (const routeFile of routeFiles) {
        let routeName = routeFile.replace('.routes.js', ''); // e.g., 'auth', 'user', 'upload'
        
        // Pluralize route names for better REST convention
        if (routeName === 'user') routeName = 'users';
        if (routeName === 'citation') routeName = 'citations';
        if (routeName === 'upload') routeName = 'uploads';
        
        const routePath = path.join(routesPath, routeFile);
        
        try {
          const routeModule = await import(`file://${routePath}`);
          const router = routeModule.default;
          
          // Register route: /api/v1/auth, /api/v1/users, /api/v1/uploads, etc.
          const apiPath = `/api/${version}/${routeName}`;
          app.use(apiPath, router);
          console.log(`✓ Route registered: ${apiPath}`);
        } catch (err) {
          console.error(`✗ Failed to load route ${routePath}:`, err.message);
        }
      }
    }
  }
}

// Error handler — normalize multer and validation errors
app.use((err, req, res, next) => {
  // Multer-specific errors
  if (err?.name === 'MulterError') {
    const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    req.log?.warn({ err }, 'Multer error');
    return res.status(status).json({ error: err.message, code: err.code });
  }

  // Errors thrown by validators / custom errors
  if (err && (err.message || err.status)) {
    const status = Number.isInteger(err.status) && err.status >= 400 ? err.status : 400;
    req.log?.warn({ err }, 'Request error');
    return res.status(status).json({ error: err.message || 'Bad Request' });
  }

  // Fallback to 500
  if (err) {
    req.log?.error({ err }, 'Unhandled error');
    return res.status(500).json({ error: 'Internal Server Error' });
  }

  return next();
});

export default app; 
