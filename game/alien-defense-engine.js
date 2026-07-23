// =========================================
// ALIEN INVASION DEFENSE - GAME ENGINE
// =========================================

// =========================================
// 1. GAME CONFIGURATION
// =========================================
const CONFIG = {
  canvas: {
    width: 800,
    height: 600
  },
  player: {
    width: 60,
    height: 60,
    speed: 5
  },
  alien: {
    width: 40,
    height: 40,
    baseSpeed: 1
  },
  bullet: {
    width: 5,
    height: 15,
    speed: 7
  },
  difficulty: {
    easy: { speedMultiplier: 0.7, spawnRate: 2000 },
    medium: { speedMultiplier: 1, spawnRate: 1500 },
    hard: { speedMultiplier: 1.5, spawnRate: 1000 }
  }
};

// =========================================
// 2. GAME STATE
// =========================================
const gameState = {
  active: false,
  paused: false,
  score: 0,

  lives: 3,
  highScore: parseInt(localStorage.getItem('alienDefenseHighScore')) || 0,
  difficulty: 'medium',
  player: null,
  aliens: [],
  bullets: [],
  particles: [],
  keys: {},
  spawnInterval: null,
  animationFrameId: null
};

// =========================================
// 3. DOM ELEMENTS
// =========================================
const DOM = {
  canvas: document.getElementById('gameCanvas'),
  ctx: null,
  currentScore: document.getElementById('currentScore'),

  currentLives: document.getElementById('currentLives'),
  highScore: document.getElementById('highScore'),
  difficultySelect: document.getElementById('difficultySelect'),
  volumeSlider: document.getElementById('volumeSlider'),
  volumeToggle: document.getElementById('volumeToggle'),
  startOverlay: document.getElementById('startOverlay'),
  gameOverOverlay: document.getElementById('gameOverOverlay'),
  pauseOverlay: document.getElementById('pauseOverlay'),
  startButton: document.getElementById('startButton'),
  restartButton: document.getElementById('restartButton'),
  pauseButton: document.getElementById('pauseButton'),
  resumeButton: document.getElementById('resumeButton'),
  shareButton: document.getElementById('shareButton'),
  finalScore: document.getElementById('finalScore'),

  warningMessage: document.getElementById('warningMessage'),
  achievementToast: document.getElementById('achievementToast'),
  achievementDesc: document.getElementById('achievementDesc'),
  leftButton: document.getElementById('leftButton'),
  rightButton: document.getElementById('rightButton'),
  fireButton: document.getElementById('fireButton'),
  fullscreenButton: document.getElementById('fullscreenButton'),
  backgroundMusic: document.getElementById('backgroundMusic'),
  hitSound: document.getElementById('hitSound'),
  gameOverSound: document.getElementById('gameOverSound'),
  congratsSound: document.getElementById('congratsSound')
};

// =========================================
// 4. PLAYER CLASS
// =========================================
class Player {
  constructor() {
    this.width = CONFIG.player.width;
    this.height = CONFIG.player.height;
    this.x = (CONFIG.canvas.width - this.width) / 2;
    this.y = CONFIG.canvas.height - this.height - 10;
    this.speed = CONFIG.player.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#4a4a4a';
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#00ffff';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.x - 10, this.y + this.height - 20, 10, 20);
    ctx.fillRect(this.x + this.width, this.y + this.height - 20, 10, 20);
  }

  move() {
    if ((gameState.keys.ArrowLeft || gameState.keys.KeyA) && this.x > 0) {
      this.x -= this.speed;
    }
    if ((gameState.keys.ArrowRight || gameState.keys.KeyD) && this.x < CONFIG.canvas.width - this.width) {
      this.x += this.speed;
    }
  }
}

// =========================================
// 5. ALIEN CLASS
// =========================================
class Alien {
  constructor(x, y, type) {
    this.width = CONFIG.alien.width;
    this.height = CONFIG.alien.height;
    this.x = x;
    this.y = y;
    this.type = type;
    this.speed = CONFIG.alien.baseSpeed * CONFIG.difficulty[gameState.difficulty].speedMultiplier;
    this.points = 10;
  }

  draw(ctx) {
    ctx.fillStyle = '#32a852';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
    ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
    ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
    ctx.fill();
  }

  move() {
    this.y += this.speed;
  }
}

// =========================================
// 6. BULLET CLASS
// =========================================
class Bullet {
  constructor(x, y) {
    this.width = CONFIG.bullet.width;
    this.height = CONFIG.bullet.height;
    this.x = x;
    this.y = y;
    this.speed = CONFIG.bullet.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#0ff';
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y -= this.speed;
  }
}

// =========================================
// 7. PARTICLE CLASS
// =========================================
class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
    this.life = 1;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life -= 0.02;
    if (this.size > 0.2) this.size -= 0.1;
  }
}

// =========================================
// 8. GAME INITIALIZATION
// =========================================
function initGame() {
  DOM.canvas.width = CONFIG.canvas.width;
  DOM.canvas.height = CONFIG.canvas.height;
  DOM.ctx = DOM.canvas.getContext('2d');
  DOM.highScore.textContent = gameState.highScore;
  setupEventListeners();
  setupAudio();
}

