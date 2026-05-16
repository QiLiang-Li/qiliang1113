const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const dir = path.join(__dirname, '..', 'assets');
const SIZE = 1024;

/** 生成纯色 PNG（Expo 要求 icon 至少 1024×1024） */
function writeSolidPng(filePath, rgb) {
  const png = new PNG({ width: SIZE, height: SIZE });
  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const i = (SIZE * y + x) << 2;
      png.data[i] = rgb[0];
      png.data[i + 1] = rgb[1];
      png.data[i + 2] = rgb[2];
      png.data[i + 3] = 255;
    }
  }
  return new Promise((resolve, reject) => {
    png
      .pack()
      .pipe(fs.createWriteStream(filePath))
      .on('finish', resolve)
      .on('error', reject);
  });
}

async function main() {
  fs.mkdirSync(dir, { recursive: true });
  const accent = [91, 124, 153];
  const splash = [247, 245, 242];

  await writeSolidPng(path.join(dir, 'icon.png'), accent);
  await writeSolidPng(path.join(dir, 'adaptive-icon.png'), accent);
  await writeSolidPng(path.join(dir, 'splash-icon.png'), splash);

  console.log('Created 1024x1024 assets in', dir);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
