import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { PALETTE } from "./constants";
import makeSection from "./components/Section";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom } from "./store";


export default async function initGame(kaplayCtx) {
  const WORLD_WIDTH = 1920;
  const WORLD_HEIGHT = 1080;

  const k = makeKaplayCtx();
  console.log("Game initialized with kaplay context and store:", kaplayCtx, store);

  // --- LOAD PLAYER SPRITE ---
  k.loadSprite("player", "./sprites/player.png", {
    sliceX: 4,
    sliceY: 8,
    anims: {
      "walk-down-idle": 0,
      "walk-down": { from: 0, to: 3, loop: true },
      "walk-left-down": { from: 4, to: 7, loop: true },
      "walk-left-down-idle": 4,
      "walk-left": { from: 8, to: 11, loop: true },
      "walk-left-idle": 8,
      "walk-left-up": { from: 12, to: 15, loop: true },
      "walk-left-up-idle": 12,
      "walk-up": { from: 16, to: 19, loop: true },
      "walk-up-idle": 16,
      "walk-right-up": { from: 20, to: 23, loop: true },
      "walk-right-up-idle": 20,
      "walk-right": { from: 24, to: 27, loop: true },
      "walk-right-idle": 24,
      "walk-right-down": { from: 28, to: 31, loop: true },
      "walk-right-down-idle": 28,
    }
  });

  // --- LOAD BACKGROUND IMAGE ---
  k.loadSprite("home-bg", "./sprites/Home.png");

  // --- LOAD SECTION IMAGES ---
  k.loadSprite("bed", "./sprites/bed.png");
  k.loadSprite("meditate", "./sprites/meditate.png");
  k.loadSprite("closet", "./sprites/Closet.png");
  k.loadSprite("books", "./sprites/Books.png");

  // --- SHADER BACKGROUND (BEHIND EVERYTHING) ---
  k.loadShaderURL("tiledPattern", null, "/shaders/tiledPattern.frag");
  const shaderBackground = k.add([
    k.uvquad(k.width(), k.height()),
    k.shader("tiledPattern", () => ({
      u_time: k.time() / 20,
      u_color1: k.Color.fromHex(PALETTE.color3),
      u_color2: k.Color.fromHex(PALETTE.color2),
      u_speed: k.vec2(1, -1),
      u_aspect: k.width() / k.height(),
      u_size: 5,
    })),
    k.pos(0, 0),
    k.fixed(true),
  ]);

  shaderBackground.onUpdate(() => {
    shaderBackground.width = k.width();
    shaderBackground.height = k.height();
    shaderBackground.uniform.u_aspect = k.width() / k.height();
  });

  // --- IMAGE BACKGROUND (WORLD SIZE) ---
  const background = k.add([
    k.sprite("home-bg"),
    k.pos(0, 0),
    k.anchor("topleft"),
  ]);

  k.onUpdate(() => {
    if (background.width && background.height) {
      const scaleX = WORLD_WIDTH / background.width;
      const scaleY = WORLD_HEIGHT / background.height;
      background.scale = k.vec2(scaleX, scaleY);
    }
  });

 // --- SECTIONS AS PNG OBSTACLES WITH INTERACTION ---
const sections = [
  { pos: k.vec2(WORLD_WIDTH / 2 - 800, WORLD_HEIGHT / 2 - 380), name: "Bed", sprite: "bed" },
  { pos: k.vec2(WORLD_WIDTH / 2 - 770, WORLD_HEIGHT / 2 + 270), name: "Meditate", sprite: "meditate" },
  { pos: k.vec2(WORLD_WIDTH / 2 - 100, WORLD_HEIGHT / 2 - 390), name: "Closet", sprite: "closet" },
  { pos: k.vec2(WORLD_WIDTH / 2 + 700, WORLD_HEIGHT / 2 - 420), name: "Books", sprite: "books" },
];

sections.forEach((s) => {
  const section = k.add([
    k.sprite(s.sprite),
    k.pos(s.pos),
    k.anchor("center"),
    k.area(),
    k.body({ isStatic: true }), // blocks movement
    "section",
    { sectionName: s.name },
  ]);

  section.onCollide("player", (player) => {
    if (player.locked) return;

    if (s.name === "Bed" || s.name === "Meditate") {
      // --- LOCK PLAYER ---
      player.locked = true;
      player.lockedBy = s.name;

      // Save exit position
      player.exitPos = player.pos.clone();

      // Stop movement & physics
      player.velocity = k.vec2(0, 0);
      player.isStatic = true;
      player.area.collisionIgnore = ["section"];

      // Snap to center of the object
      player.pos = section.pos.clone();

      // --- START COUNTER ---
      player.lockStartTime = Date.now();

      // Clear previous timer if any
      if (player.lockTimer) {
        clearInterval(player.lockTimer);
      }

      player.lockTimer = setInterval(() => {
        const elapsedSec = (Date.now() - player.lockStartTime) / 1000;
        const isPenaltyPhase = elapsedSec >= 300; // after 5 minutes

        let delta = 0;
        if (s.name === "Bed") delta = isPenaltyPhase ? -1 : 1;                // +1 every 10s
        if (s.name === "Meditate") delta = isPenaltyPhase ? -0.5 : 0.5;

        const current = store.get(mentalAtom);
        store.set(mentalAtom, current + delta);

        console.log(
          `${s.name} ${isPenaltyPhase ? "penalty" : "bonus"} → mental =`,
          store.get(mentalAtom)
        );
      }, 10_000); // every 10 seconds
    }
    else {
      console.log(`Interacted with section: ${s.name}`);
    }

  });
});



  // --- PLAYER ---
  makePlayer(k, k.vec2(WORLD_WIDTH / 2, WORLD_HEIGHT / 2), 700);
}
