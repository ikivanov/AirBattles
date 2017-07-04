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

			this.__type = consts.SpriteType.Background;
		}

		update(lastFrameEllapsedTime, keyboard) {
			if (this.y <= 0) {
				this.y = 0;
				return;
			}

			super.update(lastFrameEllapsedTime, keyboard);
		}

		render() {
			let ctx = this.context,
				width = this.game.canvas.width,
				height = this.game.canvas.height;

			ctx.drawImage(this.image, this.x, this.y, width, height, 0, 0, width, height);
		}
	}

	return Background;
});