var selectedFile="";
var idEstabelecimento="";

// Máscaras
$("#tfCEP").mask("00000-000");
$("#tfWhatsapp").mask("(00) 0 0000-0000");

(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase
	};
	firebase.initializeApp(config);
	
	autenticacao();
	updateEstabelecimento();
	
}());

// Usuário Sessão
function autenticacao(){
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) {		
			// Lista o estabelecimento do usuário
			firebase.database().ref('/estabelecimento/'+user.uid).once('value').then(function(snapshot){
				var PostObject = snapshot.val(); // recupera a chave com os dados
				var keys = Object.keys(PostObject);
				
				if(keys.length != 0){	
					for(var i = 0; i < keys.length; i++){ // Separa as chave
						var currentObject = PostObject[keys[i]]; // Separa os objetos
						
						if(currentObject.status == "Bloqueado"){
							alert("Sua Conta está Bloqueada, Favor Entrar em Contato com o Suporte.");
							
							firebase.auth().signOut().then(function(){
								// Sign-out com sucesso
								
							}, function(error) {
								alert(erro.message);
							});

							window.location.href = "index.html"
						}
					}
				}			
				
			}).catch(function(error) { // Quando o Object é null o usuário preenche os dados do estabelecimento.			  
				alert("Por favor, preencha o seu perfil.");
			  
				window.location.href = "perfil.html";
			
			});
			
		} else {
			// Nenhum usuário iniciou sessão
			window.location.href = "index.html"
		}
	});
	
}

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
		window.location.href = "index.html";
		
		firebase.auth().signOut().then(function(){
			alert("Logoff realizado com sucesso!");
		}, function(error) {
			alert(erro.message);
		});
		
	}
}

// *ABA CADASTRAR / EDITAR*

$('#image_uploads').on("change", function(event){
	selectedFile = event.target.files[0];
});

function validarCampo(campo){
	if(campo == ""){
		alert("Preencha os Campos Obrigatório!");
		return false;
	}else{
		return true;
	}
}

// Recupera os dados do Estabelecimento
function updateEstabelecimento(){
		
	//Obtém os dados do usuário logado
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) { // O usuário está conectado.
			//Id do usuário
			var userUid = user.uid;
			
			var tfEmail = document.getElementById("tfEmail");
			
			// Lista os dados do estabelecimento
			firebase.database().ref('/estabelecimento/'+userUid).once('value').then(function(snapshot){
				var PostObject = snapshot.val(); // recupera a chave com os dados
				var keys = Object.keys(PostObject);
				
				// O estabelecimento tem cadastro
				if(keys.length != 0){					
					var cbCategoria = document.getElementById("cbCategoria");
					var categoriaCount = cbCategoria.length; // Quantidade de Categorias
					var categoriaLength = categoriaCount;
					
					var tfNome = document.getElementById("tfNome");
					var tfTelefone = document.getElementById("tfTelefone");
					var tfWhatsapp = document.getElementById("tfWhatsapp");
					var tfHorario = document.getElementById("tfHorario");
					var tfCidade = document.getElementById("tfCidade");
					var tfCEP = document.getElementById("tfCEP");
					var tfBairro = document.getElementById("tfBairro");
					var tfEndereco = document.getElementById("tfEndereco");
					var taDescricao = document.getElementById("taDescricao");
					
					document.getElementById("btnNovo").disabled = true;
					document.getElementById("btnSalvar").disabled = true;
					document.getElementById("btnEditar").disabled = false;
					
					urlStorage(userUid); // Popula a imagem
					
					for(var i = 0; i < keys.length; i++){ // Separa as chave
						var currentObject = PostObject[keys[i]]; // Separa os objetos
						
						idEstabelecimento = currentObject.id_estab;
						
						cbCategoria.value = currentObject.categoria;
						tfNome.value = currentObject.nome;
						tfTelefone.value = currentObject.telefone;
						tfWhatsapp.value = currentObject.whatsapp;
						tfHorario.value = currentObject.horario;
						tfEmail.value = currentObject.email;
						tfCidade.value = currentObject.cidade;
						tfCEP.value = currentObject.cep;
						tfBairro.value = currentObject.bairro;
						tfEndereco.value = currentObject.endereco;
						taDescricao.value = currentObject.descricao;
						
					}
					
				}
				
			}).catch(function(error) {
			  // O estabelecimento não tem cadastro	
			  
			  // Informações do usuário logado
			  var userDados = firebase.auth().currentUser;
			  	if (userDados != null) {
					userDados.providerData.forEach(function (profile) {
						tfEmail.value = profile.email;
					});
				}
			  
			});
		}
	});
	
}

