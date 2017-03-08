define(["../framework/sprite", "../consts", "../sprites/explosion"], function(Sprite, consts, Explosion) {
	const IMAGE_FILENAME = "images/invader.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250,
		OFFSET_X = 50,
		SPEED_X = 60,
		SPEED_Y = 150;

	class Kamikaze extends Sprite {
		constructor(config) {
			if (!config.imageFilename) {
				config.imageFilename = IMAGE_FILENAME;
			}
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;
			that.initialX = that.x;
			that.velocityX = -SPEED_X;
			that.velocityY = 0;
			that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
			that.lastFireTime = new Date();
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Kamikaze;
		}

		update (lastFrameEllapsedTime, keyboard) {
			let that = this,
				leftBorder = that.initialX - OFFSET_X,
				rightBorder = that.initialX + OFFSET_X,
				isBorderReached = false;

			if (that.x < leftBorder) {
				that.x = leftBorder;
				isBorderReached = true;
			}

			if (that.x > rightBorder) {
				that.x = rightBorder;
				isBorderReached = true;
			}

			if (isBorderReached) {
				that.velocityX *= -1;
				that.velocityY = SPEED_Y;
			}

			if (that.y + that.height > that.game.height) {
				that.game.onInvaderOutOfScreen(that);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			that.velocityY = 0;
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile) {
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