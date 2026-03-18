// 🎮 Juego: Conecta 4
// Explicación: Haz clic en una columna para soltar una ficha. Gana el primero que conecte 4 en línea.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// � Configuración del tablero
const COLS = 7;
const ROWS = 6;
const CELL_SIZE = 80;
const PADDING = 10; // espacio alrededor del tablero

// 🔧 Ajustes del lienzo (se basan en el tablero para no dejar mucho espacio vacío)
canvas.width = COLS * CELL_SIZE + PADDING * 2;
canvas.height = ROWS * CELL_SIZE + PADDING * 2 + 40; // 40px extra para el texto de turno

// ✅ Representación del tablero: 0 = vacío, 1 = jugador 1, 2 = jugador 2
let board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
let currentPlayer = 1; // 1 = rojo, 2 = amarillo

// 🎨 Colores de las fichas
const colors = {
  0: "#111", // vacío
  1: "#e74c3c", // rojo
  2: "#f1c40f", // amarillo
};

// 📌 Manejo de clics: elegir columna para soltar ficha
canvas.addEventListener("click", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;

  const col = Math.floor((x - PADDING) / CELL_SIZE);
  if (col < 0 || col >= COLS) return;

  dropDisc(col);
});

// 🎲 Lógica de juego: soltar ficha en columna
function dropDisc(col) {
  // Busca la primera fila vacía desde abajo
  for (let row = ROWS - 1; row >= 0; row--) {
    if (board[row][col] === 0) {
      board[row][col] = currentPlayer;
      if (checkWin(row, col, currentPlayer)) {
        setTimeout(() => {
          alert(`¡Gana el jugador ${currentPlayer === 1 ? "Rojo" : "Amarillo"}!`);
          resetGame();
        }, 10);
      } else if (isBoardFull()) {
        setTimeout(() => {
          alert("Empate: el tablero se llenó.");
          resetGame();
        }, 10);
      } else {
        currentPlayer = currentPlayer === 1 ? 2 : 1;
      }
      return;
    }
  }
}

// ✅ Comprueba si el tablero está lleno
function isBoardFull() {
  return board.every((row) => row.every((cell) => cell !== 0));
}

// 🧠 Comprueba si hay 4 en línea a partir del último movimiento
function checkWin(row, col, player) {
  const directions = [
    { dr: 0, dc: 1 }, // horizontal
    { dr: 1, dc: 0 }, // vertical
    { dr: 1, dc: 1 }, // diagonal ↘
    { dr: 1, dc: -1 }, // diagonal ↙
  ];

  for (const { dr, dc } of directions) {
    let count = 1;

    // Revisa en la dirección positiva
    count += countDirection(row, col, dr, dc, player);
    // Revisa en la dirección negativa
    count += countDirection(row, col, -dr, -dc, player);

    if (count >= 4) return true;
  }

  return false;
}

// Cuenta fichas consecutivas en una dirección
function countDirection(row, col, dr, dc, player) {
  let r = row + dr;
  let c = col + dc;
  let count = 0;

  while (r >= 0 && r < ROWS && c >= 0 && c < COLS && board[r][c] === player) {
    count++;
    r += dr;
    c += dc;
  }

  return count;
}

// 🔁 Reinicia el juego
function resetGame() {
  board = Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  currentPlayer = 1;
  draw();
}

// 🎨 Dibuja el tablero y el estado actual
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Fondo del tablero
  ctx.fillStyle = "#1b2631";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Dibujar celdas
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = PADDING + col * CELL_SIZE;
      const y = PADDING + row * CELL_SIZE;

      // Casilla
      ctx.fillStyle = "#2c3e50";
      ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

      // Ficha
      ctx.beginPath();
      ctx.arc(
        x + CELL_SIZE / 2,
        y + CELL_SIZE / 2,
        CELL_SIZE * 0.35,
        0,
        Math.PI * 2
      );
      ctx.fillStyle = colors[board[row][col]];
      ctx.fill();
    }
  }

  // Texto de turno
  ctx.fillStyle = "white";
  ctx.font = "22px Arial";
  ctx.fillText(
    `Turno: ${currentPlayer === 1 ? "Rojo" : "Amarillo"}`,
    PADDING,
    canvas.height - 10
  );
}

// 🔁 Bucle de renderizado
function gameLoop() {
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();
