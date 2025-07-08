import {
  spawnErrorTag,
  shuffleArray,
  delay,
  flashMunicipality,
  startGame,
  expand,
  nextMunicipality,
  mouseoverSVG,
  createMouseoutHandler,
} from "./utils.js";

// const BosniaAndHerzegovina = document.querySelector("#BosniaAndHerzegovina");
// const map = document.querySelector("svg");
const municipalities = document.querySelectorAll(".municipality");
const startGameButton = document.querySelector("#game-start");
const municipalityName = document.querySelector("#municipality-name");

let counter = 0;
let tries = 0;
let currentTries = 0;
let points = 0;
let gameInProgress = true;

let numberOfMunicipalities = municipalities.length;
// let numberOfMunicipalities = 10;

const municipalityNames = [];
for (let m of municipalities) {
  municipalityNames.push(m.id);
}
let randomArray = shuffleArray(municipalityNames); // niz random imena koje treba pogoditi

const controlButtons = document.querySelector("#buttons-div");

document.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});

startGameButton.addEventListener("click", function () {
  startGame(municipalityName, startGameButton, randomArray[0]);
});

startGameButton.addEventListener("click", function () {
  this.style.display = "none";
  expand(controlButtons);
});

document.body.onload = () => {
  document.querySelector("#buttons-div").style.display = "block";
};

// BosniaAndHerzegovina.addEventListener("click", (event) => {
//   event.stopPropagation();
//   console.log("BOSNA KLIK");
// });

// console.log(randomArray);

// map.addEventListener("click",()=>{
//     console.log("mapa click");
// })

const MAX_TRIES = 3;
const MISSED_COLOR = "magenta";

// Store original color for each municipality at the start
for (let m of municipalities) {
  const originalFill = m.style.fill || m.getAttribute("fill") || "#bbbbbb";
  m.setAttribute("data-original-fill", originalFill);
}

function disableAllMunicipalities() {
  for (let mun of municipalities) {
    mun.style.pointerEvents = "none";
    mun.style.userSelect = "none";
  }
}

function enableNonGuessedMunicipalities() {
  for (let mun of municipalities) {
    if (mun.style.fillOpacity != 1) {
      mun.style.pointerEvents = "auto";
      mun.style.userSelect = "auto";
    }
  }
}

function handleMissedMunicipality() {
  const missedMunicipality = document.querySelector(`[id="${municipalityName.innerText}"]`);
  missedMunicipality.style.fillOpacity = 1;
  missedMunicipality.style.stroke = "#000000";
  missedMunicipality.style.fill = MISSED_COLOR;
  for (let mun of municipalities) {
    if (mun === missedMunicipality) {
      mun.style.pointerEvents = "auto";
      mun.style.userSelect = "auto";
    } else {
      mun.style.pointerEvents = "none";
      mun.style.userSelect = "none";
    }
  }
  flashMunicipality(missedMunicipality);
}

function handleCorrectGuess(municipality, mouseoutSVG, oldNumberTries) {
  currentTries = 0;
  // If municipality was missed (magenta), restore its original color
  if (municipality.style.fill === MISSED_COLOR) {
    municipality.style.fill = municipality.getAttribute("data-original-fill");
  }
  municipality.style.fillOpacity = 1;
  municipality.removeEventListener("mouseout", mouseoutSVG);
  municipality.style.pointerEvents = "none";
  municipality.style.userSelect = "none";
  // municipality.style.fill = municipality.style.fill; // keep original color

  // decide the color of the guessed municipalities log
  let color = "is-dark is-primary";
  if (oldNumberTries === 1) {
    color = "is-dark is-primary";
  } else if (oldNumberTries === 2) {
    color = "is-dark is-warning";
  } else if (oldNumberTries === 3) {
    color = "is-dark is-danger";
  } else {
    color = "is-danger is-inverted";
  }
  document
    .querySelector("#successful-guesses")
    .insertAdjacentHTML("afterbegin", `<button class="button ${color} successful-guess">${municipality.id}</button>`);

  nextMunicipality(municipalityName, randomArray[++points], counter);
  enableNonGuessedMunicipalities();
}

