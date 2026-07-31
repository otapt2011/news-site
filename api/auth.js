import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { queryD1 } from './lib/d1-client.js';

export const config = { runtime: 'edge' };

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export default async function handler(request) {
  const url = new URL(request.url);

  if (request.method === 'POST') {
    try {
      const { username, password } = await request.json();
      const rows = await queryD1('SELECT * FROM admins WHERE username = ?', [username]);

      // --- DEBUG: return the row we found and whether password matches ---
      if (rows.length === 0) {
        return new Response(JSON.stringify({ error: 'No admin found', username }), { status: 401 });
      }

      const admin = rows[0];
      const valid = await bcrypt.compare(password, admin.password_hash);

      return new Response(JSON.stringify({
        debug: true,
        username,
        stored_hash: admin.password_hash,
        password_entered: password,
        match: valid
      }), { status: valid ? 200 : 401 });
      // -----------------------------------------------------------------
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
