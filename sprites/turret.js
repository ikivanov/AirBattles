define(["../framework/sprite", "../sprites/missile", "../consts", "../framework/utils"], function(Sprite, Missile, consts, utils) {
	const IMAGE_FILENAME = "images/turret.png",
		WIDTH = 32,
		HEIGHT = 40,
		FIRE_INTERVAL = 2500,
		SPEED_X = 0,
		SPEED_Y = 25,
		MISSILE_VELOCITY = 400;

	class Turret extends Sprite {
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
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;

			that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : utils.randomRange(2500, 5000);
			that.lastFireTime = Date.now();

			that.zIndex = 2;
			that.__type = consts.SpriteType.Turret;
		}

		_calculateAngle() {
			let that = this,
				player = that.game.player,
				oppositeCateteLength = Math.abs(player.x - that.x),
				adjecentCateteLength = Math.abs(player.y - that.y),
				hypotenuseLength = Math.sqrt(oppositeCateteLength * oppositeCateteLength + adjecentCateteLength * adjecentCateteLength),
				sin = oppositeCateteLength / hypotenuseLength,
				angle = Math.asin(sin) * 180 / Math.PI;

			//angle in [0..90] -> [0..360]
			if (player.x < that.x && player.y < that.y) {
				angle = 180 - angle;
			}

			if (player.x > that.x) {
				if (player.y < that.y) {
					angle += 180;
				} else {
					angle = 360 - angle;
				}
			}

			return angle;
		}

		update (lastFrameEllapsedTime, keyboard) {
			let that = this;

			that.angle = that._calculateAngle();

			if (that.y > that.game.height) {
				that.game.onTurretOutOfScreen(that);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			that.attack();
		}

		attack() {
			let that = this,
				now = Date.now(),
				x = this.x + (25 * Math.cos((this.angle + 90) * Math.PI / 180)),
				y = this.y + (25 * Math.sin((this.angle + 90) * Math.PI / 180));

			if (now - that.lastFireTime > that.fireInterval) {
				that.game.addChild(new Missile({
					x,
					y,
					owner: that,
					angle: that.angle + 90,
					velocityX: 250,
					velocityY: 250
				}));
				that.lastFireTime = now;
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile) {
				that.lives--;

				if (that.lives === 0) {
					that.destroy();
				}
			}
		}

		destroy() {
			let that = this;

			that.isDestoyed = true;

			that.game.updateScores(that);
			//TODO: show destroyed image
		}
	}

	return Turret;
});