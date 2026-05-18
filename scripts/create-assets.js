const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.join(__dirname, '..');
const dir = path.join(root, 'assets');
const websiteCat = path.join(root, 'website', 'images', 'cat-avatar.png');
const sourcePath = path.join(dir, 'cat-avatar.png');
const SIZE = 1024;
const INNER = 520;
const SPLASH_BG = '#F7F5F2';

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

async function writeSplashIcon(filePath) {
  const cat = await sharp(sourcePath)
    .resize(Math.round(SIZE * 0.72), Math.round(SIZE * 0.72), { fit: 'contain' })
    .png()
    .toBuffer();

  await sharp({
    create: { width: SIZE, height: SIZE, channels: 3, background: SPLASH_BG },
  })
    .composite([{ input: cat, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(filePath);
}

async function main() {
  if (process.env.EAS_BUILD === 'true' && fs.existsSync(path.join(dir, 'icon.png'))) {
    console.log('EAS build: use committed icons');
    return;
  }

  fs.mkdirSync(dir, { recursive: true });

  if (fs.existsSync(websiteCat)) {
    fs.copyFileSync(websiteCat, sourcePath);
    console.log('Synced cat-avatar from website/images');
  }

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing ${sourcePath}`);
  }

  await writeLauncherIcon(path.join(dir, 'icon.png'));
  await writeAdaptiveIcon(path.join(dir, 'adaptive-icon.png'));
  await writeSplashIcon(path.join(dir, 'splash-icon.png'));

  for (const name of ['icon.png', 'adaptive-icon.png', 'splash-icon.png']) {
    const p = path.join(dir, name);
    const meta = await sharp(p).metadata();
    const bytes = fs.statSync(p).size;
    console.log(`${name}: ${meta.width}x${meta.height}, alpha=${meta.hasAlpha}, ${bytes} bytes`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
