import { SignJWT, jwtVerify } from 'jose';
import bcryptModule from 'bcryptjs';
import { queryD1 } from './lib/d1-client.js';

export const config = { runtime: 'edge' };

// In Edge Runtime, the default export might be wrapped; extract the real compare.
const compare = bcryptModule.default?.compare || bcryptModule.compare;

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function handler(request) {
  const url = new URL(request.url);

  if (request.method === 'POST') {
    try {
      const { username, password } = await request.json();
      const rows = await queryD1('SELECT * FROM admins WHERE username = ?', [username]);
      if (!rows.length) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }
      const admin = rows[0];
      const valid = await compare(password, admin.password_hash);
      if (!valid) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }

      const token = await new SignJWT({ sub: admin.id, username: admin.username })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('24h')
        .sign(SECRET);

      return new Response(JSON.stringify({ token }), { status: 200 });
    } catch (e) {
      return new Response(JSON.stringify({ message: 'Server error', details: e.message }), { status: 500 });
    }
  }

  if (request.method === 'GET') {
    const authHeader = request.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) return new Response(JSON.stringify({ valid: false }), { status: 401 });
    try {
      await jwtVerify(token, SECRET);
      return new Response(JSON.stringify({ valid: true }), { status: 200 });
    } catch {
      return new Response(JSON.stringify({ valid: false }), { status: 401 });
    }
  }

  return new Response('Method not allowed', { status: 405 });
}
