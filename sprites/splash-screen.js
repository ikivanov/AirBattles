define(["../framework/image-manager", "../framework/sprite"], function(ImageManager, Sprite) {
	const IMAGE_FILENAME = "images/background.png",
		LOGO_FILENAME = "images/logo.png";

	class SplashScreen extends Sprite {
		constructor(config) {
			super({
				x: 0,
				y: 0,
				imageFilename: IMAGE_FILENAME,
				isNonPlayable: true
			});

			this.logo = ImageManager.getImage(LOGO_FILENAME);

			this.continueTextVisible = true;
			this.lastTime = Date.now();

			this.__type = "SplashScreen";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let now = Date.now(),
				interval = this.continueTextVisible ? 900 : 750;

			if (now - this.lastTime > interval) {
				this.continueTextVisible = !this.continueTextVisible;
				this.lastTime = Date.now();
			}


			if (keyboard.keys.Space) {
				this.game.onSplashScreenNeedsRemoval(this);
			}
		}

		render() {
			let ctx = this.context;

			super.render();

			//TODO: Replace with background image
			ctx.fillStyle = "black";
			ctx.fillRect(0, 0, 600, 600);
			ctx.drawImage(this.logo, 200, 200);

			ctx.font = "32px Arial";
			ctx.fillStyle = "red";
			ctx.save();
			ctx.translate(150, 150);
			ctx.rotate(350 * Math.PI / 180);
			ctx.fillText("Air Battles, Balkan Capitals", -10, 0);
			ctx.font = "16px Arial";
			ctx.fillText("by Ivan Ivanov", 275, 20);
			ctx.restore();

			ctx.fillStyle = "red";
			if (this.continueTextVisible) {
				ctx.fillStyle = "yellow";
				ctx.font = "16px Arial";
				ctx.fillText("Press Space to continue...", 225, 575);
			}

			ctx.font = "16px Arial";
			ctx.fillStyle = "yellow";
			ctx.fillText("Move left: A or " + String.fromCharCode(parseInt(2190, 16)), 25, 450);
			ctx.fillText("Move right: D or " + String.fromCharCode(parseInt(2192, 16)), 25, 475);
			ctx.fillText("Fire: Space", 25, 500);
			ctx.fillText("Drop bomb: B", 25, 525);
			ctx.fillText("Pause Game: P", 25, 550);
			ctx.fillText("Resume Game: S", 25, 575);
		}
	}

	return SplashScreen;
});