const uniqueElements = arr => [...new Set(arr)];

uniqueElements([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]


const hasDuplicates = arr => arr.length !== new Set(arr).size;

hasDuplicates([1, 2, 2, 3, 4, 4, 5]); // true
hasDuplicates([1, 2, 3, 4, 5]); // false

const allDistinct = arr => arr.length === new Set(arr).size;

allDistinct([1, 2, 2, 3, 4, 4, 5]); // false
allDistinct([1, 2, 3, 4, 5]); // true

const removeNonUnique = arr =>
    [...new Set(arr)].filter(i => arr.indexOf(i) === arr.lastIndexOf(i));
  
  removeNonUnique([1, 2, 2, 3, 4, 4, 5]); // [1, 3, 5]

  const removeUnique = arr =>
    [...new Set(arr)].filter(i => arr.indexOf(i) !== arr.lastIndexOf(i));
  
  removeUnique([1, 2, 2, 3, 4, 4, 5]); // [2, 4]

  const uniqueElementsBy = (arr, fn) =>
    arr.reduce((acc, v) => {
      if (!acc.some(x => fn(v, x))) acc.push(v);
      return acc;
    }, []);
  
  const hasDuplicatesBy = (arr, fn) =>
    arr.length !== new Set(arr.map(fn)).size;
  
  const removeNonUniqueBy = (arr, fn) =>
    arr.filter((v, i) => arr.every((x, j) => (i === j) === fn(v, x, i, j)));
  
  const data = [
    { id: 0, value: 'a' },
    { id: 1, value: 'b' },
    { id: 2, value: 'c' },
    { id: 1, value: 'd' },
    { id: 0, value: 'e' }
  ];
  const idComparator = (a, b) => a.id == b.id;
  const idMap = a => a.id;
  
  uniqueElementsBy(data, idComparator);
  // [ { id: 0, value: 'a' }, { id: 1, value: 'b' }, { id: 2, value: 'c' } ]
  hasDuplicatesBy(data, idMap); // true
  removeNonUniqueBy(data, idComparator);  // [ { id: 2, value: 'c' } ]