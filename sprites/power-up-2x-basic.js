define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const VELOCITY_Y = 40,
		IMAGE_FILENAME = "images/power-up-2x-basic.png",
		WIDTH = 30,
		HEIGHT = 30;

	class PowerUp2xBasic extends Sprite {
		static get Width() {
			return WIDTH;
		}

		static get Height() {
			return HEIGHT;
		}

		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;
			config.imageFilename = IMAGE_FILENAME;

			super(config);

			this.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;
			this.angle = 0;

			this.zIndex = 30;
			this.__type = consts.SpriteType.PowerUp2xBasic;
		}

		update(lastFrameEllapsedTime, keyboard) {
			if (this.angle < 360) {
				this.angle++;
			} else {
				this.angle = 1;
			}

			super.update(lastFrameEllapsedTime, keyboard);

			if (this.x <= 0 || this.x + this.width >= this.game.width ||
				this.y + this.height > this.game.height) {
				this.game.onPowerUpOutOfScreen(this);
			}
		}

		onCollidedWith(sprite) {
			if (sprite.__type !== consts.SpriteType.Player) {
				return;
			}

			this.game.removeChild(this);
		}
	}

	return PowerUp2xBasic;
});