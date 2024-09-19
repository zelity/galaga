const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let player = { x: canvas.width / 2 - 15, y: canvas.height - 30, width: 30, height: 30 };
let bullets = [];
let enemies = [];
let score = 0;

// Control keys
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;

// Event listeners
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = true;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.key === ' ') {
        spacePressed = true;
        shootBullet();
    }
}

function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
        rightPressed = false;
    }
    if (e.key === 'Left' || e.key === 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key === ' ') {
        spacePressed = false;
    }
}

// Shoot bullet
function shootBullet() {
    const bullet = { x: player.x + player.width / 2 - 2, y: player.y, width: 4, height: 10 };
    bullets.push(bullet);
}

// Create enemies
function createEnemies() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 3; j++) {
            enemies.push({ x: 50 + i * 50, y: 30 + j * 40, width: 30, height: 30 });
        }
    }
}

// Update game state
function update() {
    // Move player
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += 5;
    }
    if (leftPressed && player.x > 0) {
        player.x -= 5;
    }

    // Move bullets
    for (let bullet of bullets) {
        bullet.y -= 5;
    }
    bullets = bullets.filter(bullet => bullet.y > 0);

    // Check for bullet collisions with enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (
                bullets[j].x < enemies[i].x + enemies[i].width &&
                bullets[j].x + bullets[j].width > enemies[i].x &&
                bullets[j].y < enemies[i].y + enemies[i].height &&
                bullets[j].y + bullets[j].height > enemies[i].y
            ) {
                // Remove enemy and bullet on collision
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                break;
            }
        }
    }
}

// Draw everything
function draw() {
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.fillStyle = 'white';
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Draw bullets
    ctx.fillStyle = 'red';
    for (let bullet of bullets) {
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    }

    // Draw enemies
    ctx.fillStyle = 'green';
    for (let enemy of enemies) {
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }

    // Draw score
    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

// Main game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

// Start game
createEnemies();
loop();
