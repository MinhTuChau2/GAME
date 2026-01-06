import { DIAGONAL_FACTOR, OUTFIT_DECAY_MODIFIER } from "../constants";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom, outfitAtom } from "../store";

export default function makePlayer(k, posVec2, speed) {
  // ---------------------
  // PLAYER
  // ---------------------
  const player = k.add([
    k.sprite("player", { anim: "walk-down-idle" }),
    k.scale(5),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0), 5, 10) }),
    k.body(),
    k.pos(posVec2),
    "player",
    {
      locked: false,
      lockedBy: null,
      exitPos: null,
      direction: k.vec2(0, 0),
      directionName: "walk-down",
      currentOutfitId: "none",
    },
  ]);
 
  // ---------------------
  // OUTFITS
  // ---------------------
  const outfits = [
    "outfit1", // Handmade
    "outfit2", // Second hand
    "outfit3", // Local brands
    "outfit4", // Fast fashion
    "outfit5", // Vintage
  ];

  player.currentOutfitIndex = -1; // -1 = no outfit

  
player.changeOutfit = (outfitId) => {
  const id = outfitId ?? "none";

  // 🔁 GLOBAL STATE (single source of truth)
  store.set(outfitAtom, id);

  // 🔁 LOCAL STATE (used by decay)
  player.currentOutfitId = id;

  if (player.outfit) {
    player.outfit.destroy();
    player.outfit = null;
  }

  if (id === "none") return;

  player.outfit = player.add([
    k.sprite(id, {
      anim: `${player.directionName}-idle`,
    }),
    k.anchor("center"),
  ]);
};




  // ---------------------
  // INPUT TRACKING
  // ---------------------
  let isMouseDown = false;
  const game = document.getElementById("game");

  const setMouseDown = (val) => (isMouseDown = val);

  ["mousedown", "touchstart"].forEach((evt) =>
    game.addEventListener(evt, () => setMouseDown(true))
  );

  ["mouseup", "touchend", "focusout"].forEach((evt) =>
    game.addEventListener(evt, () => setMouseDown(false))
  );

  // ---------------------
  // CLICK (UNLOCK / CLOSET)
  // ---------------------
  k.onClick(() => {
    // Closet mode → change outfit
    if (player.inCloset) {
  return; // outfit selection handled by popup UI
}


    if (!player.locked) return;

    if (player.lockTimer) {
      clearInterval(player.lockTimer);
      player.lockTimer = null;
    }

    player.locked = false;
    player.lockedBy = null;

    player.isStatic = false;
    player.area.collisionIgnore = [];

    if (player.exitPos) {
      const exitDir = player.exitPos.sub(player.pos).unit();
      player.pos = player.exitPos.add(exitDir.scale(10));
    }

    player.exitPos = null;
  });

  // ---------------------
  // CAMERA
  // ---------------------
  const CAMERA_ZOOM = 1;
  const CAMERA_LERP = 0.12;
  k.camScale(CAMERA_ZOOM);

  // ---------------------
  // WORLD BOUNDS
  // ---------------------
  const WORLD_WIDTH = 1920;
  const WORLD_HEIGHT = 1080;

  k.add([k.rect(WORLD_WIDTH, 5), k.pos(0, 0)]);
  k.add([k.rect(WORLD_WIDTH, 5), k.pos(0, WORLD_HEIGHT - 5)]);
  k.add([k.rect(5, WORLD_HEIGHT), k.pos(0, 0)]);
  k.add([k.rect(5, WORLD_HEIGHT), k.pos(WORLD_WIDTH - 5, 0)]);

  // ---------------------
  // UPDATE LOOP
  // ---------------------
 player.onUpdate(() => {
  // ---------------------
  // 🧥 CLOSET OPEN → FULL LOCK
  // ---------------------
  if (player.inCloset) {
    player.direction = k.vec2(0, 0);

    const idle = `${player.directionName}-idle`;

    if (player.getCurAnim()?.name !== idle) {
      player.play(idle);
    }

    if (player.outfit && player.outfit.getCurAnim()?.name !== idle) {
      player.outfit.play(idle);
    }

    return; // 🚨 STOP EVERYTHING
  }

  // ---------------------
  // 🔒 LOCKED BY OBJECT
  // ---------------------
  if (player.locked) {
    player.direction = k.vec2(0, 0);

    const idle = `${player.directionName}-idle`;

    if (player.getCurAnim()?.name !== idle) {
      player.play(idle);
    }

    if (player.outfit && player.outfit.getCurAnim()?.name !== idle) {
      player.outfit.play(idle);
    }

    return;
  }


    // ---------------------
    // MOVEMENT
    // ---------------------
    player.direction = k.vec2(0, 0);
    const worldMousePos = k.toWorld(k.mousePos());

    if (isMouseDown) {
      player.direction = worldMousePos.sub(player.pos).unit();
    }

    const dx = player.direction.x;
    const dy = player.direction.y;

    if (dx > 0 && Math.abs(dy) < 0.5) player.directionName = "walk-right";
    else if (dx < 0 && Math.abs(dy) < 0.5) player.directionName = "walk-left";
    else if (dy < -0.8) player.directionName = "walk-up";
    else if (dy > 0.8) player.directionName = "walk-down";
    else if (dx < 0 && dy < -0.5) player.directionName = "walk-left-up";
    else if (dx < 0 && dy > 0.5) player.directionName = "walk-left-down";
    else if (dx > 0 && dy < -0.5) player.directionName = "walk-right-up";
    else if (dx > 0 && dy > 0.5) player.directionName = "walk-right-down";

    if (player.direction.eq(k.vec2(0, 0))) {
      const idle = `${player.directionName}-idle`;
      if (!player.getCurAnim()?.name.includes("idle")) {
        player.play(idle);
        if (player.outfit) player.outfit.play(idle);
      }
    } else if (player.getCurAnim()?.name !== player.directionName) {
      player.play(player.directionName);
      if (player.outfit) player.outfit.play(player.directionName);
    }

    const moveSpeed = dx && dy ? DIAGONAL_FACTOR * speed : speed;
    player.move(player.direction.scale(moveSpeed));

    // Clamp
    const halfW = player.width / 2;
    const halfH = player.height / 2;

    player.pos.x = Math.max(halfW, Math.min(WORLD_WIDTH - halfW, player.pos.x));
    player.pos.y = Math.max(halfH, Math.min(WORLD_HEIGHT - halfH, player.pos.y));

    // Camera
    k.camPos(k.camPos().lerp(player.pos, CAMERA_LERP));
  });

  // ---------------------
  // INTERACTIONS
  // ---------------------
  player.interact = (objectTag) => {
    switch (objectTag) {
      case "bed":
        store.set(dayAtom, store.get(dayAtom) + 1);
        store.set(mentalAtom, Math.min(1, store.get(mentalAtom) + 0.2));
        break;

      case "desk":
        store.set(moneyAtom, store.get(moneyAtom) + 10);
        break;

      case "garageDoor":
        k.go("outside");
        break;

      case "exitDoor":
        k.go("house");
        break;

      case "closet":
        player.inCloset = true;
        console.log("Closet opened — click to change outfit");
        break;
    }
  };
// 🔁 Restore outfit on scene load
const savedOutfit = store.get(outfitAtom);

if (savedOutfit && savedOutfit !== "none") {
  player.changeOutfit(savedOutfit);
}

  return player;

  
}
