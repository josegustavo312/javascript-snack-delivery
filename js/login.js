(function(){
	// Initialize Firebase
	var config = {
		// Configuração do Firebase
	};
	firebase.initializeApp(config);
  
}());

// Usuário sessão.
firebase.auth().onAuthStateChanged(function(user) {
	if (user) {
		// O usuário iniciou sessão.
		$(".login-cover").hide();
		
		var dialog = document.querySelector('#loginDialog');
		if (! dialog.showModal) {
		  dialogPolyfill.registerDialog(dialog);
		}
		dialog.close();
	} else {
		// Nenhum usuário iniciou sessão.
		$(".login-cover").show();
		
		var dialog = document.querySelector('#loginDialog');
		if (! dialog.showModal) {
		  dialogPolyfill.registerDialog(dialog);
		}
		dialog.showModal();
	}
});

// Usuário login.
$("#btnLogin").click(
	function(){
		var email = $("#loginEmail").val();
		var senha = $("#loginSenha").val();
		
		if(email != "" && senha != ""){
			$("#loginProgresso").show();
			$("#btnLogin").hide();
			
			firebase.auth().signInWithEmailAndPassword(email, senha).catch(function(erro){
				//$("#loginErro").show().text(erro.message);
				$("#loginErro").show().text("Usuario ou senha invalida.");
				$("#loginProgresso").hide();
				$("#btnLogin").show();
			});
			
		}
	}
);

// Logoff das outras páginas
function indexLogoff(){
	logoff();
	window.location.href = "index.html";
}

function logoff(){
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
}
