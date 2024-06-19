let fruit = 'oranges';

switch (fruit) {
  case 'apples':
    console.log('Apples');
    break;
  case 'oranges':
    console.log('Oranges');
    break;
}
// Logs: 'Oranges'

const logFruit = {
  'apples': () => console.log('Apples'),
  'oranges': () => console.log('Oranges')
};

logFruit[fruit](); // Logs: 'Oranges'


/******************************** */
let fruit = 'strawberries';

switch (fruit) {
  case 'apples':
    console.log('Apples');
    break;
  case 'oranges':
    console.log('Oranges');
    break;
  default:
    console.log('Unknown fruit');
}
// Logs: 'Unknown fruit'

const logFruit = {
  'apples': () => console.log('Apples'),
  'oranges': () => console.log('Oranges'),
  'default': () => console.log('Unknown fruit')
};

(logFruit[fruit] || logFruit['default'])(); // Logs: 'Unknown fruit'

/******************************************* */
let fruit = 'oranges';

switch (fruit) {
  case 'apples':
  case 'oranges':
    console.log('Known fruit');
    break;
  default:
    console.log('Unknown fruit');
}
// Logs: 'Known fruit'

const knownFruit = () => console.log('Known fruit');
const unknownFruit = () => console.log('Unknown fruit');

const logFruit = {
  'apples': knownFruit,
  'oranges': knownFruit,
  'default': unknownFruit
};

(logFruit[fruit] || logFruit['default'])(); // Logs: 'Known fruit'


/************************************* */

const switchFn = (lookupObject, defaultCase = '_default') =>
    expression => (lookupObject[expression] || lookupObject[defaultCase])();
  
  const knownFruit = () => console.log('Known fruit');
  const unknownFruit = () => console.log('Unknown fruit');
  
  const logFruit = {
    'apples': knownFruit,
    'oranges': knownFruit,
    'default': unknownFruit
  };
  
  const fruitSwitch = switchFn(logFruit, 'default');
  
  fruitSwitch('apples'); // Logs: 'Known fruit'
  fruitSwitch('pineapples'); // Logs: 'Unknown fruit'