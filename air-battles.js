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

			let that = this;

			that.init();
		}

		getSplashScreen() {
			return new SplashScreen();
		}

		loadSprites() {
			let that = this;

			that.addChild(new Statistics({ x: 25, y: 25 }));
			that.addChild(new FPSCounter({ x: 545, y: 25, zIndex: 10 }));

			that.level = 1;
			that.levelDescriptorCreated = new Date();
			that.levelDescriptor = that.getLevelDescriptorLabel();
			that.addChild(that.levelDescriptor);
		}

		getLevelDescriptorLabel() {
			let that = this;

			return new Label({
				text: `${that.currentLevel.name}. Loading...`,
				x: 0,
				y: 0,
				width: that.canvas.width,
				height: that.canvas.height,
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
			let that = this;

			that.sprites = that.sprites.filter(sprite => sprite.isNonPlayable === true);
		}

		_removeCompletedExplosions() {
			let that = this,
				explosionsCompleted = that.sprites.filter(sprite => sprite.__type === consts.SpriteType.Explosion && sprite.isCompleted);

			if (explosionsCompleted && explosionsCompleted.length > 0) {
				for (let i = 0; i < explosionsCompleted.length; i++) {
					that.removeChild(explosionsCompleted[i]);
				}
			}
		}

		onSplashScreenNeedsRemoval(splashScreen) {
			let that = this;

			that.removeChild(splashScreen);

			that.currentLevel = LevelFactory.create(that.level, { game: that });

			that.loadSprites();
			that.start();
		}

		onAfterUpdate(lastFrameEllapsedTime) {
			let that = this,
				now = Date.now();

			that._removeCompletedExplosions();

			if (that.levelDescriptor && now - that.levelDescriptorCreated.getTime() > 2000) {
				that.removeChild(that.levelDescriptor);
				that.levelDescriptor = null;

				that.currentLevel.load();
			}

			if (!that.currentLevel || !that.player) {
				return;
			}

			that.currentLevel.loadMore();
		}

		onLevelCompleted() {
			let that = this;

			if (that.level === MAX_LEVEL) {
				that.gameOver();
				return;
			}

			that.cleanUpLevel();
			that.level++;
			that.currentLevel = LevelFactory.create(that.level, { game: that });
			that.currentLevel.load();

			that.levelDescriptorCreated = new Date();
			that.levelDescriptor = that.getLevelDescriptorLabel();
			that.addChild(that.levelDescriptor);
		}

		onMissileLaunched(x, y) {
			let that = this;

			that.addChild(new Missile({ x, y: y - 15, angle: 270, owner: that.player }));
		}

		onMissileOutOfScreen(missile) {
			let that = this;

			that.removeChild(missile);
		}

		onFighterOutOfScreen(fighter) {
			let that = this;

			that.removeChild(fighter);
		}

		onKamikazeOutOfScreen(kamikaze) {
			let that = this;

			that.removeChild(kamikaze);
		}

		onPowerUpOutOfScreen(powerUp) {
			let that = this;

			that.removeChild(powerUp);
		}

		onTurretOutOfScreen(turret) {
			let that = this;

			that.removeChild(turret);
		}

		runPlayerDamageEffect() {
			let that = this;

			that.addChild(new PlayerDamageEffect());
		}

		onPlayerBombEffectDone(effect) {
			let that = this;

			that.removeChild(effect);
		}

		runPlayerBombEffect() {
			let that = this;

			that.addChild(new PlayerBombEffect());
		}

		onPlayerDamageEffectDone(effect) {
			let that = this;

			that.removeChild(effect);
		}

		onBombDropped() {
			let that = this,
				sprites = that.sprites.filter(sprite => sprite.__type === consts.SpriteType.Turret),
				exposionArea = {
					x: that.player.x + that.player.width / 2,
					y: that.player.y + that.player.height / 2,
					radius: BOMB_RADIUS
				};

			that.runPlayerBombEffect();
			that.addChild(new BombExplosion({
				x: that.player.x + that.player.width - that.player.width / 2,
				y: that.player.y + that.player.height - that.player.height / 2}));

			sprites.forEach(sprite => {
				let spriteRect = { x: sprite.x, y: sprite.y, width: sprite.width, height: sprite.height };
				if (utils.hasCircleRectangleCollision(exposionArea, spriteRect)) {
					sprite.destroy();
				}
			});
		}

		isLevelCompleted() {
			return false;

			let that = this,
				sprites = that.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
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

			let that = this,
				sprites = that.sprites.find(sprite => sprite.__type === consts.SpriteType.Explosion ||
													sprite.__type === consts.SpriteType.Player ||
													sprite.__type === consts.SpriteType.Missile);

			if (!sprites) {
				return true;
			}

			sprites = that.sprites.find((sprite) => sprite.__type === consts.SpriteType.Invader ||
														sprite.__type === consts.SpriteType.DoubleWeaponInvader ||
														sprite.__type === consts.SpriteType.Missile ||
														sprite.__type === consts.SpriteType.Explosion);

			if (!sprites && that.level === MAX_LEVEL) {
				return true;
			}

			return false;
		}

		updateScores(invader) {
			let that = this;

			that.scores += that.level * invader.scoreBonus;
		}

		removePlayer(sprite) {
			let that = this;

			that.removeChild(sprite);
			that.player = null;
		}
	}

	return AirBattles;
});