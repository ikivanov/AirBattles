define(["../framework/sprite", "../consts", "../sprites/explosion", "../sprites/missile"], function(Sprite, consts, Explosion, Missile) {
	const IMAGE_FILENAME = "images/f-35d.png",
		WIDTH = 57,
		HEIGHT = 80,
		FIRE_INTERVAL = 2000,
		OFFSET_X = 50,
		SPEED_X = 0,
		SPEED_Y = 100,
		MISSILE_VELOCITY = 400;

	class Fighter extends Sprite {
		static get Width() {
			return WIDTH;
		}

		static get Height() {
			return HEIGHT;
		}

		constructor(config) {
			if (!config.imageFilename) {
				config.imageFilename = IMAGE_FILENAME;
			}
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;
			that.initialX = that.x;
			that.velocityX = SPEED_X;
			that.velocityY = SPEED_Y;
			that.angle = Math.PI;
			that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
			that.lastFireTime = Date.now();
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Fighter;
		}

		update (lastFrameEllapsedTime, keyboard) {
			let that = this;

			if (that.y + that.height > that.game.height) {
				that.game.onFighterOutOfScreen(that);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			that.attack();
		}

		attack() {
			let that = this,
				now = Date.now();

			if (now - that.lastFireTime > that.fireInterval) {
				that.game.addChild(new Missile({
					velocityY: MISSILE_VELOCITY,
					x : that.x + WIDTH / 2,
					y: that.y + HEIGHT + 5,
					color: "gold"
				}));
				that.lastFireTime = now;
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile || type === consts.SpriteType.Player) {
				that.lives--;

				if (that.lives === 0) {
					that.game.updateScores(that);
					that.game.removeChild(that);

					that.game.addChild(new Explosion({ x: that.x, y: that.y }));
				}
			}
		}
	}

	return Fighter;
});