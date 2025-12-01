// --- Funcionalidade do Menu Suspenso e Comportamento Dinâmico do Cabeçalho ---
document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menu-toggle');
    const dropdownMenu = document.getElementById('dropdown-menu');

    menuToggle.addEventListener('click', () => {
        dropdownMenu.classList.toggle('show');
    });

    window.addEventListener('click', (event) => {
        if (!event.target.matches('#menu-toggle') && !event.target.closest('#dropdown-menu')) {
            if (dropdownMenu.classList.contains('show')) {
                dropdownMenu.classList.remove('show');
            }
        }
    });

    // Inicializa os carrosséis usando a nova função reutilizável
    // Carrossel de Imagens: step 1 (sempre 1 imagem por vez), sem autoplay, com dots
    setupCarousel('image-carousel-slide', 'image-carousel-dots', 'image-prev', 'image-next', 1, false, 0);
    
    // Carrossel de Avaliações: step 3 (3 avaliações por vez no desktop), com autoplay (25s), sem dots, com botões específicos
    setupCarousel('reviews-slide-wrapper', null, 'review-prev', 'review-next', 3, true, 25000);

    // Chamar a função de visibilidade do vídeo ao carregar a página
    checkVideoVisibility();
});

// --- Comportamento Dinâmico do Cabeçalho (Esconder/Mostrar ao Rolar) ---
let lastScrollTop = 0;
const header = document.getElementById('site-header');

window.addEventListener('scroll', () => {
    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop) {
        header.style.top = '-120px'; // Esconde
    } else {
        header.style.top = '0'; // Mostra
    }
    lastScrollTop = scrollTop;
});


// --- Função Reutilizável para Carrosséis (Imagens e Avaliações) ---

function setupCarousel(wrapperId, dotsId, prevBtnClass, nextBtnClass, step, autoPlay, intervalTime) {
    const wrapper = document.getElementById(wrapperId);
    const items = wrapper.children;
    const totalItems = items.length;
    let currentIndex = 0;
    let autoPlayInterval;

    const prevBtn = document.querySelector(`.${prevBtnClass}`);
    const nextBtn = document.querySelector(`.${nextBtnClass}`);

    function updateCarouselPosition() {
        const currentStep = (window.innerWidth <= 768 && wrapperId === 'reviews-slide-wrapper') ? 1 : step;
                             
        if (currentIndex >= totalItems) currentIndex = 0;
        if (currentIndex < 0) {
             currentIndex = Math.floor((totalItems - 1) / currentStep) * currentStep;
        }

        const percentageMove = (currentIndex / totalItems) * 100;
        
        wrapper.style.transform = `translateX(-${percentageMove}%)`;

        if (dotsId) {
            const dotsContainer = document.getElementById(dotsId);
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }
    }

    function navigate(direction) {
        if (autoPlayInterval) clearInterval(autoPlayInterval); 
        
        const currentStep = (window.innerWidth <= 768 && wrapperId === 'reviews-slide-wrapper') ? 1 : step;
        currentIndex += direction * currentStep;
        
        updateCarouselPosition();

        if (autoPlay) {
             autoPlayInterval = setInterval(() => navigate(1), intervalTime);
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    if (autoPlay) {
        autoPlayInterval = setInterval(() => navigate(1), intervalTime);
    }

    window.addEventListener('resize', () => {
        currentIndex = 0;
        updateCarouselPosition();
    });

    if (dotsId) {
        const dotsContainer = document.getElementById(dotsId);
        for (let i = 0; i < totalItems; i++) {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            dot.addEventListener('click', () => {
                currentIndex = i;
                updateCarouselPosition();
            });
            dotsContainer.appendChild(dot);
        }
    }
    updateCarouselPosition();
}

// --- NOVIDADE: Pausar vídeo quando fora da visualização ---
window.addEventListener('scroll', checkVideoVisibility);
window.addEventListener('resize', checkVideoVisibility);

function checkVideoVisibility() {
    const video = document.querySelector('.header-video');
    
    if (!video) return;

    const videoRect = video.getBoundingClientRect();
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const visibleThreshold = videoRect.height * 0.7;

    const isVisible = (
        videoRect.top < viewportHeight - visibleThreshold &&
        videoRect.bottom > visibleThreshold
    );
    
    if (isVisible) {
        if (video.paused) {
           video.play().catch(e => console.error("Autoplay impedido:", e)); 
        }
    } else {
        video.pause();
    }
}