// =========================================
// 9. EVENT LISTENERS
// =========================================
function setupEventListeners() {
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // Remove the old click listener since we're using onclick in HTML
  // DOM.startButton.addEventListener('click', startGame);
  DOM.restartButton.addEventListener('click', restartGame);
  if (DOM.resumeButton) DOM.resumeButton.addEventListener('click', togglePause);
  if (DOM.pauseButton) DOM.pauseButton.addEventListener('click', togglePause);
  if (DOM.shareButton) DOM.shareButton.addEventListener('click', shareScore);

  DOM.difficultySelect.addEventListener('change', (e) => {
    gameState.difficulty = e.target.value;
  });

  DOM.volumeSlider.addEventListener('input', updateVolume);
  DOM.volumeToggle.addEventListener('click', toggleMute);

  // Mobile controls
  if (DOM.leftButton) {
    DOM.leftButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      gameState.keys.ArrowLeft = true;
    });
    DOM.leftButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      gameState.keys.ArrowLeft = false;
    });
  }

  if (DOM.rightButton) {
    DOM.rightButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      gameState.keys.ArrowRight = true;
    });
    DOM.rightButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      gameState.keys.ArrowRight = false;
    });
  }

  if (DOM.fireButton) {
    DOM.fireButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      shoot();
    });
    DOM.fireButton.addEventListener('click', (e) => {
      e.preventDefault();
      shoot();
    });
  }

  // Shooting controls
  document.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
      e.preventDefault();
      if (gameState.active && !gameState.paused) {
        shoot();
      }
    }
  });

  DOM.canvas.addEventListener('click', (e) => {
    e.preventDefault();
    if (gameState.active && !gameState.paused) {
      shoot();
    }
  });
}

// =========================================
// 10. AUDIO SETUP
// =========================================
function setupAudio() {
  if (DOM.backgroundMusic) DOM.backgroundMusic.volume = 0.5;
  updateVolume();
}

function updateVolume() {
  const volume = parseFloat(DOM.volumeSlider.value);
  if (DOM.backgroundMusic) DOM.backgroundMusic.volume = volume;

  const icon = DOM.volumeToggle.querySelector('i');
  if (volume === 0) {
    icon.className = 'fas fa-volume-mute';
  } else if (volume < 0.5) {
    icon.className = 'fas fa-volume-down';
  } else {
    icon.className = 'fas fa-volume-up';
  }
}

function toggleMute() {
  if (DOM.volumeSlider.value > 0) {
    DOM.volumeSlider.dataset.previousValue = DOM.volumeSlider.value;
    DOM.volumeSlider.value = 0;
  } else {
    DOM.volumeSlider.value = DOM.volumeSlider.dataset.previousValue || 0.5;
  }
  updateVolume();
}

function playSound(sound) {
  if (sound && DOM.volumeSlider.value > 0) {
    sound.currentTime = 0;
    sound.play().catch(e => console.log('Sound play failed:', e));
  }
}

// =========================================
// 11. GAME CONTROLS
// =========================================
function handleKeyDown(e) {
  gameState.keys[e.code] = true;
  if (e.code === 'Escape' && gameState.active) {
    togglePause();
  }
}

function handleKeyUp(e) {
  gameState.keys[e.code] = false;
}

function shoot() {
  if (!gameState.active || gameState.paused || !gameState.player) return;

  const bullet = new Bullet(
    gameState.player.x + gameState.player.width / 2 - CONFIG.bullet.width / 2,
    gameState.player.y
  );
  gameState.bullets.push(bullet);
}

// =========================================
// 12. GAME STATE MANAGEMENT
// =========================================
function startGame() {
  resetGameState();
  gameState.active = true;
  gameState.difficulty = DOM.difficultySelect.value;

  DOM.startOverlay.classList.add('hidden');
  gameState.player = new Player();
  startAlienSpawner();
  gameLoop();

  if (DOM.backgroundMusic) {
    DOM.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
  }
  
  document.dispatchEvent(new CustomEvent('gameStart'));
}

function restartGame() {
  DOM.gameOverOverlay.classList.add('hidden');
  startGame();
}

function togglePause() {
  if (!gameState.active) return;

  gameState.paused = !gameState.paused;

  if (gameState.paused) {
    DOM.pauseOverlay.classList.remove('hidden');
    if (DOM.backgroundMusic) DOM.backgroundMusic.pause();
    stopAlienSpawner();
  } else {
    DOM.pauseOverlay.classList.add('hidden');
    if (DOM.backgroundMusic) DOM.backgroundMusic.play().catch(e => console.log('Music play failed:', e));
    startAlienSpawner();
    gameLoop();
  }
}

function resetGameState() {
  gameState.score = 0;

  gameState.lives = 3;
  gameState.aliens = [];
  gameState.bullets = [];
  gameState.particles = [];
  gameState.paused = false;
  updateUI();
}

