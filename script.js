function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function flashMunicipality(element) {
  element.style.fillOpacity = 1;
  await delay(500);
  element.style.fillOpacity = 0.5;
  await delay(500);
  element.style.fillOpacity = 1;
  await delay(500);
  element.style.fillOpacity = 0.5;
  await delay(500);
  element.style.fillOpacity = 1;
  await delay(500);
}

document.body.onload = () => {
  document.querySelector("#buttons-div").style.display = "block";
};

const BosniaAndHerzegovina = document.querySelector("#BosniaAndHerzegovina");
const municipalities = document.querySelectorAll(".municipality");
const map = document.querySelector("svg");

const startGameButton = document.querySelector("#game-start");
const municipalityName = document.querySelector("#municipality-name");

let counter = 1;
let tries = 0;
let points = 0;
let numberOfMunicipalities = municipalities.length;
// let numberOfMunicipalities = 9;

// BosniaAndHerzegovina.addEventListener("click", (event) => {
//   event.stopPropagation();
//   console.log("BOSNA KLIK");
// });

const municipalityNames = [];
for (let m of municipalities) {
  municipalityNames.push(m.id);
}

const randomArray = shuffleArray(municipalityNames); // niz random imena koje treba pogoditi

function startGame() {
  municipalityName.innerText = randomArray[0];
  startGameButton.removeEventListener("click", startGame);
}

function nextMunicipality() {
  municipalityName.innerText = randomArray[++points];
  counter++;
}

startGameButton.addEventListener("click", startGame);

console.log(randomArray);

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
  m.addEventListener("click", () => {
    // console.log(m.id);
    // m.style.fillOpacity = 1;
    // m.removeEventListener("mouseout", mouseoutSVG);
    // m.removeEventListener("click");  // ukloniti da se ne moze klikat vise

    currentTries++;
    if (currentTries === 3) {
      currentTries = 0;
      console.log("Niste pogodili opcinu");
      const missedMunicipality = document.querySelector(`[id="${municipalityName.innerText}"]`);
      missedMunicipality.style.fillOpacity = 1;
      missedMunicipality.style.stroke = "#000000";
      missedMunicipality.style.fill = "magenta";
      flashMunicipality(missedMunicipality);

      // for (let mun of municipalities) {
      //     mun.style.pointerEvents = "none";
      //     mun.style.userSelect = "none";
      // }
      // m.style.pointerEvents = "auto";
      // m.style.userSelect = "auto";
    }
    if (municipalityName.innerText === m.id) {
      currentTries = 0;
      console.log("POGODIO");
      console.log(m.id);
      m.style.fillOpacity = 1;
      m.removeEventListener("mouseout", mouseoutSVG);

      m.style.pointerEvents = "none";
      m.style.userSelect = "none";
      m.style.fill = municipalityColor;
      nextMunicipality();
    }
    if (tries === numberOfMunicipalities - 1) {
      alert(`GAME OVER\nSCORE: ${((points / numberOfMunicipalities) * 100).toFixed(1)}%`);
    }
    tries++;
    console.log(tries);
  });
}
// let points = 0;
// let currentTries = 0;
// let mIndex = 0;

// const pinTheMunicipalities = () => {};
