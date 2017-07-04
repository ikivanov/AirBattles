define(["../framework/sprite"], function(Sprite) {
	class PlayerDamageEffect extends Sprite {
		constructor(config) {
			super({
				isNonPlayable: true
			});

			this.start = Date.now();
			this.duration = 150;
			this.zIndex = 10000;

			this.__type = "PlayerDamageEffect";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let now = Date.now();

			if (now - this.start > this.duration) {
				this.game.onPlayerDamageEffectDone(this);
			}
		}

		render() {
			let ctx = this.context;

			ctx.beginPath();
			ctx.fillStyle = "rgba(255, 0, 0, 0.2)";
			ctx.rect(0, 0, this.game.width, this.game.height);
			ctx.fill();
		}
	}

	return PlayerDamageEffect;
});