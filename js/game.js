// Constants
const ORIGINAL_WIDTH = 800;
const ORIGINAL_HEIGHT = 600;
let WIDTH = ORIGINAL_WIDTH;
let HEIGHT = ORIGINAL_HEIGHT;

const PEG_RADIUS = 6;
const BALL_RADIUS = 6;
// Define fixed rows and columns (same for mobile and desktop)
const ROWS = 12;
const COLS = 15;
const BIN_COUNT = 9;
const GRAVITY = 0.2;
const BOUNCE_FACTOR = 0.8;
const DIVIDER_WIDTH = 5;
const DIVIDER_HEIGHT = 50;

// Colors
const BLACK = '#000000';
const BACKGROUND = '#0A0A1E';
const WHITE = '#FFFFFF';
const LIGHT_BLUE = '#509AFF';
const GOLD = '#FFD700';
const BRIGHT_YELLOW = '#FFFF00';
const ORANGE = '#FFA500';
const GRAY = '#787878';
const LIGHT_GRAY = '#B4B4B4';
const CYAN = '#00FFFF';

// Game variables
let canvas, ctx;
let pegs = [];
let bins = [];
let dividers = [];
let balls = [];
let frameCount = 0;
let playerScore = 200;
let animationId;
let scale = 1;
// Simple mobile detection variable
let isMobile = checkMobile();

// Simplify mobile detection function
function detectMobile() {
    // Simple width-based detection
    isMobile = window.innerWidth < 768;
    console.log(`Device detected as: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
}

// Simplify the init function
function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Explicitly check mobile status
    isMobile = checkMobile();
    console.log("MOBILE DEVICE DETECTED:", isMobile);
    
    // Set up canvas and game elements
    resizeCanvas();
    createPegs();
    createBinsAndDividers();
    
    // Event listeners
    document.addEventListener('keydown', handleKeydown);
    document.getElementById('dropButton').addEventListener('click', dropBall);
    
    // Handle window resize
    window.addEventListener('resize', function() {
        isMobile = checkMobile();
        console.log("MOBILE STATUS AFTER RESIZE:", isMobile);
        resizeCanvas();
        createPegs();
        createBinsAndDividers();
    });
    
    // Start game loop
    gameLoop();
}

// Simplify resizeCanvas function
function resizeCanvas() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth - 20;
    
    // Maintain aspect ratio
    const aspectRatio = ORIGINAL_WIDTH / ORIGINAL_HEIGHT;
    
    canvas.width = containerWidth;
    canvas.height = containerWidth / aspectRatio;
    
    // Update scale factor
    scale = canvas.width / ORIGINAL_WIDTH;
    
    // Update working dimensions
    WIDTH = canvas.width;
    HEIGHT = canvas.height;
}

// Simplify handleResize function
function handleResize() {
    detectMobile();
    resizeCanvas();
    createPegs();
    createBinsAndDividers();
}

// Keep a consistent peg layout
function createPegs() {
    pegs = [];
    const spacingX = WIDTH / (COLS + 1);
    const spacingY = (HEIGHT - 100 * scale) / (ROWS + 1);
    
    for (let row = 0; row < ROWS; row++) {
        const offset = row % 2 ? spacingX / 2 : 0;
        const colsInRow = row % 2 ? COLS - 1 : COLS;
        
        for (let col = 0; col < colsInRow; col++) {
            const x = spacingX + offset + spacingX * col;
            const y = spacingY * (row + 1) + 50 * scale;
            pegs.push(new Peg(x, y));
        }
    }
}

function createBinsAndDividers() {
    bins = [];
    dividers = [];
    const binWidth = WIDTH / BIN_COUNT;
    
    // Updated scores with new values
    const scores = [100, 50, 10, 5, 1, 5, 10, 50, 100];
    
    // Create dividers (one at each boundary between bins)
    for (let i = 0; i <= BIN_COUNT; i++) {
        const x = i * binWidth;
        const dividerHeight = DIVIDER_HEIGHT * scale;
        dividers.push(new Divider(x, HEIGHT - dividerHeight, DIVIDER_WIDTH * scale, dividerHeight));
    }
    
    // Create bins
    for (let i = 0; i < BIN_COUNT; i++) {
        bins.push(new Bin(i * binWidth, binWidth, scores[i]));
    }
}

function handleKeydown(event) {
    if (event.code === 'Space') {
        dropBall();
    }
}

// Update the dropBall function to create consistent ball size
function dropBall() {
    if (playerScore >= 10) {
        playerScore -= 10;
        updateScoreDisplay();
        
        // Drop a ball from the middle
        const ball = new Ball(WIDTH/2, 10 * scale);
        
        // Same ball size on all devices
        ball.radius = BALL_RADIUS * scale;
        
        balls.push(ball);
    }
}

function updateScoreDisplay() {
    const scoreElement = document.querySelector('.score');
    scoreElement.textContent = `Balance: ${playerScore}`;
}

function drawBackground() {
    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, 0, HEIGHT);
    gradient.addColorStop(0, '#0A0A1E');
    gradient.addColorStop(1, '#1A1A2E');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
}

// Update the gameLoop function to maintain consistent ball size
function gameLoop() {
    frameCount++;
    
    // Clear canvas
    ctx.clearRect(0, 0, WIDTH, HEIGHT);
    
    // Draw background
    drawBackground();
    
    // Update and draw game elements
    updateBalls();
    
    // Draw pegs - SAME SIZE for mobile and desktop
    for (const peg of pegs) {
        peg.radius = PEG_RADIUS * scale;
        peg.draw(ctx);
    }
    
    // Draw bins and dividers
    for (const bin of bins) {
        bin.draw(ctx, HEIGHT);
    }
    
    for (const divider of dividers) {
        divider.draw(ctx);
    }
    
    // Set consistent ball size regardless of device
    for (const ball of balls) {
        // Same size on all devices
        ball.radius = BALL_RADIUS * scale;
        ball.draw(ctx);
    }
    
    // Pulse the drop button
    const dropButton = document.getElementById('dropButton');
    if (playerScore >= 10) {
        if (frameCount % 60 < 30) {
            dropButton.style.transform = 'scale(1.05)';
        } else {
            dropButton.style.transform = 'scale(1)';
        }
        dropButton.style.opacity = '1';
    } else {
        dropButton.style.transform = 'scale(1)';
        dropButton.style.opacity = '0.6';
    }
    
    // Continue the game loop
    animationId = requestAnimationFrame(gameLoop);
}

function updateBalls() {
    // Create a new array for active balls
    const activeBalls = [];
    
    for (let i = 0; i < balls.length; i++) {
        const ball = balls[i];
        
        if (ball.active) {
            // Get the score before updating
            const scoreGained = ball.update(pegs, bins, balls, dividers);
            
            // Add score if any was gained
            if (scoreGained > 0) {
                playerScore += scoreGained;
                updateScoreDisplay();
            }
            
            // Only keep active balls in the new array
            if (ball.active) {
                activeBalls.push(ball);
            }
        }
    }
    
    // Replace the balls array with only active balls
    balls = activeBalls;
}

// At the top of your file, add this function:
function checkMobile() {
    return window.innerWidth <= 768;
}

// Start the game when page loads
window.onload = init;