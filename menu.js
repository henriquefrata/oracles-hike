var telas = ["menu", "jogo", "gameover"];
var larguraJogo = 800;
var alturaJogo = 600;
var pontuacao;

function menu() {
	
	var botao;
	
	this.preload = function () {
		
		// Define a cor do fundo para azul claro.
		game.stage.backgroundColor = "#000000";
		game.load.image("menu", "menu.png");
		game.load.image("play", "play.png");
		
	};
	
	this.create = function () {
		
		game.add.image(0, 0, "menu");
		
		// Adiciona a imagem na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Como iremos trabalhar com a imagem depois, precisamos
		// armazenar em uma variável.
		botao = game.add.image(304, 400, "play");
		
		// Habilita que a imagem seja clicada.
		botao.inputEnabled = true;
		// Altera o cursor do mouse quando ele estiver sobre
		// a imagem.
		botao.input.useHandCursor = true;
		// Diz qual função deve ser executada quando a imagem
		// for clicada.
		botao.events.onInputDown.add(botaoFoiClicado);
		
		// Faz o fade de entrada (de preto para transparente).
		// Deve ser a última linha do create() para garantir
		// que cubra todos os outros elementos.
		fadeIn();
		
	};
	
	this.update = function () {
		
	};
	
	function botaoFoiClicado() {
		
		// Em vez de simplesmente iniciar a tela, como
		// estamos utilizando fade, devemos esperar o
		// fade acabar para começar a outra tela!
		fadeOut(fadeOutAcabou);
		
	}
	
	function fadeOutAcabou() {
		
		// Apenas inicia a primeira tela do jogo.
		game.state.start("jogo");
		
	}
	
}
