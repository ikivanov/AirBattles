define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const
		LEVEL_OFFSET = 75,
		SCORES_OFFSET = 150;

	class Statistics extends Sprite {
		constructor(config) {
			config.isNonPlayable = true;
			super(config);

			let that = this;

			that.lives = 0;
			that.level = 0;
			that.scores = 0;

			that.zIndex = 10;
			that.__type = consts.SpriteType.Statistics;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			that.lives = that.game.player ? that.game.player.lives : 0;
			that.level = that.game.level;
			that.scores = that.game.scores;
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText(`Lives: ${that.lives}`, that.x, that.y);
			ctx.fillText(`Level: ${that.level}`, that.x + LEVEL_OFFSET, that.y);
			ctx.fillText(`Scores: ${that.scores}`, that.x + SCORES_OFFSET, that.y);
		}
	}

	return Statistics;
});