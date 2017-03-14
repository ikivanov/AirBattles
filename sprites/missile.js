define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const VELOCITY_Y = 600,
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
			that.velocityY = config.velocityY !== undefined ? config.velocityY : VELOCITY_Y;

			if (that.type === "allied") {
				that.velocityY *= -1;
			}

			that.zIndex = 25;
			that.__type = consts.SpriteType.Missile;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			super.update(lastFrameEllapsedTime, keyboard);

			if (that.x <= 0 || that.x + that.width >= that.game.width ||
				that.y <= 0 || that.y > that.game.height) {
				that.game.onMissileOutOfScreen(that);
			}
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.save();
			ctx.fillStyle = that.color;
			ctx.fillRect(that.x, that.y, that.width, that.height);
			ctx.restore();
		}

		onCollidedWith(sprite) {
			let that = this;

			that.game.removeChild(that);
		}
	}

	return Missile;
});