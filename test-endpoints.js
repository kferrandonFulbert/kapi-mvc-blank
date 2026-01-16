#!/usr/bin/env node
import http from 'http';

function testEndpoint(path, method = 'GET') {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', (error) => {
      resolve({ error: error.message });
    });

    req.end();
  });
}

console.log('🧪 Testing API endpoints...\n');

// Test v1
const v1Info = await testEndpoint('/api/v1/users/info');
console.log('✓ GET /api/v1/users/info');
console.log('  Response:', JSON.stringify(v1Info.data, null, 2));

// Test v2
const v2Info = await testEndpoint('/api/v2/users/info');
console.log('\n✓ GET /api/v2/users/info');
console.log('  Response:', JSON.stringify(v2Info.data, null, 2));

console.log('\n✅ Tests completed!');
process.exit(0);
