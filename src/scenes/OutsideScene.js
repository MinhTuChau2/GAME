import makePlayer from "../entities/Player";
import { PALETTE } from "../constants";
import makeSection from "../components/Section";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom } from "../store";

export default function OutsideScene(k, player) {
  if (!player) {
    console.error("❌ Player is undefined in OutsideScene!");
    return;
  }

  const WORLD_WIDTH = 1920;
  const WORLD_HEIGHT = 1080;

  // Move player to outside spawn

  // Ensure the outfit is correct
  if (player.currentOutfitId && player.currentOutfitId !== "none") {
    player.changeOutfit(player.currentOutfitId);
  }

  // Background
  k.add([
    k.rect(WORLD_WIDTH, WORLD_HEIGHT),
    k.pos(0, 0),
    k.color(90, 160, 90),
  ]);
  player.pos = k.vec2(WORLD_WIDTH / 2, WORLD_HEIGHT - 350);
k.add(player);
  // Door back home
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
    k.go("home"); // player keeps their outfit
  });

  
}

