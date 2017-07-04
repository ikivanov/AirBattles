define(["framework/image-manager"], function(ImageManager) {
	class Sprite {
		constructor(config) {
			this.context = config.context || null;
			this.game = null;
			this.x = config.x;
			this.y = config.y;
			this.width = config.width;
			this.height = config.height;
			this.angle = config.angle !== undefined ? config.angle : 0;
			this.zIndex = config.zIndex !== undefined ? config.zIndex : 0;

			this.image = null;
			if (config.imageFilename) {
				this.image = ImageManager.getImage(config.imageFilename);
			}

			this.parent = null;
			this.velocityX = config.velocityX !== undefined ? config.velocityX : 0;
			this.velocityY = config.velocityY !== undefined ? config.velocityY : 0;
			this.isVisible = config.isVisible !== undefined ? config.isVisible : true;
			this.isDestoyed = false;
			this.isNonPlayable = config.isNonPlayable !== undefined ? config.isNonPlayable : false;
			this.shadow = null;

		}

		update(lastFrameEllapsedTime, keyboard) {
			let distanceX = this.velocityX * lastFrameEllapsedTime,
				distanceY = this.velocityY * lastFrameEllapsedTime;

			this.x += distanceX;
			this.y += distanceY;

			this.updateShadow(this.x, this.y);
		}

		updateShadow(x, y) {
			let shadow = this.shadow;

			if (!shadow) {
				return;
			}

			shadow.x = x + shadow.offsetX;
			shadow.y = y + shadow.offsetY;
		}

		render() {
			let ctx = this.context;

			if (this.image) {
				if (this.angle !== 0) {
					ctx.save();
					ctx.translate(this.x, this.y);
					ctx.rotate((this.angle * Math.PI) / 180);
					ctx.drawImage(this.image, -this.width / 2, -this.height / 2);
					ctx.restore();
				} else {
					ctx.drawImage(this.image, this.x, this.y);
				}
			}
		}

		onCollidedWith(sprite) {
			//add effect or some custom action
		}

		getRect() {
			return { x: this.x, y: this.y, width: this.width, height: this.height };
		}

		destroy() {
		}
	}

	return Sprite;
});