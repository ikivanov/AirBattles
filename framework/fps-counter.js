define(["framework/label"], function(Label) {
	const FPS_CALCULATION_TIME_INTERVAL = 1000;

	class FPSCounter extends Label {
		constructor(config) {
			super(config);

			this.fps = 0;
			this.oldTime = Date.now();
			this.framesCounter = 0;
			this.isNonPlayable = true;

			this.__type = "fpscounter";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let now = Date.now(),
				diff = now - this.oldTime;

			if (diff < FPS_CALCULATION_TIME_INTERVAL) {
				this.framesCounter++;
			} else {
				this.fps = this.framesCounter;
				this.framesCounter = 0;
				this.oldTime = Date.now();
			}

			this.text = `fps: ${this.fps}`;
		}
	}

	return FPSCounter;
});