define(["../framework/sprite"], function(Sprite) {
	class PlayerBombEffect extends Sprite {
		constructor(config) {
			super({
				isNonPlayable: true
			});

			let that = this;

			that.start = Date.now();
			that.duration = 150;
			that.zIndex = 10000;

			this.__type = "PlayerBombEffect";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this,
				now = Date.now();

			if (now - that.start > that.duration) {
				that.game.onPlayerBombEffectDone(that);
			}
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
			ctx.rect(0, 0, that.game.width, that.game.height);
			ctx.fill();
		}
	}

	return PlayerBombEffect;
});