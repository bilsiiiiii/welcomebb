class WelcomeHomeExperience {
    constructor() {
        this.currentTheme = 'rose-beige';
        this.currentPhase = 1;
        this.musicEnabled = false;
        this.audioContext = null;
        this.audioElement = null;
        this.musicButton = null;
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

    setupMusic() {
        // Create audio element
        this.audioElement = new Audio();
        this.audioElement.loop = true;
        this.audioElement.volume = 0.3;
        this.audioElement.preload = 'auto';
        
        // Use base64 encoded silent audio as fallback
        // In production, replace this with your actual ambient music file
        this.audioElement.src = 'data:audio/mpeg;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAABAAACcQCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8AAABQTEFNRTMuMTAwBKkAAAAAAAAAADUgJAOHQQAB9AAACHDAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//tQxAAAAAAAAAAAAAAAAAAAAAAAASAAAAAAA';
        
        // Create minimal music toggle
        this.createMusicToggle();
    }

    createMusicToggle() {
        this.musicButton = document.createElement('button');
        this.musicButton.className = 'music-toggle';
        this.musicButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M15 10C15 8.89543 14.1046 8 13 8C11.8954 8 11 8.89543 11 10C11 11.1046 11.8954 12 13 12C14.1046 12 15 11.1046 15 10Z"/>
                <path d="M8 10C8 8.89543 7.10457 8 6 8C4.89543 8 4 8.89543 4 10C4 11.1046 4.89543 12 6 12C7.10457 12 8 11.1046 8 10Z"/>
                <path d="M13 8V4L18 6L13 8Z"/>
            </svg>
        `;
        
        this.musicButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 40px;
            height: 40px;
            background: var(--accent);
            border: none;
            border-radius: 50%;
            color: var(--text);
            cursor: pointer;
            opacity: 0.7;
            transition: var(--transition-medium);
            z-index: 1000;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        this.musicButton.addEventListener('click', () => this.toggleMusic());
        this.musicButton.addEventListener('mouseenter', () => {
            this.musicButton.style.opacity = '1';
            this.musicButton.style.transform = 'scale(1.1)';
        });
        this.musicButton.addEventListener('mouseleave', () => {
            if (!this.musicEnabled) {
                this.musicButton.style.opacity = '0.7';
            }
            this.musicButton.style.transform = 'scale(1)';
        });

        document.body.appendChild(this.musicButton);
    }

    async toggleMusic() {
        if (!this.musicEnabled) {
            // Enable music
            try {
                // For demo purposes, we'll create a simple oscillator
                // In production, replace this with your actual audio file loading
                await this.playAmbientMusic();
                this.musicEnabled = true;
                this.musicButton.style.opacity = '1';
                this.musicButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 4L6 16M10 4L10 16M14 4L14 16"/>
                    </svg>
                `;
            } catch (error) {
                console.log('Audio playback failed:', error);
                // Fallback: create a simple oscillator for ambient sound
                this.createFallbackAudio();
            }
        } else {
            // Disable music
            this.stopMusic();
            this.musicEnabled = false;
            this.musicButton.style.opacity = '0.7';
            this.musicButton.innerHTML = `
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M15 10C15 8.89543 14.1046 8 13 8C11.8954 8 11 8.89543 11 10C11 11.1046 11.8954 12 13 12C14.1046 12 15 11.1046 15 10Z"/>
                    <path d="M8 10C8 8.89543 7.10457 8 6 8C4.89543 8 4 8.89543 4 10C4 11.1046 4.89543 12 6 12C7.10457 12 8 11.1046 8 10Z"/>
                    <path d="M13 8V4L18 6L13 8Z"/>
                </svg>
            `;
        }
    }

    async playAmbientMusic() {
    // Stop any existing audio
    this.stopMusic();
    
    // Load your actual music file
    this.audioElement.src = 'ambient-music.mp3'; // or .ogg, .wav
    this.audioElement.volume = 0.3;
    
    try {
        await this.audioElement.play();
        this.musicEnabled = true;
        this.musicButton.style.opacity = '1';
        this.musicButton.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                <path d="M6 4L6 16M10 4L10 16M14 4L14 16"/>
            </svg>
        `;
    } catch (error) {
        console.log('Music file playback failed:', error);
        // Fall back to generated audio
        this.createFallbackAudio();
    }
}

    createVolumeBreathing() {
        if (!this.gainNode) return;
        
        // Create a gentle, slow volume modulation
        const now = this.audioContext.currentTime;
        this.gainNode.gain.setValueAtTime(0.08, now);
        this.gainNode.gain.exponentialRampToValueAtTime(0.12, now + 4);
        this.gainNode.gain.exponentialRampToValueAtTime(0.08, now + 8);
        
        // Repeat the breathing pattern
        this.breathingInterval = setInterval(() => {
            const now = this.audioContext.currentTime;
            this.gainNode.gain.setValueAtTime(0.08, now);
            this.gainNode.gain.exponentialRampToValueAtTime(0.12, now + 4);
            this.gainNode.gain.exponentialRampToValueAtTime(0.08, now + 8);
        }, 8000);
    }

    createFallbackAudio() {
        // Simple fallback if Web Audio API fails
        try {
            this.audioElement.volume = 0.3;
            this.audioElement.play().then(() => {
                this.musicEnabled = true;
                this.musicButton.style.opacity = '1';
                this.musicButton.innerHTML = `
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M6 4L6 16M10 4L10 16M14 4L14 16"/>
                    </svg>
                `;
            });
        } catch (error) {
            console.log('Fallback audio also failed:', error);
        }
    }

    stopMusic() {
        // Stop Web Audio API oscillators
        if (this.oscillators) {
            this.oscillators.forEach(osc => {
                try {
                    osc.stop();
                    osc.disconnect();
                } catch (e) {
                    // Oscillator might already be stopped
                }
            });
            this.oscillators = null;
        }
        
        // Clear breathing interval
        if (this.breathingInterval) {
            clearInterval(this.breathingInterval);
            this.breathingInterval = null;
        }
        
        // Stop HTML5 audio
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.currentTime = 0;
        }
        
        // Close audio context
        if (this.audioContext && this.audioContext.state !== 'closed') {
            this.audioContext.close();
        }
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

    // Cleanup method to stop music when needed
    destroy() {
        this.stopMusic();
        if (this.musicButton && this.musicButton.parentNode) {
            this.musicButton.parentNode.removeChild(this.musicButton);
        }
    }
}

// Initialize the experience when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.welcomeExperience = new WelcomeHomeExperience();
});

// Handle window resize
window.addEventListener('resize', () => {
    // Recalculate any layout-dependent animations if needed
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
    if (window.welcomeExperience) {
        window.welcomeExperience.destroy();
    }
});
