export async function spawnErrorTag(m, event) {
  const errorTag = document.createElement("span");
  errorTag.innerHTML = `<span id="errTag" class="tag is-danger">${m.id}</span>`;
  document.body.append(errorTag);
  errorTag.classList.add("errorTag");

  errorTag.style.left = `${event.clientX - parseFloat(window.getComputedStyle(errorTag).width) / 2}px`;
  errorTag.style.top = `${event.clientY - 27}px`;

  await delay(1000);

  errorTag.style.display = "none";
}

// async function handleErrorTag(m, id) {
//   const element = await spawnErrorTag(m, event);
// }

export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function flashMunicipality(element) {
 for (let i = 0; i < 3; i++) {
    element.style.fillOpacity = 1;
    await delay(350);
    element.style.fillOpacity = 0.5;
    await delay(350);
  }
  element.style.fillOpacity = 1;
  await delay(500);
}

export function startGame(municipalityName, startGameButton, name) {
  municipalityName.innerText = name;
  startGameButton.removeEventListener("click", startGame);
}

export function nextMunicipality(municipalityName, name, counter) {
  municipalityName.innerText = name;
  counter++;
}

export function expand(controlButtons) {
  controlButtons.style.transition = "1s";
  controlButtons.style.width = "400px";
  controlButtons.style.height = "200px";
}