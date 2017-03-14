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

			let that = this;

			that.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;
			that.angle = 0;

			that.zIndex = 30;
			that.__type = consts.SpriteType.PowerUp2xBasic;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			if (that.angle < 360) {
				that.angle++;
			} else {
				that.angle = 0;
			}

			super.update(lastFrameEllapsedTime, keyboard);

			if (that.x <= 0 || that.x + that.width >= that.game.width ||
				that.y + that.height > that.game.height) {
				that.game.onPowerUpOutOfScreen(that);
			}
		}

		onCollidedWith(sprite) {
			let that = this;

			if (sprite.__type !== consts.SpriteType.Player) {
				return;
			}

			that.game.removeChild(that);
		}
	}

	return PowerUp2xBasic;
});