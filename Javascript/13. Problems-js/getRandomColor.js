/**
 * Generate a random color.
 *
 * Hex, rgb and hsl variants. The hsl one is the most useful in practice:
 * fixing saturation and lightness keeps generated colors visually balanced.
 */

/** Random 6-digit hex color, e.g. '#3f9a2b'. */
function getRandomHexColor() {
  const n = Math.floor(Math.random() * 0x1000000);
  return `#${n.toString(16).padStart(6, '0')}`;
}

/** Random rgb() color. */
function getRandomRgbColor() {
  const channel = () => Math.floor(Math.random() * 256);
  return `rgb(${channel()}, ${channel()}, ${channel()})`;
}

/**
 * Random hsl() color with controlled saturation/lightness,
 * so colors stay readable against a light or dark background.
 */
function getRandomHslColor({ saturation = 70, lightness = 55 } = {}) {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

/** N visually distinct colors, spread evenly around the hue wheel. */
function getDistinctColors(count, { saturation = 70, lightness = 55 } = {}) {
  const step = 360 / count;
  return Array.from(
    { length: count },
    (_, i) => `hsl(${Math.round(i * step)}, ${saturation}%, ${lightness}%)`
  );
}

// ---- Examples ----
console.log(getRandomHexColor()); // e.g. '#a3f01c'
console.log(getRandomRgbColor()); // e.g. 'rgb(12, 200, 87)'
console.log(getRandomHslColor()); // e.g. 'hsl(214, 70%, 55%)'
console.log(getDistinctColors(4)); // 4 evenly spaced hues

module.exports = {
  getRandomHexColor,
  getRandomRgbColor,
  getRandomHslColor,
  getDistinctColors,
};
