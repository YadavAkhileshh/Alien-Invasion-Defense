const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const restartButton = document.getElementById("restartButton");
const gameOverElement = document.getElementById("gameOver");
const highScoreElement = document.getElementById("highScoreValue");
const volumeSlider = document.getElementById("volumeSlider");

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

let player, aliens, bullets, particles, powerUps;
let score = 0;
let level = 1;
let lives = 3;
let gameActive = false;
let keys = {};
let highScore = 0;

// Pause game variables
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
    ctx.fillStyle = "red";
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

    ctx.fillStyle = "#00ffff";
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

    // Load the image once
    this.img = new Image(); 
    this.img.src = 'b.png'; // Path to your image
  }

  draw() {
    // Draw the preloaded image
    ctx.drawImage(
      this.img,
      this.x, // x position for the top-left corner of the image
      this.y, // y position for the top-left corner of the image
      this.width, // width of the image
      this.height // height of the image
    );
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
    // Set custom width and height values
    this.width = 25;  // Change this value to increase width
    this.height = 25; // Change this value to increase height

    // Create a new Image object
    const img = new Image();
    img.src = 'd.png'; // Path to your image file

    // Draw the image on the canvas at the specified x and y coordinates
    ctx.drawImage(img, this.x, this.y, this.width, this.height);
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
class PowerUp { // Added this class  
  constructor(x, y, type) {  
   this.width = 20;  
   this.height = 20;  
   this.x = x;  
   this.y = y;  
   this.type = type;  
  }  
  
  draw() {  
    // Create an image object if it doesn't exist
    if (!this.img) {
      this.img = new Image();
      this.img.src = 'c.png'; // Set the image source to your image path
    }
  
    // Draw the image instead of the blue rectangle
    ctx.drawImage(
      this.img,     // Image object
      this.x,       // X position
      this.y,       // Y position
      this.width,   // Width of the image
      this.height   // Height of the image
    );
  }
   
  
  update() {  
   this.y += 2;  
  }  
} 

function initGame() {
  player = new Player();
  aliens = [];
  bullets = [];
  particles = [];
  powerUps = [];
  score = 0;
  level = 1;
  lives = 3;
  scoreElement.textContent = score;
  levelElement.textContent = level;
  livesElement.textContent = lives;
  spawnAliens();
  updatePauseButton();
  setupVolumeControl();
}

function spawnAliens() {
  for (let i = 0; i < 5 + level; i++) {
    aliens.push(
      new Alien(Math.random() * (canvas.width - 40), -50 - Math.random() * 500)
    );
  }
}
function spawnPowerUp() { // Added this function  
  const x = Math.random() * (canvas.width - 20);  
  const y = -20;  
  powerUps?.push(new PowerUp(x, y, 'speedBoost'));  // added optional chaining (?.) to prevent the code from trying to access push() on a null or undefined value, which resolves the error.
}  
  
setInterval(spawnPowerUp, 5000); // Added this line  

function update() {
  if (!gamePaused) {
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
              new Particle(
                alien.x + alien.width / 2,
                alien.y + alien.height / 2
              )
            );
          }
          aliens.splice(alienIndex, 1);
          bullets.splice(bulletIndex, 1);
          score++;
          scoreElement.textContent = score;

          hitSound.play(); // Play hit sound when the bullet hits an alien

          if (score % 10 === 0) {
            level++;
            levelElement.textContent = level;
            spawnAliens();
          }
        }
      });
    });

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
  particles.forEach((particle, index) => {
    particle.draw();
    particle.update();
    if (particle.size <= 0.2) particles.splice(index, 1);
  });
  powerUps.forEach((powerUp, index) => { // Added this loop  
    powerUp.draw();  
    powerUp.update();  
    if (powerUp.y > canvas.height) {  
     powerUps.splice(index, 1);  
    }  
    if (checkCollision(player, powerUp)) {  
     // apply the power-up effect  
     if (powerUp.type === 'speedBoost') {  
       player.speed *= 2;  
       document.getElementById('speedBoostTimer').textContent = 'Speed Boost: 5s'; // Added this line  
       setTimeout(() => {  
        player.speed /= 2;  
        document.getElementById('speedBoostTimer').textContent = ''; // Added this line  
       }, 5000); // speed boost lasts for 5 seconds  
     }  
     powerUps.splice(index, 1);  
    }  
   });  


    if (aliens.length === 0) spawnAliens();

    if (gameActive) {
      requestAnimationFrame(update);
    }
  }
}
function checkCollision(obj1, obj2) { // Added this function  
  return (  
   obj1.x < obj2.x + obj2.width &&  
   obj1.x + obj1.width > obj2.x &&  
   obj1.y < obj2.y + obj2.height &&  
   obj1.y + obj1.height > obj2.y  
  );  
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
  backgroundMusic.pause(); // Stop background music on game over
}

function restart() {
  gameOverElement.style.display = "none";
  restartButton.style.display = "none";
  updatePauseButton();
  gameActive = true;
  initGame();
  backgroundMusic.play(); // Play background music when restarting the game
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
  handleSwipe();
});

function handleSwipe() {
  if (touchEndX < touchStartX) player.x -= player.speed;
  if (touchEndX > touchStartX) player.x += player.speed;
}

canvas.addEventListener("touchstart", (e) => {
  e.preventDefault();
  if (gameActive) shoot();
});

