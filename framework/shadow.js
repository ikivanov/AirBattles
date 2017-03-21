define(["framework/sprite", "../consts"], function(Sprite, consts) {
	const VELOCITY_Y = 600,
		WIDTH = 4,
		HEIGHT = 10;

	class Shadow extends Sprite {
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;

			that.zIndex = 19;

			that.offsetX = config.offsetX;
			that.offsetY = config.offsetY;
			that.owner = config.owner;

			that.isNonPlayable = true;
			that.__type = consts.SpriteType.Shadow;
		}

		update(lastFrameEllapsedTime, keyboard) {
			//shadow is updated by its sprite owner
		}

		render() {
			let that = this,
				ctx = that.context,
				angle = that.owner.angle;

			ctx.save();
			ctx.globalAlpha = 0.3;
			ctx.translate(that.x, that.y);
			let half_width = that.image.width / 2,
				half_height = that.image.height / 2;

			if (angle !== 0) {
				ctx.rotate((angle * Math.PI) / 180);
			}

			ctx.scale(0.55, 0.55);

			ctx.drawImage(that.image, 0, 0);
			ctx.restore();
		}
	}

	return Shadow;
});