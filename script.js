class WelcomeHomeExperience {
    constructor() {
        this.currentTheme = 'rose-beige';
        this.currentPhase = 1;
        this.init();
    }

    init() {
        this.setupThemeSelection();
        this.setupNavigation();
        this.setupInteractions();
        this.setupParticles();
        this.setupConstellation();
        this.setupParallax();
    }

    setupThemeSelection() {
        const paletteCards = document.querySelectorAll('.palette-card');
        const continueBtn = document.getElementById('continueBtn');

        paletteCards.forEach(card => {
            card.addEventListener('click', () => {
                // Remove active class from all cards
                paletteCards.forEach(c => c.classList.remove('active'));
                
                // Add active class to clicked card
                card.classList.add('active');
                
                // Set theme
                this.currentTheme = card.dataset.theme;
                document.body.className = `theme-${this.currentTheme}`;
                
                // Show continue button
                continueBtn.classList.add('visible');
            });
        });

        continueBtn.addEventListener('click', () => {
            this.transitionToPhase(2);
        });
    }

    setupNavigation() {
        const enterBtn = document.getElementById('enterBtn');
        enterBtn.addEventListener('click', () => {
            this.transitionToPhase(3);
        });
    }

    setupInteractions() {
        // Cat silhouette interaction
        const catSilhouette = document.getElementById('catSilhouette');
        if (catSilhouette) {
            catSilhouette.addEventListener('mouseenter', () => {
                catSilhouette.style.transform = 'translateY(-3px)';
            });
            
            catSilhouette.addEventListener('mouseleave', () => {
                catSilhouette.style.transform = 'translateY(0)';
            });
        }

        // Letter section interactions
        const yesBtn = document.getElementById('yesBtn');
        const laterBtn = document.getElementById('laterBtn');
        const laterMessage = document.getElementById('laterMessage');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModalBtn = document.getElementById('closeModalBtn');

        yesBtn.addEventListener('click', () => {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });

        laterBtn.addEventListener('click', () => {
            laterMessage.classList.add('visible');
            setTimeout(() => {
                laterMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        });

        closeModalBtn.addEventListener('click', () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Greeting panel animation on scroll
        this.setupScrollAnimations();
    }

    setupParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = 30;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        
        // Random size and opacity
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.05 + 0.02;
        
        particle.style.left = `${x}%`;
        particle.style.top = `${y}%`;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.opacity = opacity;
        
        // Random animation
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.animation = `
            float ${duration}s ease-in-out ${delay}s infinite
        `;
        
        container.appendChild(particle);
    }

    setupConstellation() {
        const container = document.getElementById('constellation');
        if (!container) return;

        const starCount = 25;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            // Random position
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            
            // Random twinkle animation
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 2;
            
            star.style.animation = `
                twinkle ${duration}s ease-in-out ${delay}s infinite
            `;
            
            container.appendChild(star);
        }

        // Add CSS for twinkle animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0%, 100% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(10px, -10px) rotate(1deg); }
                50% { transform: translate(-5px, 5px) rotate(-1deg); }
                75% { transform: translate(-10px, -5px) rotate(1deg); }
            }
            
            @keyframes twinkle {
                0%, 100% { opacity: 0.07; }
                50% { opacity: 0.15; }
            }
        `;
        document.head.appendChild(style);
    }

    setupParallax() {
        const lightPath = document.querySelector('.light-path');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (lightPath) {
                lightPath.style.transform = `translateY(${rate}px)`;
            }
        });
    }

    setupScrollAnimations() {
        const greetingPanel = document.getElementById('greetingPanel');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.3 });

        if (greetingPanel) {
            observer.observe(greetingPanel);
        }
    }

    transitionToPhase(targetPhase) {
        const currentPhase = document.getElementById(`phase${this.currentPhase}`);
        const targetPhaseElement = document.getElementById(`phase${targetPhase}`);
        
        if (!currentPhase || !targetPhaseElement) return;
        
        // Fade out current phase
        currentPhase.classList.remove('active');
        
        // After fade out, show target phase
        setTimeout(() => {
            targetPhaseElement.classList.add('active');
            this.currentPhase = targetPhase;
            
            // Special setup for phase 3
            if (targetPhase === 3) {
                this.setupPhase3Animations();
            }
        }, 600);
    }

    setupPhase3Animations() {
        // Add any phase 3 specific animations here
        const greetingLines = document.querySelectorAll('.greeting-line');
        
        greetingLines.forEach((line, index) => {
            line.style.transitionDelay = `${index * 0.1}s`;
        });
    }
}

// Initialize the experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WelcomeHomeExperience();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any layout-dependent animations if needed
});