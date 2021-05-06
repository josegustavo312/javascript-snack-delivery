document.cookie;
var	keyCookie = document.cookie;

(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase
	};
	firebase.initializeApp(config);
	
	autenticacao();
	updateAbaListar();
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

// *ABA CADASTRAR / EDITAR*

function novo(){
	window.location.href = "categorias.html";
}

function validarCampo(campo){
	if(campo == ""){
		alert("Preencha Todos os Campos");
		return false;
	}else{
		return true;
	}
}

function salvarDados(){
	
	var nome = $("#tfNome").val();
	
	if(validarCampo(nome)){
		if (confirmar("Salvar")){
			document.getElementById("btnNovo").disabled = true;
			document.getElementById("btnSalvar").disabled = true;
			
			$("#progressoBar").show();
			
			firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				// obtem a chave do banco de dados
				var postKey = firebase.database().ref('/categoria/'+userUid+'/').push().key;
				  
				// salva os dados no banco
				var updates = {};
				var postData = {
				 id_cat: postKey,
				 nome_cat: nome
				}
				 
				updates['/categoria/'+userUid+'/'+postKey] = postData;
				firebase.database().ref().update(updates);
				
				alert("Operação Realizada com Sucesso!");
				window.location.href = "categorias.html";
				// ...
			  } else { //Usuário desconectado
				alert("Usuário desconectado");
			  }
			});
			
		}else{
			// botão cancelar
		}
	}
}

// Edita os Dados - Aba CADASTRAR / EDITAR
function editarDados(){
	var tfNome = $("#tfNome").val();

	if(validarCampo(tfNome)){
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
					id_cat: keyCookie,
					nome_cat: tfNome
				}
						 
				updates['/categoria/'+userUid+'/'+keyCookie] = postData;
				firebase.database().ref().update(updates);
						
				alert("Operação Realizada com Sucesso!");
				window.location.href = "categorias.html";
				
			} else { //Usuário desconectado
				alert("Usuário desconectado");
			}
			  
			});
			
		}else{
			// botão cancelar
		}
	}
	
}

// *ABA LISTAR*

// Recupera os Dados - Aba LISTAR
function updateAbaListar(){
		
	firebase.auth().onAuthStateChanged(function(user) {
			  if (user) { // O usuário está conectado.
				//Id do usuário
				var userUid = user.uid;
				
				// Elementos
				var table = document.createElement("table");
				var thead = document.createElement("thead");
				var trTitulo = document.createElement("tr");
				var thNome = document.createElement("th");
				var thAlterar = document.createElement("th");
				var thExcluir = document.createElement("th");
				var tbody = document.createElement("tbody");
				
				// Propriedades dos elementos
				$(table).addClass("mdl-js-data-table mdl-shadow--2dp tableListar");
				$(thNome).addClass("mdl-data-table__cell--non-numeric thNomeCatListar tdLeft");
				$(thNome).html("<b> NOME </b>");
				$(thAlterar).html("<b> ALTERAR </b>");
				$(thExcluir).addClass("tdRight");
				$(thExcluir).html("<b> EXCLUIR </b>");
				
				// Adiciona os elementos
				$(table).append(thead);
				$(thead).append(trTitulo);
				$(trTitulo).append(thNome);
				$(trTitulo).append(thAlterar);
				$(trTitulo).append(thExcluir);
	
				// Lista as categorias
				firebase.database().ref('/categoria/'+userUid).once('value').then(function(snapshot){
					var PostObject = snapshot.val(); // recupera a chave com os dados
					var keys = Object.keys(PostObject);
					keys.reverse(); // Ordem decrescente
			
					if(keys.length != 0){
						for(var i = 0; i < keys.length; i++){ // Separa as chave
							var currentObject = PostObject[keys[i]]; // Separa os objetos
							
							// Elementos
							var trCategoria = document.createElement("tr");
							var tdNome = document.createElement("td");
							var tdAlterar = document.createElement("td");
							var tdExcluir = document.createElement("td");
												
							// Propriedades dos elementos
							$(tdNome).addClass("mdl-data-table__cell--non-numeric tdLeft");
							$(tdNome).html(currentObject.nome_cat);
							$(tdAlterar).html("<button id='btnEditarListar' value="+userUid+"?"+currentObject.id_cat+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect' onClick='exibirCategoria(this.value)'> <i class='material-icons'>edit</i></button>");
							$(tdExcluir).addClass("tdRight");
							$(tdExcluir).html("<button id='btnExcluirListar' value="+userUid+"?"+currentObject.id_cat+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect' onClick='excluirCategoria(this.value)'> <i class='material-icons'>delete</i></button>");
										
							// Adiciona os elementos
							$(table).append(tbody);
							$(tbody).append(trCategoria);
							$(trCategoria).append(tdNome);
							$(trCategoria).append(tdAlterar);
							$(trCategoria).append(tdExcluir);
								
						}
					}else{
						alert("Nenhuma Categoria Cadastrada!");
					}
					
					$("#conteudoListar").append(table);
					
				});
			  }
	});
}

// Ação do botão EDITAR aba LISTAR
function exibirCategoria(value){
	var buttonValueSeparado = value.split("?"); // [0]Usuario ID, [1]Categoria ID.
	
	var tfNome = document.getElementById("tfNome");
	
	// Lista a categoria do banco
	firebase.database().ref('/categoria/'+buttonValueSeparado[0]+'/'+buttonValueSeparado[1]).once('value').then(function(snapshot){
		tfNome.value = snapshot.val().nome_cat;
		
		document.cookie = buttonValueSeparado[1];
		
		location.reload(); // Atualiza a página
		
	});
	
}

// Ação do botão EXCLUIR aba LISTAR
function excluirCategoria(value){
	
	var buttonValueSeparado = value.split("?"); // [0]Usuario ID, [1]Categoria ID.
	
	if (confirmar("Excluir")){
		var keys="";
		
		// Lista os produtos do banco
		firebase.database().ref('/produto/'+buttonValueSeparado[0]+'/'+buttonValueSeparado[1]).once('value').then(function(snapshot){
			var PostObject = snapshot.val(); // recupera a chave com os dados
			keys = Object.keys(PostObject);

			alert("Impossível Excluir. Essa Categoria tem "+keys.length+" Produto(s) Cadastrado(s).");
						
		}).catch(function(error) { // Quando o Object é null a categoria é excluída.
		  
		  //Remove a Categoria 
		  var storage = firebase.storage();
		  firebase.database().ref().child('categoria/'+buttonValueSeparado[0]).child(buttonValueSeparado[1]).remove(); 
		  
		  alert("Operação Realizada com Sucesso!");
		  window.location.href = "categorias.html";
		
		});	
		
	}else{
		// botão cancelar
	}	

}