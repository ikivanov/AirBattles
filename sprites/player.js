define(["../framework/sprite", "../consts", "../sprites/explosion", "../framework/shadow"], function(Sprite, consts, Explosion, Shadow) {
	const SPEED_X = 300,
		SPEED_Y = 300,
		MIN_X = 5,
		MAX_X = 538,
		MIN_Y = 5,
		MAX_Y = 520,
		WIDTH = 57,
		HEIGHT = 75,
		FIRE_INTERVAL = 250,
		IMAGE_FILENAME = "images/mig-47.png",
		SHADOW_IMAGE_FILENAME = "images/mig-47-shadow.png",
		LIVES = 3,
		SHADOW_ZINDEX = 19,
		SHADOW_OFFSET_X = -25,
		SHADOW_OFFSET_Y = 35,
		BOMBS_COUNT = 30;

	class Player extends Sprite {
		static get Width() {
			return WIDTH;
		}

		static get Height() {
			return HEIGHT;
		}

		constructor(config) {
			super({
				x: config.x,
				y: config.y,
				width: WIDTH,
				height: HEIGHT,
				imageFilename: IMAGE_FILENAME
			});

			this.doubleFire = false;
			this.lastFireTime = new Date();
			this.lives = LIVES;

			this.zIndex = 20;
			this.__type = consts.SpriteType.Player;

			this.lastBombDropped = Date.now();

			this.shadow = new Shadow({
				x: this.x + SHADOW_OFFSET_X,
				y: this.y + SHADOW_OFFSET_Y,
				offsetX: SHADOW_OFFSET_X,
				offsetY: SHADOW_OFFSET_Y,
				imageFilename: SHADOW_IMAGE_FILENAME,
				zIndex: SHADOW_ZINDEX,
				owner: this
			});

			this.bombs = BOMBS_COUNT;
		}

		update(lastFrameEllapsedTime, keyboard) {
			if (!keyboard) {
				return;
			}

			let distanceX = SPEED_X * lastFrameEllapsedTime,
				distanceY = SPEED_Y * lastFrameEllapsedTime;

			if (keyboard.keys.ArrowLeft || keyboard.keys.KeyA) {
				if (this.x - distanceX < MIN_X) {
					this.x = MIN_X;
				} else {
					this.x -= distanceX;
				}
			}

			if (keyboard.keys.ArrowRight || keyboard.keys.KeyD) {
				if (this.x + distanceX > MAX_X) {
					this.x = MAX_X;
				} else {
					this.x += distanceX;
				}
			}

			if (keyboard.keys.ArrowUp || keyboard.keys.KeyE) {
				if (this.y - distanceY < MIN_Y) {
					this.y = MIN_Y;
				} else {
					this.y -= distanceY;
				}
			}

			if (keyboard.keys.ArrowDown || keyboard.keys.KeyD) {
				if (this.y + distanceY > MAX_Y) {
					this.y = MAX_Y;
				} else {
					this.y += distanceY;
				}
			}

			if (this.shadow) {
				this.updateShadow(this.x, this.y);
			}

			if (keyboard.keys.Space && this._canFire()) {
				let centerX = Math.floor(this.x + WIDTH / 2);

				if (this.doubleFire) {
					this.game.onMissileLaunched(centerX - 15, this.y);
					this.game.onMissileLaunched(centerX + 15, this.y);
				} else {
					this.game.onMissileLaunched(centerX, this.y);
				}
			}

			if (keyboard.keys.KeyB && this.bombs > 0 && (Date.now() - this.lastBombDropped) > 1000) {
				this.game.onBombDropped();
				this.bombs--;
				this.lastBombDropped = Date.now();
			}
		}

		onCollidedWith(sprite) {
			let type = sprite.__type;

			if (type === consts.SpriteType.Missile ||
				type === consts.SpriteType.Fighter ||
				type === consts.SpriteType.Kamikaze) {
				this.lives--;

				if (this.lives === 0) {
					this.destroy();
				} else {
					this.game.runPlayerDamageEffect();
				}
			}

			if (type === consts.SpriteType.PowerUp2xBasic) {
				this.doubleFire = true;
			}
		}

		destroy() {
			this.game.removeChild(this);

			this.game.addChild(new Explosion({ x: this.x, y: this.y }));
		}

		_canFire() {
			let now = new Date();

			if (now.getTime() - this.lastFireTime.getTime() > FIRE_INTERVAL) {
				this.lastFireTime = now;
				return true;
			}

			return false;
		}
	}

	return Player;
});