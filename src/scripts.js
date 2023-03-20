function generateCarouselItems(fileList) {
  const carouselInner = document.querySelector(".carousel-inner");

  fileList.forEach((file, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const video = document.createElement("video");
    video.src = file.videoUrl;
    video.title = file.name;
    video.controls = true;
    video.style.width = "100%";
    video.style.height = "auto";

    carouselItem.appendChild(video);

    const carouselCaption = document.createElement("div");
    carouselCaption.classList.add("carousel-caption", "d-none", "d-md-block");

    const link = document.createElement("a");
    link.href = file.path;
    link.textContent = file.name;
    link.style.color = "white";

    carouselCaption.appendChild(link);
    carouselItem.appendChild(carouselCaption);

    carouselInner.appendChild(carouselItem);
  });
}

fetch("fileList.json")
  .then((response) => response.json())
  .then((data) => generateCarouselItems(data))
  .catch((error) => console.error("Error:", error));
