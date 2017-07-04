define(["framework/sprite", "../consts"], function(Sprite, consts) {
	const VELOCITY_Y = 600,
		WIDTH = 4,
		HEIGHT = 10;

	class Shadow extends Sprite {
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			this.zIndex = 19;

			this.offsetX = config.offsetX;
			this.offsetY = config.offsetY;
			this.owner = config.owner;

			this.isNonPlayable = true;
			this.__type = consts.SpriteType.Shadow;
		}

		update(lastFrameEllapsedTime, keyboard) {
			//shadow is updated by its sprite owner
		}

		render() {
			let ctx = this.context,
				angle = this.owner.angle;

			ctx.save();
			ctx.globalAlpha = 0.3;
			ctx.translate(this.x, this.y);
			let half_width = this.image.width / 2,
				half_height = this.image.height / 2;

			if (angle !== 0) {
				ctx.rotate((angle * Math.PI) / 180);
			}

			ctx.scale(0.55, 0.55);

			ctx.drawImage(this.image, 0, 0);
			ctx.restore();
		}
	}

	return Shadow;
});