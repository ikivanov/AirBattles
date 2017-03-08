define(["framework/utils", "sprites/player", "sprites/fighter", "consts"],
	function(Utils, Player, Fighter, consts) {
	const MAX_LEVEL = 4;

	class BaseLevel {
		constructor(config) {
			let that = this;

			that.game = config.game;

			that.initialPlayerX = 275;
			that.initialPlayerY = 540;
		}

		load() {
			let that = this;

			that.createPlayer();
			
			// ground units
			// that.createBunkers(); -> circle with B inside
			// that.createBTRs(); -> rectangle with BTR inside
			// that.createMissileUnits(); -> rectangle with M inside
			// that.createRPGUnits(); -> circle with RPG inside
		}

		loadMore() {
		}

		createPlayer() {
			let that = this,
				player = new Player({ x: that.initialPlayerX, y: that.initialPlayerY });

			that.game.addChild(player);
			that.game.player = player;
		}
	}

	class Level1 extends BaseLevel {
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