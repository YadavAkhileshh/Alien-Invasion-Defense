// ==================================================================
// ENHANCED BULLET FUNCTION
// Provides an enhanced bullet with glow effect for the game engine.
// Does NOT add duplicate event listeners (engine already handles
// Space, click, and fire button) to avoid double-shots.
// ==================================================================

window.addEventListener('DOMContentLoaded', function () {
    window.shootBullet = function () {
        if (typeof gameState === 'undefined') return;
        if (!gameState.active || gameState.paused || !gameState.player) return;

        const bulletWidth = (typeof CONFIG !== 'undefined') ? CONFIG.bullet.width : 5;

        const bullet = {
            x: gameState.player.x + gameState.player.width / 2 - bulletWidth / 2,
            y: gameState.player.y,
            width: bulletWidth,
            height: 15,
            speed: 7,
            move: function () {
                this.y -= this.speed;
            },
            draw: function (ctx) {
                ctx.fillStyle = '#0ff';
                ctx.shadowColor = '#0ff';
                ctx.shadowBlur = 10;
                ctx.fillRect(this.x, this.y, this.width, this.height);
                ctx.shadowBlur = 0;
            }
        };

        gameState.bullets.push(bullet);

        const hitSound = document.getElementById('hitSound');
        if (hitSound) {
            hitSound.currentTime = 0;
            hitSound.play().catch(function () {});
        }
    };
});
