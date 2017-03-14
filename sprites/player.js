define(["../framework/sprite", "../consts", "../sprites/explosion"], function(Sprite, consts, Explosion) {
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
		LIVES = 3;

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

			let that = this;

			that.doubleFire = false;
			that.lastFireTime = new Date();
			that.lives = LIVES;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Player;
		}

		update(lastFrameEllapsedTime, keyboard) {
			if (!keyboard) {
				return;
			}

			let that = this,
				distanceX = SPEED_X * lastFrameEllapsedTime,
				distanceY = SPEED_Y * lastFrameEllapsedTime;

			if (keyboard.keys.ArrowLeft || keyboard.keys.KeyA) {
				if (that.x - distanceX < MIN_X) {
					that.x = MIN_X;
				} else {
					that.x -= distanceX;
				}
			}

			if (keyboard.keys.ArrowRight || keyboard.keys.KeyD) {
				if (that.x + distanceX > MAX_X) {
					that.x = MAX_X;
				} else {
					that.x += distanceX;
				}
			}

			if (keyboard.keys.ArrowUp || keyboard.keys.KeyE) {
				if (that.y - distanceY < MIN_Y) {
					that.y = MIN_Y;
				} else {
					that.y -= distanceY;
				}
			}

			if (keyboard.keys.ArrowDown || keyboard.keys.KeyD) {
				if (that.y + distanceY > MAX_Y) {
					that.y = MAX_Y;
				} else {
					that.y += distanceY;
				}
			}

			if (keyboard.keys.Space === true && that._canFire()) {
				let centerX = Math.floor(that.x + WIDTH / 2);

				if (that.doubleFire) {
					that.game.onMissileLaunched(centerX - 15, that.y);
					that.game.onMissileLaunched(centerX + 15, that.y);
				} else {
					that.game.onMissileLaunched(centerX, that.y);
				}
			}
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile ||
				type === consts.SpriteType.Fighter ||
				type === consts.SpriteType.Kamikaze) {
				that.lives--;

				if (that.lives === 0) {
					that.game.removePlayer(that);

					that.game.addChild(new Explosion({ x: that.x, y: that.y }));
				} else {
					that.game.runPlayerDamageEffect();
				}
			}

			if (type === consts.SpriteType.PowerUp2xBasic) {
				that.doubleFire = true;
			}
		}

		_canFire() {
			let that = this,
				now = new Date();

			if (now.getTime() - that.lastFireTime.getTime() > FIRE_INTERVAL) {
				that.lastFireTime = now;
				return true;
			}

			return false;
		}
	}

	return Player;
});