// Ação do botão SALVAR
function salvarDados(){
	var tfNome = $("#tfNome").val();
	var tfTelefone = $("#tfTelefone").val();
	
	if(validarCampo(tfNome) && validarCampo(tfTelefone)){
		if (confirmar("Salvar")){			
			document.getElementById("btnNovo").disabled = true;
			document.getElementById("btnSalvar").disabled = true;
			
			$("#progressoBar").show();
			
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				
				// obtem a chave do banco de dados
				var postKey = firebase.database().ref('/estabelecimento/'+userUid+'/').push().key;
				
				//Salva a Imagem
				if(selectedFile.length != 0){
					
					// Salva a imagem com o nome da chave
					var storageRef = firebase.storage().ref('estabelecimento/' + userUid);
					var uploadTask = storageRef.put(selectedFile);
					
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
						// Salva com a imagem
						salvarDatabase(postKey,userUid);
					});
					
				}else{
					// Salva sem a imagem
					salvarDatabase(postKey,userUid);
				}
				
			  } else { //Usuário desconectado
				alert("Usuário desconectado");
			  }
			  
			});
			
		}else{
			// botão cancelar
		}
	}
}

function salvarDatabase(postKey,userUid){
	var cbCategoria = $("#cbCategoria").val();
	var tfNome = $("#tfNome").val();
	var tfTelefone = $("#tfTelefone").val();
	var tfWhatsapp = $("#tfWhatsapp").val();
	var tfHorario = $("#tfHorario").val();
	var tfCidade = $("#tfCidade").val();
	var tfCEP = $("#tfCEP").val();
	var tfBairro = $("#tfBairro").val();
	var tfEndereco = $("#tfEndereco").val();
	var taDescricao = $("#taDescricao").val();
	var tfEmail = $("#tfEmail").val();
	var userEmail = "";
	var statusPadrao = "Liberado";
	
	// Informações do usuário logado
	var userDados = firebase.auth().currentUser;
	if (userDados != null) {
	  userDados.providerData.forEach(function (profile) {
		userEmail = profile.email;
	  });
	}
	
	// Salva os dados no banco
	var updates = {};
	var postData = {
		id_estab: postKey,
		categoria: cbCategoria,
		nome: tfNome,
		telefone: tfTelefone,
		whatsapp: tfWhatsapp,
		horario: tfHorario,
		endereco: tfEndereco,
		cidade: tfCidade,
		cep: tfCEP,
		bairro: tfBairro,
		descricao: taDescricao,
		emailUser: userEmail,
		email: tfEmail,
		status: statusPadrao
	}
						 
	updates['/estabelecimento/'+userUid+'/'+postKey] = postData;
	var retorno = firebase.database().ref().update(updates);
	
	alert("Operação Realizada com Sucesso!");
	window.location.href = "perfil.html";
	
}

function novo(){
	window.location.href = "perfil.html";
	
}

