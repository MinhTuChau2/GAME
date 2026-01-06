// src/scenes/OutsideScene.js
import makePlayer from "../entities/Player";
import { store, environmentAtom } from "../store";

export default function OutsideScene(k) {
  const WORLD_WIDTH = 1920;
  const WORLD_HEIGHT = 1080;

  // Background
  k.add([
    k.rect(WORLD_WIDTH, WORLD_HEIGHT),
    k.pos(0, 0),
    k.color(90, 160, 90), // green outside
  ]);



  // Player spawn
 const player = makePlayer(
  k,
  k.vec2(WORLD_WIDTH / 2, WORLD_HEIGHT - 350), // ⬆ farther away
  700
);


  // Door back to home
  const door = k.add([
    k.rect(120, 180),
    k.pos(WORLD_WIDTH / 2, WORLD_HEIGHT - 100),
    k.anchor("center"),
    k.color(120, 80, 40),
    k.area(),
    "doorHome",
  ]);

  k.add([
    k.text("Enter Home", { size: 14 }),
    k.pos(door.pos.x, door.pos.y - 120),
    k.anchor("center"),
  ]);

  door.onCollide("player", () => {
    console.log("🚪 Outside → Home");
    k.go("home");
  });

  // Outside improves Earth health slowly
  k.loop(5, () => {
    const current = store.get(environmentAtom);
    store.set(environmentAtom, Math.min(1, current + 0.01));

    console.log(
      "🌱 Outside → Earth health:",
      store.get(environmentAtom).toFixed(2)
    );
  });
}
