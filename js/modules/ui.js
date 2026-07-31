(function() {
  window.App = window.App || {};
  window.App.ui = {
    renderNewsList: (articles) => {
      const container = document.getElementById('news-list');
      container.innerHTML = articles.map(a => `
        <div class="card">
          <a href="article.html?id=${a.id}">
            <div class="card-title">${escapeHtml(a.title)}</div>
            <div class="card-meta">
              <i class="fa-regular fa-calendar" style="color: var(--color-muted);"></i>
              ${new Date(a.created_at).toLocaleDateString()}
            </div>
            <div style="font-size:13px; color:var(--color-muted);">${escapeHtml(a.content.substring(0, 100))}${a.content.length > 100 ? '...' : ''}</div>
          </a>
        </div>
      `).join('');
    },

    renderArticle: (article) => {
      const container = document.getElementById('article-detail');
      container.innerHTML = `
        <h2>${escapeHtml(article.title)}</h2>
        <div class="card-meta" style="margin-bottom:8px">
          <i class="fa-regular fa-calendar" style="color: var(--color-muted);"></i>
          ${new Date(article.created_at).toLocaleDateString()}
        </div>
        <div class="article-content">${escapeHtml(article.content).replace(/\n/g, '<br>')}</div>
        <div id="embed-container"></div>
      `;
    },

    renderDashboard: (articles) => {
      const container = document.getElementById('dashboard');
      container.innerHTML = `
        <table class="dashboard-table">
          <thead><tr><th>Title</th><th>Actions</th></tr></thead>
          <tbody>
            ${articles.map(a => `
              <tr>
                <td>${escapeHtml(a.title)}</td>
                <td>
                  <button class="action-btn" onclick="window.location='edit.html?id=${a.id}'" title="Edit"><i class="fa-solid fa-pen-to-square" style="color: var(--color-primary);"></i></button>
                  <button class="action-btn" onclick="deleteArticle(${a.id})" title="Delete"><i class="fa-solid fa-trash" style="color: var(--color-danger);"></i></button>
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    },

    showMessage: (text, type = 'error') => {
      const msgDiv = document.getElementById('message') || document.createElement('div');
      msgDiv.id = 'message';
      msgDiv.className = `message ${type}`;
      msgDiv.innerHTML = `<i class="fa-solid ${type === 'error' ? 'fa-circle-exclamation' : 'fa-circle-check'}" style="color: inherit;"></i> ${text}`;
      if (!document.getElementById('message')) {
        document.querySelector('main').appendChild(msgDiv);
      }
      setTimeout(() => msgDiv.remove(), 4000);
    }
  };

  function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, m => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[m]));
  }
})();