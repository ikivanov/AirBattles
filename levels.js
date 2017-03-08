define(["framework/utils", "sprites/spacecraft", "sprites/shield", "sprites/invader", "sprites/double-weapon-invader", "consts"],
	function(Utils, Spacecraft, Shield, Invader, DoubleWeaponInvader, consts) {
	const MAX_LEVEL = 4;

	class BaseLevel {
		constructor(config) {
			let that = this;

			that.game = config.game;

			that.initialSpacecraftX = 275;
			that.initialSpacecraftY = 540;
		}

		load() {
			let that = this;

			that.createSpacecraft();
			
			// ground units
			// that.createBunkers(); -> circle with B inside
			// that.createBTRs(); -> rectangle with BTR inside
			// that.createMissileUnits(); -> rectangle with M inside
			// that.createRPGUnits(); -> circle with RPG inside
		}

		createSpacecraft() {
			let that = this,
				spacecraft = new Spacecraft({ x: that.initialSpacecraftX, y: that.initialSpacecraftY });

			that.game.addChild(spacecraft);
			that.game.spacecraft = spacecraft;
		}
	}

	class Level1 extends BaseLevel {
	}

	class Level2 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;

			that.initialSpacecraftX = 185;
			that.initialSpacecraftY = 540;
		}
	}

	class Level3 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;

			that.initialSpacecraftX = 185;
			that.initialSpacecraftY = 540;
		}
	}

	class Level4 extends BaseLevel {
		constructor(config) {
			super(config);

			let that = this;
		}
	}

	class LevelFactory {
		static create(level, config) {
			if (level < 1 || level > MAX_LEVEL) {
				throw new Error("Invalid level!");
			}

			return eval(`new Level${level}(config)`);
		}
	}

	return LevelFactory;
});