function endGame() {
  municipalityName.innerText = `Rezultat: ${points} / ${numberOfMunicipalities} (${(
    (points / numberOfMunicipalities) *
    100
  ).toFixed(1)}%)`;
  counter = 0;
  tries = 0;
  currentTries = 0;
  points = 0;
  disableAllMunicipalities();
  document.querySelector("#game-end-restart").innerText = "Igraj ponovo";
  gameInProgress = false;
}

function resetGame() {
  // Reset state variables
  counter = 0;
  tries = 0;
  currentTries = 0;
  points = 0;
  gameInProgress = true;

  // Shuffle the order
  randomArray = shuffleArray([...municipalityNames]);
  numberOfMunicipalities = randomArray.length;

  // Convert NodeList to array to avoid issues with live collections
  const municipalityArray = Array.from(document.querySelectorAll(".municipality"));
  for (let mun of municipalityArray) {
    mun.style.pointerEvents = "auto";
    mun.style.userSelect = "auto";
    mun.style.fillOpacity = 0.7;
    mun.style.stroke = "#bbbbbb";
    mun.style.fill = mun.getAttribute("data-original-fill");
    mun._flashCancel = true;
    // Remove all old event listeners by replacing with a clone, if parentNode exists
    if (mun.parentNode) {
      const newMun = mun.cloneNode(true);
      mun.parentNode.replaceChild(newMun, mun);
    }
  }

  // Re-select all municipalities after cloning
  const freshMunicipalities = document.querySelectorAll(".municipality");

  // Re-attach event listeners
  for (let m of freshMunicipalities) {
    const mouseoutSVG = createMouseoutHandler(m);
    m.addEventListener("mouseover", () => mouseoverSVG(m));
    m.addEventListener("mouseout", mouseoutSVG);
    m.addEventListener("click", (event) => {
      if (!gameInProgress) return; // Prevent clicks when game is not in progress
      currentTries++;
      // incorrect guess (general)
      if (municipalityName.innerText !== m.id) {
        spawnErrorTag(m, event);
      }
      // incorrect guess (after MAX_TRIES guesses)
      if (currentTries === MAX_TRIES && municipalityName.innerText !== m.id) {
        currentTries = -1;
        handleMissedMunicipality();
      }
      // correct guess
      if (municipalityName.innerText === m.id) {
        m._flashCancel = true; // stop flashing if running
        let oldNumberTries = currentTries;
        handleCorrectGuess(m, mouseoutSVG, oldNumberTries);
      }
      // game ending clause
      if (tries === numberOfMunicipalities - 1) {
        endGame();
      }
      tries++;
    });
  }

  // Clear guessed buttons
  document.querySelector("#successful-guesses").innerHTML = "";

  // Show the first municipality to guess, if any
  if (randomArray.length > 0) {
    document.querySelector("#municipality-name").innerText = `${randomArray[0]}`;
  } else {
    document.querySelector("#municipality-name").innerText = "";
  }

  // Set restart button text
  document.querySelector("#game-end-restart").innerText = "Završi igru";
}

for (let m of municipalities) {
  const municipalityColor = m.style.fill;
  //   tries++;
  const mouseoutSVG = createMouseoutHandler(m);

  m.addEventListener("mouseover", () => mouseoverSVG(m));
  m.addEventListener("mouseout", mouseoutSVG);

  m.addEventListener("click", (event) => {
    if (!gameInProgress) return; // Prevent clicks when game is not in progress
    currentTries++;

    // incorrect guess (general)
    if (municipalityName.innerText !== m.id) {
      spawnErrorTag(m, event);
    }

    // incorrect guess (after MAX_TRIES guesses)
    if (currentTries === MAX_TRIES && municipalityName.innerText !== m.id) {
      currentTries = -1;
      handleMissedMunicipality();
    }

    // correct guess
    if (municipalityName.innerText === m.id) {
      m._flashCancel = true; // stop flashing if running
      let oldNumberTries = currentTries;
      handleCorrectGuess(m, mouseoutSVG, oldNumberTries);
    }

    // game ending clause
    if (tries === numberOfMunicipalities - 1) {
      endGame();
    }

    tries++;
    // console.log(tries);
  });
}

// privremeno
document.querySelector("#game-end-restart").addEventListener("click", function () {
  if (gameInProgress) {
    endGame();
  } else {
    resetGame();
  }
});
