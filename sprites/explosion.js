define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const IMAGE_FILENAME = "images/explosion.png",
		WIDTH = 39,
		HEIGHT = 39;

	class Explosion extends Sprite {
		constructor(config) {
			config.imageFilename = IMAGE_FILENAME;
			super(config);

			this.animationFrameSpeed = 32;
			this.frameIndex = 0;
			this.frames = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
			this.repeatAnimation = false;
			this.isCompleted = false;

			this.zIndex = 20;
			this.__type = consts.SpriteType.Explosion;
		}

		update(lastFrameEllapsedTime, keyboard) {
			this.frameIndex += this.animationFrameSpeed * lastFrameEllapsedTime;
		}

		render() {
			let ctx = this.context,
				max = this.frames.length,
				idx = Math.floor(this.frameIndex),
				frame = this.frames[idx % max],
				imageOffsetX = frame * WIDTH,
				imageOffsetY = 0;

			if(!this.repeatAnimation && idx >= max) {
				this.isCompleted = true;
				return;
			}

			if (this.image) {
				ctx.drawImage(this.image, imageOffsetX, imageOffsetY, WIDTH, HEIGHT, this.x, this.y, WIDTH, HEIGHT);
			}
		}
	}

	return Explosion;
});