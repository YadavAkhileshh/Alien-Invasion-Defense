// Professional Interactive Features

class ProfessionalUI {
    constructor() {
        this.init();
    }

    init() {
        this.setupNavbar();
        this.setupMobileMenu();
        this.setupSidebar();
        this.setupInteractiveElements();
        this.setupScrollEffects();
        this.setupLoadingStates();
    }

    setupNavbar() {
        const navbar = document.querySelector('.navbar');
        let lastScrollY = window.scrollY;

        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        const toggle = document.querySelector('.mobile-menu-toggle');
        const navLinks = document.querySelector('.nav-links');

        if (toggle && navLinks) {
            toggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                toggle.innerHTML = navLinks.classList.contains('active') ? '✕' : '☰';
            });

            // Close menu when clicking outside
            document.addEventListener('click', (e) => {
                if (!toggle.contains(e.target) && !navLinks.contains(e.target)) {
                    navLinks.classList.remove('active');
                    toggle.innerHTML = '☰';
                }
            });
        }
    }

    setupSidebar() {
        const hamburger = document.querySelector('.hamburger-icon');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.createElement('div');
        
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 998;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
        `;
        document.body.appendChild(overlay);

        if (hamburger && sidebar) {
            hamburger.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                if (sidebar.classList.contains('active')) {
                    overlay.style.opacity = '1';
                    overlay.style.visibility = 'visible';
                    document.body.style.overflow = 'hidden';
                } else {
                    overlay.style.opacity = '0';
                    overlay.style.visibility = 'hidden';
                    document.body.style.overflow = '';
                }
            });

            overlay.addEventListener('click', () => {
                sidebar.classList.remove('active');
                overlay.style.opacity = '0';
                overlay.style.visibility = 'hidden';
                document.body.style.overflow = '';
            });
        }
    }

    setupInteractiveElements() {
        // Add ripple effect to buttons
        document.querySelectorAll('.btn, button').forEach(button => {
            button.addEventListener('click', this.createRipple);
        });

        // Add hover effects to cards
        document.querySelectorAll('.interactive-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-5px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add loading states to form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', function(e) {
                const submitBtn = this.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.classList.add('loading');
                    submitBtn.disabled = true;
                    
                    setTimeout(() => {
                        submitBtn.classList.remove('loading');
                        submitBtn.disabled = false;
                    }, 2000);
                }
            });
        });
    }

    createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        const rect = button.getBoundingClientRect();
        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - rect.left - radius}px`;
        circle.style.top = `${event.clientY - rect.top - radius}px`;
        circle.classList.add('ripple');

        const rippleCSS = `
            .ripple {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.6);
                transform: scale(0);
                animation: ripple-animation 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple-animation {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
        `;

        if (!document.querySelector('#ripple-styles')) {
            const style = document.createElement('style');
            style.id = 'ripple-styles';
            style.textContent = rippleCSS;
            document.head.appendChild(style);
        }

        const ripple = button.querySelector('.ripple');
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
        
        setTimeout(() => {
            circle.remove();
        }, 600);
    }

    setupScrollEffects() {
        // Intersection Observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe elements for scroll animations
        document.querySelectorAll('.game-container, .interactive-card, .sidebar-section').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(el);
        });
    }

    setupLoadingStates() {
        // Add loading states for async operations
        const gameCanvas = document.querySelector('#gameCanvas');
        if (gameCanvas) {
            gameCanvas.addEventListener('load', () => {
                gameCanvas.classList.remove('loading');
            });
        }

        // Preload critical resources
        this.preloadResources();
    }

    preloadResources() {
        const resources = [
            'spaceship.webp',
            'background-music.wav',
            'hit-sound.wav'
        ];

        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource;
            link.as = resource.includes('.wav') ? 'audio' : 'image';
            document.head.appendChild(link);
        });
    }

    // Utility methods
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--glass-bg);
            backdrop-filter: blur(15px);
            border: 1px solid var(--glass-border);
            border-radius: 12px;
            padding: 1rem 1.5rem;
            color: white;
            z-index: 10000;
            transform: translateX(400px);
            transition: transform 0.3s ease;
            box-shadow: var(--shadow-light);
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    updateProgress(percentage) {
        const progressBar = document.querySelector('#progress-bar');
        if (progressBar) {
            progressBar.style.width = `${percentage}%`;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ProfessionalUI();
});

// Export for use in other scripts
window.ProfessionalUI = ProfessionalUI;