function generateCardItems(fileList) {
  const cardContainer = document.getElementById("card-container");

  fileList.forEach((file) => {
    const card = document.createElement("div") ;
    card.classList.add("card");

    const cardBody = document.createElement("div");
    cardBody.classList.add("card-body");

    const img = document.createElement("img");
    img.src = file.imageUrl;
    img.alt = file.name;
    img.classList.add("card-img-top");

    const cardTitle = document.createElement("h5");
    cardTitle.classList.add("card-title");
    cardTitle.textContent = file.name;

    const cardText = document.createElement("p");
    cardText.classList.add("card-text");
    cardText.textContent = file.rating;

    const link = document.createElement("a");
    link.href = `/juegos/game_container.html?game=${encodeURIComponent(file.path)}`;
    link.appendChild(img);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(cardText);

    card.appendChild(link);
    card.appendChild(cardBody);

    const col = document.createElement("div");
    col.classList.add("col-md-4", "col-sm-6");
    col.appendChild(card);

    cardContainer.appendChild(col);
  });
}

function init() {
  fetch("src/fileList.json")
    .then((response) => response.json())
    .then((data) => generateCardItems(data))
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", init);
