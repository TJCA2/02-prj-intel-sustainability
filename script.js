// Water Quest Game - JavaScript Logic

// Game state variables
let gameRunning = false;
let score = 0;
let timeLeft = 30;
let gameTimer = null;
let spawnTimer = null;

// Get references to important elements
const titleScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const startGameBtn = document.getElementById('start-game-btn');
const restartBtn = document.getElementById('restart-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');
const gameOverModal = document.getElementById('game-over-modal');
const finalScoreElement = document.getElementById('final-score');
const waterDropsElement = document.getElementById('water-drops');
const finalMessageElement = document.getElementById('final-message');
const milestoneMessage = document.getElementById('milestone-message');
const flashEffect = document.getElementById('flash-effect');
const holes = document.querySelectorAll('.hole');

// Event listeners for buttons
startGameBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
playAgainBtn.addEventListener('click', playAgain);

// Add click listeners to all holes
holes.forEach(hole => {
    hole.addEventListener('click', onHoleClick);
});

// Function to start the game
function startGame() {
    // Hide title screen and show game screen
    titleScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    
    // Reset game state
    score = 0;
    timeLeft = 30;
    gameRunning = true;
    
    // Update display
    updateScore();
    updateTimer();
    
    // Start the game timer (counts down every second)
    gameTimer = setInterval(() => {
        timeLeft--;
        updateTimer();
        
        // Check if game should end
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
    
    // Start spawning jerry cans
    scheduleNextSpawn();
}

// Function to restart the current game
function restartGame() {
    // Clear any existing timers
    clearInterval(gameTimer);
    clearTimeout(spawnTimer);
    
    // Hide all jerry cans
    hideAllJerryCans();
    
    // Start new game
    startGame();
}

// Function to play again after game over
function playAgain() {
    // Hide game over modal
    gameOverModal.classList.add('hidden');
    
    // Clear any existing timers
    clearInterval(gameTimer);
    clearTimeout(spawnTimer);
    
    // Hide all jerry cans
    hideAllJerryCans();
    
    // Start new game
    startGame();
}

// Function to end the game
function endGame() {
    gameRunning = false;
    
    // Clear timers
    clearInterval(gameTimer);
    clearTimeout(spawnTimer);
    
    // Hide all jerry cans
    hideAllJerryCans();
    
    // Show game over modal with results
    showGameOverModal();
}

// Function to update score display
function updateScore() {
    scoreElement.textContent = score;
}

// Function to update timer display
function updateTimer() {
    timerElement.textContent = timeLeft;
}

// Function to schedule the next jerry can spawn
function scheduleNextSpawn() {
    if (!gameRunning) return;
    
    // Random delay between 0.7 and 1.2 seconds
    const delay = Math.random() * 500 + 700; // 700-1200ms
    
    spawnTimer = setTimeout(() => {
        spawnJerryCan();
        scheduleNextSpawn(); // Schedule the next one
    }, delay);
}

// Function to spawn a jerry can in a random hole
function spawnJerryCan() {
    if (!gameRunning) return;
    // Choose a random hole
    const randomHole = Math.floor(Math.random() * 9);
    const hole = holes[randomHole];
    const jerryCan = hole.querySelector('.jerry-can');
    // Skip if this hole already has an active jerry can
    if (jerryCan.classList.contains('show')) {
        return;
    }
    // Decide what type of water drop to spawn
    const spawnChance = Math.random();
    jerryCan.classList.remove('good', 'polluted');
    if (spawnChance < 0.7) {
        // 70% chance for good (blue) water drop
        jerryCan.classList.add('good');
        jerryCan.classList.add('show');
        jerryCan.dataset.type = 'good';
    } else if (spawnChance < 0.9) {
        // 20% chance for polluted (black) water drop
        jerryCan.classList.add('polluted');
        jerryCan.classList.add('show');
        jerryCan.dataset.type = 'polluted';
    }
    // 10% chance for nothing (empty hole)
    // Auto-hide after 1 second if not clicked
    setTimeout(() => {
        if (jerryCan.classList.contains('show')) {
            hideJerryCan(jerryCan);
        }
    }, 1000);
}

// Function to handle hole clicks
function onHoleClick(event) {
    if (!gameRunning) return;
    
    const hole = event.currentTarget;
    const jerryCan = hole.querySelector('.jerry-can');
    
    // Only process if jerry can is visible
    if (!jerryCan.classList.contains('show')) {
        return;
    }
    
    // Get the type of jerry can
    const canType = jerryCan.dataset.type;
    
    if (canType === 'good') {
        // Good jerry can clicked - increase score
        score++;
        updateScore();
        showFlash('green');
        checkMilestone();
    } else if (canType === 'polluted') {
        // Polluted jerry can clicked - decrease score
        score = Math.max(0, score - 1); // Don't go below 0
        updateScore();
        showFlash('red');
    }
    
    // Hide the jerry can
    hideJerryCan(jerryCan);
}

// Function to hide a specific jerry can
function hideJerryCan(jerryCan) {
    jerryCan.classList.remove('show', 'polluted', 'good');
    jerryCan.dataset.type = '';
}

// Function to hide all jerry cans
function hideAllJerryCans() {
    holes.forEach(hole => {
        const jerryCan = hole.querySelector('.jerry-can');
        hideJerryCan(jerryCan);
    });
}

// Function to show flash effect
function showFlash(color) {
    flashEffect.className = `flash-effect ${color}`;
    
    // Hide flash effect after animation
    setTimeout(() => {
        flashEffect.className = 'flash-effect hidden';
    }, 300);
}

// Function to check for milestone achievements
function checkMilestone() {
    let message = '';
    
    if (score === 10) {
        message = "Great start! You're making a difference!";
    } else if (score === 20) {
        message = "Amazing! You're changing lives!";
    } else if (score === 30) {
        message = "Incredible! Clean water hero!";
    } else if (score > 0 && score % 25 === 0) {
        message = "Outstanding work! Keep going!";
    }
    
    if (message) {
        showMilestoneMessage(message);
    }
}

// Function to show milestone message
function showMilestoneMessage(message) {
    milestoneMessage.textContent = message;
    milestoneMessage.classList.remove('hidden');
    
    // Hide milestone message after 2 seconds
    setTimeout(() => {
        milestoneMessage.classList.add('hidden');
    }, 2000);
}

// Function to show game over modal
function showGameOverModal() {
    // Update final score
    finalScoreElement.textContent = score;
    waterDropsElement.textContent = score;
    
    // Choose appropriate message based on score
    let message;
    if (score >= 30) {
        message = "Outstanding! You scored " + score + " points!";
    } else if (score >= 20) {
        message = "Great job! You scored " + score + " points!";
    } else if (score >= 10) {
        message = "Good work! You scored " + score + " points!";
    } else {
        message = "Try again to beat your score and bring more clean water!";
    }
    
    finalMessageElement.innerHTML = message;
    
    // Show the modal
    gameOverModal.classList.remove('hidden');
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Make sure title screen is visible and game screen is hidden
    titleScreen.classList.remove('hidden');
    gameScreen.classList.add('hidden');
    gameOverModal.classList.add('hidden');
    
    console.log('Water Quest game loaded successfully!');
});
