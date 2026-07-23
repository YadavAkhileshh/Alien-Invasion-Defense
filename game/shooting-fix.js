(function () {
    document.addEventListener('DOMContentLoaded', function () {
        const originalStartButton = document.getElementById('startButton');
        if (originalStartButton) {
            originalStartButton.addEventListener('click', function () {
                setTimeout(() => {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(err => {
                            console.log('Fullscreen request:', err.message);
                        });
                    }
                }, 100);
            });
        }

        const pauseButton = document.getElementById('pauseButton');
        const fullscreenButton = document.getElementById('fullscreenButton');

        if (pauseButton && pauseButton.parentElement) {
            pauseButton.parentElement.style.display = 'none';
        }

        if (fullscreenButton && fullscreenButton.parentElement) {
            fullscreenButton.parentElement.style.display = 'none';
        }

        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.addEventListener('click', function (e) {
                const flash = document.createElement('div');
                flash.style.position = 'absolute';
                flash.style.width = '10px';
                flash.style.height = '10px';
                flash.style.background = '#0ff';
                flash.style.borderRadius = '50%';
                flash.style.left = e.clientX + 'px';
                flash.style.top = e.clientY + 'px';
                flash.style.pointerEvents = 'none';
                flash.style.boxShadow = '0 0 20px #0ff';
                flash.style.animation = 'fadeOut 0.3s ease-out forwards';
                document.body.appendChild(flash);
                setTimeout(() => flash.remove(), 300);
            });
        }

        if (!document.getElementById('patch-styles')) {
            const style = document.createElement('style');
            style.id = 'patch-styles';
            style.textContent = `
                @keyframes fadeOut {
                    from { opacity: 1; transform: scale(1); }
                    to { opacity: 0; transform: scale(2); }
                }
            `;
            document.head.appendChild(style);
        }
    });
})();
