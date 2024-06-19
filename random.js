let randomNumber = (min = 0, max = 1) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

//generates random id;
let guid = () => {
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  };
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
};

console.log(guid());
//"c2181edf-041b-0a61-3651-79d671fa3db7"



const randomNumberInRange = (min, max) => Math.random() * (max - min) + min;

randomNumberInRange(2, 10); // 6.0211363285087005

const randomIntegerInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

randomIntegerInRange(0, 5); // 2

const randomGauss = () => {
  const theta = 2 * Math.PI * Math.random();
  const rho = Math.sqrt(-2 * Math.log(1 - Math.random()));
  return (rho * Math.cos(theta)) / 10.0 + 0.5;
};

randomGauss(); // 0.5


const randomIntArrayInRange = (min, max, n = 1) =>
  Array.from(
    { length: n },
    () => Math.floor(Math.random() * (max - min + 1)) + min
  );

randomIntArrayInRange(12, 35, 10); // [ 34, 14, 27, 17, 30, 27, 20, 26, 21, 14 ]