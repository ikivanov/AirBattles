define(["framework/sprite"], function(Sprite) {
	class Label extends Sprite {
		constructor(config) {
			super(config);

			this.isNonPlayable = true;
			this.text = config.text || "";
			this.color = config.color;
			this.size = config.size;
			this.backgroundColor = config.backgroundColor;
			this.fontFamily = config.fontFamily || "Arial";
			this.zIndex = config.zIndex !== undefined ? config.zIndex : 0;
			this.__type = "Label";
		}

		render() {
			let ctx = this.context,
				textX = this.x,
				textY = this.y;

			if (this.width && this.height) {
				textX = (this.width - ctx.measureText(this.text).width) / 2;
				textY = (this.height - this.size) / 2;
				ctx.fillStyle = this.backgroundColor;
				ctx.fillRect(this.x, this.y, this.width, this.height);
			}

			ctx.font = `${this.size}px ${this.fontFamily}`;
			ctx.fillStyle = this.color;
			ctx.fillText(this.text, textX, textY);
		}
	}

	return Label;
});