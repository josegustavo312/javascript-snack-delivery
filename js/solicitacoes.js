/* REGISTRO */
var qtdLimiteReg = 10; // Limite inicial da lista
var maisLimiteReg = 10;	// mais quantidade na lista
var qtdListaReg = 0;
var listaLimiteReg = 0; // quando a lista chegar no limite

/* SOLICITAÇÕES */
var qtdLimiteSol = 10; // Limite inicial da lista
var maisLimiteSol = 10;  // mais quantidade na lista
var qtdListaSol = 0;
var listaLimiteSol = 0; // quando a lista chegar no limite

var fileKey = 0;
var fileSol, fileSolId = 0;

(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase 
	};
	
	firebase.initializeApp(config);
	queryRegistro();
	querySolicitacao();
	
}());

function confirmar(acao){
	var confirmar = confirm("Tem Certeza que Deseja " + acao + "?");
	
	if (confirmar==true){
		return true;
	}
	else{
		return false;
	}
}

function logoff(){
	if(confirmar("Sair")){
		firebase.auth().signOut().then(function(){
			//Logoff com sucesso
		}, function(error) {
			alert(erro.message);
		});
		
		window.location.href = "index.html";
	}
}

function showSnackbar(){
	var snackbarContainer = document.querySelector('#demo-snackbar-example');
	var data = {
      message: 'Operação Realizada com Sucesso!',
      timeout: 2000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
}

/* popula as imagens */
function urlStorage(id){
	var storage = firebase.storage();
	var storageRef = storage.ref('Registros');
			
	storageRef.child(''+id).getDownloadURL().then(function(url) {
		var img = document.getElementById(id);
  		img.src = url;
				
	}).catch(function(err) {
  		// Lidar com quaisquer erros
		console.log("erro: " + err.message);
	});
}

/* REGISTRO */

/* recupera a quantidade da lista */
function qtdRegistro(){
	firebase.database().ref('/registro/').once('value').then(function(snapshot){
		var PostObject = snapshot.val();
		var keys = Object.keys(PostObject);
		qtdListaReg = keys.length;
		
	});
	
}

/* recupera os registros */
function queryRegistro(){
	
	firebase.database().ref('/registro/').limitToLast(qtdLimiteReg).once('value').then(function(snapshot){
		var PostObject = snapshot.val(); // Object { -KtwGk_kKjTUfYNHv8ul: Object} recupera a chave com os dados
		var keys = Object.keys(PostObject);
		keys.reverse(); // Ordem decrescente
		var currentRow;
		
		/* Controle da lista */
		var inicioI = 0; // Ponto inicial do loop
		
		qtdRegistro();
		
		if (qtdListaReg == 0){
			listaLimiteReg = 0;
			
		}else if (qtdLimiteReg > qtdListaReg){
			qtdLimiteReg = qtdLimiteReg-maisLimiteReg;
			inicioI = qtdLimiteReg;
			listaLimiteReg = 1;
			
		}else{
			inicioI = qtdLimiteReg-maisLimiteReg;
			listaLimiteReg = 0;
		}
		
		if(keys.length != 0){
		/* Percorre o objeto e atribui aos elementos */
		for(var i = inicioI; i < keys.length; i++){ // separa as chave 
			var currentObject = PostObject[keys[i]]; // separa os objetos
			
			currentRow = document.createElement("div");
			$(currentRow).addClass("rowReg"+currentObject.id);
			$("#conteudoRegistros").append(currentRow);
			
			urlStorage(currentObject.id); // envia o id para popular as imagens
			
			/* Cria e adiciona os elementos */
			// Elementos
			var col = document.createElement("div");
			var assunto = document.createElement("p");
			var image = document.createElement("img");
			var data = document.createElement("p");
			var status = document.createElement("p");
			var solicitante = document.createElement("p")
			var texto = document.createElement("p");
			var resposta = document.createElement("p");
			var respostaSelect = document.createElement("p");
			var respostaTextArea = document.createElement("p");
			var registroButton = document.createElement("p");
			
			// Propriedades dos elementos
			$(assunto).html("<b>"+currentObject.assunto+"</b>");
			$(assunto).addClass("conteudoAssunto");
			image.setAttribute("id", currentObject.id); // atribui a chave de acesso ao id da imagem
			$(image).addClass("conteudoImagem");
			$(data).html("Postagem: " + currentObject.data);
			$(data).addClass("mdl-navigation__link");
			$(status).html("<b>Status: </b> <input id='inputStatus"+currentObject.id+"' class='statusSelect' value='"+currentObject.status+"' disabled>");
			$(status).addClass("conteudoStatus mdl-navigation__link");
			$(solicitante).html("<i class='material-icons'>perm_identity</i> " + currentObject.solicitante);
			$(solicitante).addClass("conteudoTexto mdl-navigation__link");
			$(texto).html("<i class='material-icons'>subject</i> " + currentObject.texto);
			$(texto).addClass("conteudoTexto mdl-navigation__link");
			$(resposta).html("<b>Resposta</b>");
			$(resposta).addClass("conteudoResposta mdl-navigation__link");
			$(respostaSelect).html("<b>Status: </b><select id='selectStatusReg"+currentObject.id+"' class='statusSelect'><option>Em análise</option><option>Em andamento</option><option>Concluído</option><option>Encerrado</option></select>");
			$(respostaSelect).addClass("conteudoStatus mdl-navigation__link");
			$(respostaTextArea).html("<textarea id='txtAreaReg"+currentObject.id+"' class='textArea' type='text' rows='3'  style='resize: none'>"+currentObject.resposta+"</textarea>");
			$(registroButton).html("<button id='btnSalvarReg' value="+currentObject.id+" class='mdl-button mdl-js-button mdl-button--raised acaoButton' onClick='acaoBotao(this.id, this.value)'> <i class='material-icons'>save</i> Salvar </button> <button id='btnExcluirReg' value="+currentObject.id+" class='mdl-button mdl-js-button mdl-button--raised' onClick='acaoBotao(this.id, this.value)'> <i class='material-icons'>delete</i> Excluir </button>");
			
			// Adiciona os elementos
			$(col).append(assunto);
			$(col).append(image);
			$(col).append(data, status, solicitante, texto);
			$(col).append(resposta, respostaSelect, respostaTextArea, registroButton);
			$(col).append("<hr><br>");
			$(currentRow).append(col);
			
		}
		
		}
		
	});
	
}

// ações dos botões de registro
function acaoBotao(id, value){
	// Propriedades do botão
	var buttonId = id;
	var buttonKey = value;
	
	//Ações do botão
	if (buttonId == "btnSalvarReg"){
		var assuntoBd, dataBd, tanteBd, textoBd;
			
		var assuntoRef = firebase.database().ref().child("registro/"+buttonKey+"/assunto");
		assuntoRef.on('value', function(snap){
			assuntoBd = snap.val();
		});
			
		var dataRef = firebase.database().ref().child("registro/"+buttonKey+"/data");
		dataRef.on('value', function(snap){
			dataBd = snap.val();
		});
				
		var solicitanteRef = firebase.database().ref().child("registro/"+buttonKey+"/solicitante");
		solicitanteRef.on('value', function(snap){
			solicitanteBd = snap.val();
		});
		
		var textoRef = firebase.database().ref().child("registro/"+buttonKey+"/texto");
		textoRef.on('value', function(snap){
			textoBd = snap.val();
		});
				
		if (confirmar("Salvar")){
					
			var textArea = document.getElementById('txtAreaReg'+buttonKey);
			var selectStatus = document.getElementById('selectStatusReg'+buttonKey);
					
			// salva os dados no banco
			var updates = {};
			var postData = {
			  id: buttonKey,
			  assunto: assuntoBd,
			  data: dataBd,
			  solicitante: solicitanteBd,
			  texto: textoBd,
			  resposta: textArea.value,
			  status: selectStatus.value
			}
					  
			updates['/solicitacao/' + buttonKey] = postData;
			firebase.database().ref().update(updates);
			
			// Exclui os dados
			firebase.database().ref().child('registro').child(buttonKey).remove();
			
			window.location.href="solicitacoes.html";
				
		}
	}
			
	else if (buttonId == "btnExcluirReg"){
		if (confirmar("Excluir")){
			var storage = firebase.storage();
			var storageRef = storage.ref('Registros/'+buttonKey);
				
			// Exclui os dados e imagem
			storageRef.delete().then(function() {
				//remove os dados
				firebase.database().ref().child('registro').child(buttonKey).remove();
				// remove a linha
				$('.rowReg'+buttonKey).remove(); 
						
				showSnackbar();
			
			}).catch(function(error) {
			  // Uh-oh, ocorreu um erro!
			});
		}
			
	}
	
}

/* Adiciona mais postagem */
function maisReg(){
	if(qtdListaReg != 0){
		if(listaLimiteReg == 0){
			qtdLimiteReg = qtdLimiteReg+maisLimiteReg;
			queryRegistro();
		}else{
			alert("Não há mais postagem...");
		}
	}else{
		alert("Não há postagem...");
	}	
}

/* SOLICITAÇÃO */

/* recupera a quantidade da lista */
function qtdSolicitacao(){
	firebase.database().ref('/solicitacao/').once('value').then(function(snapshot){
		var PostObject = snapshot.val();
		var keys = Object.keys(PostObject);
		qtdListaSol = keys.length;
		
	});
	
}

/* recupera as solicitações */
function querySolicitacao(){
	
	firebase.database().ref('/solicitacao/').limitToLast(qtdLimiteSol).once('value').then(function(snapshot){
		var PostObject = snapshot.val(); // Object { -KtwGk_kKjTUfYNHv8ul: Object} recupera a chave com os dados
		var keys = Object.keys(PostObject);
		keys.reverse(); // Ordem decrescente
		var currentRow;
		
		/* Controle da lista */
		var inicioI = 0; // ponto inicial do loop
		
		qtdSolicitacao();
		
		if (qtdListaSol == 0){
			listaLimiteSol = 0;
			
		}else if (qtdLimiteSol > qtdListaSol){
			qtdLimiteSol = qtdLimiteSol-maisLimiteSol;
			inicioI = qtdLimiteSol;
			listaLimiteSol = 1;
			
		}else{
			inicioI = qtdLimiteSol-maisLimiteSol;
			listaLimiteSol = 0;
		}
		
		if(keys.length != 0){
		/* Percorre o objeto e atribui aos elementos */
		for(var i = inicioI; i < keys.length; i++){ // separa as chave 
			var currentObject = PostObject[keys[i]]; // separa os objetos
			
			currentRow = document.createElement("div");
			$(currentRow).addClass("rowSol"+currentObject.id);
			$("#conteudoSolicitacoes").append(currentRow);
			
			urlStorage(currentObject.id); // envia o id para popular as imagens
			
			/* Cria e adiciona os elementos */
			// Elementos
			var col = document.createElement("div");
			var assunto = document.createElement("p");
			var file = document.createElement("p");
			var image = document.createElement("img");
			var data = document.createElement("p");
			var status = document.createElement("p");
			var solicitante = document.createElement("p");
			var texto = document.createElement("p");
			var resposta = document.createElement("p");
			var respostaSelect = document.createElement("p");
			var respostaTextArea = document.createElement("p");
			var registroButton = document.createElement("p");
			var progressoBar = document.createElement("p");
			
			// Propriedades dos elementos
			$(assunto).html("<b>"+currentObject.assunto+"</b>");
			$(assunto).addClass("conteudoAssunto");
			$(file).html("<form><div><label for='image_uploads"+currentObject.id+"'><i class='material-icons'>camera_alt</i></label><input type='file' id='image_uploads"+currentObject.id+"' name="+currentObject.id+" onClick='fileAlt(this.name)' accept='.jpg, .jpeg, .png, .bmp' class='file'></div><div class='preview"+currentObject.id+"'><!--Imagem--><br/></div></form>");
			image.setAttribute("id", currentObject.id); // atribui a chave de acesso ao id da imagem
			$(image).addClass("conteudoImagem");
			$(data).html("Postagem: " + currentObject.data);
			$(data).addClass("mdl-navigation__link");
			$(status).html("<b>Status: </b> <input id='inputStatusSol"+currentObject.id+"' class='statusSelect' value='"+currentObject.status+"' disabled>");
			$(status).addClass("conteudoStatus mdl-navigation__link");
			$(solicitante).html("<i class='material-icons'>perm_identity</i> " + currentObject.solicitante);
			$(solicitante).addClass("conteudoTexto mdl-navigation__link");
			$(texto).html("<i class='material-icons'>subject</i> " + currentObject.texto);
			$(texto).addClass("conteudoTexto mdl-navigation__link");
			$(resposta).html("<b>Resposta</b>");
			$(resposta).addClass("conteudoResposta mdl-navigation__link");
			$(respostaSelect).html("<b>Status: </b><select id='selectStatusSol"+currentObject.id+"' class='statusSelect'><option>"+currentObject.status+"</option><option>Em análise</option><option>Em andamento</option><option>Concluído</option><option>Encerrado</option></select>");
			$(respostaSelect).addClass("conteudoStatus mdl-navigation__link");
			$(respostaTextArea).html("<textarea id='txtAreaSol"+currentObject.id+"' class='textArea' type='text' rows='3'  style='resize: none'>"+currentObject.resposta+"</textarea>");
			$(registroButton).html("<button id='btnSalvarSol"+currentObject.id+"' value="+currentObject.id+" class='mdl-button mdl-js-button mdl-button--raised acaoButton' onClick='salvarSol(this.value)'> <i class='material-icons'>save</i> Salvar </button> <button id='btnExcluirSol"+currentObject.id+"' value="+currentObject.id+" class='mdl-button mdl-js-button mdl-button--raised' onClick='excluirSol(this.value)'> <i class='material-icons'>delete</i> Excluir </button>");
			$(progressoBar).html("<div id='progressoBar"+currentObject.id+"' class='mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded' data-upgraded=',MaterialProgress'><div class='progressbar bar bar1' style='width: 0%;'></div><div class='bufferbar bar bar2' style='width: 100%;'></div><div class='auxbar bar bar3' style='width: 0%;'></div></div>");
			
			// Adiciona os elementos
			$(col).append(assunto);
			$(col).append(file, image);
			$(col).append(data, status, solicitante, texto);
			$(col).append(resposta, respostaSelect, respostaTextArea, registroButton, progressoBar);
			$(col).append("<hr><br>");
			$(currentRow).append(col);
			
			document.getElementById("progressoBar"+currentObject.id).style.display = "none";
			
		}
		
		}
		
	});
	
}



/* FILE */
function fileAlt(nameKey){
	
	// Remove a antiga imagem pesquisada
	if(fileKey != 0){
		removePreview(fileKey);
	}
	
	var input = document.getElementById('image_uploads'+nameKey);
	fileKey = nameKey;
		
	input.style.opacity = 0;
	input.addEventListener('change', updateImageDisplay);
	
	// Evento file
	$('#image_uploads'+nameKey).on("change", function(event){
		fileSol = event.target.files[0]; // Adciona a variável a imagem
		fileSolId = nameKey;
	});
}


// Verifica o arquivo e adiciona a imagem ao preview
function updateImageDisplay() {
  var preview = document.querySelector('.preview'+fileKey);
  var input = document.getElementById('image_uploads'+fileKey);
  
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
  'image/jpeg',
  'image/png'
]

function validFileType(file) {
    if(file.type === fileTypes[0]) {
      return true;
    }
  return false;
}

function removePreview(key){
	// Remove a imagem pesquisada
	var preview = document.querySelector('.preview'+key);
	while(preview.firstChild) {
		preview.removeChild(preview.firstChild);
	}		
	
	var para = document.createElement('p');
	para.textContent = ' '; // Quebra de linha depois que remove a imagem
	preview.appendChild(para);
}


// Ação do botão btnSalvarSol
function salvarSol(key){
	if (confirmar("Salvar")){
		var imgAlt=0; // Indica quando a imagem for alterada
			
		// Altera a imagem se o id for igual
		if(fileSolId == key){
			uploadFile(key);
			imgAlt = 1;
		}
			
		var textAreaSol = document.getElementById('txtAreaSol'+key);
		var selectStatusSol = document.getElementById('selectStatusSol'+key);
		var nomeStatus =  "✓ "+selectStatusSol.value;
					
		var firebaseRef = firebase.database().ref();
		// Grava substituindo os dados
		firebaseRef.child("solicitacao/"+key+"/resposta").set(textAreaSol.value);
		firebaseRef.child("solicitacao/"+key+"/status").set(nomeStatus);
					
		// Atualiza Status
		var dbStatus = firebase.database().ref().child("solicitacao/"+key+"/status");
		dbStatus.on('value', function(snap){
			$('#inputStatusSol'+key).val(snap.val());
		});
						
		// Atualiza Resposta
		var dbResposta = firebase.database().ref().child("solicitacao/"+key+"/resposta");
		dbResposta.on('value', function(snap){
			$('#txtAreaSol'+key).val(snap.val());
		});
		
		/*Atualiza o Status*/
		//Remove os Status
		for(var i=0; i<5; i++) {
			selectStatusSol.remove(selectStatusSol.selectedIndex);
		}
		
		//Adciona as opções no Status	
		var atualStatus = document.createElement("option");
		var analiseStatus = document.createElement("option");
		var andamentoStatus = document.createElement("option");
		var concluidoStatus = document.createElement("option");
		var encerradoStatus = document.createElement("option");
		atualStatus.text = nomeStatus;
		analiseStatus.text = "Em análise";
		andamentoStatus.text = "Em andamento";
		concluidoStatus.text = "Concluído";
		encerradoStatus.text = "Encerrado";
		selectStatusSol.add(atualStatus);
		selectStatusSol.add(analiseStatus);
		selectStatusSol.add(andamentoStatus);
		selectStatusSol.add(concluidoStatus);
		selectStatusSol.add(encerradoStatus);
		
		//Caso não tenha imagem para alterar
		if(imgAlt==0){
			showSnackbar();
		}
					
	}else{
		// botão cancelar
	}
}

// Ação do botão btnExcluirSol
function excluirSol(key){
	if (confirmar("Excluir")){
		var storage = firebase.storage();
		var storageRef = storage.ref('Registros/'+key);
				
		// Exclui os dados e imagem
		storageRef.delete().then(function() {
			  //remove os dados
		  firebase.database().ref().child('solicitacao').child(key).remove(); 
		  // remove a linha
		  $('.rowSol'+key).remove();
			  
		  showSnackbar();
			  
		}).catch(function(error) {
		  // Uh-oh, ocorreu um erro!
		});
			
	}
}

/* Altera a imagem */
function uploadFile(key){
	$("#progressoBar"+key).show();
	$("#btnSalvarSol"+key).attr("disabled","disabled");
	$("#btnExcluirSol"+key).attr("disabled","disabled");
			
	var storageRef = firebase.storage().ref('Registros/' + key); // salva a imagem com o nome da chave
	var uploadTask = storageRef.put(fileSol); // salva a imagem no storage
	
	// Registre três observadores:
	// 1. Observador 'state_changed', chamado a qualquer momento em que o estado muda
	// 2. Observador de erro, chamado de falha
	// 3. Observador de conclusão, convocado para conclusão bem-sucedida
	uploadTask.on('state_changed', function(snapshot){
		// Observe eventos de mudança de estado, como progresso, pausa e currículo
		// Obtém o progresso da tarefa, incluindo o número de bytes carregados e o número total de bytes a serem carregados
	}, function(error) {
	  // Manipula uploads mal sucedidos
	}, function() {
	  // Gerencie os uploads bem-sucedidos em completo
	  // Por exemplo, obtenha o URL do download: https: //firebasestorage.googleapis.com / ...
	  
	  urlStorage(key); // substituir a imagem antiga
	  removePreview(key); // Remove a imagem pesquisada
	  fileSolId = 0;
	  
	  // Aciona os componentes
	  $("#progressoBar"+key).hide();
	  document.getElementById("btnSalvarSol"+key).disabled = false;
	  document.getElementById("btnExcluirSol"+key).disabled = false;
	  showSnackbar();
	});
}

/* Adiciona mais postagem */
function maisSol(){
	if(qtdListaSol != 0){
		if(listaLimiteSol == 0){
			qtdLimiteSol = qtdLimiteSol+maisLimiteSol;
			querySolicitacao();
		}else{
			alert("Não há mais postagem...");
		}
	}else{
		alert("Não há postagem...");
	}	
}