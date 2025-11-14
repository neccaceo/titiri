document.body.classList.add('is-first-load');

const base = '/' + window.location.pathname.split('/')[1];

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

    // gallery.html 로드 시 script 실행
    if (normalizedPath === `${base}/gallery`) {
      initGallery();
    }

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

// Swiper.js 스크립트 추가 (head에)
const swiperScript = document.createElement('script');
swiperScript.src = 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js';
document.head.appendChild(swiperScript);

// gallery 초기화 함수
function initGallery() {
    const imageContainer = document.getElementById('image-container');
    const errorDiv = document.getElementById('error');
    const fullScreenModal = document.getElementById('fullScreenModal');
    const fullScreenImage = document.getElementById('fullScreenImage');
    const closeModalBtn = document.getElementById('closeModalBtn');

    let swiper = null;

    async function loadImages() {
        try {
            errorDiv.style.display = 'none';

            const images = [
                { "name": "이미지 1", "url": "https://picsum.photos/400/500?random=1", "source": "Picsum", "date": "2025-11-10" },
                { "name": "이미지 2", "url": "https://picsum.photos/400/500?random=2", "source": "Picsum", "date": "2025-10-15" },
                { "name": "이미지 3", "url": "https://picsum.photos/400/500?random=3", "source": "Picsum", "date": "2025-09-20" },
                { "name": "이미지 4", "url": "https://picsum.photos/400/500?random=4", "source": "Picsum", "date": "2025-11-05" },
                { "name": "이미지 5", "url": "https://picsum.photos/400/500?random=5", "source": "Picsum", "date": "2025-08-01" },
                { "name": "이미지 6", "url": "https://picsum.photos/400/500?random=6", "source": "Picsum", "date": "2025-11-08" },
                { "name": "이미지 7", "url": "https://picsum.photos/400/500?random=7", "source": "Picsum", "date": "2025-10-20" },
                { "name": "이미지 8", "url": "https://picsum.photos/400/500?random=8", "source": "Picsum", "date": "2025-09-15" },
                { "name": "이미지 9", "url": "https://picsum.photos/400/500?random=9", "source": "Picsum", "date": "2025-11-02" },
                { "name": "이미지 10", "url": "https://picsum.photos/400/500?random=10", "source": "Picsum", "date": "2025-08-10" }
            ];

            console.log('로드된 이미지 개수:', images.length);
            console.log('이미지 배열:', images);

            if (!Array.isArray(images) || images.length === 0) {
                throw new Error('이미지 목록이 비어있습니다.');
            }

            renderImages(images);

            if (swiper) {
                swiper.destroy();
            }
            initSwiper();

        } catch (error) {
            errorDiv.style.display = 'block';
            errorDiv.innerHTML = `<div class="error-message">
                <strong>오류:</strong> ${error.message}<br>
                <small>브라우저 콘솔(F12)에서 더 자세한 정보를 확인하세요.</small>
            </div>`;
            console.error('이미지 로드 오류:', error);
        }
    }

    function isNewImage(dateString) {
        if (!dateString) return false;
        const imageDate = new Date(dateString);
        const now = new Date();
        const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        return imageDate >= oneMonthAgo;
    }

    function renderImages(images) {
        imageContainer.innerHTML = '';

        images.forEach((image, index) => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';

            const isNew = isNewImage(image.date);
            const newBadge = isNew ? '<span class="new-badge">NEW</span>' : '';

            slide.innerHTML = `
                <div class="card-wrapper">
                    ${newBadge}
                    <img src="${image.url}" alt="${image.name || `이미지 ${index + 1}`}" class="card-image" onerror="this.style.backgroundColor='#f3f4f6';">
                    <div class="card-content">
                        <p class="card-title" title="${image.name || `이미지 ${index + 1}`}">
                            <strong>이름:</strong> ${image.name || `이미지 ${index + 1}`}
                        </p>
                        <p class="card-source" title="${image.source || '미지정'}">
                            <strong>출처:</strong> ${image.source || '미지정'}
                        </p>
                    </div>
                </div>
            `;

            imageContainer.appendChild(slide);
        });
    }

    function initSwiper() {
        swiper = new Swiper(".mySwiper", {
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: "auto",
            spaceBetween: 40,
            loop: true,
            loopFillGroupWithBlank: false,
            pagination: {
                el: ".swiper-pagination",
                clickable: true,
            },
            navigation: {
                nextEl: ".swiper-button-next",
                prevEl: ".swiper-button-prev",
            },
        });

        swiper.on('click', function(swiper, event) {
            const clickedSlide = event.target.closest('.swiper-slide');
            if (!clickedSlide) return;

            const clickedIndex = swiper.slides.indexOf(clickedSlide);

            if (clickedSlide.classList.contains('swiper-slide-active')) {
                const imageElement = clickedSlide.querySelector('img');
                if (imageElement && imageElement.src) {
                    fullScreenImage.src = imageElement.src;
                    fullScreenModal.classList.add('active');
                }
            } else {
                swiper.slideTo(clickedIndex);
            }
        });
    }

    closeModalBtn.addEventListener('click', () => {
        fullScreenModal.classList.remove('active');
        fullScreenImage.src = '';
    });

    fullScreenModal.addEventListener('click', (event) => {
        if (event.target === fullScreenModal) {
            fullScreenModal.classList.remove('active');
            fullScreenImage.src = '';
        }
    });

    loadImages();
}










