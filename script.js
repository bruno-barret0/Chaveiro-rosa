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

// Adicionado o parâmetro 'step' para definir quantos itens pular (1 para imagens, 3 para avaliações desktop)
function setupCarousel(wrapperId, dotsId, prevBtnClass, nextBtnClass, step, autoPlay, intervalTime) {
    const wrapper = document.getElementById(wrapperId);
    const items = wrapper.children;
    const totalItems = items.length;
    let currentIndex = 0;
    let autoPlayInterval;

    // Botões manuais podem não existir para autoplay-only carousels, por isso a verificação
    const prevBtn = document.querySelector(`.${prevBtnClass}`);
    const nextBtn = document.querySelector(`.${nextBtnClass}`);

    function updateCarouselPosition() {
        // Lógica de visualização: se for mobile (para reviews) ou se for o carrossel de imagens, o passo é 1. Senão, usa o 'step' definido (3).
        const currentStep = (window.innerWidth <= 768 && wrapperId === 'reviews-slide-wrapper') ? 1 : step;
                             
        // Garante que o índice fique no loop, avançando no máximo para o último slide possível (considerando o step)
        if (currentIndex >= totalItems) currentIndex = 0;
        if (currentIndex < 0) {
             // Quando volta, pula para o início do último grupo de 3 (ou 1 no mobile)
             currentIndex = Math.floor((totalItems - 1) / currentStep) * currentStep;
        }

        // Calcula a posição de translação. Move pela porcentagem correta baseada no passo
        // A lógica de porcentagem complexa foi simplificada para funcionar com a largura CSS calc()
        const percentageMove = (currentIndex / totalItems) * 100;
        
        wrapper.style.transform = `translateX(-${percentageMove}%)`;

        // Lógica para os dots (apenas no carrossel de imagens)
        if (dotsId) {
            const dotsContainer = document.getElementById(dotsId);
            const dots = dotsContainer.querySelectorAll('.dot');
            dots.forEach(dot => dot.classList.remove('active'));
            // O dot ativo é sempre o que está no currentIndex (início do grupo)
            if (dots[currentIndex]) {
                dots[currentIndex].classList.add('active');
            }
        }
    }

    function navigate(direction) {
        // Limpa o autoplay ao clicar manualmente para evitar conflito imediato
        if (autoPlayInterval) clearInterval(autoPlayInterval); 
        
        // Navega de acordo com o step (1 ou 3 itens por vez)
        const currentStep = (window.innerWidth <= 768 && wrapperId === 'reviews-slide-wrapper') ? 1 : step;
        currentIndex += direction * currentStep;
        
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
        // Autoplay sempre move no sentido positivo (next)
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
        // Dots são criados para cada item individualmente
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

