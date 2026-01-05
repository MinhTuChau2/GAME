import { atom, createStore } from "jotai";


export const environmentAtom = atom(1);
export const mentalAtom = atom(1);
export const moneyAtom = atom(0);
export const dayAtom = atom(1);
export const earthAtom = atom(1);



export const cameraZoomValueAtom = atom(1);

export const store = createStore();