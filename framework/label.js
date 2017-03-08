define(["framework/sprite"], function(Sprite) {
	class Label extends Sprite {
		constructor(config) {
			super(config);

			let that = this;

			that.isNonPlayable = true;
			that.text = config.text || "";
			that.color = config.color;
			that.size = config.size;
			that.fontFamily = config.fontFamily || "Arial";
			that.__type = "Label";
		}

		render() {
			let that = this,
				ctx = that.context;

			ctx.font = `${that.size}px ${that.fontFamily}`;
			ctx.fillStyle = that.color;
			ctx.fillText(that.text, that.x, that.y);
		}
	}

	return Label;
});