import { store, mentalAtom } from "../store";

export default function makeMentalHealthBar(k) {
  const BAR_WIDTH = 220;
  const BAR_HEIGHT = 18;
  const PADDING = 20;

  const bg = k.add([
    k.rect(BAR_WIDTH, BAR_HEIGHT, { radius: 6 }),
    k.pos(PADDING, PADDING), // LEFT side
    k.color(40, 40, 40),
    k.fixed(),
    k.stay(),
    k.z(100),
  ]);

  const fill = k.add([
    k.rect(BAR_WIDTH, BAR_HEIGHT, { radius: 6 }),
    k.pos(bg.pos),
    k.color(120, 120, 255),
    k.anchor("left"),
    k.fixed(),
    k.stay(),
    k.z(101),
    k.scale(1, 1), // IMPORTANT
  ]);

  k.add([
    k.text("Mental Health", { size: 14 }),
    k.pos(bg.pos.x, bg.pos.y - 16),
    k.fixed(),
    k.stay(),
    k.z(102),
  ]);

  fill.onUpdate(() => {
    const value = store.get(mentalAtom);
    fill.scale.x = Math.max(0, value);

    if (value > 0.6) fill.color = k.rgb(120, 120, 255);
    else if (value > 0.3) fill.color = k.rgb(200, 150, 255);
    else fill.color = k.rgb(255, 80, 120);
  });
}
