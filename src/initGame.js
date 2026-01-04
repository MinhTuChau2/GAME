import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { PALETTE } from "./constants";
import makeSection from "./components/Section";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom } from "./store";

const outfits = [
  {
    id: "default",
    name: "Casual",
    desc: "Your everyday outfit. No bonuses.",
  },
  {
    id: "street",
    name: "Streetwear",
    desc: "Boosts confidence. Looks cool.",
  },
  {
    id: "formal",
    name: "Formal",
    desc: "Professional style. Better first impressions.",
  },
  {
    id: "sport",
    name: "Sport",
    desc: "Light and flexible. Faster movement.",
  },
];


function openClosetPopup(k, player) {
  player.locked = true;
  player.inCloset = true;

  // --- DARK BACKGROUND ---
  k.add([
    k.rect(k.width(), k.height()),
    k.pos(0, 0),
    k.color(0, 0, 0),
    k.opacity(0.6),
    k.fixed(),
    k.area(),
    "closetPopup",
  ]);

  // --- PANEL ---
  k.add([
    k.rect(700, 460),
    k.pos(k.center()),
    k.anchor("center"),
    k.color(20, 20, 20),
    k.opacity(0.95),
    k.fixed(),
    "closetPopup",
  ]);

  // --- TITLE ---
  k.add([
    k.text("Choose Your Outfit", { size: 28 }),
    k.pos(k.center().x, k.center().y - 200),
    k.anchor("center"),
    k.fixed(),
    "closetPopup",
  ]);

  const outfitOptions = [
    { id: "outfit1", label: "Handmade clothes", desc: "Ethical, slow fashion" },
    { id: "outfit2", label: "Second-hand clothes", desc: "Sustainable & affordable" },
    { id: "outfit3", label: "Local brands", desc: "Supports local creators" },
    { id: "outfit4", label: "Fast fashion", desc: "Cheap, low sustainability" },
    { id: "outfit5", label: "Vintage", desc: "Unique & reused" },
    { id: "none", label: "No outfit", desc: "Default look" },
  ];

  outfitOptions.forEach((o, i) => {
    const y = k.center().y - 120 + i * 60;

    const button = k.add([
      k.rect(520, 46, { radius: 6 }),
      k.pos(k.center().x, y),
      k.anchor("center"),
      k.color(60, 60, 60),
      k.area(),
      k.fixed(),
      {
        outfitId: o.id,
        baseColor: k.Color.fromArray([60, 60, 60]),
        hoverColor: k.Color.fromArray([100, 100, 100]),
      },
      "closetPopup",
    ]);

    k.add([
      k.text(`${o.label} — ${o.desc}`, { size: 16 }),
      k.pos(k.center().x, y),
      k.anchor("center"),
      k.fixed(),
      "closetPopup",
    ]);

    // --- HOVER ANIMATION ---
    button.onHover(() => {
      button.color = button.hoverColor;
      button.scale = k.vec2(1.03);
    });

    button.onHoverEnd(() => {
      button.color = button.baseColor;
      button.scale = k.vec2(1);
    });

    // --- CLICK ---
    button.onClick(() => {
      player.changeOutfit(o.id);
      closeCloset();
    });
  });

  function closeCloset() {
    k.destroyAll("closetPopup");
    player.locked = false;
    player.inCloset = false;
  }
}




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

  k.loadSprite("outfit1", "./sprites/outfit1.png", {
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

 k.loadSprite("outfit2", "./sprites/outfit2.png", {
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

 k.loadSprite("outfit3", "./sprites/outfit3.png", {
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

 k.loadSprite("outfit4", "./sprites/outfit4.png", {
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

 k.loadSprite("outfit5", "./sprites/outfit5.png", {
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
    else if (s.name === "Closet") {
  openClosetPopup(k, player);
  console.log("Closet opened — choose an outfit");
}


    else {
      console.log(`Interacted with section: ${s.name}`);
    }

  });
});



  // --- PLAYER ---
  const player = makePlayer(k, k.vec2(WORLD_WIDTH / 2, WORLD_HEIGHT / 2), 700);

}
