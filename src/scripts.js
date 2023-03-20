function generateCarouselItems(fileList) {
  const carouselInner = document.querySelector(".carousel-inner");

  fileList.forEach((file, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const link = document.createElement("a");
    link.href = file.path;

    const img = document.createElement("img");
    img.src = file.imageUrl;
    img.alt = file.name;
    img.style.width = "100%";
    img.style.height = "auto";

    link.appendChild(img);
    carouselItem.appendChild(link);

    const carouselCaption = document.createElement("div");
    carouselCaption.classList.add("carousel-caption", "d-none", "d-md-block");

    const captionLink = document.createElement("a");
    captionLink.href = file.path;
    captionLink.textContent = file.name;
    captionLink.style.color = "white";

    carouselCaption.appendChild(captionLink);
    carouselItem.appendChild(carouselCaption);

    carouselInner.appendChild(carouselItem);
  });
}

function init() {
  fetch("src/fileList.json")
    .then((response) => response.json())
    .then((data) => generateCarouselItems(data))
    .catch((error) => console.error("Error:", error));
}

document.addEventListener("DOMContentLoaded", init);
