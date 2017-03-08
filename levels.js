define(["framework/utils", "sprites/background", "sprites/player", "sprites/fighter", "consts"],
	function(Utils, Background, Player, Fighter, consts) {
	const MAX_LEVEL = 4;

	class BaseLevel {
		constructor(config) {
			let that = this;

			that.game = config.game;

			that.name = config.name || "";
			that.initialPlayerX = 275;
			that.initialPlayerY = 540;
		}

		load() {
			let that = this;

			that.createBackground();
			that.createPlayer();

			// ground units
			// that.createBunkers(); -> circle with B inside
			// that.createBTRs(); -> rectangle with BTR inside
			// that.createMissileUnits(); -> rectangle with M inside
			// that.createRPGUnits(); -> circle with RPG inside
		}

		loadMore() {
		}

		createBackground() {
		}

		createPlayer() {
			let that = this,
				player = new Player({ x: that.initialPlayerX, y: that.initialPlayerY });

			that.game.addChild(player);
			that.game.player = player;
		}
	}

	class Level1 extends BaseLevel {
		constructor(config) {
			config = config || {};
			config.name = "Battle for Sofia";

			super(config);
		}

		createBackground() {
			let that = this;

			that.game.addChild(new Background({
				intialX: 0,
				intialY: 5743,
				velocityY: -25,
				imageFilename: "images/level1-background.jpg"
			}));
		}
	}

	class Level2 extends BaseLevel {
		constructor(config) {
			config = config || {};
			config.name = "Battle for Beograd";

			super(config);
		}

		createBackground() {
			let that = this;

			that.game.addChild(new Background({
				intialX: 0,
				intialY: 5743,
				velocityY: -25,
				imageFilename: "images/level1-background.jpg"
			}));
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