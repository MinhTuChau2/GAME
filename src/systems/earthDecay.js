import { store, environmentAtom } from "../store";
import { OUTFIT_DECAY_MODIFIER } from "../constants";

let started = false;

export default function startEarthDecay(getPlayer) {
  if (started) return; // 🚨 prevent duplicate timers
  started = true;

  const BASE_DECAY = 0.01;

  setInterval(() => {
    const current = store.get(environmentAtom);

    const player = getPlayer?.(); // ✅ ALWAYS current player
    const outfitId = player?.currentOutfitId ?? "none";
    const modifier = OUTFIT_DECAY_MODIFIER[outfitId] ?? 1;

    const decayAmount = BASE_DECAY * modifier;
    const newValue = Math.max(0, current - decayAmount);

    console.log(
      `[EARTH] Outfit=${outfitId} x${modifier} → ${newValue.toFixed(3)}`
    );

    store.set(environmentAtom, newValue);
  }, 1000);
}
