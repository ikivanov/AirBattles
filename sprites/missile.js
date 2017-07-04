define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const VELOCITY_X = 600,
		VELOCITY_Y = 600,
		WIDTH = 4,
		HEIGHT = 10;

	class Missile extends Sprite {
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			this.owner = config.owner || "";
			this.type = config.type;
			this.color = config.color || "yellow";
			this.velocityX = config.velocityX !== undefined ? config.velocityX : VELOCITY_X;
			this.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;
			this.angle = config.angle !== undefined ? config.angle : 0;

			if (this.type === "allied") {
				this.velocityY *= -1;
			}

			this.zIndex = 25;
			this.__type = consts.SpriteType.Missile;
		}

		update(lastFrameEllapsedTime, keyboard) {
			this.x += this.velocityX * lastFrameEllapsedTime * Math.cos((this.angle) * Math.PI / 180);
			this.y += this.velocityY * lastFrameEllapsedTime * Math.sin((this.angle) * Math.PI / 180);

			if (this.x <= 0 || this.x + this.width >= this.game.width ||
				this.y <= 0 || this.y > this.game.height) {
				this.game.onMissileOutOfScreen(this);
			}
		}


		_getRotationAngle(angle) {
			let rotationAngle = angle - 90;

			if (rotationAngle < 0) {
				rotationAngle = 360 + rotationAngle;
			}

			return rotationAngle;
		}

		render() {
			let ctx = this.context;

			ctx.save();
			ctx.translate(this.x, this.y);
			ctx.rotate(this._getRotationAngle(this.angle) * Math.PI / 180);
			ctx.fillStyle = this.color;
			ctx.fillRect(0, 0, this.width, this.height);
			ctx.restore();
		}

		onCollidedWith(sprite) {
			//todo: introduce Ground sprites => if sprites is ground...
			if (sprite.__type === consts.SpriteType.Turret) {
				return;
			}

			this.destroy();
		}

		destroy() {
			this.game.removeChild(this);
		}
	}

	return Missile;
});