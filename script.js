console.clear();

const MAX_GUESSES = 10;
const MAX_CLUES = 10;

const map1 = `
    1  2  3  4  5  6  7  8  9 10 11 12 13
  +--+--+--+--+--+--+--+--+--+--+--+--+--+
A   |♣ |♣ |· |· |· |· |· |▲ |▲ |▲ |▲ |· |· |
B   |· |· |· |· |· |· |· |· |· |▲ |▲ |▲ |· |
C   |· |∆ |∆ |· |· |· |· |· |· |· |· |· |· |
D   |· |∆ |· |· |○ |○ |· |· |~ |~ |~ |· |· |
E   |· |· |· |· |○ |○ |· |· |~ |· |~ |~ |~ |
F   |· |· |· |· |○ |· |· |~ |~ |· |· |· |· |
G   |■ |· |· |· |· |· |· |~ |· |· |· |· |· |
H   |■ |■ |■ |· |· |· |· |~ |· |· |· |· |· |
  +--+--+--+--+--+--+--+--+--+--+--+--+--+
`;

const map1Matrix = [
  ["T","T","","","","","", "A","A","A","A","",""],
  ["","","","","","","","","","A","A","A",""],
  ["","V","V","","","","","","","","","",""],
  ["","V","","","O","O","","","~","~","~","",""],
  ["","","","","O","O","","","~","","~","~","~"],
  ["","","","","O","","","~","~","","","",""],
  ["@","","","","","","","~","","","","",""],
  ["@","@","@","","","","","~","","","","",""]
];

const rowIndex = { A:0, B:1, C:2, D:3, E:4, F:5, G:6, H:7 };

const treasure = {
  x: Math.floor(Math.random() * 13),
  y: Math.floor(Math.random() * 8)
};

let guesses = 0;
let cluesUsed = 0;
let gameOver = false;

console.log("🎮 Welcome to Treasure Hunt!");
console.log(map1);
console.log(`Use guess("A5") to play. You have ${MAX_GUESSES} guesses. Good luck!`);

window.guess = function(input) {
  if (gameOver) return console.log("❌ Game over. Refresh to play again.");

  if (guesses >= MAX_GUESSES) {
    gameOver = true;
    return console.log("🛑 No guesses left.");
  }

  if (!input || input.length < 2) {
    return console.log("❗ Invalid format. Use guess(\"A5\")");
  }

  const rowChar = input[0].toUpperCase();
  const col = parseInt(input.slice(1), 10) - 1;

  if (!(rowChar in rowIndex) || isNaN(col) || col < 0 || col > 12) {
    return console.log("❗ Invalid coordinate.");
  }

  const row = rowIndex[rowChar];
  guesses++;

  const distance =
    Math.abs(treasure.y - row) + Math.abs(treasure.x - col);

  if (distance === 0) {
    gameOver = true;
    console.log("🎉 YOU FOUND THE TREASURE!");
  } else {
    console.log(
      `📍 ${input} is ${distance} cells away. (${MAX_GUESSES - guesses} guesses left)`
    );
  }
};

window.clue = function(n) {
  if (gameOver) return console.log("❌ Game over.");

  if (cluesUsed >= MAX_CLUES) {
    return console.log("🛑 No clues left.");
  }

  if (n === undefined) {
    return console.log(`
Clues:
1. Inside river enclosure?
2. In a pond?
3. In the mountains?
4. In a volcano?
5. In the trees?
6. In the rocks?
Usage: clue(1)
    `);
  }

  cluesUsed++;

  const cell = map1Matrix[treasure.y][treasure.x];

  const responses = {
    1: (() => {
      const enclosed = new Set([
        "3,3","3,4","3,5","3,6","3,7","3,8","3,9","3,10",
        "4,3","4,4","4,5","4,6","4,7","4,8","4,10",
        "5,3","5,4","5,6","5,7","5,9"
      ]);
      return enclosed.has(`${treasure.y},${treasure.x}`)
        ? "🔍 The treasure IS inside the river enclosure."
        : "🔍 The treasure is NOT inside the river enclosure.";
    })(),
    2: cell === "O" ? "💧 The treasure IS in the pond." : "💧 The treasure is NOT in the pond.",
    3: cell === "A" ? "⛰️ The treasure IS in the mountains." : "⛰️ The treasure is NOT in the mountains.",
    4: cell === "V" ? "🌋 The treasure IS in the volcano." : "🌋 The treasure is NOT in the volcano.",
    5: cell === "T" ? "🌳 The treasure IS in the trees." : "🌳 The treasure is NOT in the trees.",
    6: cell === "@" ? "🗿 The treasure IS in the rocks." : "🗿 The treasure is NOT in the rocks."
  };

  console.log(responses[n] || "❗ Invalid clue number.");
};
