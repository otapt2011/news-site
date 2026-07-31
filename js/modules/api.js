(function() {
  const BASE = '/api';
  
  async function request(url, options = {}) {
    const res = await fetch(BASE + url, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Request failed');
    }
    return res.json();
  }
  
  window.App = window.App || {};
  window.App.api = {
    getNews: () => request('/news'),
    getArticle: (id) => request(`/news?id=${id}`),
    createArticle: (data, token) => request('/news', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
    updateArticle: (id, data, token) => request(`/news?id=${id}`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(data),
    }),
    deleteArticle: (id, token) => request(`/news?id=${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    }),
    login: (username, password) => request('/auth', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }).then(data => data.token),
  };
})();