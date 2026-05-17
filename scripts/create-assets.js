const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'assets');
const sourcePath = path.join(dir, 'cat-avatar.png');
const SIZE = 256;

async function writeIcon(filePath) {
  await sharp(sourcePath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .ensureAlpha()
    .png({ compressionLevel: 9 })
    .toFile(filePath);
}

async function main() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(sourcePath)) {
    console.warn('Skipping asset generation: missing cat-avatar.png');
    return;
  }

  if (process.env.EAS_BUILD === 'true') {
    console.log('EAS build: using committed icons');
    return;
  }

  await writeIcon(path.join(dir, 'icon.png'));
  await writeIcon(path.join(dir, 'adaptive-icon.png'));
  await writeIcon(path.join(dir, 'splash-icon.png'));

  console.log('Created cat photo app assets in', dir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
