import makeCar from "../entities/Car";
import { store, outfitAtom, environmentAtom, carDecayAtom , moneyAtom  } from "../store";

const COIN_SCALE = 0.1;
const WORLD_WIDTH = 1920;
const WORLD_HEIGHT = 1080;
// Track active coin respawn timers
const coinRespawnTimers = new Set();
let leavingScene = false;

export default function OutsideScene(k, player) {
  if (!player) return;

  // ---------------------
  // Load sprites (ONLY ONCE)
  // ---------------------
  k.loadSprite("prologue", "./sprites/car1.png", {
    sliceX: 4,
    sliceY: 8,
    anims: {
      "drive-down-idle": 0,
      "drive-down": { from: 0, to: 3, loop: true },
      "drive-left-down": { from: 4, to: 7, loop: true },
      "drive-left-down-idle": 4,
      "drive-left": { from: 8, to: 11, loop: true },
      "drive-left-idle": 8,
      "drive-left-up": { from: 12, to: 15, loop: true },
      "drive-left-up-idle": 12,
      "drive-up": { from: 16, to: 19, loop: true },
      "drive-up-idle": 16,
      "drive-right-up": { from: 20, to: 23, loop: true },
      "drive-right-up-idle": 20,
      "drive-right": { from: 24, to: 27, loop: true },
      "drive-right-idle": 24,
      "drive-right-down": { from: 28, to: 31, loop: true },
      "drive-right-down-idle": 28,
    },
  });

  k.loadSprite("civic", "./sprites/car2.png", {
    sliceX: 4,
    sliceY: 8,
    anims: {
      "drive-down-idle": 0,
      "drive-down": { from: 0, to: 3, loop: true },
      "drive-left-down": { from: 4, to: 7, loop: true },
      "drive-left-down-idle": 4,
      "drive-left": { from: 8, to: 11, loop: true },
      "drive-left-idle": 8,
      "drive-left-up": { from: 12, to: 15, loop: true },
      "drive-left-up-idle": 12,
      "drive-up": { from: 16, to: 19, loop: true },
      "drive-up-idle": 16,
      "drive-right-up": { from: 20, to: 23, loop: true },
      "drive-right-up-idle": 20,
      "drive-right": { from: 24, to: 27, loop: true },
      "drive-right-idle": 24,
      "drive-right-down": { from: 28, to: 31, loop: true },
      "drive-right-down-idle": 28,
    },
  });

  k.loadSprite("coin", "./sprites/Coin.png");

  // ---------------------
  // Background
  // ---------------------
  k.add([
    k.rect(WORLD_WIDTH, WORLD_HEIGHT),
    k.pos(0, 0),
    k.color(70, 150, 70),
  ]);

  // ---------------------
// Coin UI
// ---------------------
const coinText = k.add([
  k.text(`Coins: ${store.get(moneyAtom)}`, { size: 18 }),
  k.pos(50, 50),
  k.fixed(),
  k.z(200),
  k.stay(),
]);

// React to money changes
coinText.onUpdate(() => {
  coinText.text = `Coins: ${store.get(moneyAtom)}`;
});

  // ---------------------
  // Player
  // ---------------------
  player.pos = k.vec2(WORLD_WIDTH / 2, WORLD_HEIGHT / 2);
  player.scale = k.vec2(2);
  k.add(player);

  if (player.setBounds) player.setBounds(null);

  // ---------------------
  // Cars (FROM car.js)
  // ---------------------
  const civic = makeCar(
    k,
    k.vec2(WORLD_WIDTH / 2 - 200, WORLD_HEIGHT / 2),
    "civic"
  );

  const prologue = makeCar(
    k,
    k.vec2(WORLD_WIDTH / 2 + 200, WORLD_HEIGHT / 2),
    "prologue"
  );

  // ---------------------
  // Enter car
  // ---------------------
  player.inCar = false;
  player.car = null;

  player.enterCar = (car) => {
  if (player.inCar) return;

  player.inCar = true;
  player.car = car;
  car.driver = player;
  player.hidden = true;

  // 🌍 APPLY CAR POLLUTION
  store.set(carDecayAtom, car.envMultiplier);

  k.camPos(car.pos);
};


  k.onCollide("player", "car", (_, car) => {
    player.enterCar(car);
  });

  
  // ---------------------
  // Coins
  // ---------------------
  function spawnCoin(pos) {
  return k.add([
    k.sprite("coin"),
    k.pos(pos),
    k.scale(COIN_SCALE),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0), 10, 10) }),
    k.opacity(1),
    "coin",
  ]);
}



  for (let i = 0; i < 40; i++) {
    spawnCoin(
      k.vec2(
        k.rand(200, WORLD_WIDTH - 200),
        k.rand(200, WORLD_HEIGHT - 200)
      )
    );
  }

  
const COIN_RESPAWN_TIME = 5000;
const RESPAWN_RADIUS = 40;

k.onCollide("car", "coin", (car, coin) => {
  if (!car.driver) return;
  if (leavingScene) return;

  const basePos = coin.pos.clone();
  coin.destroy();

  store.set(moneyAtom, store.get(moneyAtom) + 1);

  const timerId = setTimeout(() => {
    // 🛑 Do nothing if we already left
    if (leavingScene) return;

    const offset = k.vec2(
      k.rand(-RESPAWN_RADIUS, RESPAWN_RADIUS),
      k.rand(-RESPAWN_RADIUS, RESPAWN_RADIUS)
    );

    const newCoin = spawnCoin(basePos.add(offset));
    newCoin.opacity = 0;

    k.tween(
      0,
      1,
      0.6,
      (v) => (newCoin.opacity = v),
      k.easings.easeOutQuad
    );

    coinRespawnTimers.delete(timerId);
  }, COIN_RESPAWN_TIME);

  coinRespawnTimers.add(timerId);
});




// ---------------------
// Door to go home
// ---------------------
function addHomeDoor(pos) {
  return k.add([
    k.rect(40, 60), // size of the door
    k.pos(pos),
    k.color(150, 75, 0), // brown
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0), 40, 60) }),
    "door",
  ]);
}

// Add the door somewhere in the world
const homeDoor = addHomeDoor(k.vec2(100, WORLD_HEIGHT / 2));

// ---------------------
// Door collision / interaction
// ---------------------
k.onCollide("player", "door", (playerEntity) => {
  // 🛑 STOP ALL COIN RESPAWNS
  leavingScene = true;

  coinRespawnTimers.forEach((id) => clearTimeout(id));
  coinRespawnTimers.clear();

  // 🚗 Force exit car
  if (playerEntity.inCar && playerEntity.car) {
    const car = playerEntity.car;
    car.driver = null;
    playerEntity.pos = car.pos.add(k.vec2(32, 0));
    playerEntity.inCar = false;
    playerEntity.car = null;
    playerEntity.hidden = false;
    store.set(carDecayAtom, 1);
  }

  playerEntity.scale = k.vec2(5);

  // 🚪 Go home
  k.go("home");
});

  // ---------------------
  // Camera
  // ---------------------
  k.onUpdate(() => {
    const target = player.inCar ? player.car.pos : player.pos;
    k.camPos(k.camPos().lerp(target, 0.12));
  });

  // ---------------------
  // Outfit restore
  // ---------------------
  const savedOutfit = store.get(outfitAtom);
  if (savedOutfit && savedOutfit !== "none") {
    player.changeOutfit(savedOutfit);
  }
}
