let currentIndex = 0; // Start with the first background
const totalBackgrounds = 4; // Total number of backgrounds

// Change background based on index
function changeBackground(index) {
    const backgrounds = document.querySelectorAll('.background');
    backgrounds.forEach((bg, i) => {
        if (i === index) {
            bg.classList.add('active');
        } else {
            bg.classList.remove('active');
        }
    });
    currentIndex = index;
}

// Automatically change background every 6 seconds
setInterval(() => {
    currentIndex = (currentIndex + 1) % totalBackgrounds; // Cycle through the backgrounds
    changeBackground(currentIndex);
}, 5000); // 5 seconds interval

//----button logic to enter into the game----
document.getElementById('button').addEventListener('click', () => {
    window.location.href = '/index.html'; // Redirect to the index.html page
});