// Adjust canvas size for mobile
function resizeCanvas() {
  const maxWidth = window.innerWidth - 20;
  const maxHeight = window.innerHeight - 20;
  const aspectRatio = canvas.width / canvas.height;

  if (maxWidth / aspectRatio <= maxHeight) {
    canvas.style.width = maxWidth + "px";
    canvas.style.height = maxWidth / aspectRatio + "px";
  } else {
    canvas.style.width = maxHeight * aspectRatio + "px";
    canvas.style.height = maxHeight + "px";
  }
}

window.addEventListener("resize", resizeCanvas);
resizeCanvas();

let shootingInterval;

// Keydown event listener for continuous shooting
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space" && gameActive) shoot();
  if (e.code === "Escape") {
    if (gameActive) {
      if (gamePaused) {
        // If the game is paused, resume it and restore previous state
        gamePaused = false;
        restoreGameState();
        update();
        pauseButton.style.display = 'none';
      } else {
        // If the game is not paused, pause it and save the current state
        gamePaused = true;
        saveGameState();
        pauseButton.style.display = 'block';
      }
    }
  }
});

function saveGameState() {
  previousGameState = {
    score,
    level,
    lives,
    aliens: aliens.map((alien) => ({ x: alien.x, y: alien.y })), // Save the positions of aliens
    bullets: bullets.map((bullet) => ({ x: bullet.x, y: bullet.y })), // Save the positions of bullets
    playerPosition: { x: player.x, y: player.y }, // Save player position
  };
  // Optionally, stop any ongoing animations or sounds
  backgroundMusic.pause();
}

function updatePauseButton() {
  if (gamePaused) {
    pauseButton.style.display = 'block';
  } else {
    pauseButton.style.display = 'none';
  }
}

function restoreGameState() {
  if (previousGameState) {
    score = previousGameState.score;
    level = previousGameState.level;
    lives = previousGameState.lives;
    aliens = previousGameState.aliens.map((pos) => new Alien(pos.x, pos.y)); // Restore aliens
    bullets = previousGameState.bullets.map((pos) => new Bullet(pos.x, pos.y)); // Restore bullets
    player.x = previousGameState.playerPosition.x; // Restore player position
    player.y = previousGameState.playerPosition.y; // Restore player position

    scoreElement.textContent = score;
    levelElement.textContent = level;
    livesElement.textContent = lives;

    // Optionally, resume any sounds or animations
    backgroundMusic.play();
  }


  if (gameActive) {
    if ((e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") && !shootingInterval) {
      shoot();
      shootingInterval = setInterval(() => {
        shoot();
      }, 100); // Fire a bullet every 200 milliseconds while holding space
    }
  }
};


// Keyup event listener to stop shooting
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;

  if (e.code === "Space" || e.code === "ArrowUp" || e.code === "KeyW") {
    clearInterval(shootingInterval);
    shootingInterval = null; // Clear the interval when the spacebar is released
  }
});

document.addEventListener("mousedown", (e) => {
  if (gameActive) shoot();  
})

// Shooting with left mouse click
document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Start game on button click
startButton.addEventListener("click", () => {
  if (!gameActive) {
    gameActive = true;
    startButton.style.display = "none";
    gameOverElement.style.display = "none";
    initGame();
    backgroundMusic.play(); // Play background music when the game starts
    update();
  }
});

// Restart game on button click
restartButton.addEventListener("click", restart);
pauseButton.addEventListener("click", () => {
  gamePaused = false;
  restoreGameState();
  update();
  pauseButton.style.display = 'none';
});


// Get references to control buttons
const leftButton = document.getElementById("leftButton");
const rightButton = document.getElementById("rightButton");
const fireButton = document.getElementById("fireButton");

// Add event listeners for the left movement button
leftButton.addEventListener("mousedown", () => {
  keys.ArrowLeft = true; // Set the left arrow key as pressed
});
leftButton.addEventListener("mouseup", () => {
  keys.ArrowLeft = false; // Release the left arrow key
});
leftButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  keys.ArrowLeft = true; // Set the left arrow key as pressed
});
leftButton.addEventListener("touchend", () => {
  keys.ArrowLeft = false; // Release the left arrow key
});

// Add event listeners for the right movement button
rightButton.addEventListener("mousedown", () => {
  keys.ArrowRight = true; // Set the right arrow key as pressed
});
rightButton.addEventListener("mouseup", () => {
  keys.ArrowRight = false; // Release the right arrow key
});
rightButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  keys.ArrowRight = true; // Set the right arrow key as pressed
});
rightButton.addEventListener("touchend", () => {
  keys.ArrowRight = false; // Release the right arrow key
});

// Add event listener for the fire button
fireButton.addEventListener("mousedown", () => {
  if (gameActive) shoot(); // Shoot if the game is active
});
fireButton.addEventListener("mouseup", () => {
  // Logic for stopping fire can be added here if needed
});
fireButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  if (gameActive) shoot(); // Shoot if the game is active
});
fireButton.addEventListener("touchend", () => {
  // Logic for stopping fire can be added here if needed
});

// Handle volume changes
function setupVolumeControl() {
  backgroundMusic.volume = volumeSlider.value;
  volumeSlider.addEventListener("input", function() {
  backgroundMusic.volume = this.value;
  });
}

