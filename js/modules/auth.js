(function() {
  window.App = window.App || {};
  const TOKEN_KEY = 'admin_token';
  
  window.App.auth = {
    saveToken: (token) => localStorage.setItem(TOKEN_KEY, token),
    getToken: () => localStorage.getItem(TOKEN_KEY),
    isLoggedIn: () => !!localStorage.getItem(TOKEN_KEY),
    requireAuth: () => {
      if (!localStorage.getItem(TOKEN_KEY)) {
        window.location.href = '/admin/login.html';
      }
    },
    logout: () => {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = '/admin/login.html';
    }
  };
})();