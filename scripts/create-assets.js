const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'assets');
const sourcePath = path.join(dir, 'cat-avatar.png');
const SIZE = 1024;

async function writeIcon(filePath) {
  await sharp(sourcePath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .png({ compressionLevel: 9, palette: true })
    .toFile(filePath);
}

async function main() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(sourcePath)) {
    console.warn('Skipping asset generation: missing cat-avatar.png');
    return;
  }

  const iconPath = path.join(dir, 'icon.png');
  if (process.env.EAS_BUILD === 'true' && fs.existsSync(iconPath)) {
    console.log('EAS build: using committed icons, skip regeneration');
    return;
  }

  await writeIcon(iconPath);
  await writeIcon(path.join(dir, 'adaptive-icon.png'));
  await writeIcon(path.join(dir, 'splash-icon.png'));

  console.log('Created cat photo app assets in', dir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
