// Sidebar functionality fix
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger-icon');
    const sidebar = document.querySelector('.sidebar');
    
    // Create overlay if it doesn't exist
    let overlay = document.querySelector('.sidebar-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);
    }
    
    // Toggle sidebar function
    function toggleSidebar() {
        if (sidebar) {
            sidebar.classList.toggle('active');
            overlay.classList.toggle('active');
            
            if (sidebar.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    }
    
    // Make toggleSidebar globally accessible
    window.toggleSidebar = toggleSidebar;
    
    // Event listeners - try multiple selectors
    const hamburgerSelectors = ['.hamburger-icon', '#hamburger-menu', '[onclick="toggleSidebar()"]'];
    let hamburgerFound = false;
    
    hamburgerSelectors.forEach(selector => {
        const element = document.querySelector(selector);
        if (element && !hamburgerFound) {
            element.addEventListener('click', toggleSidebar);
            hamburgerFound = true;
            console.log('Hamburger menu attached to:', selector);
        }
    });
    
    if (!hamburgerFound) {
        console.log('Hamburger menu not found, creating fallback');
        // Create hamburger if not found
        const fallbackHamburger = document.createElement('div');
        fallbackHamburger.className = 'hamburger-icon';
        fallbackHamburger.textContent = '<i class="fas fa-bars"></i>';
        fallbackHamburger.addEventListener('click', toggleSidebar);
        document.body.appendChild(fallbackHamburger);
    }
    
    if (overlay) {
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    // Close sidebar on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Game performance optimization
if (typeof requestAnimationFrame !== 'undefined') {
    const canvas = document.querySelector('#gameCanvas');
    if (canvas) {
        // Enable hardware acceleration
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.imageSmoothingEnabled = false;
            ctx.webkitImageSmoothingEnabled = false;
            ctx.mozImageSmoothingEnabled = false;
            ctx.msImageSmoothingEnabled = false;
        }
    }
}