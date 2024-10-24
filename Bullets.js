document.getElementById('fireButton').addEventListener('click', () => {
    shootBullet();
});

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        shootBullet();
    }
});

function shootBullet() {
    console.log("Bullet fired!");
    // Implement bullet firing logic here (moving bullets, collision detection, etc.)
}
