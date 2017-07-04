define(["../framework/sprite", "../consts"], function(Sprite, consts) {
	const
		LEVEL_OFFSET = 75,
		SCORES_OFFSET = 150,
		BOMBS_OFFSET = 250;

	class Statistics extends Sprite {
		constructor(config) {
			config.isNonPlayable = true;
			super(config);

			this.lives = 0;
			this.level = 0;
			this.scores = 0;
			this.bombs = 0;

			this.zIndex = 10;
			this.__type = consts.SpriteType.Statistics;
		}

		update(lastFrameEllapsedTime, keyboard) {
			let player = this.game.player;

			this.lives = this.game.player ? this.game.player.lives : 0;
			this.level = this.game.level;
			this.scores = this.game.scores;
			this.bombs = player ? player.bombs : 0;
		}

		render() {
			let ctx = this.context;

			ctx.font = "14px Arial";
			ctx.fillStyle = "white";
			ctx.textAlign = "left";

			ctx.fillText(`Lives: ${this.lives}`, this.x, this.y);
			ctx.fillText(`Level: ${this.level}`, this.x + LEVEL_OFFSET, this.y);
			ctx.fillText(`Scores: ${this.scores}`, this.x + SCORES_OFFSET, this.y);
			ctx.fillText(`Bombs: ${this.bombs}`, this.x + BOMBS_OFFSET, this.y);
		}
	}

	return Statistics;
});