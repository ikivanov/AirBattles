define(["framework/utils"], function(Utils) {
	class Game {
		constructor(config) {
			this.canvas = config.canvas;
			this.context = this.canvas.getContext("2d");
			this.width = this.canvas.width;
			this.height = this.canvas.height;

			document.addEventListener("keydown", this._onKeyDown.bind(this));
			document.addEventListener("keyup", this._onKeyUp.bind(this));
		}

		init() {
			let splashScreen = this.getSplashScreen();

			this.lastFrameTime = Date.now();
			this.sprites = [];

			this.isPaused = false;
			this.isGameOver = false;

			this.level = 1;
			this.scores = 0;

			this.keyboard = { keys : { } };

			if (splashScreen) {
				this.splashScreen = splashScreen;
				this.addChild(this.splashScreen);
			}

			this.gameOverLabel = this.getGameOverLabel();
			this.addChild(this.gameOverLabel);

			this.pauseLabel = this.getPauseLabel();
			this.addChild(this.pauseLabel);
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
			let now = Date.now(),
				lastFrameEllapsedTime = (now - this.lastFrameTime) / 1000.0;

			if (this.isGameOver) {
				this.gameOverLabel.render();
				return;
			}

			if (this.isPaused) {
				this.pauseLabel.render();
				return;
			}

			this.update(lastFrameEllapsedTime, this.keyboard);
			this.render();

			this.createdOn = Date.now();
			this.lastFrameTime = Date.now();

			requestAnimationFrame(this.run.bind(this));
		}

		start() {
			if (!this.isGameOver && !this.isPaused) {
				return;
			}

			if (this.isGameOver) {
				this.init();
			}

			this.isGameOver = this.isPaused = false;

			this.gameOverLabel.isVisible = false;
			this.pauseLabel.isVisible = false;

			this.lastFrameTime = Date.now();

			this.run();
		}

		pause() {
			this.pauseLabel.isVisible = true;
			this.isPaused = true;
		}

		gameOver() {
			this.currentLevel = null;
			this.gameOverLabel.isVisible = true;
			this.isGameOver = true;
		}

		detectCollisions() {
			for (let i = 0; i < this.sprites.length; i++) {
				let sprite = this.sprites[i];

				if (sprite.isNonPlayable) {
					continue;
				}

				for (let j = 0; j < this.sprites.length; j++) {
					let sprite2 = this.sprites[j];

					if (sprite2.isNonPlayable || sprite2 === sprite) {
						continue;
					}

					let hasCollision = Utils.hasRectangularCollision(sprite.getRect(), sprite2.getRect());
					if (hasCollision) {
						sprite.onCollidedWith(sprite2);
						sprite2.onCollidedWith(sprite);
						this.onCollisionDetected(sprite, sprite2);
					}
				}
			}
		}

		isLevelCompleted() {
			return false;
		}

		cleanUpLevel() {
		}

		onLevelCompleted() {
		}

		checkGameOver() {
			return false;
		}

		onCollisionDetected(sprite1, sprite2) {
		}

		update(lastFrameEllapsedTime, keyboard) {
			for (let i = 0; i < this.sprites.length; i++) {
				let sprite = this.sprites[i];
				sprite.update(lastFrameEllapsedTime, keyboard);
			}

			this.onAfterUpdate(lastFrameEllapsedTime);

			this.detectCollisions();

			if (this.currentLevel) {
				if (this.checkGameOver()) {
					this.gameOver();
					return;
				}

				if (this.isLevelCompleted()) {
					this.onLevelCompleted();
				}
			}
		}

		onAfterUpdate(lastFrameEllapsedTime) {
		}

		render() {
			let ctx = this.context;

			ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for (let i = 0; i < this.sprites.length; i++) {
				let sprite = this.sprites[i];

				if (!sprite.isVisible) {
					continue;
				}

				this.sprites[i].render();
			}
		}

		addChild(sprite) {
			if (!sprite) {
				return;
			}

			let shadow = sprite.shadow;

			this.sprites.push(sprite);
			sprite.context = this.context;
			sprite.game = this;

			if (shadow) {
				this.sprites.push(shadow);
				shadow.context = this.context;
				shadow.game = this;
			}

			this.sprites.sort((a, b) => a.zIndex - b.zIndex);
		}

		addChildren(sprites) {
			if (!sprites || !sprites.length) {
				return;
			}

			for (let i = 0; i < sprites.length; i++) {
				this.addChild(sprites[i]);
			}
		}

		removeChild(sprite) {
			if (!sprite) {
				return;
			}

			let index = this.sprites.indexOf(sprite),
				shadow = sprite.shadow;

			if (index !== -1) {
				this.sprites.splice(index, 1);
			}

			if (!shadow) {
				return;
			}

			index = this.sprites.indexOf(shadow);

			if (index !== -1) {
				this.sprites.splice(index, 1);
			}
		}

		_onKeyDown(e) {
			let code = e.code;

			if (code === "KeyS") {
				this.start();
			}

			if (code === "KeyP") {
				this.pause();
			}

			if (this.isGameOver || this.isPaused) {
				return;
			}

			this.keyboard.keys[code] = true;
		}

		_onKeyUp(e) {
			let code = e.code;

			this.keyboard.keys[code] = false;
		}
	}

	return Game;
});