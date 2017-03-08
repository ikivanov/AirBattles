define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const IMAGE_FILENAME = "images/explosion.png",
		WIDTH = 39,
		HEIGHT = 39;

	class Explosion extends Sprite {
		constructor(config) {
			config.imageFilename = IMAGE_FILENAME;
			super(config);

			let that = this;
			that.animationFrameSpeed = 32;
			that.frameIndex = 0;
			that.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			that.repeatAnimation = false;
			that.isCompleted = false;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Explosion;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			that.frameIndex += that.animationFrameSpeed * lastFrameEllapsedTime;
		}

		render() {
			let that = this,
				ctx = that.context,
				max = that.frames.length,
				idx = Math.floor(that.frameIndex),
				frame = that.frames[idx % max],
				imageOffsetX = frame * WIDTH,
				imageOffsetY = 0;

			if(!that.repeatAnimation && idx >= max) {
				that.isCompleted = true;
				return;
			}

			if (that.image) {
				ctx.drawImage(that.image, imageOffsetX, imageOffsetY, WIDTH, HEIGHT, that.x, that.y, WIDTH, HEIGHT);
			}
		}
	}

	return Explosion;
});