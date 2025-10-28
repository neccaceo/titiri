document.body.classList.add('is-first-load');

const routes = {
  '/': 'home.html',
  '/index.html': 'home.html',
  '/character': 'character.html',
  '/character.html': 'character.html', // .html 경로 추가
  '/gallery': 'gallery.html',
  '/gallery.html': 'gallery.html', // .html 경로 추가
  '/info': 'info.html',
  '/info.html': 'info.html', // .html 경로 추가
};

/**
 * 3. [수정] GitHub Pages basePath 계산 로직 수정
 * * GitHub Pages (예: .../my-repo/) 또는 로컬/루트 도메인 (/) 에서
 * 모두 작동하도록 수정된 basePath 로직입니다.
 */
let basePath = '/'; // 기본값 (localhost 또는 루트 도메인)
if (location.hostname.endsWith('github.io')) {
  // GitHub Pages인 경우: 경로가 /repo-name/ 일 수 있음
  // location.pathname에서 첫 번째 세그먼트(repo-name)를 가져옴
  const pathSegments = location.pathname.split('/');
  if (pathSegments.length > 1 && pathSegments[1] !== '') {
    basePath = `/${pathSegments[1]}/`;
  }
}
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



