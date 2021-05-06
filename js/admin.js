(function(){
	// Initialize Firebase
	var firebaseConfig = {		
		// Configuração do Firebase		
	};
	firebase.initializeApp(firebaseConfig);
  	
	//atualizarCartoes();
}());

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
	
	if (userEmail=="snackdelivery.ti@gmail.com") {
		// Administrador iniciou a sessão.
		$(".login-cover").hide();
		
		var dialog = document.querySelector('#loginDialog');
		if (! dialog.showModal) {
		  dialogPolyfill.registerDialog(dialog);
		}
		dialog.close();
		atualizarCartoes();
		
	} else {
		// Administrador não logado.
		$(".login-cover").show();
		
		var dialog = document.querySelector('#loginDialog');
		if (! dialog.showModal) {
		  dialogPolyfill.registerDialog(dialog);
		}
		dialog.showModal();
		
	}
});


function confirmar(acao){
	var confirmar = confirm("Tem Certeza que Deseja " + acao + "?");
	
	if (confirmar==true){
		return true;
	}
	else{
		return false;
	}
}

// Usuário login
$("#btnLogin").click(
	function(){
		var email = $("#loginEmail").val();
		var senha = $("#loginSenha").val();
		
		if(email != "" && senha != ""){
			if(email == "snackdelivery.ti@gmail.com"){
				$("#loginProgresso").show();
				$("#btnLogin").hide();
				
				firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(erro){
					$("#paragrafoErro").show().text("Email ou senha inválida.");
					$("#loginProgresso").hide();
					$("#btnLogin").show();
				});
			
			}else{
				$("#paragrafoErro").show().text("Digite o email do administrador.");	
			}
			
		}else{
			$("#paragrafoErro").show().text("Preencha todos os campos.");
		}
	}
);

function logoff(){
	if(confirmar("Sair")){
		firebase.auth().signOut().then(function(){
			// Sign-out com sucesso
			$("#loginProgresso").hide();
			$("#btnLogin").show();
			
			// Apaga os campos email e senha
			$("#loginEmail").val("");
			$("#loginSenha").val("");
			
		}, function(error) {
			alert(erro.message);
		});
		
		window.location.href = "index.html";
	}
}

/* ÚLTIMAS POSTAGEM */

function atualizarCartoes(){
	lastRegistro();
	lastNovidade();
	lastEvento();
}

//Registro
function lastRegistro(){
	var novidadeRef = firebase.database().ref().child("registro").limitToLast(1);
	novidadeRef.on("child_added", function(snap) {
		$('.rowRegistro').remove();
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowRegistro");
		$("#conteudoRegistro").append(currentRow);
		
		$(currentRow).append(snap.child("assunto").val());
		$(currentRow).append("<br/>");
		$(currentRow).append(snap.child("data").val());
		
		qtdRegistro();
		
	});
}

function qtdRegistro(){
	firebase.database().ref('/registro/').once('value').then(function(snapshot){
		$('.rowRegistroCount').remove();
		
		var PostObject = snapshot.val();
		var keys = Object.keys(PostObject);
		var qtdLista = keys.length;
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowRegistroCount material-icons mdl-badge mdl-badge--overlap");
		$(currentRow).attr("data-badge", qtdLista);
		$("#countRegistro").append(currentRow);
		
		$(currentRow).append("record_voice_over");
	});
}

//Novidades
function lastNovidade(){
	var novidadeRef = firebase.database().ref().child("novidades").limitToLast(1);
	novidadeRef.on("child_added", function(snap) {
		$('.rowNovidade').remove();
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowNovidade");
		$("#conteudoNovidade").append(currentRow);
		
		$(currentRow).append(snap.child("titulo").val());
		$(currentRow).append("<br/>");
		$(currentRow).append(snap.child("data").val());
		
		qtdNovidade();
		
	});
}

function qtdNovidade(){
	firebase.database().ref('/novidades/').once('value').then(function(snapshot){
		$('.rowNovidadeCount').remove();
		
		var PostObject = snapshot.val();
		var keys = Object.keys(PostObject);
		var qtdLista = keys.length;
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowNovidadeCount material-icons mdl-badge mdl-badge--overlap");
		$(currentRow).attr("data-badge", qtdLista);
		$("#countNovidade").append(currentRow);
		
		$(currentRow).append("sync");
	});
}

//Eventos
function lastEvento(){
	var novidadeRef = firebase.database().ref().child("eventos").limitToLast(1);
	novidadeRef.on("child_added", function(snap) {
		$('.rowEvento').remove();
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowEvento");
		$("#conteudoEvento").append(currentRow);
		
		$(currentRow).append(snap.child("titulo").val());
		$(currentRow).append("<br/>");
		$(currentRow).append(snap.child("data").val());
		
		qtdEvento();
		
	});
}

function qtdEvento(){
	firebase.database().ref('/eventos/').once('value').then(function(snapshot){
		$('.rowEventoCount').remove();
		
		var PostObject = snapshot.val();
		var keys = Object.keys(PostObject);
		var qtdLista = keys.length;
		
		currentRow = document.createElement("div");
		$(currentRow).addClass("rowEventoCount material-icons mdl-badge mdl-badge--overlap");
		$(currentRow).attr("data-badge", qtdLista);
		$("#countEvento").append(currentRow);
		
		$(currentRow).append("place");
	});
}