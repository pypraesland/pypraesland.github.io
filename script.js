document.addEventListener('DOMContentLoaded', () => {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const totalSlides = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const indicatorContainer = document.getElementById('indicatorContainer');
    const navInstructions = document.getElementById('navInstructions');
    let instructionTimeout;
    let hasInteracted = false;
    let touchStartX = 0;
    let touchEndX = 0;

    // Buat indikator slide secara dinamis
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.classList.add('slide-indicator', 'w-3', 'h-3', 'rounded-full', 'bg-gray-300', 'cursor-pointer');
        indicator.dataset.slide = i;
        indicatorContainer.appendChild(indicator);
    }
    const indicators = document.querySelectorAll('.slide-indicator');

    function updateSlide() {
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev');
            if (index === currentSlide) {
                slide.classList.add('active');
            } else if (index < currentSlide) {
                slide.classList.add('prev');
            }
        });

        slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;

        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentSlide);
        });
    }

    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
            updateSlide();
        }
    }

    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
            updateSlide();
        }
    }

    function goToSlide(slideIndex) {
        if (slideIndex >= 0 && slideIndex < totalSlides) {
            currentSlide = slideIndex;
            updateSlide();
        }
    }

    function showInstructions() {
        navInstructions.style.opacity = '1';
        clearTimeout(instructionTimeout);
        instructionTimeout = setTimeout(() => {
            navInstructions.style.opacity = '0';
        }, 4000);
    }

    // Event listeners
    nextBtn.addEventListener('click', (e) => { e.preventDefault(); nextSlide(); });
    prevBtn.addEventListener('click', (e) => { e.preventDefault(); prevSlide(); });

    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', (e) => { e.preventDefault(); goToSlide(index); });
    });

    document.addEventListener('keydown', (e) => {
        if (!hasInteracted) { hasInteracted = true; showInstructions(); }
        if (e.key === 'ArrowRight' || e.key === ' ') { e.preventDefault(); nextSlide(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); prevSlide(); }
        else if (e.key >= '1' && e.key <= '9') {
            const slideNum = parseInt(e.key) - 1;
            if (slideNum < totalSlides) { e.preventDefault(); goToSlide(slideNum); }
        }
        else if (e.key === 'Home') { e.preventDefault(); goToSlide(0); }
        else if (e.key === 'End') { e.preventDefault(); goToSlide(totalSlides - 1); }
    });

    document.addEventListener('wheel', (e) => {
        if (!hasInteracted) { hasInteracted = true; showInstructions(); }
        e.preventDefault();
        if (e.deltaY > 0) { nextSlide(); }
        else if (e.deltaY < 0) { prevSlide(); }
    }, { passive: false });

    document.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; });
    document.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) { nextSlide(); }
            else { prevSlide(); }
        }
    }

    // Initialize
    updateSlide();
    setTimeout(showInstructions, 500);

    [prevBtn, nextBtn].forEach(btn => btn.addEventListener('mouseenter', showInstructions));
});
