define(["framework/game", "sprites/splash-screen", "framework/label", "sprites/statistics", "framework/fps-counter", "levels", "sprites/missile", "sprites/player-damage-effect", "sprites/player-bomb-effect", "sprites/bomb-explosion", "consts", "framework/utils"],
	function(Game, SplashScreen, Label, Statistics, FPSCounter, LevelFactory, Missile, PlayerDamageEffect, PlayerBombEffect, BombExplosion, consts, utils) {
	const
		PLAYER_MISSILE_VELOCITY = -600,
		WIDTH = 600,
		HEIGHT = 600,
		MAX_LEVEL = 4,
		BOMB_RADIUS = 100;

	class AirBattles extends Game {
		static get Width() {
			return WIDTH;
		}

		static get Height() {
			return HEIGHT;
		}

		constructor(config) {
			super(config);

			this.init();
		}

		getSplashScreen() {
			return new SplashScreen();
		}

		loadSprites() {
			this.addChild(new Statistics({ x: 25, y: 25 }));
			this.addChild(new FPSCounter({ x: 545, y: 25, zIndex: 10 }));

			this.level = 1;
			this.levelDescriptorCreated = new Date();
			this.levelDescriptor = this.getLevelDescriptorLabel();
			this.addChild(this.levelDescriptor);
		}

		getLevelDescriptorLabel() {
			return new Label({
				text: `${this.currentLevel.name}. Loading...`,
				x: 0,
				y: 0,
				width: this.canvas.width,
				height: this.canvas.height,
				color: "yellow",
				size: 22,
				backgroundColor: "black"
			});
		}

		getGameOverLabel() {
			return new Label({ x: 200, y: 280,
														text: "Game Over! (Press S to try again)",
														isVisible: false,
														zIndex: 10000 });
		}

		getPauseLabel() {
			return new Label({ x: 220, y: 280,
														text: "Paused (Press S to resume)",
														isVisible: false,
														zIndex: 10000 });
		}

		cleanUpLevel() {
			this.sprites = this.sprites.filter(sprite => sprite.isNonPlayable === true);
		}

		_removeCompletedExplosions() {
			let explosionsCompleted = this.sprites.filter(sprite => sprite.__type === consts.SpriteType.Explosion && sprite.isCompleted);

			if (explosionsCompleted && explosionsCompleted.length > 0) {
				for (let i = 0; i < explosionsCompleted.length; i++) {
					this.removeChild(explosionsCompleted[i]);
				}
			}
		}

		onSplashScreenNeedsRemoval(splashScreen) {
			this.removeChild(splashScreen);

			this.currentLevel = LevelFactory.create(this.level, { game: this });

			this.loadSprites();
			this.start();
		}

		onAfterUpdate(lastFrameEllapsedTime) {
			let now = Date.now();

			this._removeCompletedExplosions();

			if (this.levelDescriptor && now - this.levelDescriptorCreated.getTime() > 2000) {
				this.removeChild(this.levelDescriptor);
				this.levelDescriptor = null;

				this.currentLevel.load();
			}

			if (!this.currentLevel || !this.player) {
				return;
			}

			this.currentLevel.loadMore();
		}

		onLevelCompleted() {
			if (this.level === MAX_LEVEL) {
				this.gameOver();
				return;
			}

			this.cleanUpLevel();
			this.level++;
			this.currentLevel = LevelFactory.create(this.level, { game: this });
			this.currentLevel.load();

			this.levelDescriptorCreated = new Date();
			this.levelDescriptor = this.getLevelDescriptorLabel();
			this.addChild(this.levelDescriptor);
		}

		onMissileLaunched(x, y) {
			this.addChild(new Missile({ x, y: y - 15, angle: 270, owner: this.player }));
		}

		onMissileOutOfScreen(missile) {
			this.removeChild(missile);
		}

		onFighterOutOfScreen(fighter) {
			this.removeChild(fighter);
		}

		onKamikazeOutOfScreen(kamikaze) {
			this.removeChild(kamikaze);
		}

		onPowerUpOutOfScreen(powerUp) {
			this.removeChild(powerUp);
		}

		onTurretOutOfScreen(turret) {
			this.removeChild(turret);
		}

		runPlayerDamageEffect() {
			this.addChild(new PlayerDamageEffect());
		}

		onPlayerBombEffectDone(effect) {
			this.removeChild(effect);
		}

		runPlayerBombEffect() {
			this.addChild(new PlayerBombEffect());
		}

		onPlayerDamageEffectDone(effect) {
			this.removeChild(effect);
		}

		onBombDropped() {
			let sprites = this.sprites.filter(sprite => sprite.__type === consts.SpriteType.Turret),
				exposionArea = {
					x: this.player.x + this.player.width / 2,
					y: this.player.y + this.player.height / 2,
					radius: BOMB_RADIUS
				};

			this.runPlayerBombEffect();
			this.addChild(new BombExplosion({
				x: this.player.x + this.player.width - this.player.width / 2,
				y: this.player.y + this.player.height - this.player.height / 2}));

			sprites.forEach(sprite => {
				let spriteRect = { x: sprite.x, y: sprite.y, width: sprite.width, height: sprite.height };
				if (utils.hasCircleRectangleCollision(exposionArea, spriteRect)) {
					sprite.destroy();
				}
			});
		}

		isLevelCompleted() {
			return false;

			let sprites = this.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
															sprite.__type === consts.SpriteType.DoubleWeaponInvader ||
															sprite.__type === consts.SpriteType.Missile ||
															sprite.__type === consts.SpriteType.Explosion);

			if (!sprites) {
				return true;
			}

			return false;
		}

		checkGameOver() {
			return false;

			let sprites = this.sprites.find(sprite => sprite.__type === consts.SpriteType.Explosion ||
					sprite.__type === consts.SpriteType.Player ||
					sprite.__type === consts.SpriteType.Missile);

			if (!sprites) {
				return true;
			}

			sprites = this.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
														sprite.__type === consts.SpriteType.DoubleWeaponInvader ||
														sprite.__type === consts.SpriteType.Missile ||
														sprite.__type === consts.SpriteType.Explosion);

			if (!sprites && this.level === MAX_LEVEL) {
				return true;
			}

			return false;
		}

		updateScores(invader) {
			this.scores += this.level * invader.scoreBonus;
		}

		removePlayer(sprite) {
			this.removeChild(sprite);
			this.player = null;
		}
	}

	return AirBattles;
});