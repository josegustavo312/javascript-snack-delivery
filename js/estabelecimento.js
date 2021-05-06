document.cookie;
var	keyCookie = document.cookie;

(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase
	};
	firebase.initializeApp(config);
	
	updateAbaListar();
	botaoAtivar();
	setTimeout(1);
	
}());

setTimeout(function() {
  document.cookie="";
}, 1000);

// Usuário sessão
firebase.auth().onAuthStateChanged(function(user) {
	// Informações do usuário logado
	var userEmail = "";
	var userDados = firebase.auth().currentUser;
	if (userDados != null) {
	  userDados.providerData.forEach(function (profile) {
		userEmail = profile.email;
	  });
	}
	
	if (userEmail!="snackdelivery.ti@gmail.com") {
		window.location.href = "admin.html";
		firebase.auth().signOut().then(function(){
			// Sign-out com sucesso
			
		}, function(error) {
			alert(erro.message);
		});
	}
});


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
		window.location.href = "admin.html";
		firebase.auth().signOut().then(function(){
			alert("Logoff realizado com sucesso!");
		}, function(error) {
			alert(erro.message);
		});
		
	}
}

// *ABA CADASTRAR / EDITAR*

function novo(){
	window.location.href = "estabelecimento.html";
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
	
	var email = $("#tfEmail").val().toLowerCase(); // Letras minúsculas.
	var password = $("#tfPassword").val().toLowerCase(); // Letras minúsculas.
	
	if(validarCampo(email) && validarCampo(password)){
		if (confirmar("Salvar")){
			
			firebase.auth().createUserWithEmailAndPassword(email, password).then(function(){
				document.getElementById("btnNovo").disabled = true;
				document.getElementById("btnSalvar").disabled = true;
				
				$("#progressoBar").show();
				
				alert("Operação Realizada com Sucesso!");
				window.location.href = "estabelecimento.html";
				
			}, function(error) {
			  // Handle Errors here.
			  
			  var errorCode = error.code;
			  var errorMessage = error.message;
			  
			  if (errorCode == "auth/weak-password") {
				$("#paragrafoErro").show().text("A senha está muito fraca.");
			  
			  }else if(errorCode == "auth/invalid-email"){
			  	$("#paragrafoErro").show().text("Endereço de email não é válido.");
				
			  }else if(errorCode == "auth/operation-not-allowed"){
			  	$("#paragrafoErro").show().text("Contas de email / senha não estão ativadas.");
				
			  }else if(errorCode == "auth/email-already-in-use"){
			  	$("#paragrafoErro").show().text("O endereço de email já está sendo usado por outro estabelecimento.");
			  
			  } else {
				$("#paragrafoErro").show().text("ERRO: " + errorMessage);
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
				
			// Lista os estabelecimentos
			firebase.database().ref('/estabelecimento/').once('value').then(function(snapshot){
				var PostObject = snapshot.val(); // recupera a chave com os dados
				var keys = Object.keys(PostObject);
				keys.reverse(); // Ordem decrescente
					
				if(keys.length != 0){
					for(var i = 0; i < keys.length; i++){ // Separa as chave
						var currentObject = PostObject[keys[i]]; // Separa os objetos
							
						// Id do usuário do estabelecimento
						var userUid = keys[i];
							
						listaEstabelecimento(userUid);
							
					}
						
				}
					
			});
				
		}
			  
	});
}

function listaEstabelecimento(userUid){
	var status = "";
	
	// Lista os dados do estabelecimento
	firebase.database().ref('/estabelecimento/'+userUid).once('value').then(function(snapshot){
		var PostObject = snapshot.val(); // recupera a chave com os dados
		var keys = Object.keys(PostObject);
		keys.reverse(); // Ordem decrescente
								
		if(keys.length != 0){
			for(var i = 0; i < keys.length; i++){ // Separa as chave
				var currentObject = PostObject[keys[i]]; // Separa os objetos
				
				// Elementos
				var table = document.createElement("table");
				var thead = document.createElement("thead");
				var trTitulo = document.createElement("tr");
				var thNome = document.createElement("th");
				var thStatus = document.createElement("th");
				var thExcluir = document.createElement("th");
				var tbody = document.createElement("tbody");
					
				// Propriedades dos elementos
				$(table).addClass("mdl-js-data-table mdl-shadow--2dp tableListar");
				$(thNome).addClass("mdl-data-table__cell--non-numeric thNomeCatListar tdLeft");
				$(thNome).html("<b>" + currentObject.nome + "</b>");
				$(thStatus).html("<b> STATUS </b>");
				$(thExcluir).addClass("tdRight");
				$(thExcluir).html("<b> EXCLUIR </b>");
						
				// Adiciona os elementos
				$(table).append(thead);
				$(thead).append(trTitulo);
				$(trTitulo).append(thNome);
				$(trTitulo).append(thStatus);
				$(trTitulo).append(thExcluir);
										
				// Elementos
				var trUser = document.createElement("tr");
				var tdNome = document.createElement("td");
				var tdStatus = document.createElement("td");
				var tdExcluir = document.createElement("td");
															
				// Propriedades dos elementos
				$(tdNome).addClass("mdl-data-table__cell--non-numeric tdLeft");
				$(tdNome).html("<b> Status: " + currentObject.status 
								+ "</b> <br> <b> Categoria: </b>" + currentObject.categoria 
								+ "<br> <b> Email: </b>" + currentObject.email 
								+ "<br> <b> Email do Usuário: </b>" + currentObject.emailUser 
								+ "<br> <b> Telefone: </b>" + currentObject.telefone 
								+ "<br> <b> Whatsapp: </b>" + currentObject.whatsapp 
								+ "<br> <b> Horário: </b>" + currentObject.horario 
								+ "<br> <b> Cidade: </b>" + currentObject.cidade 
								+ "<br> <b> CEP: </b>" + currentObject.cep 
								+ "<br> <b> Bairro: </b>" + currentObject.bairro 
								+ "<br> <b> Endereço: </b>" + currentObject.endereco);
				$(tdStatus).html("<label class='switch'> <input type='checkbox' id='cbStatus"+userUid+"' value="+userUid+"?"+keys[i]+"?"+currentObject.status+" onClick='statusDados(this.value)'> <span class='slider round'></span> </label>");
				$(tdExcluir).addClass("tdRight");
				$(tdExcluir).html("<button id='btnExcluirListar' value="+userUid+" class='mdl-button mdl-js-button mdl-button--raised mdl-button--colored mdl-js-ripple-effect' onClick='excluirDados(this.value)'> <i class='material-icons'>delete</i></button>");
													
				// Adiciona os elementos
				$(table).append(tbody);
				$(tbody).append(trUser);
				$(trUser).append(tdNome);
				$(trUser).append(tdStatus);
				$(trUser).append(tdExcluir);
				
				var status = currentObject.status;
										
			}
									
		}
		
		// Adciona a tabela na <div>						
		$("#conteudoListar").append(table);
		$("#conteudoListar").append("<hr />");
		
		// Ativa e desativa o cbStatus
		var cbStatus = document.getElementById("cbStatus"+userUid);
		if (status == "Liberado"){
			cbStatus.checked = true;
		}else{
			cbStatus.checked = false;
		}
								
	});	
	
}

// Ação do botão STATUS aba LISTAR
function statusDados(value){ // Value ID do Usuário
	var checkboxValueSeparado = value.split("?"); // [0]Usuario ID, [1]Estabelecimento ID, [2]Status.
	
	var cbStatus = document.getElementById("cbStatus"+checkboxValueSeparado[0]);
	
	if (confirmar("Alterar")){
		var checkboxStatus = checkboxValueSeparado[2];
		
		if(checkboxStatus == "Liberado"){
			checkboxStatus = "Bloqueado";
		}else{
			checkboxStatus = "Liberado";
		}
		
		// Recupera os dados do estabelecimento
		var id_estab = "";
		var categoria = "";
		var nome = "";
		var telefone = "";
		var whatsapp = "";
		var horario = "";
		var email = "";
		var emailUser = "";
		var cidade = "";
		var cep = "";
		var bairro = "";
		var endereco = "";
		var descricao = "";
		firebase.database().ref('/estabelecimento/'+checkboxValueSeparado[0]+'/'+checkboxValueSeparado[1]).once('value').then(function(snapshot){
			id_estab = snapshot.val().id_estab;
			categoria = snapshot.val().categoria;
			nome = snapshot.val().nome;
			telefone = snapshot.val().telefone;
			whatsapp = snapshot.val().whatsapp;
			horario = snapshot.val().horario;
			email = snapshot.val().email;
			horario = snapshot.val().horario;
			email = snapshot.val().email;
			emailUser = snapshot.val().emailUser;
			cidade = snapshot.val().cidade;
			cep = snapshot.val().cep;
			bairro = snapshot.val().bairro;
			endereco = snapshot.val().endereco;
			descricao = snapshot.val().descricao;
			
			// Atualiza o campo status do estabelecimento
			var postData = {
				id_estab: id_estab,
				categoria: categoria,
				nome: nome,
				telefone: telefone,
				whatsapp: whatsapp,
				horario: horario,
				email: email,
				horario: horario,
				email: email,
				emailUser: emailUser,
				cidade: cidade,
				cep: cep,
				bairro: bairro,
				endereco: endereco,
				descricao: descricao,
				status: checkboxStatus
			};
			  
			var updates = {};
			updates['/estabelecimento/'+checkboxValueSeparado[0]+'/'+checkboxValueSeparado[1]] = postData;
			
			firebase.database().ref().update(updates);
			
			alert("Operação Realizada com Sucesso!");
			window.location.href = "estabelecimento.html";
			
		});
		
	}else{
		// Botão cancelar
		if(checkboxValueSeparado[2] == "Liberado"){
			cbStatus.checked = true;
		}else{
			cbStatus.checked = false;
		}
	}
	
}

// Ação do botão EXCLUIR aba LISTAR
function excluirDados(value){ // Value ID do Usuário
	
	if (confirmar("Excluir")){
		
		// Exclui os Dados
		firebase.database().ref().child('estabelecimento').child(value).remove();
		firebase.database().ref().child('produto').child(value).remove();
				
		// Exclui a Imagem
		var storage = firebase.storage();
		var storageRef = storage.ref('estabelecimento/'+value);
		
		storageRef.delete().then(function() {
		  // Removeu a imagem
		  alert("Operação Realizada com Sucesso!");
		  window.location.href = "estabelecimento.html";
		  		  
		}).catch(function(error) {
		  // O estabelecimento não tem imagem
		  alert("Operação Realizada com Sucesso!");
		  window.location.href = "estabelecimento.html";
		  
		});		
		
	}else{
		// botão cancelar
	}	

}