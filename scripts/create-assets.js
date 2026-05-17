const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'assets');
const sourcePath = path.join(dir, 'cat-avatar.png');
const SIZE = 1024;
const INNER = 512;

async function writeLauncherIcon(filePath) {
  await sharp(sourcePath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9, palette: true, colors: 256 })
    .toFile(filePath);
}

async function writeAdaptiveIcon(filePath) {
  const innerCircle = Buffer.from(
    `<svg width="${INNER}" height="${INNER}"><circle cx="${INNER / 2}" cy="${INNER / 2}" r="${INNER / 2}" fill="white"/></svg>`
  );
  const catRound = await sharp(sourcePath)
    .resize(INNER, INNER, { fit: 'cover', position: 'center' })
    .composite([{ input: innerCircle, blend: 'dest-in' }])
    .png()
    .toBuffer();

  await sharp({
    create: {
      width: SIZE,
      height: SIZE,
      channels: 4,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    },
  })
    .composite([{ input: catRound, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(filePath);
}

async function main() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(sourcePath)) {
    console.warn('Missing cat-avatar.png — skip icon generation');
    return;
  }

  await writeLauncherIcon(path.join(dir, 'icon.png'));
  await writeAdaptiveIcon(path.join(dir, 'adaptive-icon.png'));
  await writeLauncherIcon(path.join(dir, 'splash-icon.png'));

  for (const name of ['icon.png', 'adaptive-icon.png', 'splash-icon.png']) {
    const meta = await sharp(path.join(dir, name)).metadata();
    const bytes = fs.statSync(path.join(dir, name)).size;
    console.log(`${name}: ${meta.width}x${meta.height}, alpha=${meta.hasAlpha}, ${bytes} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
