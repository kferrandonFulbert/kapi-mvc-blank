import app, { initializeRoutes } from './app.js';

const PORT = process.env.PORT || 3000;

// Initialize routes then start server
await initializeRoutes();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});