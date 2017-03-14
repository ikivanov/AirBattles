define(["../framework/sprite", "../consts", "../sprites/explosion"], function(Sprite, consts, Explosion) {
	const IMAGE_FILENAME = "images/su-55.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250,
		OFFSET_X = 50,
		SPEED_X = 0,
		SPEED_Y = 500;

	class Kamikaze extends Sprite {
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

			let that = this;
			that.initialX = that.x;
			that.velocityX = SPEED_X;
			that.velocityY = SPEED_Y;
			that.angle = 180;
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Kamikaze;
		}

		update (lastFrameEllapsedTime, keyboard) {
			let that = this;

			super.update(lastFrameEllapsedTime, keyboard);

			if (that.y > that.game.height) {
				that.game.onKamikazeOutOfScreen(that);
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile || type === consts.SpriteType.Player) {
				that.lives--;

				if (that.lives === 0) {
					that.game.updateScores(that);
					that.game.removeChild(that);

					that.game.addChild(new Explosion({ x: that.x, y: that.y }));
				}
			}
		}
	}

	return Kamikaze;
});