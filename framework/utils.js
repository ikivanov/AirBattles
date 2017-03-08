define([], function() {
	class Utils {
		static hasRectangularCollision(rect1, rect2) {
			if (rect1.x < rect2.x + rect2.width &&
				rect1.x + rect1.width > rect2.x &&
				rect1.y < rect2.y + rect2.height &&
				rect1.height + rect1.y > rect2.y) {
				return true;
			}

			return false;
		}

		static randomRange(min, max)
		{
			return ((Math.random() * (max - min)) + min);
		}
	}

	return Utils;
});