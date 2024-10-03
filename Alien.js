const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
const startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameOverElement = document.getElementById("gameOver");
const highScoreElement = document.getElementById("highScoreValue");

// Load audio elements
const backgroundMusic = document.getElementById("backgroundMusic");
const hitSound = document.getElementById("hitSound");

// Drop down menu
const instructionsTitle = document.getElementById("instructionsTitle");
const instructionsList = document.getElementById("instructionsList");

// Drop down menu event listeners
instructionsTitle.addEventListener("click", () => {
  instructionsList.style.display = instructionsList.style.display === "block" ? "none" : "block";
});

canvas.width = 800;
canvas.height = 600;

let player, aliens, bullets, particles;
let score = 0;
let level = 1;
let lives = 3;
let gameActive = false;
let keys = {};
let highScore = 0;

let shooting = false;      // Tracks whether the shooting button is held
let shootCooldown = 0;     // Cooldown timer to control fire rate
const shootDelay = 10;     // Delay between shots (lower = faster shooting)

class Player {
  constructor() {
    this.width = 60;
    this.height = 60;
    this.x = canvas.width / 2 - this.width / 2;
    this.y = canvas.height - this.height - 10;
    this.speed = 5;
  }

  draw() {
    ctx.fillStyle = "#4a4a4a";
    ctx.beginPath();
    ctx.moveTo(this.x + this.width / 2, this.y);
    ctx.lineTo(this.x, this.y + this.height);
    ctx.lineTo(this.x + this.width, this.y + this.height);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#00ffff";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 3,
      this.width / 6,
      0,
      Math.PI * 2
    );
    ctx.fill();

    ctx.fillStyle = "#ff0000";
    ctx.fillRect(this.x - 10, this.y + this.height - 20, 10, 20);
    ctx.fillRect(this.x + this.width, this.y + this.height - 20, 10, 20);
  }

  move() {
    let movement = 0; // Variable to store accumulated movement

    if ((keys.ArrowLeft || keys["KeyA"]) && this.x > 0) {
      movement -= this.speed; // Move left
    }

    if ((keys.ArrowRight || keys["KeyD"]) && this.x < canvas.width - this.width) {
      movement += this.speed; // Move right
    }

    // Update the player's position by applying accumulated movement
    this.x += movement;
  }
}

class Alien {
  constructor(x, y) {
    this.width = 40;
    this.height = 40;
    this.x = x;
    this.y = y;
    this.speed = 1 + level * 0.5;
  }

  draw() {
    ctx.fillStyle = "#f00";
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2,
      this.y + this.height / 2,
      this.width / 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
  }

  move() {
    this.y += this.speed;
  }
}

class Bullet {
  constructor(x, y) {
    this.width = 5;
    this.height = 15;
    this.x = x;
    this.y = y;
    this.speed = 7;
  }

  draw() {
    ctx.fillStyle = "#0ff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move() {
    this.y -= this.speed;
  }
}

class Particle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 5 + 1;
    this.speedX = Math.random() * 4 - 2;
    this.speedY = Math.random() * 4 - 2;
    this.color = `hsl(${Math.random() * 360}, 100%, 50%)`;
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }
}

function initGame() {
  player = new Player();
  aliens = [];
  bullets = [];
  particles = [];
  score = 0;
  level = 1;
  lives = 3;
  scoreElement.textContent = score;
  levelElement.textContent = level;
  livesElement.textContent = lives;
  spawnAliens();
}

function spawnAliens() {
  for (let i = 0; i < 5 + level; i++) {
    aliens.push(
      new Alien(Math.random() * (canvas.width - 40), -50 - Math.random() * 500)
    );
  }
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Handle player movement
  player.move();
  player.draw();

  // Handle continuous shooting
  if (shooting && shootCooldown <= 0) {
    shoot();
    shootCooldown = shootDelay;  // Reset the cooldown after each shot
  }
  if (shootCooldown > 0) shootCooldown--;  // Decrease cooldown over time

  // Handle alien movement, bullet movement, collisions, etc.
  aliens.forEach((alien, alienIndex) => {
    alien.draw();
    alien.move();

    if (alien.y > canvas.height) {
      aliens.splice(alienIndex, 1);
      lives--;
      livesElement.textContent = lives;
      if (lives <= 0) gameOver();
    }

    if (
      player.x < alien.x + alien.width &&
      player.x + player.width > alien.x &&
      player.y < alien.y + alien.height &&
      player.y + player.height > alien.y
    ) {
      lives--;
      livesElement.textContent = lives;
      aliens.splice(alienIndex, 1);
      if (lives <= 0) gameOver();
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        for (let i = 0; i < 15; i++) {
          particles.push(
            new Particle(alien.x + alien.width / 2, alien.y + alien.height / 2)
          );
        }
        aliens.splice(alienIndex, 1);
        bullets.splice(bulletIndex, 1);
        score++;
        scoreElement.textContent = score;

        hitSound.play();  // Play hit sound when the bullet hits an alien

        if (score % 10 === 0) {
          level++;
          levelElement.textContent = level;
          spawnAliens();
        }
      }
    });
  });

  // Handle bullet and particle movement
  bullets.forEach((bullet, index) => {
    bullet.draw();
    bullet.move();
    if (bullet.y < 0) bullets.splice(index, 1);
  });

  particles.forEach((particle, index) => {
    particle.draw();
    particle.update();
    if (particle.size <= 0.2) particles.splice(index, 1);
  });

  if (aliens.length === 0) spawnAliens();

  if (gameActive) {
    requestAnimationFrame(update);
  }
}

function shoot() {
  bullets.push(new Bullet(player.x + player.width / 2 - 2.5, player.y));
}

function gameOver() {
  gameActive = false;
  gameOverElement.style.display = "block";
  restartButton.style.display = "block";
  document.getElementById("finalScore").textContent = `Final Score: ${score}`;
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
  }
  backgroundMusic.pause();  // Stop background music on game over
}

function restart() {
  gameOverElement.style.display = "none";
  restartButton.style.display = "none";
  gameActive = true;
  initGame();
  backgroundMusic.play();  // Play background music when restarting the game
  update();
}

// Touch controls for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleGesture();
});

function handleGesture() {
  if (touchEndX < touchStartX) {
    keys["ArrowLeft"] = true;
    keys["ArrowRight"] = false;
  }
  if (touchEndX > touchStartX) {
    keys["ArrowRight"] = true;
    keys["ArrowLeft"] = false;
  }
}

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    shooting = true;       // Start shooting when button is pressed
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    shooting = false;      // Stop shooting when button is released
  }
});

startButton.addEventListener("click", () => {
  startButton.style.display = "none";
  gameActive = true;
  initGame();
  backgroundMusic.play();  // Play background music when starting the game
  update();
});

restartButton.addEventListener("click", restart);
