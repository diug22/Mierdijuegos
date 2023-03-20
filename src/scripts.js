function generateFileList(fileList) {
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

fetch("fileList.json")
  .then((response) => response.json())
  .then((data) => generateFileList(data))
  .catch((error) => console.error
