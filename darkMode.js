const checkbox = document.getElementById('checkbox');
const modeLabel = document.getElementById('mode-label');
const body = document.body;  // Selecting the body to change the background image and text color

// Check if dark mode is already enabled
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    checkbox.checked = true;
    modeLabel.textContent = 'Dark Mode';
    body.style.backgroundImage = "url('path-to-dark-theme-image.jpg')";  // Set dark theme background image
} else {
    document.documentElement.setAttribute('data-theme', 'light');
    modeLabel.textContent = 'Light Mode';
    body.style.backgroundImage = "url('path-to-light-theme-image.jpg')";  // Set light theme background image
}

// Add event listener for toggle switch
checkbox.addEventListener('change', () => {
    if (checkbox.checked) {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        modeLabel.textContent = 'Dark Mode';
        body.style.backgroundImage = "url('path-to-dark-theme-image.jpg')";  // Set dark theme background image
    } else {
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
        modeLabel.textContent = 'Light Mode';
        body.style.backgroundImage = "url('path-to-light-theme-image.jpg')";  // Set light theme background image
    }
});
