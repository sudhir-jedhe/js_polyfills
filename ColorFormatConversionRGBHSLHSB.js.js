// Hexadecimal: A 6-digit hexadecimal representation of a color, with 2 digits for each of the red, green and blue components. For example, #ff0000 represents the color red.
// RGB: A comma-separated list of the red, green and blue components of a color, each ranging from 0 to 255. For example, rgb(255, 0, 0) represents the color red.
// HSL: A comma-separated list of the hue, saturation and lightness components of a color, with the hue ranging from 0 to 360, and the saturation and lightness ranging from 0% to 100%. For example, hsl(0, 100%, 50%) represents the color red.
// HSB: A comma-separated list of the hue, saturation and brightness components of a color, with the hue ranging from 0 to 360, and the saturation and brightness ranging from 0% to 100%. For example, hsb(0, 100%, 100%) represents the color red.

const rgbToHex = (r, g, b) =>
    ((r << 16) + (g << 8) + b).toString(16).padStart(6, '0');
  
  rgbToHex(255, 165, 1); // 'ffa501'

  const hexToRgb = hex => {
    let alpha = false,
      h = hex.slice(hex.startsWith('#') ? 1 : 0);
    if (h.length === 3) h = [...h].map(x => x + x).join('');
    else if (h.length === 8) alpha = true;
    h = parseInt(h, 16);
    return (
      'rgb' +
      (alpha ? 'a' : '') +
      '(' +
      (h >>> (alpha ? 24 : 16)) +
      ', ' +
      ((h & (alpha ? 0x00ff0000 : 0x00ff00)) >>> (alpha ? 16 : 8)) +
      ', ' +
      ((h & (alpha ? 0x0000ff00 : 0x0000ff)) >>> (alpha ? 8 : 0)) +
      (alpha ? `, ${h & 0x000000ff}` : '') +
      ')'
    );
  };
  
  hexToRgb('#27ae60ff'); // 'rgba(39, 174, 96, 255)'
  hexToRgb('27ae60'); // 'rgb(39, 174, 96)'
  hexToRgb('#fff'); // 'rgb(255, 255, 255)'



  const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
  };
  
  rgbToHsl(45, 23, 11); // [21.17647, 60.71428, 10.98039]


  const hslToRgb = (h, s, l) => {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
  };
  
  hslToRgb(13, 100, 11); // [56.1, 12.155, 0]



  const rgbToHsb = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const v = Math.max(r, g, b),
      n = v - Math.min(r, g, b);
    const h =
      n === 0 ? 0 : n && v === r ? (g - b) / n : v === g ? 2 + (b - r) / n : 4 + (r - g) / n;
    return [60 * (h < 0 ? h + 6 : h), v && (n / v) * 100, v * 100];
  };
  
  rgbToHsb(252, 111, 48);
  // [18.529411764705856, 80.95238095238095, 98.82352941176471]


  const hsbToRgb = (h, s, b) => {
    s /= 100;
    b /= 100;
    const k = (n) => (n + h / 60) % 6;
    const f = (n) => b * (1 - s * Math.max(0, Math.min(k(n), 4 - k(n), 1)));
    return [255 * f(5), 255 * f(3), 255 * f(1)];
  };
  
  hsbToRgb(18, 81, 99); // [252.45, 109.31084999999996, 47.965499999999984]



  const hslToHsb = (h, s, l) => {
    const b = l + (s / 100) * Math.min(l, 100 - l);
    s = b === 0 ? 0 : 2 * (1 - l / b) * 100;
    return [h, s, b];
  };
  
  hslToHsb(13, 100, 11); // [13, 100, 22]



  const hsbToHsl = (h, s, b) => {
    const l = (b / 100) * (100 - s / 2);
    s = l === 0 || l === 1 ? 0 : ((b - l) / Math.min(l, 100 - l)) * 100;
    return [h, s, l];
  };
  
  hsbToHsl(13, 100, 22); // [13, 100, 11]
  