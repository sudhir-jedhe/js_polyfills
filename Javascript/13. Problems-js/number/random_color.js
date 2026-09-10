/**
 * Random color generators.
 *
 * Hex / rgb / rgba / hsl, plus a palette generator that spreads hues evenly
 * so generated series stay visually distinct.
 */

/** '#a3f01c' */
function randomHex() {
  return `#${Math.floor(Math.random() * 0x1000000).toString(16).padStart(6, '0')}`;
}

/** Classic loop-over-hex-digits version. */
function randomHexLoop() {
  const digits = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) color += digits[Math.floor(Math.random() * 16)];
  return color;
}

/** 'rgb(12, 200, 87)' */
function randomRgb() {
  const c = () => Math.floor(Math.random() * 256);
  return `rgb(${c()}, ${c()}, ${c()})`;
}

/** 'rgba(12, 200, 87, 0.5)' */
function randomRgba(alpha = Math.round(Math.random() * 100) / 100) {
  const c = () => Math.floor(Math.random() * 256);
  return `rgba(${c()}, ${c()}, ${c()}, ${alpha})`;
}

/** Controlled saturation/lightness keeps colors usable as UI accents. */
function randomHsl({ saturation = 70, lightness = 55 } = {}) {
  return `hsl(${Math.floor(Math.random() * 360)}, ${saturation}%, ${lightness}%)`;
}

/** N evenly spaced, visually distinct colors. */
function randomPalette(count, { saturation = 70, lightness = 55 } = {}) {
  const offset = Math.random() * 360;
  return Array.from({ length: count }, (_, i) =>
    `hsl(${Math.round((offset + (360 / count) * i) % 360)}, ${saturation}%, ${lightness}%)`
  );
}

/** Pick black or white text so it stays readable on the given hex color. */
function contrastText(hex) {
  const n = parseInt(hex.replace('#', ''), 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  // Relative luminance, ITU-R BT.601 weights.
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

// ---- Examples ----
console.log(randomHex());
console.log(randomHexLoop());
console.log(randomRgb());
console.log(randomRgba(0.4));
console.log(randomHsl());
console.log(randomPalette(5));
console.log(contrastText('#ffee00')); // '#000000'

module.exports = {
  randomHex,
  randomHexLoop,
  randomRgb,
  randomRgba,
  randomHsl,
  randomPalette,
  contrastText,
};
