define(["../framework/sprite", "../consts", "../sprites/explosion", "../framework/shadow"], function(Sprite, consts, Explosion, Shadow) {
	const IMAGE_FILENAME = "images/su-55.png",
		WIDTH = 50,
		HEIGHT = 55,
		FIRE_INTERVAL = 250,
		OFFSET_X = 50,
		SPEED_X = 0,
		SPEED_Y = 500,
		SHADOW_ZINDEX = 19,
		SHADOW_IMAGE_FILENAME = "images/su-55-shadow.png",
		SHADOW_OFFSET_X = 10,
		SHADOW_OFFSET_Y = 70;

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

			this.initialX = this.x;
			this.velocityX = SPEED_X;
			this.velocityY = SPEED_Y;
			this.angle = 180;
			this.scoreBonus = 10;
			this.lives = config.lives !== undefined ? config.lives : 1;

			this.zIndex = 20;
			this.__type = consts.SpriteType.Kamikaze;

			this.shadow = new Shadow({
				x: this.x + SHADOW_OFFSET_X,
				y: this.y + SHADOW_OFFSET_Y,
				offsetX: SHADOW_OFFSET_X,
				offsetY: SHADOW_OFFSET_Y,
				imageFilename: SHADOW_IMAGE_FILENAME,
				zIndex: SHADOW_ZINDEX,
				owner: this
			});
		}

		update (lastFrameEllapsedTime, keyboard) {
			super.update(lastFrameEllapsedTime, keyboard);

			if (this.y > this.game.height) {
				this.game.onKamikazeOutOfScreen(this);
			}
		}

		onCollidedWith(sprite) {
			let type = sprite.__type;

			if (type === consts.SpriteType.Missile || type === consts.SpriteType.Player) {
				this.lives--;

				if (this.lives === 0) {
					this.destroy();
				}
			}
		}

		destroy() {
			this.game.updateScores(this);
			this.game.removeChild(this);

			this.game.addChild(new Explosion({ x: this.x, y: this.y }));
		}
	}

	return Kamikaze;
});