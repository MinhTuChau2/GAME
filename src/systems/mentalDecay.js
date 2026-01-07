import {
  store,
  mentalAtom,
  carDecayAtom,
  environmentAtom,
} from "../store";

let started = false;

export default function startMentalDecay() {
  if (started) return;
  started = true;

  const BASE_DECAY = 0.0008;

  setInterval(() => {
    const current = store.get(mentalAtom);

    // 🚗 Car stress modifier
    const carMod = store.get(carDecayAtom) ?? 1;

    // 🌍 Environment impact (bad earth = bad mental)
    const env = store.get(environmentAtom);
    const envMod = env < 0.3 ? 1.5 : env < 0.6 ? 1.2 : 1;

    // 🧠 FINAL DECAY (NO outfit)
    const decayAmount = BASE_DECAY * carMod * envMod;
    const newValue = Math.max(0, current - decayAmount);

    console.log(
      `[MENTAL] Car x${carMod} | Env x${envMod} → ${newValue.toFixed(3)}`
    );

    store.set(mentalAtom, newValue);
  }, 1000);
}
