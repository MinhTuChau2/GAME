import {
  store,
  environmentAtom,
  outfitAtom,
  carDecayAtom,
} from "../store";
import { OUTFIT_DECAY_MODIFIER } from "../constants";

let started = false;

export default function startEarthDecay() {
  if (started) return;
  started = true;

  const BASE_DECAY = 0.001;

  setInterval(() => {
    const current = store.get(environmentAtom);

    // 👕 Outfit modifier
    const outfitId = store.get(outfitAtom) ?? "none";
    const outfitMod = OUTFIT_DECAY_MODIFIER[outfitId] ?? 1;

    // 🚗 Car modifier
    const carMod = store.get(carDecayAtom) ?? 1;

    // 🌍 FINAL DECAY
    const decayAmount = BASE_DECAY * outfitMod * carMod;
    const newValue = Math.max(0, current - decayAmount);

    console.log(
      `[EARTH] Outfit=${outfitId} x${outfitMod} | Car x${carMod} → ${newValue.toFixed(3)}`
    );

    store.set(environmentAtom, newValue);
  }, 1000);
}
