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

		static hasCircleRectangleCollision(circle, rect)
		{
			let closestX = (circle.x < rect.x ? rect.x : (circle.x > rect.x + rect.width ? rect.x + rect.width : circle.x)),
				closestY = (circle.y < rect.y ? rect.y : (circle.y > rect.y + rect.height ? rect.y + rect.height : circle.y)),
				dx = closestX - circle.x,
				dy = closestY - circle.y;

			return (dx * dx + dy * dy) <= circle.radius * circle.radius;
		}

		static randomRange(min, max)
		{
			return ((Math.random() * (max - min)) + min);
		}
	}

	return Utils;
});