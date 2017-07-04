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

			this.initialX = this.x;
			this.velocityX = SPEED_X;
			this.velocityY = SPEED_Y;
			this.angle = 180;
			this.fireInterval = config.fireInterval !== undefined ? config.fireInterval : FIRE_INTERVAL;
			this.lastFireTime = Date.now();
			this.scoreBonus = 10;
			this.lives = config.lives !== undefined ? config.lives : 1;

			this.zIndex = 20;
			this.__type = consts.SpriteType.Fighter;

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
			if (this.y > this.game.height) {
				this.game.onFighterOutOfScreen(this);
			}

			super.update(lastFrameEllapsedTime, keyboard);

			this.attack();
		}

		attack() {
			let now = Date.now();

			if (now - this.lastFireTime > this.fireInterval) {
				this.game.addChild(new Missile({
					velocityY: MISSILE_VELOCITY,
					x : this.x,
					y: this.y + HEIGHT + 1,
					color: "gold",
					angle: 90,
					owner: this
				}));
				this.lastFireTime = now;
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

	return Fighter;
});