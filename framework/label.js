define(["framework/sprite"], function(Sprite) {
	class Label extends Sprite {
		constructor(config) {
			super(config);

			let that = this;

			that.isNonPlayable = true;
			that.text = config.text || "";
			that.color = config.color;
			that.size = config.size;
			that.backgroundColor = config.backgroundColor;
			that.fontFamily = config.fontFamily || "Arial";
			that.zIndex = config.zIndex !== undefined ? config.zIndex : 0;
			that.__type = "Label";
		}

		render() {
			let that = this,
				ctx = that.context,
				textX = that.x,
				textY = that.y;

			if (that.width && that.height) {
				textX = (that.width - ctx.measureText(that.text).width) / 2;
				textY = (that.height - that.size) / 2;
				ctx.fillStyle = that.backgroundColor;
				ctx.fillRect(that.x, that.y, that.width, that.height);
			}

			ctx.font = `${that.size}px ${that.fontFamily}`;
			ctx.fillStyle = that.color;
			ctx.fillText(that.text, textX, textY);
		}
	}

	return Label;
});