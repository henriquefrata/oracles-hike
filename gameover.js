function gameover() {
	
	var restart;
	
	this.preload = function () {
		game.load.image("teladegameover", "teladegameover.png");
		game.load.image("restart", "tryagain.png");
	};
	
	this.create = function () {
		game.add.image(0 , 0, "teladegameover");
			
		var estilo = {
			font: "normal 16px 'Press Start 2P'",
			fill: "#ffffff"
		};
		// Adiciona um texto na coordenada (0, 0) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		texto = game.add.text(280, 45, "Gods defeated: " + pontuacao, estilo);	
			
		// Adiciona a imagem na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com a imagem depois, precisamos
		// armazenar em uma variável.
		restart = game.add.image(200, 400, "restart");
		
		// Habilita que a imagem seja clicada.
		restart.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// a imagem.
		restart.input.useHandCursor = true;
		// Diz qual função deve ser executada quando a imagem
		// for clicada.
		restart.events.onInputDown.add(restartFoiClicado);
		
		// Faz o fade de entrada (de preto para transparente).
		// Deve ser a última linha do create() para garantir
		// que cubra todos os outros elementos.
		fadeIn();
		
	};
	
	this.update = function () {
		
	};
	
	function restartFoiClicado() {
		
		// Em vez de simplesmente iniciar a tela, como
		// estamos utilizando fade, devemos esperar o
		// fade acabar para começar a outra tela!
		fadeOut(fadeOutAcabou);
		
	}
	
	function fadeOutAcabou() {
		
		// Apenas inicia a primeira tela do jogo.
		game.state.start("menu");
		
		
	
}
}