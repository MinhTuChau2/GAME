import { store, environmentAtom } from "../store";

export default function makeEarthHealthBar(k) {
  const BAR_WIDTH = 220;
  const BAR_HEIGHT = 18;
  const PADDING = 20;

  // ✅ MUST be here (function scope)
  const startTime = k.time();
  let gameOverShown = false;

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
    k.scale(1, 1),
  ]);

  k.add([
    k.text("Earth Health", { size: 14 }),
    k.pos(bg.pos.x, bg.pos.y - 16),
    k.fixed(),
    k.z(102),
    k.stay(),
  ]);

  fill.onUpdate(() => {
    const value = store.get(environmentAtom);

    fill.scale.x = Math.max(0, value);

    if (value > 0.6) fill.color = k.rgb(80, 200, 120);
    else if (value > 0.3) fill.color = k.rgb(230, 200, 80);
    else fill.color = k.rgb(220, 80, 80);

    //  GAME OVER (only once)
    if (value <= 0 && !gameOverShown) {
      gameOverShown = true;

      const survivedTime = (k.time() - startTime).toFixed(2);

      // Overlay
      k.add([
        k.rect(k.width(), k.height()),
        k.color(0, 0, 0),
        k.opacity(0.75),
        k.fixed(),
        k.z(200),
      ]);

      k.add([
        k.text("GAME OVER", { size: 48 }),
        k.pos(k.center().x, k.center().y - 100),
        k.anchor("center"),
        k.fixed(),
        k.z(201),
      ]);

      k.add([
        k.text(`You survived ${survivedTime} seconds`, { size: 20 }),
        k.pos(k.center().x, k.center().y - 30),
        k.anchor("center"),
        k.fixed(),
        k.z(201),
      ]);

      k.add([
        k.text("Better make the right decisions next time", { size: 16 }),
        k.pos(k.center().x, k.center().y + 10),
        k.anchor("center"),
        k.fixed(),
        k.z(201),
      ]);

      // 🔁 Restart button
      const restartBtn = k.add([
        k.rect(180, 44, { radius: 8 }),
        k.pos(k.center().x, k.center().y + 70),
        k.anchor("center"),
        k.color(100, 180, 255),
        k.fixed(),
        k.z(201),
        k.area(),
      ]);

      k.add([
        k.text("Restart", { size: 18 }),
        k.pos(restartBtn.pos),
        k.anchor("center"),
        k.fixed(),
        k.z(202),
      ]);

      restartBtn.onHover(() => {
        restartBtn.scale = k.vec2(1.05);
        restartBtn.color = k.rgb(140, 210, 255);
      });

      restartBtn.onHoverEnd(() => {
        restartBtn.scale = k.vec2(1);
        restartBtn.color = k.rgb(100, 180, 255);
      });

      restartBtn.onClick(() => {
        store.set(environmentAtom, 1);
        gameOverShown = false;
        k.go("home");
      }); 
      // Optional hard stop
      // k.timeScale(0);
    }
  });
}
