define(["framework/label"], function(Label) {
	const FPS_CALCULATION_TIME_INTERVAL = 1000;

	class FPSCounter extends Label {
		constructor(config) {
			super(config);

			let that = this;

			that.fps = 0;
			that.oldTime = new Date();
			that.framesCounter = 0;
			that.isNonPlayable = true;

			that.__type = "fpscounter";
		}

		update(lastFrameEllapsedTime, keyboard) {
			let that = this,
				now = new Date(),
				diff = now.getTime() - that.oldTime.getTime();

			if (diff < FPS_CALCULATION_TIME_INTERVAL) {
				that.framesCounter++;
			} else {
				that.fps = that.framesCounter;
				that.framesCounter = 0;
				that.oldTime = new Date();
			}

			that.text = `fps: ${that.fps}`;
		}
	}

	return FPSCounter;
});