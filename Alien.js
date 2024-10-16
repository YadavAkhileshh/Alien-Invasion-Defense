const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
startButton = document.getElementById("startButton");
const restartButton = document.getElementById("restartButton");
const gameOverElement = document.getElementById("gameOver");
const highScoreElement = document.getElementById("highScoreValue");
 levelSelect = document.getElementById('levelSelect');
let currentScore = 0;
let highScore = localStorage.getItem('highScore') ? parseInt(localStorage.getItem('highScore')) : 0;

// Display the initial high score
highScoreElement.textContent = highScore;
let aliensDestroyed = 0; // Track how many aliens have been destroyed
let totalAliens = 10;    // Total aliens per wave
let wave = 1;            // Current wave number
let waveActive = true;
// Update the high score display on page load
document.getElementById('highScore').textContent = highScore;
// Load audio elements
const backgroundMusic = document.getElementById("backgroundMusic");
const hitSound = document.getElementById("hitSound");
const gameOverSound = document.getElementById("gameOverSound");

// Drop down menu
const instructionsTitle = document.getElementById("instructionsTitle");
const instructionsList = document.getElementById("instructionsList");

//volume icons
const volumeSlider = document.getElementById("volumeSlider");
const volumeIcon = document.querySelector("#volumeControl i"); 
const pauseResumeButton = document.getElementById("pauseResumeButton");

pauseResumeButton.addEventListener("click", () => {
  if (gamePaused) {
      resumeGame(); // Resume the game if it's currently paused
      pauseResumeButton.textContent = "Pause"; // Change button text to "Pause"
      pauseResumeButton.classList.remove("paused"); // Remove paused class
      pauseResumeButton.classList.add("resumed"); // Add resumed class
  } else {
      pauseGame(); // Pause the game if it's currently running
      pauseResumeButton.textContent = "Resume"; // Change button text to "Resume"
      pauseResumeButton.classList.remove("resumed"); // Remove resumed class
      pauseResumeButton.classList.add("paused"); // Add paused class
  }
});

function pauseGame() {
    gamePaused = true; // Set the game paused state to true
    console.log("Game paused"); // Log pause action (optional)
    // Stop game loop, animations, etc. as needed
}
function updateScore() {
  currentScore++; // Increase the current score
  document.getElementById('score').textContent = currentScore; // Update the score on the page

  // Check if the current score exceeds the high score
  if (currentScore > highScore) {
      highScore = currentScore; // Update the high score
      localStorage.setItem('highScore', highScore); // Store the new high score in localStorage
      document.getElementById('highScore').textContent = highScore; // Update the high score display
  }
}
function resumeGame() {
    gamePaused = false; // Set the game paused state to false
    console.log("Game resumed"); // Log resume action (optional)
    update(); // Resume the game loop
}
function resetGame() {
  currentScore = 0; // Reset current score
  document.getElementById('score').textContent = currentScore; // Reset score display
}
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
let lives = 3;
let gameActive = false;
let keys = {};
let shootingInterval = null;
let gamePaused = false;
let previousGameState = null;
let level=1;
let aliensKilled = 0;  // Track how many aliens are killed
//let level = 1;  // Start at level 1
let waitingForNextWave = false;

function setLevel(difficulty){
  switch(difficulty) {
    case 'easy':
        // Easy level settings
        level=1;
        break;
    case 'medium':
        // Medium level settings
        level=2;
        break;
    case 'hard':
        // Hard level settings
        level=3;
        break;
    default:
        level=1;
  }
}

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

class Heart {
  constructor(x, y) {
    this.width = 30;
    this.height = 30;
    this.x = x;
    this.y = y;
    this.speed = 2; 
  }

  draw() {
    ctx.fillStyle = "#FF0000";
    
    // Heart shape using bezier curves
    ctx.beginPath();
    const topCurveHeight = this.height * 0.3;
    ctx.moveTo(this.x, this.y + topCurveHeight);
    
    // Top left curve
    ctx.bezierCurveTo(
      this.x, this.y, 
      this.x - this.width / 2, this.y, 
      this.x - this.width / 2, this.y + topCurveHeight
    );
    
    // Bottom left curve
    ctx.bezierCurveTo(
      this.x - this.width / 2, this.y + (this.height + topCurveHeight) / 2, 
      this.x, this.y + (this.height + topCurveHeight) / 2, 
      this.x, this.y + this.height
    );
    
    // Bottom right curve
    ctx.bezierCurveTo(
      this.x, this.y + (this.height + topCurveHeight) / 2, 
      this.x + this.width / 2, this.y + (this.height + topCurveHeight) / 2, 
      this.x + this.width / 2, this.y + topCurveHeight
    );

    // Top right curve
    ctx.bezierCurveTo(
      this.x + this.width / 2, this.y, 
      this.x, this.y, 
      this.x, this.y + topCurveHeight
    );
    
    ctx.closePath();
    ctx.fill();
  }

