function jogo() {
	
	var setas;
	var teclaTiro;
	var tiros;
	var personagem;
	var barradevidas;
	var horaParaDispararTiro;
	var horaParaOProximoTiro;
	var horaParaProximoInimigo;
	var plataformas;
	var inimigos;
	var texto;
	var somfundo;
	var somexplosao;
	var somtiro;
	
	this.preload = function () {
		
		// Carrega imagem dos tiros (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo).
		game.load.image("tiro", "lanca.png");
		game.load.image("fundojogo", "fundojogo.jpg");
		game.load.image("piso", "piso.png");
		
		// Carrega a imagem de um sprite (o primeiro parâmetro é como
		// nós iremos chamar a imagem no nosso jogo, e os dois últimos
		// são a largura e a altura de cada quadro na imagem, em pixels).
		//
		// Para entender mehor, convém abrir a imagem em uma aba nova:
		// http://tech-espm.github.io/labs-editor/phaser/game/examples/assets/personagem.png
		game.load.spritesheet("personagem", "personagem.png", 50, 64);
		game.load.spritesheet("barradevidas", "barradevidas.png", 250, 47);
		game.load.spritesheet("explosao", "explosao.png", 108, 108);
		game.load.spritesheet("inimigozeus1", "inimigozeus1.png", 80, 90);
		game.load.spritesheet("inimigozeus2", "inimigozeus2.png", 80, 90);
		game.load.spritesheet("inimigozeus3", "inimigozeus3.png", 80, 90);
		game.load.spritesheet("inimigozeus4", "inimigozeus4.png", 80, 90);
		
		game.load.audio("somfundo", "fundo.mp3");
		game.load.audio("somexplosao", "explosao.mp3");
		game.load.audio("somtiro", "tiro.mp3");
	};
	
	this.create = function () {
		
		somfundo = game.add.audio("somfundo");
		somfundo.loop = true;
		somfundo.volume = 0.75;
		somfundo.play();
		
		somtiro = game.add.audio("somtiro");
		somtiro.volume = 0.3;
		
		somexplosao = game.add.audio("somexplosao");
		somexplosao.volume = 0.15;

		game.add.image(0, 0, "fundojogo");
		
		plataformas = game.add.physicsGroup();
		plataformas.create(0, 540, "piso");
		plataformas.create(120, 540, "piso");
		plataformas.create(240, 540, "piso");
		plataformas.create(360, 540, "piso");
		plataformas.create(480, 540, "piso");
		plataformas.create(600, 540, "piso");
		plataformas.create(720, 540, "piso");
		// As plataformas não devem se mover quando forem acertadas
		// pelo jogador, diferente de uma bola de bilhar, que
		// deve ser movida quando for acertada por outra bola.
		plataformas.setAll("body.immovable", true);
		
		barradevidas = game.add.sprite(0, 0, "barradevidas");
		barradevidas.frame = 5;	
		
		
		var estilo = {
			font: "normal 16px 'Press Start 2P'",
			fill: "#ffffff"
		};
		// Adiciona um texto na coordenada (0, 0) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		texto = game.add.text(20, 0, "Gods defeated: 0", estilo);

		pontuacao = 0;
		
		
		// Cria um objeto para tratar as teclas direcionais
		// do teclado (cima, baixo, esquerda, direita).
		//
		// Mais atributos e métodos de entrada (game.input.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Input.html
		//
		// Mais atributos e métodos do teclado (game.input.keyboard.xxx):
		// http://phaser.io/docs/2.6.2/Phaser.Keyboard.html
		setas = game.input.keyboard.createCursorKeys();
		
		// Atribui uma função para ser executada quando a
		// seta para cima for pressionada.
		//
		// Mais atributos e métodos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		setas.up.onDown.add(pular);
		
		// Cria um objeto para tratar a barra de espaços, mas
		// *não* atribui uma função para ser executada quando a
		// tecla for pressionada.
		//
		// Mais teclas disponíveis:
		// https://phaser.io/docs/2.6.2/Phaser.KeyCode.html
		//
		// Mais atributos e métodos das teclas (tecla.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Key.html
		teclaTiro = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);

		inimigos = game.add.physicsGroup();
		
		// Vamos deixar 40 inimigos já criados. Esse valor será
		// a quantidade máxima de inimigos na tela em um dado
		// momento.
		for (var i = 0; i < 40; i++) {
			var resto = i % 4;
			var inimigo;
			if (resto == 0) {
				inimigo = inimigos.create(0, 0, "inimigozeus1");
			} else if (resto == 1) {
				inimigo = inimigos.create(0, 0, "inimigozeus2");
			} else if (resto == 2) {
				inimigo = inimigos.create(0, 0, "inimigozeus3");
			} else {
				inimigo = inimigos.create(0, 0, "inimigozeus4");
			}
			
			inimigo.animations.add("andando", [0, 1, 2, 3, 4, 5, 6, 7], 16, true);
			
			inimigo.exists = false;
			inimigo.visible = false;
			// Assim como com o personagem, vamos definir a âncora
			// dos tiros para facilitar.
			inimigo.anchor.x = 0.5;
			inimigo.anchor.y = 0.5;
			//tiro.checkWorldBounds = true;
			//tiro.events.onOutOfBounds.add(destruirTiro);
		}

		
		// Adiciona o sprite na coordenada (20, 100) da tela,
		// lembrando que (0, 0) está no canto superior esquerdo!
		//
		// Diferença entre sprites e imagens no Phaser 2: imagens
		// não podem ter animação nem física!
		//
		// Como iremos trabalhar com o sprite depois, precisamos
		// armazenar em uma variável.
		personagem = game.add.sprite(30, 540, "personagem");
		
		// Habilita o motor de física tradicional.
		game.physics.arcade.enable(personagem);
		
		// Cria três animações chamadas "esquerda", "parado" e "direita"
		// para o sprite, com seus respectivos quadros, a uma velocidade
		// de 8 quadros por segundo, repetindo para sempre.
		personagem.animations.add("parado", [0], 8, true);
		personagem.animations.add("andando", [0, 1, 2, 3], 8, true);
		personagem.animations.add("atirando", [4, 5, 0], 16, false);
		// Inicia a animação "parado".
		personagem.animations.play("parado");
		
		// Previne que o sprite saia da tela.
		personagem.body.collideWorldBounds = true;
		// Configura a gravidade (em pixels/s²) aplicada ao sprite,
		// lembrando que valores positivos apontam para baixo!
		//personagem.body.gravity.y = 500;
		// Configura o fator de rebatimento do sprite, definido
		// como o percentual da velocidade que ele terá quando
		// colidir com algum obstáculo.
		personagem.body.bounce.x = 0.5;
		personagem.body.bounce.y = 0.5;
		// Configura a velocidade máxima do sprite,
		// porque agora iremos trabalhar com a aceleração do
		// sprite, sem alterar sua velocidade diretamente.
		personagem.body.maxVelocity.x = 500;
		personagem.body.maxVelocity.y = 1500;
		// Configura o arrasto/desaceleração do sprite.
		personagem.body.drag.x = 3000;
		personagem.body.drag.y = 4000;
		// É comum assumir que as coordenadas x e y de um personagem
		// se refiram ao ponto inferior/central em jogos de plataforma,
		// o que pode facilitar os cálculos em alguns momentos.
		personagem.anchor.x = 0.5;
		personagem.anchor.y = 1;
		
		// Outros atributos comuns de body:
		// personagem.body.velocity.x (em pixels/s)
		// personagem.body.velocity.y (em pixels/s)
		// personagem.body.acceleration.x (em pixels/s²)
		// personagem.body.acceleration.y (em pixels/s²)
		// personagem.body.drag.y (arrasto/desaceleração em pixels/s²)
		// personagem.body.maxVelocity.y (em pixels/s)
		//
		// Mais atributos e métodos de body (personagem.body.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Physics.Arcade.Body.html
		//
		// Mais informações relacionados à física de arcade:
		// https://phaser.io/docs/2.6.2/index#arcadephysics
		
		// O Phaser 2 possui o conceito de grupo de objetos, que
		// são objetos com comportamentos e significados similares.
		// Os grupos são utilizados para facilitar a execução de
		// tarefas repetidas sobre vários objetos diferentes, mas
		// que possuem mesma funcionalidade no jogo.
		//
		// Mais atributos e métodos dos grupos (tiros.xxx):
		// https://phaser.io/docs/2.6.2/Phaser.Group.html
		//
		// Como todos os objetos do grupo devem ter física,
		// usamos game.add.physicsGroup() em vez de game.add.group().
		// https://phaser.io/docs/2.6.2/Phaser.GameObjectFactory.html#physicsGroup
		tiros = game.add.physicsGroup();
		
		// Vamos deixar 5 tiros já criados. Esse valor será
		// a quantidade máxima de tiros na tela em um dado
		// momento.
		for (var i = 0; i < 25; i++) {
			// Cria um novo tiro na coordenada (0, 0) da tela,
			// o que não importa, porque o tiro não aparecerá
			// ainda, nem terá a física processada (exists = false
			// e visible = false).
			var tiro = tiros.create(0, 0, "tiro");
			tiro.exists = false;
			tiro.visible = false;
			// Assim como com o personagem, vamos definir a âncora
			// dos tiros para facilitar.
			tiro.anchor.x = 0;
			tiro.anchor.y = 0.5;
			// Quando o tiro sair da tela ele deve ser destruído.
			// Caso contrário, ele ficaria ativo para sempre, mesmo
			// não estando mais visível!
			tiro.checkWorldBounds = true;
			tiro.events.onOutOfBounds.add(destruirTiro);
		}
		
		horaParaDispararTiro = 0;
		horaParaOProximoTiro = game.time.now;
		horaParaProximoInimigo = game.time.now + 5000;
		
		fadeIn();
		
	};
	
	this.update = function () {
		
		game.physics.arcade.collide(personagem, plataformas);
		
		// Controle de movimentos simples. Se a seta esquerda estiver
		// pressionada, aplica uma aceleração negativa (esquerda) ao
		// o sprite. Se a seta direita estiver pressionada, aplica uma
		// aceleração positiva (direita) ao sprite. Se nenhuma tecla
		// estiver pressionada, remove a aceleração do sprite, deixando
		// que o arrasto/desaceleração (drag) pare o sprite.
		//
		// Além disso, define a animação correta do sprite dependendo
		// da seta que estiver pressionada.
		if (setas.up.isDown) {
			personagem.body.acceleration.y = -3500;
		} else {
			if (setas.down.isDown) {
				personagem.body.acceleration.y = 3500;
			} else {
				personagem.body.acceleration.y = 0;
			}
		}

		if (setas.left.isDown) {
			// Muda ultimaDirecao para indicar que o personagem deverá
			// continuar atirando para a esquerda, mesmo se ficar parado
			// no futuro.
			personagem.body.acceleration.x = -3000;
			if (!horaParaDispararTiro) {
				personagem.animations.play("andando");
			}
		} else {
			if (setas.right.isDown) {
				// Muda ultimaDirecao para indicar que o personagem deverá
				// continuar atirando para a direita, mesmo se ficar parado
				// no futuro.
				personagem.body.acceleration.x = 3000;
				if (!horaParaDispararTiro) {
					personagem.animations.play("andando");
				}
			} else {
				// Não vamos alterar o valor de ultimaDirecao aqui, para
				// que o personagem continue atirando na direção para onde
				// ele estava andando anteriormente.
				personagem.body.acceleration.x = 0;
				if (!horaParaDispararTiro) {
					personagem.animations.play("parado");
				}
			}
		}
		
		// Poderíamos também alterar a animação do sprite não apenas com
		// base no teclado, mas com base em sua velocidade, ou uma combinação
		// de ambos! :)
		
		var agora = game.time.now;
		
		// Neste exemplo, o tiro será executada sempre que a tecla
		// estiver pressionada, mas apenas se já tiver passado o
		// intervalo de tempo desejado. No nosso caso, um novo tiro
		// deve ser liberado a cada 100 milissegundos.
		if (teclaTiro.isDown && agora > horaParaOProximoTiro) {
			// Nós criamos 5 tiros, assim, só poderão existir no
			// máximo 5 tiros na tela, em qualquer momento!
			var tiro = tiros.getFirstExists(false);
			
			if (tiro) {
				personagem.animations.play("atirando");
				horaParaDispararTiro = agora + 160;
				horaParaOProximoTiro = agora + 220;
			}
		}
		
		if (horaParaDispararTiro && agora > horaParaDispararTiro && barradevidas.frame > 0) {
			horaParaDispararTiro = 0;
			
			var tiro = tiros.getFirstExists(false);
			
			if (tiro) {
				somtiro.play();
				// Caso exista ao menos um tiro disponível,
				// devemos posicionar o sprite do tiro na
				// posicão correta, com a velocidade correta.
				tiro.reset(personagem.x, personagem.y - 20);
				
				// Se ultimaDirecao for 1, o tiro irá para a
				// direita, mas se for -1, irá para a esquerda.
				tiro.body.velocity.x = 500;
			}
		}
		
		if (agora > horaParaProximoInimigo) {
			criarInimigo();
		}
		
		inimigos.forEachAlive(verificarPosicaoInimigo);
		
		game.physics.arcade.overlap(tiros, inimigos, tiroAcertouInimigo);
		
	};
	
	function destruirTiro(tiro) {
		
		// Quando o tiro sair da tela ele deve ser destruído.
		// Caso contrário, ele ficaria ativo para sempre, mesmo
		// não estando mais visível!
		tiro.kill();
		
	}
		
	function tiroAcertouInimigo(tiro, inimigo) {
		
		somexplosao.play();
		
		var explosao = game.add.sprite(inimigo.x, inimigo.y, "explosao");
		explosao.anchor.x = 0.5;
		explosao.anchor.y = 0.5;
		var animacao = explosao.animations.add("explodir", [0, 1, 2, 3, 4, 5], 8, false);
		explosao.animations.play("explodir");
		animacao.onComplete.add(destruirExplosao);
		
		tiro.kill();
		inimigo.kill();
		
		pontuacao = pontuacao + 1;
		texto.setText("Gods defeated: " + pontuacao);
		
	}
	
	function destruirExplosao(explosao) {
		
		explosao.kill();
		
	}
	
	function pular() {
		
		if (barradevidas.frame > 0) {
			
			// Pular significa aplicar a um sprite uma velocidade para cima
			// (negativa). Contudo, só podemos deixar que o jogador pule se
			// o sprite estiver sobre o chão. Se bem que... alguns jogos
			// deixam que o jogador pule mesmo no ar... ;)
			if (personagem.body.onFloor() || personagem.body.touching.down) {
				personagem.body.velocity.y = -700;
			}
			
		}
		
	}
	
	function verificarPosicaoInimigo(inimigo) {
		if (inimigo.x < -100) {
			
			if (barradevidas.frame >= 1) {
				barradevidas.frame = barradevidas.frame - 1;
				
				if (barradevidas.frame <= 0) {
					fadeOut(irParaGameOver);
				}
			}
			
			inimigo.kill();
		}
	}

	function irParaGameOver() {
		somfundo.stop();
		game.state.start("gameover");
	}
	
	function criarInimigo() {
		
		var inimigosDisponiveis = inimigos.getAll("exists", false);
		
		if (inimigosDisponiveis && inimigosDisponiveis.length) {
			var inimigo = inimigosDisponiveis[(Math.random() * inimigosDisponiveis.length) | 0];
			
			inimigo.reset(800, 100 + (Math.random() * 400), 0);
			inimigo.body.velocity.x = -550;
			inimigo.animations.play("andando");
			
			horaParaProximoInimigo = game.time.now + 100 + (Math.random() * 1400);
		}
		
	}
	
}
