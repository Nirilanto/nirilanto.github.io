/**
 * Prépare le portrait sur fond noir pour le thème sombre : écrase le point noir
 * pour que le fond de studio devienne un noir pur, qui disparaît ensuite dans la
 * page grâce au mode de fusion « lighten ».
 *
 *   node scripts/portrait-nuit.mjs src/assets/venerand.jpeg src/assets/venerand-nuit.jpg
 */
import sharp from 'sharp';

const [src, out] = process.argv.slice(2);
if (!src || !out) {
  console.error('Usage : node scripts/portrait-nuit.mjs <source.jpg> <sortie.jpg>');
  process.exit(1);
}
const BLACK = 30;
const gain = 255 / (255 - BLACK);
await sharp(src)
  .resize(1344, 1800)
  .linear(gain, -BLACK * gain)
  .jpeg({ quality: 92 })
  .toFile(out);
