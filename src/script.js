const fileList = [
    { name: "ZigZagSalto ⭐7/10⭐", path: "/juegos/zig_zag_salto" },
    { name: "Cazador de estrellas ⭐5/10⭐", path: "/juegos/cazador_estrellas" },
    { name: "Conexión cuántica ⭐2/10⭐", path: "/juegos/conexion_cuantica" },
    { name: "ColorBlitz ⭐8/10⭐", path: "/juegos/colorblitz" },
  ];

  function generateFileList() {
    const listElement = document.getElementById("file-list");

    fileList.forEach((file) => {
      const listItem = document.createElement("li");
      const link = document.createElement("a");
      link.href = file.path;
      link.textContent = file.name;
      listItem.appendChild(link);
      listElement.appendChild(listItem);
    });
  }

  generateFileList();