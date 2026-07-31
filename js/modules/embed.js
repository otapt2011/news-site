(function() {
  window.App = window.App || {};
  window.App.embed = {
    renderEmbed: (type, url) => {
      const container = document.getElementById('embed-container');
      if (!container) return;
      let embedHtml = '';
      if (type === 'youtube') {
        const id = extractYouTubeId(url);
        if (id) embedHtml = `<div class="embed-container"><iframe src="https://www.youtube.com/embed/${id}" allowfullscreen></iframe></div>`;
      } else if (type === 'tiktok') {
        const id = extractTikTokId(url);
        if (id) embedHtml = `<div class="embed-container"><iframe src="https://www.tiktok.com/embed/v2/${id}" allowfullscreen></iframe></div>`;
      }
      container.innerHTML = embedHtml || '';
    }
  };
  
  function extractYouTubeId(url) {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?#]+)/);
    return match ? match[1] : null;
  }
  
  function extractTikTokId(url) {
    const match = url.match(/tiktok\.com\/@[\w.-]+\/video\/(\d+)/);
    return match ? match[1] : null;
  }
})();