document.body.classList.add('is-first-load');

const base = '/titiri';

const routes = {
  [`${base}/`]: 'home.html',
  [`${base}/index.html`]: 'home.html',
  [`${base}/character`]: 'character.html',
  [`${base}/gallery`]: 'gallery.html',
  [`${base}/info`]: 'info.html',
};

const updateActiveNav = (path) => {
  const navLinks = document.querySelectorAll('nav a');

  navLinks.forEach(link => {
    link.classList.remove('active');
  });

  const normalizedPath = (path === '/index.html') ? '/' : path;
  
  const activeLink = document.querySelector(`nav a[href="${normalizedPath}"]`);

  if (activeLink) {
    activeLink.classList.add('active');
  }
};

const loadContent = async (path) => {
  const contentElement = document.getElementById('content');
  if (!contentElement) {
    console.error("'content' ID를 가진 <main> 요소를 찾을 수 없습니다.");
    return;
  }

  const normalizedPath = (path === '/index.html') ? '/' : path;
  const file = routes[normalizedPath] || routes['/']; 
  
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`페이지를 찾을 수 없습니다: ${file}`);
    const html = await response.text();
    
    contentElement.innerHTML = html;

    updateActiveNav(normalizedPath);

  } catch (error) {
    console.error('페이지 로드 실패:', error);
    contentElement.innerHTML = '<h2>페이지를 불러올 수 없습니다.</h2>';
  }
};

/**
 * 5. 링크 클릭을 가로채는 함수
 * @param {Event} event - 클릭 이벤트
 */
const onLinkClick = (event) => {
  const clickedLink = event.target.closest('nav a');

  if (!clickedLink) {
    return;
  }
  
  event.preventDefault(); 
  
  const path = new URL(clickedLink.href).pathname;

  if (path === location.pathname) {
    return;
  }
  history.pushState({}, '', path);
  
  loadContent(path);
};

window.addEventListener('popstate', () => {
  loadContent(location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
  document.body.addEventListener('click', onLinkClick);
  
  loadContent(location.pathname);

  setTimeout(() => {
    document.body.classList.remove('is-first-load');
  }, 2000); 
});