// Edita os Dados
function editarDados(){
	var tfNome = $("#tfNome").val();
	var tfTelefone = $("#tfTelefone").val();

	if(validarCampo(tfNome) && validarCampo(tfTelefone)){
		if (confirmar("Editar")){
			document.getElementById("btnEditar").disabled = true;
			
			$("#progressoBar").show();
						
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				
				//Altera a Imagem
				if(selectedFile.length != 0){
					
					// Salva a imagem com o nome da chave
					var storageRef = firebase.storage().ref('estabelecimento/'+userUid);
					var uploadTask = storageRef.put(selectedFile);			
					
					// Salva a imagem com o nome da chave
					var uploadTask = storageRef.put(selectedFile);
					
					// Registre três observadores:
					// 1. Observador 'state_changed', chamado a qualquer momento em que o estado muda
					// 2. Observador de erro, chamado de falha
					// 3. Observador de conclusão, convocado para conclusão bem-sucedida
					uploadTask.on('state_changed', function(snapshot){
						// Observe eventos de mudança de estado, como progresso, pausa e currículo
						// Obtém o progresso da tarefa, incluindo o número de bytes carregados e o número total de bytes a serem carregados
						$("#progressoBar").show();
					}, function(error) {
						// Manipula uploads mal sucedidos
						console.log("error " + error);
					}, function() {
						// Gerencie os uploads bem-sucedidos em completo
						editarDatabase(userUid);
					});
					
				}else{
					editarDatabase(userUid);
				}
				
			} else { //Usuário desconectado
				alert("Usuário desconectado");
			}
			  
			});
			
		}else{
			// botão cancelar
		}
	}
	
}

function editarDatabase(userUid){
	var cbCategoria = $("#cbCategoria").val();
	var tfNome = $("#tfNome").val();
	var tfTelefone = $("#tfTelefone").val();
	var tfWhatsapp = $("#tfWhatsapp").val();
	var tfHorario = $("#tfHorario").val();
	var tfCidade = $("#tfCidade").val();
	var tfCEP = $("#tfCEP").val();
	var tfBairro = $("#tfBairro").val();
	var tfEndereco = $("#tfEndereco").val();
	var taDescricao = $("#taDescricao").val();
	var statusPadrao = "Liberado";
	var tfEmail = $("#tfEmail").val();
	var userEmail = "";

	
	// Informações do usuário logado
	var user = firebase.auth().currentUser;
	if (user != null) {
	  user.providerData.forEach(function (profile) {
		userEmail = profile.email;
	  });
	}
	
	// Salva os dados no banco
	var updates = {};
	var postData = {
		id_estab: idEstabelecimento,
		categoria: cbCategoria,
		nome: tfNome,
		telefone: tfTelefone,
		whatsapp: tfWhatsapp,
		horario: tfHorario,
		endereco: tfEndereco,
		cidade: tfCidade,
		cep: tfCEP,
		bairro: tfBairro,
		descricao: taDescricao,
		emailUser: userEmail,
		email: tfEmail,
		status: statusPadrao
	}
						 
	updates['/estabelecimento/'+userUid+'/'+idEstabelecimento] = postData;
	firebase.database().ref().update(updates);
	
	alert("Operação Realizada com Sucesso!");
	window.location.href = "perfil.html";
	
}

// *Popula a imagem*
function urlStorage(userUid){
	var storage = firebase.storage();
	var storageRef = storage.ref('estabelecimento');
	
	storageRef.child(''+userUid).getDownloadURL().then(function(url) {
		var preview = document.querySelector(".preview");
		
		// Remove a mensagem "Nenhuma imagem selecionada..."
		while(preview.firstChild) {
			preview.removeChild(preview.firstChild);
	  	}
		
		var listItem = document.createElement("div");
		var image = document.createElement('img');

		image.src = url;
		
		listItem.append(image);
		
		preview.appendChild(listItem);

	}).catch(function(erro) {
		urlStoragePadrao();
	});
}

// *Popula com a imagem padrão*
function urlStoragePadrao(){
	var storage = firebase.storage();
	var storageRef = storage.ref('estabelecimento');
	
	storageRef.child('estabelecimento_padrao.jpeg').getDownloadURL().then(function(url) {
		var preview = document.querySelector(".preview");
		
		// Remove a mensagem "Nenhuma imagem selecionada..."
		while(preview.firstChild) {
			preview.removeChild(preview.firstChild);
	  	}
		
		var listItem = document.createElement("div");
		var image = document.createElement('img');

		image.src = url;
		
		listItem.append(image);
		
		preview.appendChild(listItem);

	}).catch(function(erro) {
  		// Lidar com quaisquer erros
	});
}