function gameOver() {
  gameState.active = false;
  stopAlienSpawner();

  DOM.finalScore.textContent = gameState.score;


  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    localStorage.setItem('alienDefenseHighScore', gameState.highScore);
    DOM.highScore.textContent = gameState.highScore;
    playSound(DOM.congratsSound);
  }

  DOM.gameOverOverlay.classList.remove('hidden');
  if (DOM.backgroundMusic) DOM.backgroundMusic.pause();
  playSound(DOM.gameOverSound);
  
  document.dispatchEvent(new CustomEvent('gameOver'));
}

// =========================================
// 13. ALIEN SPAWNING
// =========================================
function startAlienSpawner() {
  stopAlienSpawner();
  const spawnRate = CONFIG.difficulty[gameState.difficulty].spawnRate;
  gameState.spawnInterval = setInterval(spawnAlien, spawnRate);
}

function stopAlienSpawner() {
  if (gameState.spawnInterval) {
    clearInterval(gameState.spawnInterval);
    gameState.spawnInterval = null;
  }
}

function spawnAlien() {
  const x = Math.random() * (CONFIG.canvas.width - CONFIG.alien.width);
  const alien = new Alien(x, -CONFIG.alien.height, 'default');
  gameState.aliens.push(alien);
}

// =========================================
// 14. COLLISION DETECTION
// =========================================
function checkCollision(obj1, obj2) {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// =========================================
// 15. GAME LOOP
// =========================================
function gameLoop() {
  if (!gameState.active || gameState.paused) return;

  DOM.ctx.clearRect(0, 0, CONFIG.canvas.width, CONFIG.canvas.height);

  if (gameState.player) {
    gameState.player.move();
    gameState.player.draw(DOM.ctx);
  }

  // Update bullets
  for (let i = gameState.bullets.length - 1; i >= 0; i--) {
    const bullet = gameState.bullets[i];
    bullet.move();

    if (bullet.y < -bullet.height) {
      gameState.bullets.splice(i, 1);
      continue;
    }

    bullet.draw(DOM.ctx);
  }

  // Update aliens
  for (let i = gameState.aliens.length - 1; i >= 0; i--) {
    const alien = gameState.aliens[i];
    alien.move();

    if (alien.y > CONFIG.canvas.height) {
      gameState.aliens.splice(i, 1);
      loseLife();
      continue;
    }

    // Check bullet collisions
    let alienHit = false;
    for (let j = gameState.bullets.length - 1; j >= 0; j--) {
      if (checkCollision(alien, gameState.bullets[j])) {
        for (let k = 0; k < 8; k++) {
          gameState.particles.push(new Particle(
            alien.x + alien.width / 2,
            alien.y + alien.height / 2
          ));
        }

        gameState.bullets.splice(j, 1);
        gameState.aliens.splice(i, 1);
        addScore(alien.points);
        playSound(DOM.hitSound);
        alienHit = true;
        break;
      }
    }

    if (alienHit) continue;

    // Check player collision
    if (checkCollision(alien, gameState.player)) {
      loseLife();
      gameState.aliens.splice(i, 1);
      continue;
    }

    alien.draw(DOM.ctx);
  }

  // Update particles
  for (let i = gameState.particles.length - 1; i >= 0; i--) {
    const particle = gameState.particles[i];
    particle.update();

    if (particle.life <= 0) {
      gameState.particles.splice(i, 1);
    } else {
      particle.draw(DOM.ctx);
    }
  }

  requestAnimationFrame(gameLoop);
}

// =========================================
// 16. SCORE & LIVES MANAGEMENT
// =========================================
function addScore(points) {
  gameState.score += points;
  updateUI();
}

function loseLife() {
  gameState.lives--;
  updateUI();

  if (gameState.lives === 1) {
    showWarning();
  }

  if (gameState.lives <= 0) {
    gameOver();
  }
}

function showWarning() {
  if (DOM.warningMessage) {
    DOM.warningMessage.classList.remove('hidden');
    setTimeout(() => {
      DOM.warningMessage.classList.add('hidden');
    }, 2000);
  }
}

// =========================================
// 17. UI UPDATES
// =========================================
function updateUI() {
  DOM.currentScore.textContent = gameState.score;
  DOM.currentLives.textContent = gameState.lives;
}

// =========================================
// 18. SHARE FUNCTIONALITY
// =========================================
function shareScore() {
  const text = `I scored ${gameState.score} points in Alien Invasion Defense!`;
  const url = window.location.href;

  if (navigator.share) {
    navigator.share({
      title: 'Alien Invasion Defense',
      text: text,
      url: url
    }).catch(err => console.log('Error sharing:', err));
  } else {
    navigator.clipboard.writeText(`${text} ${url}`)
      .then(() => console.log('Score copied to clipboard!'))
      .catch(err => console.log('Error copying:', err));
  }
}

// =========================================
// 19. INITIALIZE ON PAGE LOAD
// =========================================
document.addEventListener('DOMContentLoaded', initGame);

// Make functions globally accessible
window.startGame = startGame;
window.restartGame = restartGame;
window.togglePause = togglePause;
window.shoot = shoot;