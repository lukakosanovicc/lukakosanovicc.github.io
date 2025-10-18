document.addEventListener("DOMContentLoaded", () => {
  const link = document.getElementById("startGameLink");
  if (link) {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      startTreasureHunt();
    });
  }
});

function startTreasureHunt() {
    console.clear();
    alert("Game started! Press F12 and go to the console tab to play.\nIf the UI is too small, hold the control key and scroll to zoom in.");

    // MAP SETUP

    let map1 = `
    
          1  2  3  4  5  6  7  8  9 10 11 12 13
        +--+--+--+--+--+--+--+--+--+--+--+--+--+       LEGEND:
    A   |♣ |♣ |· |· |· |· |· |▲ |▲ |▲ |▲ |· |· |      ♣ -> tree
    B   |· |· |· |· |· |· |· |· |· |▲ |▲ |▲ |· |      ▲ -> mountain
    C   |· |∆ |∆ |· |· |· |· |· |· |· |· |· |· |      ∆ -> volcano
    D   |· |∆ |· |· |○ |○ |· |· |~ |~ |~ |· |· |      ○ -> pond
    E   |· |· |· |· |○ |○ |· |· |~ |· |~ |~ |~ |      ~ -> river
    F   |· |· |· |· |○ |· |· |~ |~ |· |· |· |· |      ■ -> rock
    G   |■ |· |· |· |· |· |· |~ |· |· |· |· |· |
    H   |■ |■ |■ |· |· |· |· |~ |· |· |· |· |· |
        +--+--+--+--+--+--+--+--+--+--+--+--+--+
    
    `;

    let map1_matrix = [
      ["T", "T", "", "", "", "", "", "A", "A", "A", "A", "", ""],
      ["", "", "", "", "", "", "", "", "", "A", "A", "A", ""],
      ["", "V", "V", "", "", "", "", "", "", "", "", "", ""],
      ["", "V", "", "", "O", "O", "", "", "~", "~", "~", "", ""],
      ["", "", "", "", "O", "O", "", "", "~", "", "~", "~", "~"],
      ["", "", "", "", "O", "", "", "~", "~", "", "", "", ""],
      ["@", "", "", "", "", "", "", "~", "", "", "", "", ""],
      ["@", "@", "@", "", "", "", "", "~", "", "", "", "", ""]
    ];

    let letter_to_index = {
      'A': 0, 'B': 1, 'C': 2, 'D': 3,
      'E': 4, 'F': 5, 'G': 6, 'H': 7
    };

    function getRandomInt(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    }

    let x = getRandomInt(0, 13);
    let y = getRandomInt(0, 8);

    console.log("🎮 Welcome to TreasureHunt!");
    console.log("You have to guess where I hid the treasure in 10 or less tries. Good luck!");

    let number_of_guesses = 0;

    while (true) {
      console.log(map1);

      if (number_of_guesses >= 10) {
        console.log("\n🛑 Too many guesses. Refresh to try again.");
        break;
      }

      console.log("Enter your guess (e.g., A5), enter 0 to clear the console or click cancel to quit");
      let guess = prompt();
      if (!guess) break;

      guess = guess.trim().toUpperCase();

      if (guess === "0") {
        console.clear();
        continue;
      }

      let rowChar = guess[0];
      let colStr = guess.slice(1);
      if (!(rowChar in letter_to_index) || isNaN(colStr)) {
        console.log("❗ Invalid input. Format must be like A5.");
        continue;
      }

      let row = letter_to_index[rowChar];
      let col = parseInt(colStr) - 1;

      if (col < 0 || col > 12) {
        console.log("❗ Column number must be between 1 and 13.");
        continue;
      }

      number_of_guesses += 1;
      let distance = Math.abs(y - row) + Math.abs(x - col);

      if (distance === 0) {
        console.log("🎉 You found the treasure! Well done!");
        break;
      } else {
        console.log(`⏱ Your guess ${guess} is ${distance} cells away with ${10 - number_of_guesses} guesses left.`);
        console.log("\nClues:");
        console.log("1. Is it outside of the space enclosed by the river?");
        console.log("2. Is it in the pond?");
        console.log("3. Is it in the mountains?");
        console.log("4. Is it in the volcano?");
        console.log("5. Is it in the trees?");
        console.log("6. Is it in the rocks?");
        console.log("0. No clue please.\n");

        console.log("Which clue do you want? (0–6)");
        let clue = prompt();
        clue = parseInt(clue);

        if (isNaN(clue) || clue < 0 || clue > 6) {
          console.log("❗ Invalid clue number.");
          continue;
        }

        let cell = map1_matrix[y][x];
        let response = "";

        if (clue === 0) continue;

        if (clue === 1) {
          let enclosed = new Set([
            "3,3","3,4","3,5","3,6","3,7","3,8","3,9","3,10",
            "4,3","4,4","4,5","4,6","4,7","4,8","4,10",
            "5,3","5,4","5,6","5,7","5,9"
          ]);
          response = enclosed.has(`${y},${x}`)
            ? "🔍 The treasure is INSIDE the space enclosed by the river."
            : "🔍 The treasure is OUTSIDE the space enclosed by the river.";
        }
        if (clue === 2) {
          response = cell === "O" ? "💧 Yes, it's in the pond." : "💧 No, not in the pond.";
        }
        if (clue === 3) {
          response = cell === "A" ? "⛰️ Yes, it's in the mountains." : "⛰️ No, not in the mountains.";
        }
        if (clue === 4) {
          response = cell === "V" ? "🌋 Yes, it's in the volcano." : "🌋 No, not in the volcano.";
        }
        if (clue === 5) {
          response = cell === "T" ? "🌳 Yes, it's in the trees." : "🌳 No, not in the trees.";
        }
        if (clue === 6) {
          response = cell === "@" ? "🗿 Yes, it's in the rocks." : "🗿 No, not in the rocks.";
        }

        console.log(response);
      }
    }
}
