function getQueryParam(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
  }

  async function loadFileList() {
    try {
      const response = await fetch("../src/fileList.json");
      if (!response.ok) {
        throw new Error("Error al cargar fileList.json");
      }
      const fileList = await response.json();
      return fileList;
    } catch (error) {
      console.error("Error al cargar fileList.json:", error);
      return [];
    }
  }
  async function loadNameAndRating(file){

    const header_container = document.getElementById("header");
    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = file.name;
    const grid_item = document.createElement("div");
    grid_item.classList.add("grid-item");
    grid_item.appendChild(cardTitle);
    header_container.insertBefore(grid_item,header_container.firstChild);


    const game_container = document.getElementById("game-container");
    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = file.rating;
    game_container.appendChild(cardText);

    
  }
  
  async function loadAndExecuteScript(id) {
    try {
        const fileList = await loadFileList();
        console.log(fileList)
        const fileInfo = fileList.find((f) => f.id === id);
        loadNameAndRating(fileInfo)
        var script = document.createElement("script");
        script.src = fileInfo.scriptUrl;
        script.onload = function () {
            initGame();
        };
        document.documentElement.firstChild.appendChild(script);
    } catch (error) {
      console.error("Error al cargar y ejecutar el script:", error);
    }
  }

  async function loadGame() {
    const gameId = decodeURIComponent(getQueryParam("game"));
    if (gameId) {
      try {
        const response = await fetch(gameId);
        if (!response.ok) {
          throw new Error("Error al cargar el juego");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const gameDoc = parser.parseFromString(html, "text/html");
        document.getElementById("game-container").innerHTML += html;

        await loadAndExecuteScript(gameId);
        addClickEvent()
        resizeCanvas()
      } catch (error) {
        console.error("Error:",JSON.stringify(error));
      }
    } else {
      console.error("No se proporcionó el parámetro 'game'");
    }
  }


  function resizeCanvas(){
    document.getElementById("gameCanvas").height = (window.screen.availHeight - (window.screen.availHeight*0.25))
    document.getElementById("gameCanvas").width = (window.screen.availWidth - (window.screen.availWidth*0.10))
  }

  function addClickEvent() {
    document.getElementById("home").onclick = goHome;
  }
  
  function goHome() {
    window.location.href = '/';
  }

  document.addEventListener("DOMContentLoaded", loadGame);

