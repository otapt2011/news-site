import { jwtVerify } from 'jose';
import { queryD1 } from './lib/d1-client.js';

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

async function authenticate(request) {
  const authHeader = request.headers.get('Authorization') || '';
  const token = authHeader.replace('Bearer ', '');
  if (!token) throw new Error('Unauthorized');
  await jwtVerify(token, SECRET);
}

export default async function handler(request) {
  const url = new URL(request.url);
  const method = request.method;
  
  // Public read routes
  if (method === 'GET') {
    const id = url.searchParams.get('id');
    if (id) {
      const rows = await queryD1('SELECT * FROM articles WHERE id = ?', [id]);
      if (!rows.length) return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 });
      return new Response(JSON.stringify(rows[0]), { status: 200 });
    } else {
      const rows = await queryD1('SELECT * FROM articles ORDER BY created_at DESC');
      return new Response(JSON.stringify(rows), { status: 200 });
    }
  }
  
  // Protected write routes
  try {
    await authenticate(request);
  } catch {
    return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
  }
  
  const body = method === 'DELETE' ? null : await request.json();
  const id = url.searchParams.get('id');
  
  if (method === 'POST') {
    const { title, content, embed_type, embed_url } = body;
    const result = await queryD1(
      'INSERT INTO articles (title, content, embed_type, embed_url) VALUES (?, ?, ?, ?) RETURNING *',
      [title, content, embed_type, embed_url || null]
    );
    return new Response(JSON.stringify(result[0]), { status: 201 });
  }
  
  if (method === 'PUT' && id) {
    const { title, content, embed_type, embed_url } = body;
    await queryD1(
      'UPDATE articles SET title = ?, content = ?, embed_type = ?, embed_url = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [title, content, embed_type, embed_url || null, id]
    );
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  
  if (method === 'DELETE' && id) {
    await queryD1('DELETE FROM articles WHERE id = ?', [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  }
  
  return new Response('Method not allowed', { status: 405 });
}