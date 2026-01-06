import makePlayer from "./entities/Player";
import makeKaplayCtx from "./kaplayCtx";
import { PALETTE } from "./constants";
import makeSection from "./components/Section";
import { store, environmentAtom, mentalAtom, moneyAtom, dayAtom } from "./store";
import HomeScene from "./scenes/HomeScene";
import OutsideScene from "./scenes/OutsideScene";
import makeEarthHealthBar from "./ui/EarthHealthBar";
import startEarthDecay from "./systems/earthDecay";

let currentPlayer = null;

export default async function initGame() {
  const k = makeKaplayCtx();
    // Create player once
  const player = makePlayer(k, k.vec2(960, 540), 700); // initial position in home
 currentPlayer = player;
  //  Start decay ONCE
  startEarthDecay(() => currentPlayer);

  // UI listens to environmentAtom
  makeEarthHealthBar(k);

k.scene("home", () => {
  currentPlayer = HomeScene(k, player);
});

k.scene("outside", () => {
  currentPlayer = OutsideScene(k, player);
});


  k.go("home");
}
