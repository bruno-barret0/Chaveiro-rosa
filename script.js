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
    // Carrossel de Imagens: sem autoplay, com dots
    setupCarousel('image-carousel-slide', 'image-carousel-dots', 'image-prev', 'image-next', false, 0);
    
    // Carrossel de Avaliações: com autoplay (25s), sem dots, com botões específicos
    setupCarousel('reviews-slide-wrapper', null, 'review-prev', 'review-next', true, 25000);
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

function setupCarousel(wrapperId, dotsId, prevBtnClass, nextBtnClass, autoPlay, intervalTime) {
    const wrapper = document.getElementById(wrapperId);
    const items = wrapper.children;
    const totalItems = items.length;
    let currentIndex = 0;
    let autoPlayInterval;

    const prevBtn = document.querySelector(`.${prevBtnClass}`);
    const nextBtn = document.querySelector(`.${nextBtnClass}`);

    function updateCarouselPosition() {
        // Lógica de visualização diferente para mobile vs desktop (1 vs 3 cards/imagens)
        const itemsPerView = (window.innerWidth <= 768 && wrapperId === 'reviews-slide-wrapper') ? 1 : 
                             (wrapperId === 'image-carousel-slide' ? 1 : 3); // Imagens sempre 1 por vez no JS/CSS original

        // Garante que o índice fique no loop (avança se passar do limite, volta se for negativo)
        if (currentIndex >= totalItems) currentIndex = 0;
        if (currentIndex < 0) currentIndex = totalItems - 1;

        // Calcula a posição de translação. Multiplica pelo índice e divide pelo total de itens visíveis
        const percentageMove = (currentIndex / totalItems) * 100 * (itemsPerView / 1);
        
        wrapper.style.transform = `translateX(-${percentageMove}%)`;

        // Lógica para os dots (apenas no carrossel de imagens)
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
        // Limpa o autoplay ao clicar manualmente para evitar conflito imediato
        if (autoPlayInterval) clearInterval(autoPlayInterval); 
        
        currentIndex += direction;
        updateCarouselPosition();

        // Reinicia o autoplay após a navegação manual
        if (autoPlay) {
             autoPlayInterval = setInterval(() => navigate(1), intervalTime);
        }
    }

    // Adiciona eventos de clique manual
    if (prevBtn) prevBtn.addEventListener('click', () => navigate(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigate(1));

    // Configuração inicial e autoplay
    if (autoPlay) {
        autoPlayInterval = setInterval(() => navigate(1), intervalTime);
    }

    // Listener de resize para ajustar a visualização mobile/desktop
    window.addEventListener('resize', () => {
        // Reseta a posição no resize para evitar visuais quebrados
        currentIndex = 0;
        updateCarouselPosition();
    });

    // Criação dos dots (apenas para o carrossel de imagens)
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

    // Mostrar a posição inicial
    updateCarouselPosition();
}
