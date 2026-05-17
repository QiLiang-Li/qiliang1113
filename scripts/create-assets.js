const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const dir = path.join(__dirname, '..', 'assets');
const sourcePath = path.join(dir, 'cat-avatar.png');
const SIZE = 1024;

async function writeIcon(filePath) {
  await sharp(sourcePath)
    .resize(SIZE, SIZE, { fit: 'cover', position: 'center' })
    .png()
    .toFile(filePath);
}

async function main() {
  fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Missing source icon: ${sourcePath}`);
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
