#!/usr/bin/env node
import app, { initializeRoutes } from './src/app.js';

const PORT = process.env.PORT || 3000;

console.log('🔄 Initializing routes...');
await initializeRoutes();

console.log('✅ Routes initialized successfully!');
console.log('\nRegistered API endpoints:');
console.log('  - GET  /api/v1/users/info');
console.log('  - GET  /api/v1/users/profile (requires auth)');
console.log('  - POST /api/v1/auth/register');
console.log('  - POST /api/v1/auth/login');
console.log('  - POST /api/v1/uploads/:name');
console.log('  - GET  /docs (Swagger UI)');
console.log('  - GET  /docs.json (OpenAPI spec)');

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on port ${PORT}`);
});
