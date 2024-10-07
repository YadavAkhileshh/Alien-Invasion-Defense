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

//volume icons
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.querySelector("#volumeControl i"); 

volumeSlider.addEventListener("input", function () {
  backgroundMusic.volume = volumeSlider.value;

  if (volumeSlider.value == 0) {
    volumeIcon.classList.remove("fa-volume-up");
    volumeIcon.classList.add("fa-volume-mute");
    backgroundMusic.pause(); 
  } else {
    volumeIcon.classList.remove("fa-volume-mute");
    volumeIcon.classList.add("fa-volume-up");
    if (backgroundMusic.paused) {
      backgroundMusic.play();  
    }
  }
});

backgroundMusic.volume = volumeSlider.value;

startButton.addEventListener("click", function () {
  backgroundMusic.volume = volumeSlider.value;  // Set volume when game starts
});

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
let shootingInterval = null;
let gamePaused = false;
let previousGameState = null;

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
    if ((keys.ArrowLeft || keys["KeyA"]) && this.x > 0)
      this.x -= this.speed;
    if ((keys.ArrowRight || keys["KeyD"]) && this.x < canvas.width - this.width)
      this.x += this.speed;
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
    // Alien body (circle)
    ctx.fillStyle = "#32a852"; // Alien green color for the body
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 2, // Center x
      this.y + this.height / 2, // Center y
      this.width / 2, // Radius (body size)
      0,
      Math.PI * 2 // Full circle
    );
    ctx.fill();
  
    // Alien eyes (two large eyes)
    ctx.fillStyle = "#ffffff"; // White for the eyes
    // Left eye
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 3, // Position to the left
      this.y + this.height / 3, // Slightly higher than center
      this.width / 6, // Size of the eye
      0,
      Math.PI * 2
    );
    ctx.fill();
  
    // Right eye
    ctx.beginPath();
    ctx.arc(
      this.x + (2 * this.width) / 3, // Position to the right
      this.y + this.height / 3, // Slightly higher than center
      this.width / 6, // Size of the eye
      0,
      Math.PI * 2
    );
    ctx.fill();
  
    // Alien pupils (black circles inside the eyes)
    ctx.fillStyle = "#000000"; // Black for the pupils
    // Left pupil
    ctx.beginPath();
    ctx.arc(
      this.x + this.width / 3, 
      this.y + this.height / 3, 
      this.width / 12, // Smaller than the eye
      0,
      Math.PI * 2
    );
    ctx.fill();
  
    // Right pupil
    ctx.beginPath();
    ctx.arc(
      this.x + (2 * this.width) / 3, 
      this.y + this.height / 3, 
      this.width / 12, 
      0,
      Math.PI * 2
    );
    ctx.fill();
  
    // Alien antennae (two lines coming out from the head)
    ctx.strokeStyle = "#ff00ff"; // Magenta for antennae
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Left antenna
    ctx.moveTo(this.x + this.width / 3, this.y); // Start from top-left of head
    ctx.lineTo(this.x + this.width / 3, this.y - this.height / 4); // Extend upwards
    ctx.stroke();
  
    ctx.beginPath();
    // Right antenna
    ctx.moveTo(this.x + (2 * this.width) / 3, this.y); // Start from top-right of head
    ctx.lineTo(this.x + (2 * this.width) / 3, this.y - this.height / 4); // Extend upwards
    ctx.stroke();
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

  player.move();
  player.draw();

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
        if (score % 10 === 0) levelUp();
        hitSound.currentTime = 0;
        hitSound.play();
      }
    });
  });

  bullets.forEach((bullet, bulletIndex) => {
    bullet.draw();
    bullet.move();
    if (bullet.y < 0) bullets.splice(bulletIndex, 1);
  });

  particles.forEach((particle, particleIndex) => {
    particle.draw();
    particle.update();
    if (particle.size <= 0.2) particles.splice(particleIndex, 1);
  });

  if (gameActive && !gamePaused) requestAnimationFrame(update);
}

function levelUp() {
  level++;
  levelElement.textContent = level;
  spawnAliens();
}

function shootBullet() {
  bullets.push(
    new Bullet(player.x + player.width / 2 - 2.5, player.y)
  );
}

function startGame() {
  gameActive = true;
  gamePaused = false;
  gameOverElement.style.display = "none";
  restartButton.style.display = "none";
  backgroundMusic.currentTime = 0;
  backgroundMusic.loop = true;
  backgroundMusic.play();
  initGame();
  update();
}

function gameOver() {
  gameActive = false;
  gamePaused = true;
  gameOverElement.style.display = "block";
  restartButton.style.display = "block";
  backgroundMusic.pause();
  if (score > highScore) {
    highScore = score;
    highScoreElement.textContent = highScore;
  }
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" && !shootingInterval) {
    shootingInterval = setInterval(shootBullet, 300);
  }
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
  if (e.code === "Space") {
    clearInterval(shootingInterval);
    shootingInterval = null;
  }
});

document.addEventListener("keydown", (e) => {
  if (e.code === "KeyP") {
    if (!gamePaused) {
      gamePaused = true;
      previousGameState = {
        aliens: [...aliens],
        bullets: [...bullets],
        particles: [...particles]
      };
    } else {
      gamePaused = false;
      aliens = [...previousGameState.aliens];
      bullets = [...previousGameState.bullets];
      particles = [...previousGameState.particles];
      update();
    }
  }
});