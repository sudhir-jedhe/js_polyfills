// Convert an rgb() color string to an array

const toRGBArray = rgbStr => rgbStr.match(/\d+/g).map(Number);

toRGBArray('rgb(255, 12, 0)'); // [255, 12, 0]

// Convert an rgb() color string to an object

const toRGBObject = rgbStr => {
    const [red, green, blue] = rgbStr.match(/\d+/g).map(Number);
    return { red, green, blue };
  };
  
  toRGBObject('rgb(255, 12, 0)'); // {red: 255, green: 12, blue: 0}