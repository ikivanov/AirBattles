define(["../framework/sprite"], function(Sprite) {
	class PlayerBombEffect extends Sprite {
		constructor(config) {
			super({
				isNonPlayable: true
			});

			this.start = Date.now();
			this.duration = 150;
			this.zIndex = 10000;

			this.__type = "PlayerBombEffect";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let now = Date.now();

			if (now - this.start > this.duration) {
				this.game.onPlayerBombEffectDone(this);
			}
		}

		render() {
			let ctx = this.context;

			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 255, 0, 0.2)";
			ctx.rect(0, 0, this.game.width, this.game.height);
			ctx.fill();
		}
	}

	return PlayerBombEffect;
});