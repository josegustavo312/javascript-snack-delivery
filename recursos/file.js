var input = document.getElementById('image_uploads');
var preview = document.querySelector('.preview');

input.style.opacity = 0;
input.addEventListener('change', updateImageDisplay);
function updateImageDisplay() {
  while(preview.firstChild) {
    preview.removeChild(preview.firstChild);
  }

  var curFiles = input.files;
  if(curFiles.length === 0) {
	var para = document.createElement('p');
    para.textContent = 'Nenhum arquivo selecionado';
    preview.appendChild(para);
  } else {
	  var listItem = document.createElement("div");
      var para = document.createElement('p');
	  
      if(validFileType(curFiles[0])) {
        var image = document.createElement('img');
        image.src = window.URL.createObjectURL(curFiles[0]);
		
        listItem.append(image);

      } else {
        para.textContent = 'O Arquivo ' + curFiles[0].name + ': Não é um tipo de arquivo válido.';
		listItem.append(para);
      }
	  
	  preview.appendChild(listItem); // adiciona na div
  }
}var fileTypes = [
  'image/jpeg',
  'image/jpg',
  'image/png',
]

function validFileType(file) {

    if(file.type === fileTypes[0]) {
      return true;
    }
  return false;
}