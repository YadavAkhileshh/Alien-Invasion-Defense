import { Player } from './classes/Player.js';
import { Alien } from './classes/Alien.js';
import { Bullet } from './classes/Bullet.js';
import { Heart } from './classes/Heart.js';
import { Particle } from './classes/Particle.js';

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const livesElement = document.getElementById("lives");
const startButton = document.getElementById("startButton");
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
function gameLoop() {
  if (!gamePaused) {
      update(); // Update game objects like player, aliens, hearts
      draw();    // Draw everything to the canvas
  }
  requestAnimationFrame(gameLoop); // Request the next frame
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
  startGame();
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

let hearts = [];

function spawnHearts() {
  if (Math.random() < 0.007) { 
    hearts.push(new Heart(Math.random() * (canvas.width - 30), -30));
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

// spawn only 10 aliens
function spawnAliens() {
  if (aliens.length >= totalAliens) return; 

  for (let i = 0; i < totalAliens; i++) {
    const alienType = Math.random();
    let type;
    let points;

    if (alienType < 1 / 5) {
      type = "default";
      points = 10; // Points for default aliens
    } else if (alienType < 2 / 5) {
      type = "terrific";
      points = 20; // Points for terrific aliens
    } else if (alienType < 3 / 5) {
      type = "cute";
      points = 15; // Points for cute aliens
    } else if (alienType < 4 / 5) {
      type = "robotic";
      points = 25; // Points for robotic aliens
    } else {
      type = "ghostly";
      points = 30; // Points for ghostly aliens
    }
   // spawn aliens randomly
    const numAliens = Math.floor(Math.random() * 3) + 2;

    for (let j = 0; j < numAliens && aliens.length < totalAliens; j++) {
      aliens.push(
        new Alien(
          Math.random() * (canvas.width - 40), 
          -50 - Math.random() * 500, 
          type,
          points // Pass points to the alien constructor
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
    // Destroy the alien and get points
    aliens.splice(alienIndex, 1);
    bullets.splice(bulletIndex, 1);
    
    // Increment the destroyed aliens count and score based on alien type
    score += alien.points; // Add points from the defeated alien
    scoreElement.textContent = score; // Update score display
    hitSound.currentTime = 0;
    hitSound.play();
    
    // Check if all aliens have been destroyed
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



