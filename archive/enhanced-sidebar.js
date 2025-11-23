// Enhanced sidebar and header functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.querySelector('.sidebar');
    const navbar = document.querySelector('.navbar');
    let lastScrollY = window.scrollY;
    let ticking = false;
    
    // Create overlay
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background: rgba(0,0,0,0.5); z-index: 999; display: none;
        `;
        document.body.appendChild(overlay);
    }
    
    // Toggle sidebar function
    function toggleSidebar() {
        if (sidebar) {
            const isActive = sidebar.classList.contains('active');
            sidebar.classList.toggle('active');
            overlay.style.display = isActive ? 'none' : 'block';
            document.body.style.overflow = isActive ? '' : 'hidden';
        }
    }
    
    window.toggleSidebar = toggleSidebar;
    
    // Enhanced hamburger detection
    function attachHamburgerEvents() {
        const selectors = ['.hamburger-icon', '#hamburger-menu', '.hamburger', '[data-toggle="sidebar"]'];
        let attached = false;
        
        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                if (element && !element.hasAttribute('data-sidebar-attached')) {
                    element.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleSidebar();
                    });
                    element.addEventListener('touchstart', function(e) {
                        e.preventDefault();
                        toggleSidebar();
                    });
                    element.setAttribute('data-sidebar-attached', 'true');
                    attached = true;
                }
            });
        });
        
        return attached;
    }
    
    // Initial attachment
    setTimeout(() => {
        if (!attachHamburgerEvents()) {
            setTimeout(attachHamburgerEvents, 500);
        }
    }, 100);
    
    // Close sidebar events
    if (overlay) {
        overlay.addEventListener('click', () => {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        });
    }
    
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.style.display = 'none';
            document.body.style.overflow = '';
        }
    });
    
    // Smart header hide/show
    function updateHeader() {
        const currentScrollY = window.scrollY;
        const gameContainer = document.querySelector('#gameContainer');
        const gameRect = gameContainer ? gameContainer.getBoundingClientRect() : null;
        
        if (navbar) {
            if (gameRect && gameRect.top <= 100 && gameRect.bottom >= 100) {
                navbar.style.transform = 'translateY(0)';
            } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
        }
        
        lastScrollY = currentScrollY;
        ticking = false;
    }
    
    function requestTick() {
        if (!ticking) {
            requestAnimationFrame(updateHeader);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', requestTick, { passive: true });
    
    // Re-attach events on dynamic content
    const observer = new MutationObserver(() => {
        attachHamburgerEvents();
    });
    
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});