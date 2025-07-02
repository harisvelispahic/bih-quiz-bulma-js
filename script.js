import { spawnErrorTag, shuffleArray, delay, flashMunicipality, startGame, expand, nextMunicipality } from "./utils.js";


// const BosniaAndHerzegovina = document.querySelector("#BosniaAndHerzegovina");
// const map = document.querySelector("svg");
const municipalities = document.querySelectorAll(".municipality");
const startGameButton = document.querySelector("#game-start");
const municipalityName = document.querySelector("#municipality-name");

let counter = 1;
let tries = 0;
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

startGameButton.addEventListener("click", function() {
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

let currentTries = 0;
for (let m of municipalities) {
  const municipalityColor = m.style.fill;
  //   tries++;
  const mouseoutSVG = () => {
    // m.style.opacity = 0.7;
    m.style.fillOpacity = 0.7;
    m.style.stroke = "#bbbbbb";
  };

  m.addEventListener("mouseover", () => {
    m.style.transition = "100ms";
    m.style.fillOpacity = 1;
    m.style.stroke = "#000000";
    // m.style.strokeWidth = 3;

    // console.log(m.id);
  });
  m.addEventListener("mouseout", mouseoutSVG);
  m.addEventListener("click", (event) => {
    // console.log(m.id);
    // m.style.fillOpacity = 1;
    // m.removeEventListener("mouseout", mouseoutSVG);
    // m.removeEventListener("click");  // ukloniti da se ne moze klikat vise

    currentTries++;

    if (municipalityName.innerText !== m.id) {
      spawnErrorTag(m, event);
    }

    if (currentTries === 3 && municipalityName.innerText !== m.id) {
      currentTries = 0;

      console.log("Niste pogodili opcinu");
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
    if (municipalityName.innerText === m.id) {
      let oldNumberTries = currentTries;
      currentTries = 0;
      console.log("POGODIO");
      console.log(m.id);
      m.style.fillOpacity = 1;
      m.removeEventListener("mouseout", mouseoutSVG);

      m.style.pointerEvents = "none";
      m.style.userSelect = "none";
      m.style.fill = municipalityColor;

      // const successMessage = document.createElement();
      // successMessage.innerHTML = `<button class="button is-primary is-dark successful-guess">${m.id}</button>`;
      let color = "is-primary";
      if (oldNumberTries === 1) {
        color = "is-primary";
      } else if (oldNumberTries === 2) {
        color = "is-warning";
      } else if (oldNumberTries === 3) {
        color = "is-danger";
      } else {
        color = "is-danger is-inverted";
      }
      document
        .querySelector("#successful-guesses")
        .insertAdjacentHTML(
          "afterbegin",
          `<button class="button ${color} is-dark successful-guess ${color}">${m.id}</button>`
        );

      nextMunicipality(municipalityName, randomArray[++points], counter);

      for (let mun of municipalities) {
        if (mun.style.fillOpacity != 1) {
          //   console.log("Info");
          mun.style.pointerEvents = "auto";
          mun.style.userSelect = "auto";
        }
      }
    }

    if (tries === numberOfMunicipalities - 1) {
      //   alert(`GAME OVER\nSCORE: ${((points / numberOfMunicipalities) * 100).toFixed(1)}%`);
      municipalityName.innerText = `Rezultat: ${points} / ${numberOfMunicipalities}`;
    }
    tries++;
    console.log(tries);
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

