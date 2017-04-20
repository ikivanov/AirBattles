define(["../framework/sprite", "../consts", "../sprites/explosion", "../sprites/missile", "../framework/shadow"], function(Sprite, consts, Explosion, Missile, Shadow) {
	const IMAGE_FILENAME = "images/f-35d.png",
		SHADOW_IMAGE_FILENAME = "images/f-35d-shadow.png",
		WIDTH = 57,
		HEIGHT = 80,
		FIRE_INTERVAL = 2000,
		OFFSET_X = 50,
		SPEED_X = 0,
		SPEED_Y = 100,
		MISSILE_VELOCITY = 400,
		SHADOW_ZINDEX = 19,
		SHADOW_OFFSET_X = 10,
		SHADOW_OFFSET_Y = 80;

	class Fighter extends Sprite {
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
			that.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
			that.lastFireTime = Date.now();
			that.scoreBonus = 10;
			that.lives = config.lives !== undefined ? config.lives : 1;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Fighter;

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
			let that = this;

			if (that.y > that.game.height) {
				that.game.onFighterOutOfScreen(that);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			that.attack();
		}

		attack() {
			let that = this,
				now = Date.now();

			if (now - that.lastFireTime > that.fireInterval) {
				that.game.addChild(new Missile({
					velocityY: MISSILE_VELOCITY,
					x : that.x,
					y: that.y + HEIGHT + 1,
					color: "gold",
					angle: 90,
					owner: that
				}));
				that.lastFireTime = now;
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile || type === consts.SpriteType.Player) {
				that.lives--;

				if (that.lives === 0) {
					that.destroy();
				}
			}
		}

		destroy() {
			let that = this;

			that.game.updateScores(that);
			that.game.removeChild(that);

			that.game.addChild(new Explosion({ x: that.x, y: that.y }));
		}
	}

	return Fighter;
});