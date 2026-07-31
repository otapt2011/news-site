export async function queryD1(sql, params = []) {
  const accountId = process.env.CF_ACCOUNT_ID;
  const databaseId = process.env.CF_DATABASE_ID;
  const token = process.env.CF_API_TOKEN;
  
  const res = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/d1/database/${databaseId}/query`,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, params }),
    }
  );
  
  const json = await res.json();
  if (!json.success) {
    throw new Error(json.errors?.[0]?.message || 'D1 query failed');
  }
  // Return the rows from the first result set
  return json.result?.[0]?.results || [];
}