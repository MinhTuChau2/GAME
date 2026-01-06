import { store, environmentAtom } from "../store";

export default function makeEarthHealthBar(k) {
  const BAR_WIDTH = 220;
  const BAR_HEIGHT = 18;
  const PADDING = 20;

  const bg = k.add([
    k.rect(BAR_WIDTH, BAR_HEIGHT, { radius: 6 }),
    k.pos(k.width() - BAR_WIDTH - PADDING, PADDING),
    k.color(40, 40, 40),
    k.fixed(),
    k.z(100),
    k.stay(),
  ]);

 const fill = k.add([
  k.rect(BAR_WIDTH, BAR_HEIGHT, { radius: 6 }),
  k.pos(bg.pos),
  k.color(80, 200, 120),
  k.anchor("left"),
  k.fixed(),
  k.z(101),
  k.stay(),
  k.scale(1, 1), // <-- ADD THIS
]);

  k.add([
    k.text("Earth Health", { size: 14 }),
    k.pos(bg.pos.x, bg.pos.y - 16),
    k.fixed(),
    k.z(102),
    k.stay(),
  ]);

  //  OBJECT-BASED UPDATE (survives scene changes)
 fill.onUpdate(() => {
  const value = store.get(environmentAtom);

  console.log("Earth health value:", value.toFixed(3));

  fill.scale.x = Math.max(0, value); // now safe

  if (value > 0.6) fill.color = k.rgb(80, 200, 120);
  else if (value > 0.3) fill.color = k.rgb(230, 200, 80);
  else fill.color = k.rgb(220, 80, 80);
});

}
