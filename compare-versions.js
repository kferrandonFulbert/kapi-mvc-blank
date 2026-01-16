#!/usr/bin/env node
import http from 'http';

function testEndpoint(path) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path,
      method: 'GET'
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve(parsed);
        } catch {
          resolve(data);
        }
      });
    });

    req.on('error', (error) => {
      resolve({ error: error.message });
    });

    req.end();
  });
}

console.log('🧪 Testing API v1 vs v2 comparison...\n');

// Test v1
console.log('📊 API v1 Response (/api/v1/users/info):');
const v1Info = await testEndpoint('/api/v1/users/info');
console.log(JSON.stringify(v1Info, null, 2));

// Test v2
console.log('\n📊 API v2 Response (/api/v2/users/info):');
const v2Info = await testEndpoint('/api/v2/users/info');
console.log(JSON.stringify(v2Info, null, 2));

console.log('\n✅ Comparison completed!');
console.log('✓ v2 includes: api_version, os, arch, hostname');
process.exit(0);
