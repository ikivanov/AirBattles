define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const IMAGE_FILENAME = "images/background.jpg",
		WIDTH = 600,
		HEIGHT = 600,
		SPEED_Y = -25,
		INITIAL_X = 5743;

	class Background extends Sprite {
		constructor() {
			super({
				x: 0,
				y: INITIAL_X,
				velocityX: 0,
				velocityY: SPEED_Y,
				imageFilename: IMAGE_FILENAME,
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
				ctx = that.context;

			ctx.drawImage(that.image, that.x, that.y, WIDTH, HEIGHT, 0, 0, WIDTH, HEIGHT);
		}
	}

	return Background;
});