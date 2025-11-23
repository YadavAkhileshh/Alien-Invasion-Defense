// ==================================================================
// COMPLETE SHOOTING FIX
// This script completely overrides and fixes all shooting functionality
// ==================================================================

console.log('🔧 Loading shooting fix...');

// Wait for everything to load
window.addEventListener('DOMContentLoaded', function () {
    console.log('✅ DOM loaded, applying shooting fix');

    // Override the shoot function globally
    window.shootBullet = function () {
        console.log('🔫 SHOOT called!');

        // Check if game state exists
        if (typeof gameState === 'undefined') {
            console.error('❌ gameState not defined');
            return;
        }

        if (!gameState.active) {
            console.log('⚠️ Game not active');
            return;
        }

        if (gameState.paused) {
            console.log('⚠️ Game paused');
            return;
        }

        if (!gameState.player) {
            console.log(' ❌ No player');
            return;
        }

        // Get CONFIG if available
        const bulletWidth = (typeof CONFIG !== 'undefined') ? CONFIG.bullet.width : 5;

        // Create bullet
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
        console.log('✅ Bullet created! Total bullets:', gameState.bullets.length);

        // Play sound if available
        const hitSound = document.getElementById('hitSound');
        if (hitSound) {
            hitSound.currentTime = 0;
            hitSound.play().catch(e => console.log('Sound error:', e));
        }
    };

    // Set up shooting listeners after a short delay to ensure game is loaded
    setTimeout(function () {
        console.log('🎮 Setting up shooting controls...');

        // Space key shooting
        document.addEventListener('keydown', function (e) {
            if (e.code === 'Space' || e.key === ' ') {
                e.preventDefault();
                console.log('⌨️ Space pressed');
                window.shootBullet();
            }
        });

        // Click shooting on canvas
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('🖱️ Canvas clicked');
                window.shootBullet();
            });

            canvas.addEventListener('touchstart', function (e) {
                e.preventDefault();
                console.log('👆 Canvas touched');
                window.shootBullet();
            });
        }

        // Fire button
        const fireButton = document.getElementById('fireButton');
        if (fireButton) {
            fireButton.addEventListener('click', function (e) {
                e.preventDefault();
                console.log('🔴 Fire button clicked');
                window.shootBullet();
            });

            fireButton.addEventListener('touchstart', function (e) {
                e.preventDefault();
                console.log('🔴 Fire button touched');
                window.shootBullet();
            });
        }

        console.log('✅ All shooting controls set up!');
        console.log('📌 Try: Space key, Click canvas, or Fire button');
    }, 1000);
});

// Also try to override after window load
window.addEventListener('load', function () {
    console.log('🌐 Window fully loaded');

    // Make sure shoot function is available
    if (typeof window.shoot !== 'undefined') {
        const originalShoot = window.shoot;
        window.shoot = function () {
            console.log('🔄 Redirecting to shootBullet');
            window.shootBullet();
        };
    }
});

console.log('🎯 Shooting fix script loaded');
