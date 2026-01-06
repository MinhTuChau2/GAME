import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { PALETTE } from "./constants";
import makeSection from "./components/Section";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom } from "./store";
import HomeScene from "./scenes/HomeScene";
import OutsideScene from "./scenes/OutsideScene";

export default function initGame() {
  const k = makeKaplayCtx();

  console.log("Game initialized");

  // Register scenes
  k.scene("home", () => HomeScene(k));
  k.scene("outside", () => OutsideScene(k));

  //  START GAME
  k.go("home");
}
