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
  
  async function loadAndExecuteScript(path) {
    try {
        const fileList = await loadFileList();
        console.log(fileList)
        const fileInfo = fileList.find((f) => f.path === path);
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
    const gamePath = decodeURIComponent(getQueryParam("game"));
    if (gamePath) {
      try {
        const response = await fetch(gamePath);
        if (!response.ok) {
          throw new Error("Error al cargar el juego");
        }

        const html = await response.text();
        const parser = new DOMParser();
        const gameDoc = parser.parseFromString(html, "text/html");
        document.getElementById("game-container").innerHTML += html;

        await loadAndExecuteScript(gamePath);
      } catch (error) {
        console.error("Error:",JSON.stringify(error));
      }
    } else {
      console.error("No se proporcionó el parámetro 'game'");
    }
  }

  document.addEventListener("DOMContentLoaded", loadGame);