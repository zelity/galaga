const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 30;
const BULLET_WIDTH = 4;
const BULLET_HEIGHT = 10;
const ENEMY_WIDTH = 30;
const ENEMY_HEIGHT = 30;

// Load assets
const assets = {
    player: new Image(),
    enemy: new Image(),
    bullet: new Image(),
    explosion: new Image(),
    background: new Image(),
    shootSound: new Audio('assets/shoot.mp3'),
    explosionSound: new Audio('assets/explosion.mp3'),
    backgroundMusic: new Audio('assets/background.mp3')
};

assets.player.src = 'assets/player.png';
assets.enemy.src = 'assets/enemy.png';
assets.bullet.src = 'assets/bullet.png';
assets.explosion.src = 'assets/explosion.png';
assets.background.src = 'assets/background.png';
assets.backgroundMusic.loop = true;

let gameState = 'playing'; // 'playing', 'gameOver'
let player = { x: canvas.width / 2 - PLAYER_WIDTH / 2, y: canvas.height - PLAYER_HEIGHT - 5 };
let bullets = [];
let enemies = [];
let score = 0;
let levelIndex = 0;

// Load levels
let levels = [];
function loadLevels() {
    for (let i = 1; i <= 2; i++) { // Adjust this based on how many levels you have
        fetch(`levels/level${i}.json`)
            .then(response => response.json())
            .then(data => levels.push(data));
    }
}

// Control keys
let rightPressed = false;
let leftPressed = false;
document.addEventListener('keydown', keyDownHandler);
document.addEventListener('keyup', keyUpHandler);

function keyDownHandler(e) {
    if (e.key === 'ArrowRight') rightPressed = true;
    if (e.key === 'ArrowLeft') leftPressed = true;
    if (e.key === ' ') shootBullet();
}

function keyUpHandler(e) {
    if (e.key === 'ArrowRight') rightPressed = false;
    if (e.key === 'ArrowLeft') leftPressed = false;
}

function shootBullet() {
    if (gameState !== 'playing') return;

    assets.shootSound.currentTime = 0; // Reset sound
    assets.shootSound.play();

    const bullet = {
        x: player.x + PLAYER_WIDTH / 2 - BULLET_WIDTH / 2,
        y: player.y,
        width: BULLET_WIDTH,
        height: BULLET_HEIGHT
    };
    bullets.push(bullet);
}

function createEnemies(level) {
    enemies = level.enemies.map(enemy => ({
        x: enemy.x,
        y: enemy.y,
        width: ENEMY_WIDTH,
        height: ENEMY_HEIGHT
    }));
}

function update() {
    if (gameState !== 'playing') return;

    if (rightPressed && player.x < canvas.width - PLAYER_WIDTH) player.x += 5;
    if (leftPressed && player.x > 0) player.x -= 5;

    bullets.forEach(bullet => bullet.y -= 5);
    bullets = bullets.filter(bullet => bullet.y > 0);

    for (let i = enemies.length - 1; i >= 0; i--) {
        for (let j = bullets.length - 1; j >= 0; j--) {
            if (collides(bullets[j], enemies[i])) {
                enemies.splice(i, 1);
                bullets.splice(j, 1);
                score++;
                assets.explosionSound.currentTime = 0; // Reset sound
                assets.explosionSound.play();
                break;
            }
        }
    }

    if (enemies.length === 0) {
        if (levelIndex < levels.length - 1) {
            levelIndex++;
            startNextLevel();
        } else {
            gameState = 'gameOver';
            showGameOver();
        }
    }
}

function collides(bullet, enemy) {
    return (
        bullet.x < enemy.x + enemy.width &&
        bullet.x + bullet.width > enemy.x &&
        bullet.y < enemy.y + enemy.height &&
        bullet.y + bullet.height > enemy.y
    );
}

function draw() {
    ctx.drawImage(assets.background, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(assets.player, player.x, player.y, PLAYER_WIDTH, PLAYER_HEIGHT);

    bullets.forEach(bullet => {
        ctx.drawImage(assets.bullet, bullet.x, bullet.y, BULLET_WIDTH, BULLET_HEIGHT);
    });

    enemies.forEach(enemy => {
        ctx.drawImage(assets.enemy, enemy.x, enemy.y, ENEMY_WIDTH, ENEMY_HEIGHT);
    });

    ctx.fillStyle = 'white';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${score}`, 8, 20);
}

function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

function showGameOver() {
    document.getElementById('gameOver').classList.remove('hidden');
    assets.backgroundMusic.pause();
}

function restartGame() {
    gameState = 'playing';
    score = 0;
    player.x = canvas.width / 2 - PLAYER_WIDTH / 2;
    bullets = [];
    levelIndex = 0;
    createEnemies(levels[levelIndex]);
    assets.backgroundMusic.play();
    document.getElementById('gameOver').classList.add('hidden');
    loop();
}

function startNextLevel() {
    createEnemies(levels[levelIndex]);
}

// Start game
assets.backgroundMusic.play();
loadLevels();
createEnemies(levels[levelIndex]);
loop();
