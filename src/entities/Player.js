import { DIAGONAL_FACTOR, OUTFIT_DECAY_MODIFIER } from "../constants";
import { store, outfitAtom } from "../store";

export default function makePlayer(k, posVec2, speed) {
  // ---------------------
  // PLAYER ENTITY
  // ---------------------
  const player = k.add([
    k.sprite("player", { anim: "walk-down-idle" }),
    k.scale(5),
    k.anchor("center"),
    k.area({ shape: new k.Rect(k.vec2(0), 5, 10), solid: true }), // solid for collision
    k.body({ isStatic: false }),
    k.pos(posVec2),
    "player",
    {
      locked: false,
      lockedBy: null,
      unlocking: false,
      inCloset: false,
      exitPos: null,
      justLocked: false,
      direction: k.vec2(0, 0),
      directionName: "walk-down",
      currentOutfitId: "none",
    },
  ]);

  // ---------------------
  // WORLD BOUNDS
  // ---------------------
  let worldWidth = 0;
  let worldHeight = 0;

  player.setBounds = (w, h) => {
    worldWidth = w;
    worldHeight = h;
  };

  // ---------------------
  // OUTFITS
  // ---------------------
  const outfits = ["outfit1", "outfit2", "outfit3", "outfit4", "outfit5"];
  player.currentOutfitIndex = -1;

  player.changeOutfit = (outfitId) => {
    const id = outfitId ?? "none";
    store.set(outfitAtom, id);
    player.currentOutfitId = id;

    if (player.outfit) {
      player.outfit.destroy();
      player.outfit = null;
    }

    if (id === "none") return;
   if (player.inCar) player.hidden = false;
    player.outfit = player.add([
      k.sprite(id, { anim: `${player.directionName}-idle` }),
      k.anchor("center"),
    ]);
  };

  // Restore saved outfit
  const savedOutfit = store.get(outfitAtom);
  if (savedOutfit && savedOutfit !== "none") {
    player.changeOutfit(savedOutfit);
  }

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
  // UNLOCK / CLOSET CLICK
  // ---------------------
  const unlockPlayer = () => {
    if (player.inCloset || !player.locked) return;

    if (player.justLocked) {
      player.justLocked = false;
      return;
    }

    if (player.lockTimer) {
      clearInterval(player.lockTimer);
      player.lockTimer = null;
    }

    player.locked = false;
    player.lockedBy = null;
    player.unlocking = true;
    player.isStatic = false;
    player.area.collisionIgnore = ["section"];

    if (player.exitPos) {
      const exitDir = player.exitPos.sub(player.pos).unit();
      player.pos = player.exitPos.add(exitDir.scale(20));
    }

    player.exitPos = null;

    setTimeout(() => {
      player.area.collisionIgnore = [];
      player.unlocking = false;
    }, 150);
  };

  game.addEventListener("mouseup", unlockPlayer);
  game.addEventListener("touchend", unlockPlayer);

  // ---------------------
  // CAMERA
  // ---------------------
  const CAMERA_ZOOM = 1;
  const CAMERA_LERP = 0.12;
  k.camScale(CAMERA_ZOOM);

  // ---------------------
  // MAIN UPDATE LOOP
  // ---------------------
  player.onUpdate(() => {
    // ---------------------
    // LOCKED / CLOSET STATES
    // ---------------------
    if (player.inCloset || player.locked) {
      player.direction = k.vec2(0, 0);
      const idle = `${player.directionName}-idle`;

      if (!player.getCurAnim()?.name.includes("idle")) {
        player.play(idle);
        if (player.outfit) player.outfit.play(idle);
      }
      return;
    }

    // ---------------------
    // MOVEMENT
    // ---------------------
    player.direction = k.vec2(0, 0);
    const worldMousePos = k.toWorld(k.mousePos());
    if (isMouseDown) player.direction = worldMousePos.sub(player.pos).unit();

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

    // ---------------------
    // CAMERA FOLLOW
    // ---------------------
    k.camPos(k.camPos().lerp(player.pos, CAMERA_LERP));
  });

  return player;
}
