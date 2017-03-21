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

			let that = this;
			that.initialX = that.x;
			that.velocityX = SPEED_X;
			that.velocityY = SPEED_Y;
			that.angle = 180;
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;
			that.isChasing = false;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Kamikaze;

			that.shadow = new Shadow({
				x: that.x + SHADOW_OFFSET_X,
				y: that.y + SHADOW_OFFSET_Y,
				offsetX: SHADOW_OFFSET_X,
				offsetY: SHADOW_OFFSET_Y,
				imageFilename: SHADOW_IMAGE_FILENAME,
				zIndex: SHADOW_ZINDEX,
				owner: that
			});
		}

		update (lastFrameEllapsedTime, keyboard) {
			let that = this,
				player = that.game.player,
				targetX = player ? player.x : that.x,
				targetY = player ? player.y : that.game.Height;

			if (that.y <= 55) {
				super.update(lastFrameEllapsedTime, keyboard);
			} else if (that.y > 55 && targetY > that.y && !that.isChasing) {
				that.isChasing = true;
				that.distance = Math.sqrt(Math.pow(targetX - that.x, 2) + Math.pow(targetY - that.y, 2));
				that.directionX = (targetX - that.x) / that.distance;
				that.directionY = (targetY - that.y) / that.distance;
			} else if (that.isChasing) {
				that.x += that.directionX * SPEED_Y * lastFrameEllapsedTime;
				that.y += that.directionY * SPEED_Y * lastFrameEllapsedTime;
				that.updateShadow(that.x, that.y);
			}

			if (that.x < 0 || that.x > that.game.width || that.y > that.game.height) {
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

	return Kamikaze2;
});