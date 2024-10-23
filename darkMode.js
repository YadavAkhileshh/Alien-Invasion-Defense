// Theme switcher functionality
document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.querySelector('#checkbox');
    const modeLabel = document.querySelector('#mode-label');
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.body.classList.toggle('dark-theme', savedTheme === 'dark');
        themeToggle.checked = savedTheme === 'dark';
        modeLabel.textContent = savedTheme === 'dark' ? 'Dark Mode' : 'Light Mode';
    }

    // Theme toggle handler
    themeToggle.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            modeLabel.textContent = 'Dark Mode';
        } else {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            modeLabel.textContent = 'Light Mode';
        }
    });

    // Optional: Add system theme preference detection
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
    
    function setThemeBySystemPreference(e) {
        if (!localStorage.getItem('theme')) {
            const isDark = e.matches;
            document.body.classList.toggle('dark-theme', isDark);
            themeToggle.checked = isDark;
            modeLabel.textContent = isDark ? 'Dark Mode' : 'Light Mode';
        }
    }

    prefersDark.addListener(setThemeBySystemPreference);
    setThemeBySystemPreference(prefersDark);
});