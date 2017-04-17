define(["../framework/sprite", "../sprites/missile", "../consts"], function(Sprite, Missile, consts) {
	const IMAGE_FILENAME = "images/turret.png",
		WIDTH = 32,
		HEIGHT = 40,
		FIRE_INTERVAL = 1000,
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

			that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
			that.lastFireTime = Date.now();

			that.zIndex = 2;
			that.__type = consts.SpriteType.Turret;
		}

		_calculateAngle() {
			let that = this,
				player = that.game.player,
				oppositeCateteLength = player.x - that.x,
				adjecentCateteLength = player.y - that.y,
				hypotenuseLength = Math.sqrt(oppositeCateteLength * oppositeCateteLength + adjecentCateteLength * adjecentCateteLength),
				sin = oppositeCateteLength / hypotenuseLength,
				angle = Math.asin(sin) * 180 / Math.PI;

			if (player.y > that.y) {
				if (angle < 0) {
					angle = Math.abs(angle);
				} else {
					angle = 360 - angle;
				}
			}

			if (player.y < that.y) {
				if (angle < 0) {
					angle = 180 - Math.abs(angle);
				} else {
					angle = 180 + angle;
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
				now = Date.now();

			if (now - that.lastFireTime > that.fireInterval) {
				that.game.addChild(new Missile({
					velocityY: MISSILE_VELOCITY,
					x : that.x + WIDTH / 2,
					y: that.y + HEIGHT + 1,
					color: "gold",
					owner: that
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