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

			let that = this;

			that.owner = config.owner || "";
			that.type = config.type;
			that.color = config.color || "yellow";
			that.velocityX = config.velocityX !== undefined ? config.velocityX : VELOCITY_X;
			that.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;
			that.angle = config.angle !== undefined ? config.angle : 0;

			if (that.type === "allied") {
				that.velocityY *= -1;
			}

			that.zIndex = 25;
			that.__type = consts.SpriteType.Missile;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			that.x += that.velocityX * lastFrameEllapsedTime * Math.cos((that.angle) * Math.PI / 180);
			that.y += that.velocityY * lastFrameEllapsedTime * Math.sin((that.angle) * Math.PI / 180);

			if (that.x <= 0 || that.x + that.width >= that.game.width ||
				that.y <= 0 || that.y > that.game.height) {
				that.game.onMissileOutOfScreen(that);
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
			let that = this,
				ctx = that.context;

			ctx.save();
			ctx.translate(that.x, that.y);
			ctx.rotate(that._getRotationAngle(that.angle) * Math.PI / 180);
			ctx.fillStyle = that.color;
			ctx.fillRect(0, 0, that.width, that.height);
			ctx.restore();
		}

		onCollidedWith(sprite) {
			let that = this;

			//todo: introduce Ground sprites => if sprites is ground...
			if (sprite.__type === consts.SpriteType.Turret) {
				return;
			}

			that.destroy();
		}

		destroy() {
			let that = this;

			that.game.removeChild(that);
		}
	}

	return Missile;
});