  move() {
    this.y += this.speed;
  }
}


let hearts = [];

function spawnHearts() {
  if (Math.random() < 0.007) { 
    hearts.push(new Heart(Math.random() * (canvas.width - 30), -30));
  }
}

class Alien {
  constructor(x, y, type) {
    this.width = 40;
    this.height = 40;
    this.x = x;
    this.y = y;
    this.speed = 1 + level * 0.5;
    this.type = type; // Assign the type
  }

  draw() {
    if (this.type === 'default') {
      ctx.fillStyle = "#32a852"; // Alien green color for the body
      ctx.beginPath();
      ctx.arc(
        this.x + this.width / 2, 
        this.y + this.height / 2, 
        this.width / 2, 
        0,
        Math.PI * 2 // Full circle
      );
      ctx.fill();
  
      // Eyes
      ctx.fillStyle = "#ffffff"; 
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
      ctx.fill();
  
      // Pupils
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
      ctx.fill();
  
      // Antennae
      ctx.strokeStyle = "#ff00ff"; 
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 3, this.y); 
      ctx.lineTo(this.x + this.width / 3, this.y - this.height / 4);
      ctx.stroke();
  
      ctx.beginPath();
      ctx.moveTo(this.x + (2 * this.width) / 3, this.y);
      ctx.lineTo(this.x + (2 * this.width) / 3, this.y - this.height / 4);
      ctx.stroke();
    } 
    else if (this.type === 'terrific') {
      // Terrific Alien appearance
      ctx.fillStyle = "#8b0000"; // Dark red body
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();

      // Eyes (one misaligned pupil to look scary)
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
      ctx.fill();

      // Pupils (misaligned one)
      ctx.fillStyle = "#000000";
      // Left pupil
      ctx.beginPath();
      ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
      ctx.fill();

      // Right pupil (slightly offset)
      ctx.beginPath();
      ctx.arc(this.x + (2 * this.width) / 3 + 5, this.y + this.height / 3 + 5, this.width / 12, 0, Math.PI * 2);
      ctx.fill();

      // Add horns
      ctx.strokeStyle = "#8b0000"; 
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 4, this.y); 
      ctx.lineTo(this.x + this.width / 5, this.y - this.height / 4); // Left horn
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x + (3 * this.width) / 4, this.y); 
      ctx.lineTo(this.x + (4 * this.width) / 5, this.y - this.height / 4); // Left horn
      ctx.stroke();

      // Add jagged teeth
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 4, this.y + (2 * this.height) / 3); // Left tooth
      ctx.lineTo(this.x + this.width / 2, this.y + (3 * this.height) / 4); // Middle tooth
      ctx.lineTo(this.x + (3 * this.width) / 4, this.y + (2 * this.height) / 3); // Right tooth
      ctx.closePath();
      ctx.fill();

      // Add scar (diagonal line across face)
      ctx.strokeStyle = "#ff0000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 4, this.y + this.height / 2);
      ctx.lineTo(this.x + (3 * this.width) / 4, this.y + this.height / 3);
      ctx.stroke();
    }
    else if (this.type === 'cute') {
      // Cute Alien appearance
      ctx.fillStyle = "#FF69B4"; 
      ctx.beginPath();
      ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
      ctx.fill();
      
      // Big round eyes
      ctx.fillStyle = "#ffffff"; 
      ctx.beginPath();
      ctx.arc(this.x + this.width / 4, this.y + this.height / 2.5, this.width / 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + (3 * this.width) / 4, this.y + this.height / 2.5, this.width / 4, 0, Math.PI * 2);
      ctx.fill();
      
      // Big black pupils
      ctx.fillStyle = "#000000";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 4, this.y + this.height / 2.5, this.width / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + (3 * this.width) / 4, this.y + this.height / 2.5, this.width / 8, 0, Math.PI * 2);
      ctx.fill();
      
      // Cute blushing cheeks (small pink circles)
      ctx.fillStyle = "#FFC0CB";
      ctx.beginPath();
      ctx.arc(this.x + this.width / 4, this.y + (2 * this.height) / 3, this.width / 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(this.x + (3 * this.width) / 4, this.y + (2 * this.height) / 3, this.width / 8, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "#FF0000";
      ctx.fillStyle = "#FF0000";
      // Horns
      ctx.strokeStyle = "#FF69B4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.x + this.width / 4, this.y);
      ctx.lineTo(this.x + this.width / 5, this.y - this.height / 4); // Left horn
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(this.x + (3 * this.width) / 4, this.y);
      ctx.lineTo(this.x + (4 * this.width) / 5, this.y - this.height / 4); // Right horn
      ctx.stroke();
      
    } 
    else if (this.type === 'robotic') {
      // Robotic Alien appearance
      ctx.fillStyle = "#808080"; // Gray for metal body
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = "#ff0000"; // Red robotic eyes
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 6, 0, Math.PI * 2);
        ctx.fill();

        // Pupils
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y + this.height / 3, this.width / 12, 0, Math.PI * 2);
        ctx.fill();

        // antennae with lights
        ctx.strokeStyle = "#ff0000"; 
        ctx.lineWidth = 3;
        // Left antenna
        ctx.beginPath();
        ctx.moveTo(this.x + this.width / 3, this.y);
        ctx.lineTo(this.x + this.width / 3, this.y - this.height / 4);
        ctx.stroke();

        // Red light on top
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x + this.width / 3, this.y - this.height / 4 - 5, 5, 0, Math.PI * 2);
        ctx.fill();

        // Right antenna
        ctx.beginPath();
        ctx.moveTo(this.x + (2 * this.width) / 3, this.y);
        ctx.lineTo(this.x + (2 * this.width) / 3, this.y - this.height / 4);
        ctx.stroke();

        // Red light on top
        ctx.fillStyle = "#ff0000";
        ctx.beginPath();
        ctx.arc(this.x + (2 * this.width) / 3, this.y - this.height / 4 - 5, 5, 0, Math.PI * 2);
        ctx.fill();

        // mouth
        ctx.fillStyle = "#000000";
        ctx.fillRect(this.x + this.width / 3, this.y + (2 * this.height) / 3, this.width / 3, this.height / 6);
    } 
    else if (this.type === 'ghostly') {
      //body
        ctx.fillStyle = "#F8F8FF"; 
        ctx.beginPath();
        ctx.arc(this.x + this.width / 2, this.y + this.height / 2, this.width / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Eyes 
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.ellipse(this.x + this.width / 4, this.y + this.height / 3, this.width / 8, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(this.x + (3 * this.width) / 4, this.y + this.height / 3, this.width / 8, this.height / 4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Tail
        ctx.fillStyle = "#F8F8FF";
        ctx.beginPath();
        ctx.moveTo(this.x, this.y + this.height);
        ctx.quadraticCurveTo(this.x + this.width / 2, this.y + this.height + 10, this.x + this.width, this.y + this.height);
        ctx.fill();
    }
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
  let difficulty=levelSelect.value;
  setLevel(difficulty);
  lives = 3;
  scoreElement.textContent = score;
  levelElement.textContent = level;
  livesElement.textContent = lives;
  spawnAliens();
}

function spawnAliens() {
  // Spawn only 10 aliens for each wave
  if (aliens.length >= totalAliens) return; 

  for (let i = 0; i < totalAliens; i++) {
    const alienType = Math.random();
    let type;
    if (alienType < 1 / 5) {
      type = "default";
    } else if (alienType < 2 / 5) {
      type = "terrific";
    } else if (alienType < 3 / 5) {
      type = "cute";
    } else if (alienType < 4 / 5) {
      type = "robotic";
    } else {
      type = "ghostly";
    }

    // Spawn aliens randomly
    const numAliens = Math.floor(Math.random() * 3) + 2;

    for (let j = 0; j < numAliens && aliens.length < totalAliens; j++) {
      aliens.push(
        new Alien(
          Math.random() * (canvas.width - 40), 
          -50 - Math.random() * 500, 
          type
        )
      );
    }
  }
}

function update() {
  if (!gameActive || gamePaused || waitingForNextWave) return; 
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.move();
  player.draw();

  spawnHearts();
  hearts.forEach((heart, index) => {
    heart.draw();
    heart.move();

    if (
      player.x < heart.x + heart.width &&
      player.x + player.width > heart.x &&
      player.y < heart.y + heart.height &&
      player.y + player.height > heart.y
    ) {
      lives++;
      livesElement.textContent = lives;
      hearts.splice(index, 1); // Remove heart once collected
    }

    if (heart.y > canvas.height) {
      hearts.splice(index, 1); // Remove heart if it falls off-screen
    }
  });

  aliens.forEach((alien, alienIndex) => {
    alien.draw();
    alien.move();

    if (alien.y > canvas.height) {
      aliens.splice(alienIndex, 1);
      lives--;
      livesElement.textContent = lives;
      if (lives === 1) {
        // Show the warning message
        const warningMessage = document.getElementById("warningMessage");
        warningMessage.style.display = "block"; // Show the message

        // Hide the warning after 1 seconds
        setTimeout(() => {
          warningMessage.style.display = "none";
        }, 1000);
      } else if (lives <= 0) gameOver();
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
      else if (lives === 1) {
        // Show the warning message
        const warningMessage = document.getElementById("warningMessage");
        warningMessage.style.display = "block"; // Show the message

        // Hide the warning after 1 seconds
        setTimeout(() => {
          warningMessage.style.display = "none";
        }, 1000);
      }
    }

    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x < alien.x + alien.width &&
        bullet.x + bullet.width > alien.x &&
        bullet.y < alien.y + alien.height &&
        bullet.y + bullet.height > alien.y
      ) {
        // Destroy the alien
        aliens.splice(alienIndex, 1);
        bullets.splice(bulletIndex, 1);
      
        // Increment the destroyed aliens count
        aliensDestroyed++;
        score++;
        scoreElement.textContent = score;
        hitSound.currentTime = 0;
        hitSound.play();
      
        // Check if all 10 aliens have been destroyed
        if (aliensDestroyed >= totalAliens) {
          endWave();
        }
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

function shootBullet() {
  bullets.push(
    new Bullet(player.x + player.width / 2 - 2.5, player.y)
  );
}


// Preload explosion images
const explosionFrames = [];
for (let i = 1; i <= 6; i++) {
  const img = new Image();
  img.src = `images/exp${i}.png`;
  explosionFrames.push(img);
}

let explosionIndex = 0;
let explosionActive = false;

function animateExplosion() {
  if (explosionActive && explosionIndex < explosionFrames.length) {
    ctx.clearRect(
      player.x - 10,
      player.y - 20,
      player.width + 20,
      player.height + 20
    );
    ctx.drawImage(
      explosionFrames[explosionIndex],
      player.x,
      player.y,
      player.width,
      player.height
    );
    explosionIndex++;

    // Schedule the next frame
    setTimeout(animateExplosion, 100); // Adjust for animation speed
  } else {
    // Reset once animation completes
    explosionActive = false;
    explosionIndex = 0;
  }
}


function endWave() {
  waveActive = false; // Mark the wave as inactive
  showNextLevelMessage(); // Display the message for the next wave
  
  setTimeout(() => {
    // Reset the wave variables for the next wave
    aliensDestroyed = 0;
    totalAliens += 5; // Increase the number of aliens for the next wave (optional)
    wave++;
    waveActive = true;
    
    // Start spawning the next wave of aliens
    spawnAliens();
  }, 5000); // Wait for 5 seconds before the next wave
}
function showNextLevelMessage() {
  const nextLevelMessage = document.getElementById("nextLevelMessage");
  nextLevelMessage.textContent = `Wave ${wave + 1} Incoming!`;
  nextLevelMessage.style.display = "block";
  
  // Hide the message after 5 seconds
  setTimeout(() => {
    nextLevelMessage.style.display = "none";
  }, 5000);
}
function prepareNextWave() {
  waitingForNextWave = true;
  
  // Display "Next Wave" message
  const waveMessage = document.getElementById("waveMessage");
  waveMessage.textContent = `Wave ${level + 1} Coming!`;
  waveMessage.style.display = "block";

  // Pause the game for 5 seconds
  setTimeout(() => {
    waveMessage.style.display = "none"; // Hide message after 5 seconds

    // Move to the next level
    level++;
    aliensKilled = 0;  // Reset the killed alien count for the new wave

    // Increase difficulty (optional)
    spawnAliens();  // Spawn new aliens for the next level
    waitingForNextWave = false;
  }, 5000);  // 5-second wait
}

function startGame() {
  gameActive = true;
  gamePaused = false;
  gameOverElement.style.display = "none";
  restartButton.style.display = "none";
  startButton.style.display = "none";
  backgroundMusic.currentTime = 0;
  backgroundMusic.loop = true;
  backgroundMusic.play();
  wave = 1; // Reset wave to 1
  aliensDestroyed = 0; // Reset aliens destroyed counter
  totalAliens = 10; 
  initGame();
  update();
}
nextWave();
function nextWave() {
  if (wave === 1) {
      aliensPerWave = 10;
      // Display message for first wave
      document.getElementById('nextLevelMessage').innerText = `Wave 1 Incoming!`;
  } else if (wave === 2) {
      aliensPerWave = 20;
      // Display message for second wave
      document.getElementById('nextLevelMessage').innerText = `Wave 2 Incoming!`;
  } else if (wave === 3) {
      infiniteWave = true; // Activate infinite wave
      aliensPerWave = 0; // Set to zero to indicate infinite spawning
      // Display message for final wave
      document.getElementById('nextLevelMessage').innerText = `Final Wave Incoming!`;
  }

  document.getElementById('nextLevelMessage').style.display = 'block';
  
  setTimeout(() => {
      document.getElementById('nextLevelMessage').style.display = 'none';
      spawnAliens(aliensPerWave);

      // If it's the infinite wave, start spawning aliens at intervals
      if (infiniteWave) {
          setInterval(() => {
              spawnAliens(1); // Spawn 1 alien continuously
          }, 1000); // Adjust the timing as necessary
      }
  }, 5000); // Wait 5 seconds before starting the wave
}
function alienDestroyed() {
  totalAliensDestroyed++;
  if (totalAliensDestroyed >= aliensPerWave) {
      wave++; // Move to the next wave
      totalAliensDestroyed = 0; // Reset the counter
      nextWave(); // Call the next wave function
  }
}

// Retrieve the last high score from localStorage or set it to 0 if none exists

function gameOver() {
  // Check if current score is the new high score
  if (currentScore > highScore) {
      highScore = currentScore; // Set new high score
      localStorage.setItem('highScore', highScore); // Save high score
      document.getElementById('highScore').textContent = highScore; // Display the updated high score
  }

  // Start the explosion animation on the canvas at the player's position
  explosionActive = true;
  animateExplosion();
  // Any other game over logic (e.g., displaying "Game Over" screen) goes here
  alert("Game Over! Your Score: " + currentScore);
  level = 1;
  aliensKilled = 0;
}
function restart() {
  gameOverElement.style.display = "none";
  restartButton.style.display = "none";
  // updatePauseButton();
  initGame();
  backgroundMusic.play(); // Play background music when restarting the game
  update();
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", startGame);

// document.addEventListener("keydown", (e) => {
//   keys[e.code] = true;
//   if (e.code === "Space" && !shootingInterval) {
//     shootingInterval = setInterval(shootBullet, 300);
//   }
// });

document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
  if (e.code === "Space") {
    // Shoot immediately when the spacebar is pressed
    if (!shootingInterval) {
      shootBullet(); // Shoot immediately
      shootingInterval = setInterval(shootBullet, 300); // Continue shooting every 300ms
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

function restoreGameState(e) {
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
      shootBullet();
      shootingInterval = setInterval(() => {
        shootBullet();
      }, 100); // Fire a bullet every 200 milliseconds while holding space
    }
  }
};

// Keyup event listener to stop shooting
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


// Restart game on button click
// restartButton.addEventListener("click", restart);
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
  if (gameActive) shootBullet(); // Shoot if the game is active
});
fireButton.addEventListener("mouseup", () => {
  // Logic for stopping fire can be added here if needed
});
fireButton.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  if (gameActive) shootBullet(); // Shoot if the game is active
});
fireButton.addEventListener("touchend", () => {
  // Logic for stopping fire can be added here if needed
});

document.addEventListener("DOMContentLoaded", () => {
  // Retrieve the stored JSON string and parse it back to an object
  let personData = localStorage.getItem("signupData");

  // Check if person data exists
  if (personData) {
      // Parse the JSON string to an object
      const person = JSON.parse(personData);
      // Get the name from the person object
      const name = person.fullName;
      document.getElementById("displayName").textContent = `Welcome to the game ${name}!`;
  } else {
      // If no data is found, use default
      const defaultName = "Adventurer";
      document.getElementById("displayName").textContent = `Welcome to the game ${defaultName}!`;
  }
});



