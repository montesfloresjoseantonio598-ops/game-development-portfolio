const player = document.getElementById("player");
const game = document.getElementById("game");

const scoreText = document.getElementById("score");
const timeText = document.getElementById("time");

const restartButton = document.getElementById("restart");

const message = document.getElementById("message");
const messageTitle = document.getElementById("message-title");
const messageText = document.getElementById("message-text");
const messageButton = document.getElementById("message-button");

const coins = document.querySelectorAll(".coin");

let playerX = 50;
let playerY = 50;

let score = 0;
let time = 30;

let gameOver = false;

const speed = 5;

const keys = {};


/* =========================
   CONTROLES
========================= */

document.addEventListener("keydown", function(event) {

    const key = event.key.toLowerCase();

    keys[key] = true;

    if (
        key === "w" ||
        key === "a" ||
        key === "s" ||
        key === "d" ||
        key.startsWith("arrow")
    ) {
        event.preventDefault();
    }

});


document.addEventListener("keyup", function(event) {

    keys[event.key.toLowerCase()] = false;

});


/* =========================
   MOVIMIENTO
========================= */

function movePlayer() {

    if (gameOver) {
        return;
    }

    if (keys["w"] || keys["arrowup"]) {
        playerY -= speed;
    }

    if (keys["s"] || keys["arrowdown"]) {
        playerY += speed;
    }

    if (keys["a"] || keys["arrowleft"]) {
        playerX -= speed;
    }

    if (keys["d"] || keys["arrowright"]) {
        playerX += speed;
    }


    const maxX =
        game.clientWidth - player.offsetWidth;

    const maxY =
        game.clientHeight - player.offsetHeight;


    playerX = Math.max(
        0,
        Math.min(playerX, maxX)
    );

    playerY = Math.max(
        0,
        Math.min(playerY, maxY)
    );


    player.style.left = playerX + "px";
    player.style.top = playerY + "px";


    checkCoins();

    requestAnimationFrame(movePlayer);
}


/* =========================
   COLISIONES
========================= */

function checkCoins() {

    coins.forEach(function(coin) {

        if (coin.style.display === "none") {
            return;
        }

        const playerRect =
            player.getBoundingClientRect();

        const coinRect =
            coin.getBoundingClientRect();


        const collision =
            playerRect.left < coinRect.right &&
            playerRect.right > coinRect.left &&
            playerRect.top < coinRect.bottom &&
            playerRect.bottom > coinRect.top;


        if (collision) {

            collectCoin(coin);

        }

    });

}


/* =========================
   RECOGER MONEDA
========================= */

function collectCoin(coin) {

    coin.style.display = "none";

    score++;

    scoreText.textContent = score;

    player.style.transform = "scale(1.2)";

    setTimeout(function() {

        player.style.transform = "scale(1)";

    }, 120);


    if (score === coins.length) {

        winGame();

    }

}


/* =========================
   TEMPORIZADOR
========================= */

function startTimer() {

    const timer = setInterval(function() {

        if (gameOver) {

            clearInterval(timer);

            return;

        }


        time--;

        timeText.textContent = time;


        if (time <= 0) {

            clearInterval(timer);

            loseGame();

        }

    }, 1000);

}


/* =========================
   VICTORIA
========================= */

function winGame() {

    gameOver = true;

    message.classList.remove("hidden");

    messageTitle.textContent =
        "🎉 ¡VICTORIA!";

    messageText.textContent =
        "Recogiste todas las monedas. Puntuación: " +
        score;

}


/* =========================
   DERROTA
========================= */

function loseGame() {

    gameOver = true;

    message.classList.remove("hidden");

    messageTitle.textContent =
        "💀 GAME OVER";

    messageText.textContent =
        "Se acabó el tiempo. Monedas: " +
        score;

}


/* =========================
   REINICIAR
========================= */

function restartGame() {

    location.reload();

}


restartButton.addEventListener(
    "click",
    restartGame
);

messageButton.addEventListener(
    "click",
    restartGame
);


/* =========================
   INICIAR JUEGO
========================= */

movePlayer();

startTimer();