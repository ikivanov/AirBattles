define(["framework/utils"], function(Utils) {
	class Game {
		constructor(config) {
			let that = this;

			that.canvas = config.canvas;
			that.context = that.canvas.getContext("2d");
			that.width = that.canvas.width;
			that.height = that.canvas.height;

			document.addEventListener("keydown", that._onKeyDown.bind(that));
			document.addEventListener("keyup", that._onKeyUp.bind(that));
		}

		init() {
			let that = this,
				splashScreen = that.getSplashScreen();

			that.lastFrameTime = Date.now();
			that.sprites = [];

			that.isPaused = false;
			that.isGameOver = false;

			that.level = 1;
			that.scores = 0;

			that.keyboard = { keys : { } };

			if (splashScreen) {
				that.splashScreen = splashScreen;
				that.addChild(that.splashScreen);
			} else {
				that.loadSprites();
			}

			that.gameOverLabel = that.getGameOverLabel();
			that.addChild(that.gameOverLabel);

			that.pauseLabel = that.getPauseLabel();
			that.addChild(that.pauseLabel);
		}

		getSplashScreen() {
			return null;
		}

		loadSprites() {
		}

		getGameOverLabel() {
			return null;
		}

		getPauseLabel() {
			return null;
		}

		run() {
			let that = this,
				now = Date.now(),
				lastFrameEllapsedTime = (now - that.lastFrameTime) / 1000.0;

			if (that.isGameOver) {
				that.gameOverLabel.render();
				return;
			}

			if (that.isPaused) {
				that.pauseLabel.render();
				return;
			}

			that.update(lastFrameEllapsedTime, that.keyboard);
			that.render();

			that.createdOn = Date.now();
			that.lastFrameTime = Date.now();

			requestAnimationFrame(that.run.bind(that));
		}

		start() {
			let that = this;

			if (!that.isGameOver && !that.isPaused) {
				return;
			}

			if (that.isGameOver) {
				that.init();
			}

			that.isGameOver = that.isPaused = false;

			that.gameOverLabel.isVisible = false;
			that.pauseLabel.isVisible = false;

			that.lastFrameTime = Date.now();

			that.run();
		}

		pause() {
			let that = this;

			that.pauseLabel.isVisible = true;
			that.isPaused = true;
		}

		gameOver() {
			let that = this;

			that.currentLevel = null;
			that.gameOverLabel.isVisible = true;
			that.isGameOver = true;
		}

		detectCollisions() {
			let that = this;

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];

				if (sprite.isNonPlayable) {
					continue;
				}

				for (let j = 0; j < that.sprites.length; j++) {
					let sprite2 = that.sprites[j];

					if (sprite2.isNonPlayable || sprite2 === sprite) {
						continue;
					}

					let hasCollision = Utils.hasRectangularCollision(sprite.getRect(), sprite2.getRect());
					if (hasCollision) {
						sprite.onCollidedWith(sprite2);
						sprite2.onCollidedWith(sprite);
						that.onCollisionDetected(sprite, sprite2);
					}
				}
			}
		}

		isLevelCompleted() {
			return false;
		}

		cleanUpLevel() {
		}

		loadLevel() {
		}

		onLevelCompleted() {
		}

		checkGameOver() {
			return false;
		}

		onCollisionDetected(sprite1, sprite2) {
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];
				sprite.update(lastFrameEllapsedTime, keyboard);
			}

			that.onAfterUpdate(lastFrameEllapsedTime);

			that.detectCollisions();

			if (that.currentLevel) {
				if (that.checkGameOver()) {
					that.gameOver();
					return;
				}

				if (that.isLevelCompleted()) {
					that.onLevelCompleted();
				}
			}
		}

		onAfterUpdate(lastFrameEllapsedTime) {
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.clearRect(0, 0, that.canvas.width, that.canvas.height);

			for (let i = 0; i < that.sprites.length; i++) {
				let sprite = that.sprites[i];

				if (!sprite.isVisible) {
					continue;
				}

				that.sprites[i].render();
			}
		}

		addChild(sprite) {
			if (!sprite) {
				return;
			}

			let that = this;

			that.sprites.push(sprite);
			sprite.context = that.context;
			sprite.game = that;

			that.sprites.sort((a, b) => a.zIndex - b.zIndex);
		}

		addChildren(sprites) {
			if (!sprites || !sprites.length) {
				return;
			}

			let that = this;

			for (let i = 0; i < sprites.length; i++) {
				that.addChild(sprites[i]);
			}
		}

		removeChild(sprite) {
			if (!sprite) {
				return;
			}

			let that = this,
				index = that.sprites.indexOf(sprite);

			if (index !== -1) {
				that.sprites.splice(index, 1);
			}
		}

		_onKeyDown(e) {
			let that = this,
				code = e.code;

			if (code === "KeyS") {
				that.start();
			}

			if (code === "KeyP") {
				that.pause();
			}

			if (that.isGameOver || that.isPaused) {
				return;
			}

			that.keyboard.keys[code] = true;
		}

		_onKeyUp(e) {
			let that = this,
				code = e.code;

			that.keyboard.keys[code] = false;
		}
	}

	return Game;
});