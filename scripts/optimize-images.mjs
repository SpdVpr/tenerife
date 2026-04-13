import sharp from 'sharp';
import { statSync, renameSync } from 'fs';

const images = [
  { input: 'public/images/tenerife1.jpeg' },
  { input: 'public/images/tenerife2.jpeg' },
];

for (const img of images) {
  const before = statSync(img.input).size;
  const meta = await sharp(img.input).metadata();
  const tmp = img.input + '.opt';
  console.log(`${img.input}: ${meta.width}x${meta.height}, ${Math.round(before / 1024)}KB`);

  await sharp(img.input)
    .resize({ width: 1920, withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(tmp);

  const after = statSync(tmp).size;
  renameSync(tmp, img.input);

  console.log(`  → ${Math.round(after / 1024)}KB (ušetřeno ${Math.round((before - after) / 1024)}KB, ${Math.round((1 - after/before)*100)}%)`);
}
