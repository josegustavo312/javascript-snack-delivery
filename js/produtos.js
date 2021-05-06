document.cookie;
var	keyCookie = document.cookie;
var selectedFile="";

(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase
	};
	firebase.initializeApp(config);
	
	autenticacao();
	updateAbaCadastrar();
	updateAbaListar();
	
	if(keyCookie.length != 0){
		urlStorage(); // Popula a imagem
	}
	
	botaoAtivar();
	setTimeout(1);
	
}());

setTimeout(function() {
  document.cookie="";
}, 1000);

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

// Desabilita os botões da aba CADASTRAR/EDITAR
function botaoAtivar(){
	
	if(keyCookie.length != 0){
		document.getElementById("btnEditar").disabled = false;
		document.getElementById("btnSalvar").disabled = true;
	}else{
		document.getElementById("btnEditar").disabled = true;
	}
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

function showSnackbar(){
	var snackbarContainer = document.querySelector('#demo-snackbar-example');
	var data = {
      message: 'Operação Realizada com Sucesso!',
      timeout: 2000
    };
    snackbarContainer.MaterialSnackbar.showSnackbar(data);
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

// Recupera os Dados - Aba CADASTRAR
function updateAbaCadastrar(){
	var cbCategoria = document.getElementById("cbCategoria");
	var categoriaCount = cbCategoria.length; // Quantidade de Categorias
	var categoriaLength = categoriaCount;
		
	//Obtém os dados do usuário logado
	firebase.auth().onAuthStateChanged(function(user) {
		if (user) { // O usuário está conectado.
			//Id do usuário
			var userUid = user.uid;
			
			// Lista as categorias
			firebase.database().ref('/categoria/'+userUid).once('value').then(function(snapshot){
				var PostObject = snapshot.val(); // recupera a chave com os dados
				var keys = Object.keys(PostObject);
				
				// Combobox Categoria, Aba CADASTRAR
				//Limpa o combobox Categoria
				for (i = 0; i < categoriaCount; i++) {
					categoriaLength = categoriaLength-1;  // Remove em ordem decrescente
					cbCategoria.remove(categoriaLength);
				}
				
				// Popula o combobox
				if(keys.length != 0){
					
					for(var i = 0; i < keys.length; i++){ // Separa as chave
						var currentObject = PostObject[keys[i]]; // Separa os objetos
							
						var optionElement = document.createElement("option"); // Cria as opções
							optionElement.value = currentObject.id_cat;
							optionElement.text = currentObject.nome_cat;
							
    					cbCategoria.add(optionElement, cbCategoria.options[i]); // Adciona os elementos				
					}
					
					if(keyCookie.length != 0){
						updateAbaEditar();
					}
					
				}else{
					alert("Nenhuma Categoria Cadastrada!");
				}
			});
		}
	});	
}

// Ação do botão SALVAR aba CADASTRAR
function salvarDados(){
	var tfNome = $("#tfNome").val();
	var tfValor = $("#tfValor").val();
	var cbCategoria = $("#cbCategoria").val();
	
	if(validarCampo(tfNome) && validarCampo(tfValor)){
		if (confirmar("Salvar")){
			document.getElementById("btnNovo").disabled = true;
			document.getElementById("btnSalvar").disabled = true;
			
			$("#progressoBar").show();
			
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				
				// obtem a chave do banco de dados
				var postKey = firebase.database().ref('/produto/'+userUid+'/'+cbCategoria+'/').push().key;
				
				if(selectedFile.length != 0){
					
					// Salva a imagem com o nome da chave
					var storageRef = firebase.storage().ref('produto/' + postKey);
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
	var tfNome = $("#tfNome").val();
	var tfValor = $("#tfValor").val();
	var cbCategoria = $("#cbCategoria").val();
	var cbAdcionais = $("#cbAdcionais").val();
	var cbStatus = $("#cbStatus").val();
	var taDescricao = $("#taDescricao").val();	
	
	// Salva os dados no banco
	var updates = {};
	var postData = {
		id_prod: postKey,
		nome_prod: tfNome,
		valor: tfValor,
		adcionais: cbAdcionais,
		status: cbStatus,
		descricao: taDescricao
	}
						 
	updates['/produto/'+userUid+'/'+cbCategoria+'/'+postKey] = postData;
	firebase.database().ref().update(updates);
						
	alert("Operação Realizada com Sucesso!");
	window.location.href = "produtos.html";
}

function novo(){
	window.location.href = "produtos.html";
}

// Recupera os Dados - Aba EDITAR
function updateAbaEditar(){
	if(keyCookie.length != 0){
		var cbCategoria = document.getElementById("cbCategoria");
		var cbAdcionais = document.getElementById("cbAdcionais");
		var cbStatus = document.getElementById("cbStatus");
		var btnEditar = document.getElementById("btnEditar");
		
		var keyCookieSeparado = keyCookie.split("?"); // [0]Produto ID, [1]Categoria ID, [2]Adcionais nome, [3]Status nome.
		
		// Seleciona e desabilita o option do combobox Categoria.
		cbCategoria.value = keyCookieSeparado[1];
		cbCategoria.disabled = true;
		
		// Seleciona o option do combobox Adcionais.
		cbAdcionais.value = keyCookieSeparado[2];
		
		// Seleciona o option do combobox Status.
		cbStatus.value = keyCookieSeparado[3];
		
		btnEditar.value = keyCookie;
	}
}

// Edita os Dados - Aba CADASTRAR / EDITAR
function editarDados(){
	var keyCookieSeparado = keyCookie.split("?"); // [0]Produto ID, [1]Categoria ID, [2]Adcionais nome, [3]Status nome.
		
	var tfNome = $("#tfNome").val();
	var tfValor = $("#tfValor").val();
	var cbAdcionais = $("#cbAdcionais").val();
	var cbStatus = $("#cbStatus").val();
	var taDescricao = $("#taDescricao").val();

	if(validarCampo(tfNome) && validarCampo(tfValor)){
		if (confirmar("Editar")){
			document.getElementById("btnNovo").disabled = true;
			document.getElementById("btnEditar").disabled = true;
			
			$("#progressoBar").show();
						
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				
				// Salva os dados no banco
				var updates = {};
				var postData = {
					id_prod: keyCookieSeparado[0],
					nome_prod: tfNome,
					valor: tfValor,
					adcionais: cbAdcionais,
					status: cbStatus,
					descricao: taDescricao
				}
						 
				updates['/produto/'+userUid+'/'+keyCookieSeparado[1]+'/'+keyCookieSeparado[0]] = postData;
				firebase.database().ref().update(updates);
				
				//Altera a Imagem
				if(selectedFile.length != 0){
					
					// Salva a imagem com o nome da chave
					var storageRef = firebase.storage().ref('produto/' + keyCookieSeparado[0]);
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
						alert("Operação Realizada com Sucesso!");
						window.location.href = "produtos.html";
					});
					
				}else{
					alert("Operação Realizada com Sucesso!");
					window.location.href = "produtos.html";
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

// * ABA LISTAR*

// Recupera os Dados - Aba LISTAR
function updateAbaListar(){
	
	firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
	
				// Lista as categorias
				firebase.database().ref('/categoria/'+userUid).once('value').then(function(snapshot){
					var PostObject = snapshot.val(); // recupera a chave com os dados
					var keys = Object.keys(PostObject);
					keys.reverse(); // Ordem decrescente
			
					if(keys.length != 0){
						for(var i = 0; i < keys.length; i++){ // Separa as chave
							var currentObject = PostObject[keys[i]]; // Separa os objetos
							var id_cat = currentObject.id_cat;
							var nome_cat = currentObject.nome_cat;
							
							listaProdutos(userUid,id_cat,nome_cat); // Cria os elementos da aba LISTAR
								
						}
					}else{
						alert("Nenhuma Categoria Cadastrada!");
					}
					});
			  }
	});
}

// Cria os elementos da aba LISTAR
function listaProdutos(userUid,id_cat,nome_cat){
	
	// Elementos
	var table = document.createElement("table");
	var thead = document.createElement("thead");
	var trTitulo = document.createElement("tr");
	var thNome = document.createElement("th");
	var thValor = document.createElement("th");
	var thAlterar = document.createElement("th");
	var thExcluir = document.createElement("th");
	var tbody = document.createElement("tbody");
	
	// Propriedades dos elementos
	$(table).addClass("mdl-js-data-table mdl-shadow--2dp tableListar"); //mdl-data-table
	$(thNome).addClass("mdl-data-table__cell--non-numeric thNomeListar tdLeft");
	$(thNome).html("<b> NOME </b>");
	$(thValor).html("<b> VALOR </b>");
	$(thAlterar).html("<b> ALTERAR </b>");
	$(thExcluir).addClass("tdRight");
	$(thExcluir).html("<b> EXCLUIR </b>");
	
	// Adiciona os elementos
	$(table).append(thead);
	$(thead).append(trTitulo);
	$(trTitulo).append(thNome);
	$(trTitulo).append(thValor);
	$(trTitulo).append(thAlterar);
	$(trTitulo).append(thExcluir);
	
	// Lista os produtos do banco
	firebase.database().ref('/produto/'+userUid+'/'+id_cat).once('value').then(function(snapshot){
		var PostObject = snapshot.val(); // recupera a chave com os dados
		var keys = Object.keys(PostObject);
		keys.reverse(); // Ordem decrescente
		
			if(keys.length != 0){
			
				for(var i = 0; i < keys.length; i++){ // Separa as chave
					var currentObject = PostObject[keys[i]]; // Separa os objetos
						
					// Elementos
					var trProduto = document.createElement("tr");
					var tdNome = document.createElement("td");
					var tdValor = document.createElement("td");
					var tdAlterar = document.createElement("td");
					var tdExcluir = document.createElement("td");
										
					// Propriedades dos elementos
					$(tdNome).addClass("mdl-data-table__cell--non-numeric tdLeft");
					$(tdNome).html("<b>" + currentObject.nome_prod + "</b> <br>" + currentObject.descricao);
					$(tdValor).html("R$: "+currentObject.valor);
					$(tdAlterar).html("<button id='btnEditarListar' value="+userUid+"?"+id_cat+"?"+currentObject.id_prod+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect' onClick='exibirProduto(this.value)'> <i class='material-icons'>edit</i></button>");
					$(tdExcluir).addClass("tdRight");
					$(tdExcluir).html("<button id='btnExcluirListar' value="+userUid+"?"+id_cat+"?"+currentObject.id_prod+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect' onClick='excluirProduto(this.value)'> <i class='material-icons'>delete</i></button>");
							
					// Adiciona os elementos
					$(table).append(tbody);
					$(tbody).append(trProduto);
					$(trProduto).append(tdNome);
					$(trProduto).append(tdValor);
					$(trProduto).append(tdAlterar);
					$(trProduto).append(tdExcluir);
				}
				
			}else{
				alert("Nenhum Produto Cadastrado!");
			}	
			
		$("#conteudoListar").append("<i class='material-icons'>category</i> <b>" + nome_cat + "</b>");
		$("#conteudoListar").append(table);
		$("#conteudoListar").append("<br/>");
		
	});
	
}

// Ação do botão EDITAR aba LISTAR
function exibirProduto(value){
	var buttonValueSeparado = value.split("?"); // [0]Usuario ID, [1]Categoria ID, [2]Produto ID.
	
	var tfNome = document.getElementById("tfNome");
	var tfValor = document.getElementById("tfValor");
	var taDescricao = document.getElementById("taDescricao");
	var cbCategoria = document.getElementById("cbCategoria");
	var categoriaCount = cbCategoria.length; // Quantidade de Categorias
	var categoriaLength = categoriaCount;
	
	//Limpa o combobox Categoria
	for (i = 0; i < categoriaCount; i++) {
		categoriaLength = categoriaLength-1;  // Remove em ordem decrescente
		cbCategoria.remove(categoriaLength);
	}
	
	// Lista o produto do banco
	firebase.database().ref('/produto/'+buttonValueSeparado[0]+'/'+buttonValueSeparado[1]+'/'+buttonValueSeparado[2]).once('value').then(function(snapshot){
		tfNome.value = snapshot.val().nome_prod;
		tfValor.value = snapshot.val().valor;
		taDescricao.value = snapshot.val().descricao;
		
		// Adciona valores no cookie do navegador
		document.cookie =  snapshot.val().id_prod + "?" + buttonValueSeparado[1] + "?" + snapshot.val().adcionais + "?" + snapshot.val().status;
		
		location.reload(); // Atualiza a página
		
	});
	
}

// Ação do botão EXCLUIR aba LISTAR
function excluirProduto(value){
	if (confirmar("Excluir")){
		var buttonValueSeparado = value.split("?"); // [0]Usuario ID, [1]Categoria ID, [2]Produto ID.
		
		// Exclui os Dados
		firebase.database().ref().child('produto/'+buttonValueSeparado[0]+'/'+buttonValueSeparado[1]).child(buttonValueSeparado[2]).remove();
				
		// Exclui a Imagem
		var storage = firebase.storage();
		var storageRef = storage.ref('produto/'+buttonValueSeparado[2]);
		
		storageRef.delete().then(function() {
		  // Removeu a imagem
		  alert("Operação Realizada com Sucesso!");
		  window.location.href = "produtos.html";
		  		  
		}).catch(function(error) {
		  // O produto não tem imagem
		  alert("Operação Realizada com Sucesso!");
		  window.location.href = "produtos.html";
		  
		});
		
	}else{
		// botão cancelar
	}	

}

// *Popula a imagem*
function urlStorage(){
	var keyCookieSeparado = keyCookie.split("?"); // [0]Produto ID, [1]Categoria ID, [2]Adcionais nome, [3]Status nome.
	var storage = firebase.storage();
	var storageRef = storage.ref('produto');
	
	storageRef.child(''+keyCookieSeparado[0]).getDownloadURL().then(function(url) {
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
		if(keyCookie.length != 0){
			urlStoragePadrao();
		}
	});
}

// *Popula com a imagem padrão*
function urlStoragePadrao(){
	var storage = firebase.storage();
	var storageRef = storage.ref('produto');
	
	storageRef.child('produto_padrao.jpeg').getDownloadURL().then(function(url) {
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