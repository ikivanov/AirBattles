define(["framework/utils", "sprites/background", "sprites/player", "sprites/fighter", "sprites/kamikaze", "sprites/kamikaze2", "sprites/power-up-2x-basic", "consts"],
	function(Utils, Background, Player, Fighter, Kamikaze, Kamikaze2, PowerUp2xBasic, consts) {
	const MAX_LEVEL = 4;

	class BaseLevel {
		constructor(config) {
			let that = this;

			that.game = config.game;

			that.name = config.name || "";
			that.initialPlayerX = 275;
			that.initialPlayerY = that.game.height - Player.Height - 5;
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

			this.levelStart = Date.now();
			this.powerUpDroped = false;
			this.lastKamikazeLaunched = Date.now();
			this.lastKamikaze2Launched = Date.now();
			this.intervalBetweenKamikazeLaunches = 5000;
			this.intervalBetweenKamikaze2Launches = 7500;
			this.lastFighterLaunched = Date.now();
			this.intervalBetweenFighterLaunches = 250;
			this.fighterLauchesMinIntervalValue = 1000;
			this.fighterLauchesMaxIntervalValue = 2000;
		}

		createBackground() {
			let that = this;

			that.game.addChild(new Background({
				intialX: 0,
				intialY: 5354,
				velocityY: -25,
				imageFilename: "images/level1-background.jpg"
			}));
		}

		loadMore() {
			let that = this;

			that.launchFighter();
			that.launchKamikaze();
			that.launchKamikaze2();
			that.dropPowerUp();
		}


		launchFighter() {
			let that = this,
				player = that.game.player,
				now = Date.now();

			if (now - that.lastFighterLaunched > that.intervalBetweenFighterLaunches) {
				that.game.addChild(new Fighter({
					x: Utils.randomRange(0, that.game.width - Fighter.Width),
					y: -Fighter.Height
				}));

				that.lastFighterLaunched = now;
				that.intervalBetweenFighterLaunches = Utils.randomRange(that.fighterLauchesMinIntervalValue, that.fighterLauchesMaxIntervalValue);
				if (that.fighterLauchesMinIntervalValue > 100) {
					//that.fighterLauchesMinIntervalValue--;
				}

				if (that.fighterLauchesMaxIntervalValue > 500) {
					//that.fighterLauchesMaxIntervalValue -= 5;
				}
			}
		}

		launchKamikaze() {
			let that = this,
				player = that.game.player,
				now = Date.now();

			if (now - that.lastKamikaze2Launched > that.intervalBetweenKamikaze2Launches) {
				that.game.addChild(new Kamikaze({
					x: player.x,
					y: -Kamikaze.Height
				}));

				that.lastKamikaze2Launched = now;
				that.intervalBetweenKamikaze2Launches = Utils.randomRange(5000, 7500);
			}
		}

		launchKamikaze2() {
			let that = this,
				player = that.game.player,
				now = Date.now();

			if (now - that.lastKamikazeLaunched > that.intervalBetweenKamikazeLaunches) {
				that.game.addChild(new Kamikaze2({
					x: Utils.randomRange(0, that.game.width - Kamikaze2.Width),
					y: -Kamikaze2.Height
				}));

				that.lastKamikazeLaunched = now;
				that.intervalBetweenKamikazeLaunches = Utils.randomRange(3500, 5000);
			}
		}

		dropPowerUp() {
			if (this.powerUpDroped) {
				return;
			}

			let that = this,
				now = Date.now();

			if (now - that.levelStart > 60000) {
				that.game.addChild(new PowerUp2xBasic({
					x: Utils.randomRange(0, that.game.width - PowerUp2xBasic.Width),
					y: -PowerUp2xBasic.Height
				}));
				that.powerUpDroped = true;
			}
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