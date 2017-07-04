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

	class Kamikaze2 extends Sprite {
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
			this.isChasing = false;

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
			let player = this.game.player,
				targetX = player ? player.x : this.x,
				targetY = player ? player.y : this.game.Height;

			if (this.y <= 55) {
				super.update(lastFrameEllapsedTime, keyboard);
			} else if (this.y > 55 && targetY > this.y && !this.isChasing) {
				this.isChasing = true;
				this.distance = Math.sqrt(Math.pow(targetX - this.x, 2) + Math.pow(targetY - this.y, 2));
				this.directionX = (targetX - this.x) / this.distance;
				this.directionY = (targetY - this.y) / this.distance;
			} else if (this.isChasing) {
				this.x += this.directionX * SPEED_Y * lastFrameEllapsedTime;
				this.y += this.directionY * SPEED_Y * lastFrameEllapsedTime;
				this.updateShadow(this.x, this.y);
			}

			if (this.x < 0 || this.x > this.game.width || this.y > this.game.height) {
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

	return Kamikaze2;
});