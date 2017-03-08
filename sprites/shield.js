define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const WIDTH = 12,
		HEIGHT = 12;

	class Shield extends Sprite{
		constructor(config) {
			config.width = WIDTH;
			config.height = HEIGHT;

			super(config);

			let that = this;

			that.zIndex = 20;
			that.__type = consts.SpriteType.Shield;
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.strokeStyle = "gray";
			ctx.fillStyle = "red";

			ctx.strokeRect(that.x, that.y, WIDTH, HEIGHT);
			ctx.fillRect(that.x, that.y, WIDTH, HEIGHT);
		}

		onCollidedWith(sprite) {
			let that = this,
				type = sprite.__type;

			if (type === consts.SpriteType.Missile ||
				type === consts.SpriteType.Invader) {
				that.game.removeChild(that);
			}
		}
	}

	return Shield;
});