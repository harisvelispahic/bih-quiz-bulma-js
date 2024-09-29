function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

const municipalities = document.querySelectorAll(".municipality");
const map = document.querySelector("svg");

let counter=0;
for(let m of municipalities){

    const mouseoutSVG = () => {
        // m.style.opacity = 0.7;
        m.style.fillOpacity = 0.7;
        m.style.stroke = "#bbbbbb";
    }

    counter++;
    m.addEventListener("mouseover", () => {
        m.style.transition = "100ms";
        m.style.fillOpacity = 1;
        m.style.stroke = "#000000";
        // m.style.strokeWidth = 3;
        
        // console.log(m.id);
    })
    m.addEventListener("mouseout", mouseoutSVG)
    m.addEventListener("click", ()=>{
        console.log(m.id);
        m.style.fillOpacity = 1;
        m.removeEventListener("mouseout", mouseoutSVG);
        // m.removeEventListener("click");  // ukloniti da se ne moze klikat vise
        
        currentTries++;
        if(currentTries===3){
            currentTries=0;
            console.log("Niste pogodili opcinu");
        }
    })
    // m.addEventListener("click", ()=>{
    //     console.log(m.id);
    //     m.style.fill="#000000";
    // })
}

// let counter = 200;
// for(let m of municipalities){
//     setTimeout(()=>{
//         m.style.fill="black";
//         console.log(m.id);
//     },counter+200);
//     counter+=200;
// }

// console.log(counter);


const municipalityNames = [];
for(let m of municipalities){
    municipalityNames.push(m.id);
}

const randomArray = shuffleArray(municipalityNames);        // niz random imena koje treba pogoditi

const startGameButton = document.querySelector("#game-start");
const municipalityName = document.querySelector("#municipality-name");


startGameButton.addEventListener("click", ()=>{
    municipalityName.innerText = randomArray[0];
})


console.log(randomArray);

// map.addEventListener("click",()=>{
//     console.log("mapa click");
// })

let points = 0;
let currentTries = 0;
let mIndex = 0;

const pinTheMunicipalities = () => {

}