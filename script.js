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
let numberOfMunicipalities = municipalities.length;

const municipalityNames = [];
for (let m of municipalities) {
  municipalityNames.push(m.id);
}
const randomArray = shuffleArray(municipalityNames); // niz random imena koje treba pogoditi

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

for (let m of municipalities) {
  const municipalityColor = m.style.fill;
  //   tries++;
  const mouseoutSVG = createMouseoutHandler(m);

  m.addEventListener("mouseover", () => mouseoverSVG(m));
  m.addEventListener("mouseout", mouseoutSVG);

  m.addEventListener("click", (event) => {
    // console.log(m.id);
    // m.style.fillOpacity = 1;
    // m.removeEventListener("mouseout", mouseoutSVG);
    // m.removeEventListener("click");  // ukloniti da se ne moze klikat vise

    currentTries++;

    // incorrect guess (general)
    if (municipalityName.innerText !== m.id) {
      spawnErrorTag(m, event);
    }

    // incorrect guess (after 3 guesses)
    if (currentTries === 3 && municipalityName.innerText !== m.id) {
      currentTries = -1;

      // console.log("Niste pogodili opcinu");
      const missedMunicipality = document.querySelector(`[id="${municipalityName.innerText}"]`);
      missedMunicipality.style.fillOpacity = 1;
      missedMunicipality.style.stroke = "#000000";
      missedMunicipality.style.fill = "magenta";
      for (let mun of municipalities) {
        mun.style.pointerEvents = "none";
        mun.style.userSelect = "none";
        if (mun.style.fill === "magenta") {
          mun.style.pointerEvents = "auto";
          mun.style.userSelect = "auto";
        }
      }
      flashMunicipality(missedMunicipality);

      // for (let mun of municipalities) {
      //     mun.style.pointerEvents = "none";
      //     mun.style.userSelect = "none";
      // }
      // m.style.pointerEvents = "auto";
      // m.style.userSelect = "auto";
    }

    // correct guess
    if (municipalityName.innerText === m.id) {
      let oldNumberTries = currentTries;
      currentTries = 0;
      // console.log("POGODIO");
      // console.log(m.id);
      m.style.fillOpacity = 1;
      m.removeEventListener("mouseout", mouseoutSVG);

      m.style.pointerEvents = "none";
      m.style.userSelect = "none";
      m.style.fill = municipalityColor;

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
        currentTries = 0;
      }
      document
        .querySelector("#successful-guesses")
        .insertAdjacentHTML("afterbegin", `<button class="button ${color} successful-guess">${m.id}</button>`);

      nextMunicipality(municipalityName, randomArray[++points], counter);

      // give back option to be clicked to all non-already-guessed municipalities
      for (let mun of municipalities) {
        if (mun.style.fillOpacity != 1) {
          mun.style.pointerEvents = "auto";
          mun.style.userSelect = "auto";
        }
      }
    }

    // game ending clause
    if (tries === numberOfMunicipalities) {
      //   alert(`GAME OVER\nSCORE: ${((points / numberOfMunicipalities) * 100).toFixed(1)}%`);
      municipalityName.innerText = `Rezultat: ${points} / ${numberOfMunicipalities} (${(
        (points / numberOfMunicipalities) *
        100
      ).toFixed(1)}%)`;

      counter = 0;
      tries = 0;
      currentTries = 0;
      points = 0;

      // da sve disabluje, refaktorovati u posebnu funkciju jer se koristi na dva mjesta
      for (let mun of municipalities) {
        mun.style.pointerEvents = "none";
        mun.style.userSelect = "none";
      }
    }

    tries++;
    // console.log(tries);
  });
}

// privremeno
document.querySelector("#game-restart").addEventListener("click", function () {
  document
    .querySelector("#successful-guesses")
    .insertAdjacentHTML(
      "afterbegin",
      `<button class="button is-primary is-dark successful-guess">aaaaaaaaaaaaaa</button>`
    );
});
