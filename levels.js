define(["framework/utils", "sprites/background", "sprites/player", "sprites/fighter", "sprites/kamikaze", "sprites/kamikaze2", "sprites/power-up-2x-basic", "sprites/turret", "consts"],
	function(Utils, Background, Player, Fighter, Kamikaze, Kamikaze2, PowerUp2xBasic, Turret, consts) {
	const MAX_LEVEL = 4;

	class BaseLevel {
		constructor(config) {
			this.game = config.game;

			this.name = config.name || "";
			this.initialPlayerX = 275;
			this.initialPlayerY = this.game.height - Player.Height - 5;
		}

		load() {
			this.createBackground();
			this.createPlayer();
		}

		loadMore() {
		}

		createBackground() {
		}

		createPlayer() {
			let player = new Player({ x: this.initialPlayerX, y: this.initialPlayerY });

			this.game.addChild(player);
			this.game.player = player;
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
			this.intervalBetweenKamikazeLaunches = 10000;
			this.intervalBetweenKamikaze2Launches = 15000;
			this.lastFighterLaunched = Date.now();
			this.intervalBetweenFighterLaunches = 5000;
			this.fighterLauchesMinIntervalValue = 5000;
			this.fighterLauchesMaxIntervalValue = 10000;
			this.turretCoords = [
				{ x: 300, y: 5054 },
				{ x: 70, y: 4654 },
				{ x: 180, y: 3960 },
				{ x: 445, y: 3965 },
				{ x: 515, y: 3395 },
				{ x: 190, y: 3230 },
				{ x: 580, y: 2690 },
				{ x: 430, y: 2180 },
				{ x: 235, y: 1570 },
			];
		}

		createBackground() {
			this.background = new Background({
				intialX: 0,
				intialY: 5354,
				velocityY: -25,
				imageFilename: "images/level1-background.jpg"
			});

			this.game.addChild(this.background);
		}

		loadMore() {
			this.launchFighter();
			this.launchKamikaze();
			this.launchKamikaze2();
			this.dropPowerUp();
			this.createTurrets();
		}


		launchFighter() {
			let player = this.game.player,
				now = Date.now();

			if (now - this.lastFighterLaunched > this.intervalBetweenFighterLaunches) {
				this.game.addChild(new Fighter({
					x: Utils.randomRange(0, this.game.width - Fighter.Width),
					y: -Fighter.Height
				}));

				this.lastFighterLaunched = now;
				this.intervalBetweenFighterLaunches = Utils.randomRange(this.fighterLauchesMinIntervalValue, this.fighterLauchesMaxIntervalValue);
				if (this.fighterLauchesMinIntervalValue > 100) {
					//this.fighterLauchesMinIntervalValue--;
				}

				if (this.fighterLauchesMaxIntervalValue > 500) {
					//this.fighterLauchesMaxIntervalValue -= 5;
				}
			}
		}

		launchKamikaze() {
			let player = this.game.player,
				now = Date.now();

			if (now - this.lastKamikaze2Launched > this.intervalBetweenKamikaze2Launches) {
				this.game.addChild(new Kamikaze({
					x: player.x,
					y: -Kamikaze.Height
				}));

				this.lastKamikaze2Launched = now;
				this.intervalBetweenKamikaze2Launches = Utils.randomRange(5000, 7500);
			}
		}

		launchKamikaze2() {
			let player = this.game.player,
				now = Date.now();

			if (now - this.lastKamikazeLaunched > this.intervalBetweenKamikazeLaunches) {
				this.game.addChild(new Kamikaze2({
					x: Utils.randomRange(0, this.game.width - Kamikaze2.Width),
					y: -Kamikaze2.Height
				}));

				this.lastKamikazeLaunched = now;
				this.intervalBetweenKamikazeLaunches = Utils.randomRange(3500, 5000);
			}
		}

		dropPowerUp() {
			if (this.powerUpDroped) {
				return;
			}

			let now = Date.now();

			if (now - this.levelStart > 60000) {
				this.game.addChild(new PowerUp2xBasic({
					x: Utils.randomRange(0, this.game.width - PowerUp2xBasic.Width),
					y: -PowerUp2xBasic.Height
				}));
				this.powerUpDroped = true;
			}
		}

		createTurrets() {
			this.turretCoords.forEach(c => {
				if (c.created) {
					return;
				}

				if (this.background.y >= c.y && this.background.y - 700 <= c.y) {
					this.game.addChild(new Turret({
						x: c.x,
						y: 600 - (this.background.y - c.y)
					}));

					c.created = true;
				}
			});
		}
	}

	class Level2 extends BaseLevel {
		constructor(config) {
			config = config || {};
			config.name = "Battle for Beograd";

			super(config);
		}

		createBackground() {
			this.game.addChild(new Background({
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