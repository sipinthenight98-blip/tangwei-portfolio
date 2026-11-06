const film = document.getElementById('project-film');
const loadFilmButton = document.getElementById('load-film');
let filmObjectUrl;

async function loadFilm() {
  if (!film || !loadFilmButton) return;
  loadFilmButton.disabled = true;
  loadFilmButton.textContent = '正在加载视频…';
  try {
    if (location.hostname.endsWith('.github.io')) {
      const parts = [];
      for (let i = 1; i <= 6; i++) {
        const path = `assets/campaign-film-${String(i).padStart(2, '0')}.bin`;
        const response = await fetch(path);
        if (!response.ok) throw new Error(`无法读取视频片段 ${i}`);
        parts.push(await response.arrayBuffer());
      }
      const blob = new Blob(parts, { type: 'video/mp4' });
      if (blob.size !== 11163940) throw new Error('视频文件不完整');
      filmObjectUrl = URL.createObjectURL(blob);
      film.src = filmObjectUrl;
    } else {
      film.src = 'assets/campaign-film.mp4';
    }
    film.load();
    loadFilmButton.remove();
    await film.play().catch(() => {});
  } catch (error) {
    console.error(error);
    loadFilmButton.disabled = false;
    loadFilmButton.textContent = '加载失败，点击重试 ↗';
  }
}
loadFilmButton?.addEventListener('click', loadFilm);
addEventListener('pagehide', () => { if (filmObjectUrl) URL.revokeObjectURL(filmObjectUrl); });

const lightbox = document.getElementById('lightbox');
const lightboxImage = lightbox?.querySelector('img');
const zoomable = document.querySelectorAll('.star-gallery img, .pink-grid > img, .unomi-grid img, .xhs-gallery img');
zoomable.forEach(image => {
  image.tabIndex = 0;
  image.setAttribute('role', 'button');
  image.setAttribute('aria-label', `放大查看：${image.alt}`);
  const show = () => {
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightbox.showModal();
  };
  image.addEventListener('click', show);
  image.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); show(); }
  });
});
lightbox?.querySelector('button')?.addEventListener('click', () => lightbox.close());
lightbox?.addEventListener('click', event => { if (event.target === lightbox) lightbox.close(); });

const pinkProductImage = document.querySelector('.pink-product img');
if (pinkProductImage) {
  const officialVisual = new Image();
  officialVisual.onload = () => {
    pinkProductImage.src = officialVisual.src;
    pinkProductImage.alt = 'PinkPunch 官网场景化产品视觉';
    const credit = document.querySelector('.pink-product small');
    if (credit) credit.textContent = '图片来源：PinkPunch 官网';
  };
  officialVisual.src = 'https://www.pinkpunch.com/cdn/shop/files/20.png?v=1724318855&width=1080';
}
