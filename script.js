class WelcomeHomeExperience {
    constructor() {
        this.currentTheme = 'rose-beige';
        this.currentPhase = 1;
        this.musicEnabled = false;
        this.audioContext = null;
        this.audioElement = null;
        this.musicButton = null;
        this.userInteracted = false;
        this.init();
    }

    init() {
        this.setupThemeSelection();
        this.setupNavigation();
        this.setupInteractions();
        this.setupParticles();
        this.setupConstellation();
        this.setupParallax();
        this.setupMusic();
        this.setupMobileEvents();
    }

    setupMobileEvents() {
        // Add touch events for mobile
        document.addEventListener('touchstart', () => {
            this.userInteracted = true;
        }, { once: true });

        document.addEventListener('click', () => {
            this.userInteracted = true;
        }, { once: true });
    }

    setupThemeSelection() {
        const paletteCards = document.querySelectorAll('.palette-card');
        const continueBtn = document.getElementById('continueBtn');

        paletteCards.forEach(card => {
            card.addEventListener('click', () => {
                paletteCards.forEach(c => c.classList.remove('active'));
                card.classList.add('active');
                this.currentTheme = card.dataset.theme;
                document.body.className = `theme-${this.currentTheme}`;
                continueBtn.classList.add('visible');
            });

            // Add touch events for mobile
            card.addEventListener('touchstart', (e) => {
                e.preventDefault();
                card.click();
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
            const handleHover = () => catSilhouette.style.transform = 'translateY(-3px)';
            const handleLeave = () => catSilhouette.style.transform = 'translateY(0)';
            
            catSilhouette.addEventListener('mouseenter', handleHover);
            catSilhouette.addEventListener('touchstart', handleHover);
            catSilhouette.addEventListener('mouseleave', handleLeave);
            catSilhouette.addEventListener('touchend', handleLeave);
        }

        // Letter section interactions
        const yesBtn = document.getElementById('yesBtn');
        const laterBtn = document.getElementById('laterBtn');
        const laterMessage = document.getElementById('laterMessage');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModalBtn = document.getElementById('closeModalBtn');

        const openModal = () => {
            modalOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        const showLaterMessage = () => {
            laterMessage.classList.add('visible');
            setTimeout(() => {
                laterMessage.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'center' 
                });
            }, 300);
        };

        const closeModal = () => {
            modalOverlay.classList.remove('active');
            document.body.style.overflow = 'auto';
        };

        yesBtn.addEventListener('click', openModal);
        laterBtn.addEventListener('click', showLaterMessage);
        closeModalBtn.addEventListener('click', closeModal);

        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Touch events for mobile
        yesBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            openModal();
        });

        laterBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            showLaterMessage();
        });

        // Greeting panel animation on scroll
        this.setupScrollAnimations();
    }

    setupMusic() {
        this.audioElement = new Audio();
        this.audioElement.loop = true;
        this.audioElement.volume = 0.3;
        this.audioElement.preload = 'auto';
        
        // Use your actual music file
        this.audioElement.src = 'ambient-music.mp3';
        
        this.createMusicToggle();
        
        // Preload the music file
        this.preloadMusic();
    }

    preloadMusic() {
        // Try to preload the music file
        this.audioElement.load();
        
        // Set up event listeners for loading
        this.audioElement.addEventListener('canplaythrough', () => {
            console.log('Music file loaded and ready');
        });
        
        this.audioElement.addEventListener('error', (e) => {
            console.error('Error loading music file:', e);
            console.log('Make sure ambient-music.mp3 is in the same directory as your HTML file');
        });
    }

    createMusicToggle() {
        this.musicButton = document.createElement('button');
        this.musicButton.className = 'music-toggle';
        this.musicButton.setAttribute('aria-label', 'Toggle background music');
        this.musicButton.innerHTML = this.getMusicIcon(false);
        
        this.musicButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMusic();
        });

        this.musicButton.addEventListener('touchstart', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.toggleMusic();
        });

        document.body.appendChild(this.musicButton);
    }

    getMusicIcon(isPlaying) {
        if (isPlaying) {
            return `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <rect x="6" y="4" width="2" height="12"/>
                    <rect x="12" y="4" width="2" height="12"/>
                </svg>
            `;
        } else {
            return `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0ZM8 10a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                    <path d="M13 8V4l5 2-5 2Z"/>
                </svg>
            `;
        }
    }

    async toggleMusic() {
        // On mobile, ensure user has interacted with the page first
        if (!this.userInteracted) {
            this.userInteracted = true;
        }

        if (!this.musicEnabled) {
            await this.enableMusic();
        } else {
            this.disableMusic();
        }
    }

    async enableMusic() {
        try {
            await this.playMusicFile();
            this.musicEnabled = true;
            this.updateMusicButton(true);
            
        } catch (error) {
            console.log('Music playback failed:', error);
            this.showMusicError();
        }
    }

    async playMusicFile() {
        this.stopMusic();
        
        // For iOS and other mobile browsers, we need to handle audio context
        try {
            // Create and resume audio context first (required for iOS)
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
            
            // Create a source node from the audio element
            const source = this.audioContext.createMediaElementSource(this.audioElement);
            const gainNode = this.audioContext.createGain();
            
            // Connect nodes
            source.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Set volume
            gainNode.gain.value = 0.3;
            
            // Store reference
            this.audioSource = source;
            this.audioGainNode = gainNode;
            
        } catch (contextError) {
            console.log('Audio context setup failed, using direct audio:', contextError);
            // Continue with direct audio playback if context fails
        }
        
        // Now play the audio
        this.audioElement.volume = 0.3;
        this.audioElement.currentTime = 0;
        
        try {
            await this.audioElement.play();
        } catch (playError) {
            console.log('Direct play failed, trying with user gesture:', playError);
            
            // If direct play fails, try the iOS unlock method
            await this.unlockAudioIOS();
            await this.audioElement.play();
        }
    }

    async unlockAudioIOS() {
        // iOS requires a user gesture to play audio
        // Create and play a silent audio to unlock audio context
        const silentAudio = new Audio();
        silentAudio.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQAAAAAAA==';
        silentAudio.volume = 0.001;
        
        try {
            await silentAudio.play();
            await silentAudio.pause();
        } catch (e) {
            // Ignore errors in unlock attempt
        }
    }

    disableMusic() {
        this.stopMusic();
        this.musicEnabled = false;
        this.updateMusicButton(false);
    }

    stopMusic() {
        // Stop HTML5 audio
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        
        // Disconnect Web Audio nodes
        if (this.audioSource) {
            this.audioSource.disconnect();
            this.audioSource = null;
        }
        
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close().catch(() => {});
            this.audioContext = null;
        }
    }

    updateMusicButton(isPlaying) {
        this.musicButton.innerHTML = this.getMusicIcon(isPlaying);
        this.musicButton.style.opacity = isPlaying ? '1' : '0.7';
        this.musicButton.style.transform = isPlaying ? 'scale(1.1)' : 'scale(1)';
    }

    showMusicError() {
        // Briefly show error state
        const originalHTML = this.musicButton.innerHTML;
        this.musicButton.innerHTML = '!';
        this.musicButton.style.opacity = '0.5';
        
        setTimeout(() => {
            this.updateMusicButton(false);
        }, 1000);
    }

    setupParticles() {
        const container = document.getElementById('particles');
        if (!container) return;

        const particleCount = this.isMobile() ? 15 : 30;
        
        for (let i = 0; i < particleCount; i++) {
            this.createParticle(container);
        }
    }

    createParticle(container) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        const size = Math.random() * 2 + 1;
        const opacity = Math.random() * 0.05 + 0.02;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        
        particle.style.cssText = `
            left: ${x}%;
            top: ${y}%;
            width: ${size}px;
            height: ${size}px;
            opacity: ${opacity};
            animation: float ${duration}s ease-in-out ${delay}s infinite;
        `;
        
        container.appendChild(particle);
    }

    setupConstellation() {
        const container = document.getElementById('constellation');
        if (!container) return;

        const starCount = this.isMobile() ? 15 : 25;
        
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const duration = Math.random() * 4 + 2;
            const delay = Math.random() * 2;
            
            star.style.cssText = `
                left: ${x}%;
                top: ${y}%;
                animation: twinkle ${duration}s ease-in-out ${delay}s infinite;
            `;
            
            container.appendChild(star);
        }

        // Add animation styles
        if (!document.getElementById('animation-styles')) {
            const style = document.createElement('style');
            style.id = 'animation-styles';
            style.textContent = `
                @keyframes float {
                    0%, 100% { transform: translate(0, 0) rotate(0deg); }
                    25% { transform: translate(5px, -5px) rotate(0.5deg); }
                    50% { transform: translate(-3px, 3px) rotate(-0.5deg); }
                    75% { transform: translate(-5px, -3px) rotate(0.5deg); }
                }
                
                @keyframes twinkle {
                    0%, 100% { opacity: 0.07; }
                    50% { opacity: 0.15; }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupParallax() {
        if (this.isMobile()) return; // Disable parallax on mobile for performance
        
        const lightPath = document.querySelector('.light-path');
        
        const handleScroll = () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            
            if (lightPath) {
                lightPath.style.transform = `translateY(${rate}px)`;
            }
        };
        
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    setupScrollAnimations() {
        const greetingPanel = document.getElementById('greetingPanel');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: this.isMobile() ? 0.1 : 0.3,
            rootMargin: '50px' 
        });

        if (greetingPanel) {
            observer.observe(greetingPanel);
        }
    }

    transitionToPhase(targetPhase) {
        const currentPhase = document.getElementById(`phase${this.currentPhase}`);
        const targetPhaseElement = document.getElementById(`phase${targetPhase}`);
        
        if (!currentPhase || !targetPhaseElement) return;
        
        currentPhase.classList.remove('active');
        
        setTimeout(() => {
            targetPhaseElement.classList.add('active');
            this.currentPhase = targetPhase;
            
            if (targetPhase === 3) {
                this.setupPhase3Animations();
            }
        }, 600);
    }

    setupPhase3Animations() {
        const greetingLines = document.querySelectorAll('.greeting-line');
        
        greetingLines.forEach((line, index) => {
            line.style.transitionDelay = `${index * 0.1}s`;
        });
    }

    isMobile() {
        return window.innerWidth <= 768;
    }

    destroy() {
        this.stopMusic();
        if (this.musicButton && this.musicButton.parentNode) {
            this.musicButton.parentNode.removeChild(this.musicButton);
        }
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.welcomeExperience = new WelcomeHomeExperience();
});

// Handle resize events with debouncing
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        // Re-initialize particles and constellation on resize
        if (window.welcomeExperience) {
            // You could add resize handling here if needed
        }
    }, 250);
});

// Clean up
window.addEventListener('beforeunload', () => {
    if (window.welcomeExperience) {
        window.welcomeExperience.destroy();
    }
});
