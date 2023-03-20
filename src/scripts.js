function generateCarouselItems(fileList) {
  const carouselInner = document.querySelector(".carousel-inner");

  fileList.forEach((file, index) => {
    const carouselItem = document.createElement("div");
    carouselItem.classList.add("carousel-item");
    if (index === 0) {
      carouselItem.classList.add("active");
    }

    const videoWrapper = document.createElement("div");
    videoWrapper.style.position = "relative";
    videoWrapper.style.overflow = "hidden";
    videoWrapper.style.paddingTop = "56.25%"; // 16:9 aspect ratio

    const video = document.createElement("iframe");
    video.src = file.videoUrl;
    video.title = file.name;
    video.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
    video.allowFullscreen = true;
    video.style.position = "absolute";
    video.style.top = "0";
    video.style.left = "0";
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.border = "0";

    videoWrapper.appendChild(video);
    carouselItem.appendChild(videoWrapper);

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
