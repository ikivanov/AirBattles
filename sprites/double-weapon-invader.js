define(["../sprites/invader", "../consts"], function(Invader, consts) {
	const IMAGE_FILENAME = "images/double-weapon-invader.png";

	class DoubleWeaponInvader extends Invader {
		constructor(config) {
			config.imageFilename = IMAGE_FILENAME;
			super(config);

			let that = this;
			that.scoreBonus = 20;
			that.__type = consts.SpriteType.DoubleWeaponInvader;
		}
	}

	return DoubleWeaponInvader;
});