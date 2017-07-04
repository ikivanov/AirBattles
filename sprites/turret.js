define(["../framework/sprite", "../sprites/missile", "../consts", "../framework/utils", "framework/image-manager"], function(Sprite, Missile, consts, utils, ImageManager) {
	const IMAGE_FILENAME = "images/turret.png",
		IMAGE_FILENAME_DESTROYED = "images/turret-destroyed.png",
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

			this.initialX = this.x;
			this.velocityX = SPEED_X;
			this.velocityY = SPEED_Y;
			this.scoreBonus = 10;
			this.lives = config.lives !== undefined ? config.lives : 1;

			this.fireInterval = config.fireInterval !== undefined ? config.fireInterval : utils.randomRange(2500, 5000);
			this.lastFireTime = Date.now();

			this.zIndex = 2;
			this.__type = consts.SpriteType.Turret;
		}

		_calculateAngle() {
			let player = this.game.player,
				oppositeCateteLength = Math.abs(player.x - this.x),
				adjecentCateteLength = Math.abs(player.y - this.y),
				hypotenuseLength = Math.sqrt(oppositeCateteLength * oppositeCateteLength + adjecentCateteLength * adjecentCateteLength),
				sin = oppositeCateteLength / hypotenuseLength,
				angle = Math.asin(sin) * 180 / Math.PI;

			//angle in [0..90] -> [0..360]
			if (player.x < this.x && player.y < this.y) {
				angle = 180 - angle;
			}

			if (player.x > this.x) {
				if (player.y < this.y) {
					angle += 180;
				} else {
					angle = 360 - angle;
				}
			}

			return angle;
		}

		update (lastFrameEllapsedTime, keyboard) {
			if (this.y > this.game.height) {
				this.game.onTurretOutOfScreen(this);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			if (this.isDestoyed) {
				return;
			}

			this.angle = this._calculateAngle();

			this.attack();
		}

		attack() {
			let now = Date.now(),
				x = this.x + (25 * Math.cos((this.angle + 90) * Math.PI / 180)),
				y = this.y + (25 * Math.sin((this.angle + 90) * Math.PI / 180));

			if (now - this.lastFireTime > this.fireInterval) {
				this.game.addChild(new Missile({
					x,
					y,
					owner: this,
					angle: this.angle + 90,
					velocityX: 250,
					velocityY: 250
				}));
				this.lastFireTime = now;
			}
		}

		destroy() {
			this.isDestoyed = true;

			this.game.updateScores(this);

			this.image = ImageManager.getImage(IMAGE_FILENAME_DESTROYED);
		}
	}

	return Turret;
});