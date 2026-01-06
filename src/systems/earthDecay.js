import { store, environmentAtom, outfitAtom } from "../store";
import { OUTFIT_DECAY_MODIFIER } from "../constants";

let started = false;

export default function startEarthDecay() {
  if (started) return;
  started = true;

  const BASE_DECAY = 0.001;

  setInterval(() => {
    const current = store.get(environmentAtom);

    // 🌍 Single source of truth
    const outfitId = store.get(outfitAtom) ?? "none";
    const modifier = OUTFIT_DECAY_MODIFIER[outfitId] ?? 1;

    const decayAmount = BASE_DECAY * modifier;
    const newValue = Math.max(0, current - decayAmount);

    console.log(
      `[EARTH] Outfit=${outfitId} x${modifier} → ${newValue.toFixed(3)}`
    );

    store.set(environmentAtom, newValue);
  }, 1000);
}
