const fs = require('fs');
const path = require('path');

const png = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAFUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==',
  'base64'
);

const dir = path.join(__dirname, '..', 'assets');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'icon.png'), png);
fs.writeFileSync(path.join(dir, 'splash-icon.png'), png);
fs.writeFileSync(path.join(dir, 'adaptive-icon.png'), png);
const required = ['icon.png', 'splash-icon.png', 'adaptive-icon.png'];
const missing = required.filter((name) => !fs.existsSync(path.join(dir, name)));
if (missing.length === 0) {
  console.log('Assets OK:', dir);
} else {
  console.log('Created assets:', missing.join(', '));
}

