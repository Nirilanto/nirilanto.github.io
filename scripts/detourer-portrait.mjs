/**
 * Détoure un portrait pris sur fond blanc : remplit le fond depuis les bords,
 * nettoie les poussières, rogne le liseré et écrit un PNG avec transparence.
 *
 *   node scripts/detourer-portrait.mjs src/assets/venenrand.jpeg src/assets/venerand-detoure.png
 */
import sharp from 'sharp';

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('Usage : node scripts/detourer-portrait.mjs <source.jpg> <sortie.png>');
  process.exit(1);
}
const T = 251,
  W = 1344,
  H = 1800;
const { data } = await sharp(src)
  .resize(W, H)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const white = new Uint8Array(W * H);
for (let i = 0; i < W * H; i++)
  white[i] = Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) >= T ? 1 : 0;
const bg = new Uint8Array(W * H);
const stack = [];
const push = (x, y) => {
  const i = y * W + x;
  if (white[i] && !bg[i]) {
    bg[i] = 1;
    stack.push(i);
  }
};
for (let x = 0; x < W; x++) push(x, 0);
for (let y = 0; y < H * 0.45; y++) {
  push(0, y);
  push(W - 1, y);
}
while (stack.length) {
  const i = stack.pop();
  const x = i % W,
    y = (i / W) | 0;
  if (x > 0) push(x - 1, y);
  if (x < W - 1) push(x + 1, y);
  if (y > 0) push(x, y - 1);
  if (y < H - 1) push(x, y + 1);
}
const alpha = Buffer.alloc(W * H);
for (let i = 0; i < W * H; i++) alpha[i] = bg[i] ? 0 : 255;
const raw = { raw: { width: W, height: H, channels: 1 } };
// 1. supprime les poussières isolées  2. rogne ~2 px le liseré blanc  3. adoucit le bord
let m = await sharp(alpha, raw).blur(3).threshold(128).extractChannel(0).raw().toBuffer();
m = await sharp(m, raw).blur(2.5).threshold(205).extractChannel(0).raw().toBuffer();
m = await sharp(m, raw).blur(1.1).extractChannel(0).raw().toBuffer();
const rgb = await sharp(src).resize(W, H).removeAlpha().raw().toBuffer();
const rgba = Buffer.alloc(W * H * 4);
for (let i = 0; i < W * H; i++) {
  rgba[i * 4] = rgb[i * 3];
  rgba[i * 4 + 1] = rgb[i * 3 + 1];
  rgba[i * 4 + 2] = rgb[i * 3 + 2];
  rgba[i * 4 + 3] = m[i];
}
await sharp(rgba, { raw: { width: W, height: H, channels: 4 } })
  .png({ compressionLevel: 9 })
  .toFile(out);
