(function() {
  window.App = window.App || {};
  window.App.ui = {
    renderNewsList: (articles) => {
      const container = document.getElementById('news-list');
      container.innerHTML = articles.map(a => `
        <div class="news-card">
          <a href="article.html?id=${a.id}">
            <div class="news-card-title">${escapeHtml(a.title)}</div>
            <div class="news-card-meta">
              <i class="fa-regular fa-calendar" style="color: var(--text-secondary);"></i>
              ${new Date(a.created_at).toLocaleDateString()}
            </div>
            <div class="news-card-excerpt">${escapeHtml(a.content.substring(0, 120))}${a.content.length > 120 ? '...' : ''}</div>
          </a>
        </div>
      `).join('');
    },

    renderArticle: (article) => {
      const container = document.getElementById('article-detail');
      container.innerHTML = `
        <h1 class="article-title">${escapeHtml(article.title)}</h1>
        <div class="article-meta">
          <i class="fa-regular fa-calendar" style="color: var(--text-secondary);"></i>
          ${new Date(article.created_at).toLocaleDateString()}
        </div>
        <div class="article-body">${escapeHtml(article.content)}</div>
        <div id="embed-container"></div>
      `;
    },

    renderDashboard: (articles) => {
      const container = document.getElementById('dashboard');
      container.innerHTML = `
        <table class="dashboard-table">
          <thead><tr><th>Title</th><th style="width:70px;">Actions</th></tr></thead>
          <tbody>
            ${articles.map(a => `
              <tr>
                <td>${escapeHtml(a.title)}</td>
                <td>
                  <button class="action-btn" onclick="window.location='edit.html?id=${a.id}'" title="Edit"><i class="fa-solid fa-pen-to-square" style="color: var(--primary);"></i></button>
                  <button class="action-btn" onclick="deleteArticle(${a.id})" title="Delete"><i class="fa-solid fa-trash" style="color: var(--danger);"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    },

    showMessage: (text, type = 'error') => {
      // Remove existing toast
      const existing = document.querySelector('.toast');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = `toast ${type}`;
      toast.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}"></i> ${text}`;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3500);
    }
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
})();
