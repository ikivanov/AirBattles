define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	class Background extends Sprite {
		constructor(config) {
			super({
				x: config.initialX || 0,
				y: config.intialY || 0,
				velocityX: config.velocityX || 0,
				velocityY: config.velocityY || 0,
				imageFilename: config.imageFilename || "",
				isNonPlayable: true
			});

			let that = this;
			that.__type = consts.SpriteType.Background;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			if (that.y <= 0) {
				that.y = 0;
				return;
			}

			super.update(lastFrameEllapsedTime, keyboard);
		}

		render() {
			let that = this,
				ctx = that.context,
				width = that.game.canvas.width,
				height = that.game.canvas.height;

			ctx.drawImage(that.image, that.x, that.y, width, height, 0, 0, width, height);
		}
	}

	return Background;
});