import request from 'supertest';
import app, { initializeRoutes } from '../app.js';

describe('User Controller', () => {
  beforeAll(async () => {
    await initializeRoutes();
  });

  test('GET /api/v1/users/info returns 200 and msg', async () => {
    const res = await request(app)
      .get('/api/v1/users/info')
      .expect(200);
    
    expect(res.body).toEqual({ msg: 'ok' });
  });
});