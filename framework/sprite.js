define(["framework/image-manager"], function(ImageManager) {
	class Sprite {
		constructor(config) {
			let that = this;

			that.context = config.context || null;
			that.game = null;
			that.x = config.x;
			that.y = config.y;
			that.width = config.width;
			that.height = config.height;
			that.angle = 0;
			that.zIndex = config.zIndex !== undefined ? config.zIndex : 0;

			that.image = null;
			if (config.imageFilename) {
				that.image = ImageManager.getImage(config.imageFilename);
			}

			that.parent = null;
			that.velocityX = config.velocityX !== undefined ? config.velocityX : 0;
			that.velocityY = config.velocityY !== undefined ? config.velocityY : 0;
			that.isVisible = config.isVisible !== undefined ? config.isVisible : true;
			that.isDestoyed = false;
			that.isNonPlayable = config.isNonPlayable !== undefined ? config.isNonPlayable : false;
			that.shadow = null;

		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this;

			let distanceX = that.velocityX * lastFrameEllapsedTime,
				distanceY = that.velocityY * lastFrameEllapsedTime;

			that.x += distanceX;
			that.y += distanceY;

			that.updateShadow(that.x, that.y);
		}

		updateShadow(x, y) {
			let that = this,
				shadow = that.shadow;

			if (!shadow) {
				return;
			}

			shadow.x = x + shadow.offsetX;
			shadow.y = y + shadow.offsetY;
		}

		render() {
			let that = this,
				ctx = that.context;

			if (that.image) {
				if (that.angle !== 0) {
					ctx.save();
					ctx.translate(that.x, that.y);
					ctx.rotate((that.angle * Math.PI) / 180);
					ctx.drawImage(that.image, -that.width, -that.height);
					ctx.restore();
				} else {
					ctx.drawImage(that.image, that.x, that.y);
				}
			}
		}

		onCollidedWith(sprite) {
			//add effect or some custom action
		}

		getRect() {
			let that = this;

			return { x: that.x, y: that.y, width: that.width, height: that.height };
		}
	}

	return Sprite;
});