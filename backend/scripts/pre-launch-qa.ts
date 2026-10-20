import http from 'http';
import app from '../src/app';
import { generateAccessToken } from '../src/utils/jwt';

interface TestResult {
  name: string;
  category: string;
  passed: boolean;
  error?: string;
  details?: any;
}

const results: TestResult[] = [];

function recordTest(category: string, name: string, passed: boolean, error?: string, details?: any) {
  results.push({ name, category, passed, error, details });
  const icon = passed ? '✅ PASS' : '❌ FAIL';
  console.log(`[${category}] ${icon}: ${name}${error ? ` -> ${error}` : ''}`);
}

function makeRequest(
  server: http.Server,
  path: string,
  method: string = 'GET',
  headers: Record<string, string> = {},
  body?: any
): Promise<{ statusCode: number; headers: http.IncomingHttpHeaders; data: any }> {
  return new Promise((resolve, reject) => {
    const address = server.address() as any;
    const req = http.request(
      {
        hostname: '127.0.0.1',
        port: address.port,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          let parsed = null;
          try {
            parsed = JSON.parse(raw);
          } catch {
            parsed = raw;
          }
          resolve({ statusCode: res.statusCode || 500, headers: res.headers, data: parsed });
        });
      }
    );

    req.on('error', reject);

    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

async function runAudit() {
  console.log('\n========================================');
  console.log('🚀 VANTA AGENCY — PRE-LAUNCH AUTOMATED AUDIT');
  console.log('========================================\n');

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', () => resolve()));
  const port = (server.address() as any).port;
  console.log(`Ephemeral test server running on port ${port}...\n`);

  try {
    // ─── 1. Health & Status Endpoints ───
    {
      const res = await makeRequest(server, '/api/health');
      recordTest(
        'Routing & Health',
        'GET /api/health returns 200 with service: backend',
        res.statusCode === 200 && res.data?.status === 'ok'
      );
    }
    {
      const res = await makeRequest(server, '/api');
      recordTest(
        'Routing & Health',
        'GET /api returns 200 online without exposing internal secrets',
        res.statusCode === 200 && res.data?.status === 'online' && !res.data?.JWT_SECRET
      );
    }

    // ─── 2. Security Headers (Helmet) ───
    {
      const res = await makeRequest(server, '/api/health');
      const hasNosniff = res.headers['x-content-type-options'] === 'nosniff';
      const hasDnsPrefetch = res.headers['x-dns-prefetch-control'] !== undefined;
      recordTest(
        'Security Headers',
        'Helmet applies X-Content-Type-Options: nosniff and security headers',
        hasNosniff && hasDnsPrefetch,
        undefined,
        { headers: res.headers }
      );
    }

    // ─── 3. Authentication & Protected Routes ───
    {
      const res = await makeRequest(server, '/api/auth/me');
      recordTest(
        'Authentication',
        'GET /api/auth/me rejects unauthenticated requests with 401 UNAUTHORIZED',
        res.statusCode === 401 && res.data?.error?.code === 'UNAUTHORIZED'
      );
    }
    {
      const res = await makeRequest(server, '/api/auth/me', 'GET', { Authorization: 'Bearer malformed.invalid.token' });
      recordTest(
        'Authentication',
        'GET /api/auth/me rejects malformed token with 401 INVALID_TOKEN',
        res.statusCode === 401 && res.data?.error?.code === 'INVALID_TOKEN'
      );
    }
    {
      const validToken = generateAccessToken({ userId: 'test-admin-id', email: 'admin@vanta.studio', role: 'admin' });
      const res = await makeRequest(server, '/api/auth/me', 'GET', { Authorization: `Bearer ${validToken}` });
      recordTest(
        'Authentication',
        'GET /api/auth/me accepts valid JWT token and returns user payload',
        res.statusCode === 200 && res.data?.data?.email === 'admin@vanta.studio'
      );
    }

    // ─── 4. Input Validation & Form Protection ───
    {
      const res = await makeRequest(server, '/api/messages', 'POST', {}, { name: '', email: '', message: '' });
      recordTest(
        'Form Validation',
        'POST /api/messages rejects empty fields with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }
    {
      const res = await makeRequest(server, '/api/messages', 'POST', {}, { name: '   ', email: '   ', message: '   ' });
      recordTest(
        'Form Validation',
        'POST /api/messages rejects whitespace-only inputs with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }
    {
      const res = await makeRequest(
        server,
        '/api/messages',
        'POST',
        {},
        { name: 'John Doe', email: 'invalid-email-syntax', message: 'Legitimate message content here' }
      );
      recordTest(
        'Form Validation',
        'POST /api/messages rejects invalid email syntax with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }
    {
      const res = await makeRequest(
        server,
        '/api/messages',
        'POST',
        {},
        { name: 'John Doe', email: 'valid@vanta.studio', message: 'Hi' }
      );
      recordTest(
        'Form Validation',
        'POST /api/messages rejects message shorter than 5 chars with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }

    // ─── 5. Protected Mutating Endpoints Authorization ───
    {
      const res = await makeRequest(server, '/api/projects/reorder', 'PUT', {}, { projectIds: ['1', '2'] });
      recordTest(
        'Authorization',
        'PUT /api/projects/reorder blocks unauthenticated modification with 401',
        res.statusCode === 401
      );
    }
    {
      const res = await makeRequest(server, '/api/messages', 'GET');
      recordTest(
        'Authorization',
        'GET /api/messages (inbox) blocks public access with 401',
        res.statusCode === 401
      );
    }
    {
      const res = await makeRequest(server, '/api/media', 'POST');
      recordTest(
        'Authorization',
        'POST /api/media blocks unauthenticated upload with 401',
        res.statusCode === 401
      );
    }

    // ─── 6. Login Input Validation ───
    {
      const res = await makeRequest(
        server,
        '/api/auth/login',
        'POST',
        {},
        { email: '', password: '' }
      );
      recordTest(
        'Authentication',
        'POST /api/auth/login rejects empty credentials with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }
    {
      const res = await makeRequest(
        server,
        '/api/auth/login',
        'POST',
        {},
        { email: 'admin@vanta.studio' }
      );
      recordTest(
        'Authentication',
        'POST /api/auth/login rejects missing password with 400 VALIDATION_ERROR',
        res.statusCode === 400 && res.data?.error?.code === 'VALIDATION_ERROR'
      );
    }

  } finally {
    server.close();
  }

  // ─── Summary Report ───
  console.log('\n========================================');
  console.log('📊 AUDIT SUMMARY RESULTS');
  console.log('========================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = results.filter((r) => !r.passed).length;
  console.log(`Total Automated Tests Executed: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.error('\n❌ AUDIT FAILED WITH UNRESOLVED DEFECTS');
    process.exit(1);
  } else {
    console.log('\n✅ ALL PRE-LAUNCH AUTOMATED AUDIT CHECKS PASSED');
    process.exit(0);
  }
}

runAudit();
