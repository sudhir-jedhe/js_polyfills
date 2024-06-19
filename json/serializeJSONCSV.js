// JavaScript function that serializes a JavaScript value into a JSON string:

Case	                        Sample value	    CSV representation
Simple case	                  ['a','b']	        a,b
Empty value	                  ['a',null]	      a,
Value contains delimiter	    ['a,b','c']	      "a,b",c
Value contains newline	      ['a\nb','c']	    "a\\nb",c
Value contains double quotes	['a"b','c']	      "a""b",c


function serialize(value) {
    // Check if the value is an object
    if (typeof value === 'object') {
      // If it is an object, convert it to a JSON string
      return JSON.stringify(value);
    } else {
      // If it is not an object, return the value as is
      return value;
    }
  }



  const serializeRow = (row, delimiter = ',') => row.join(delimiter);

serializeRow(['a', 'b']);
// 'a,b'
serializeRow(['a', 'b'], ';');
// 'a;b'


const isEmptyValue = value =>
  value === null || value === undefined || Number.isNaN(value);

const serializeValue = (value, delimiter = ',') => {
  if (isEmptyValue(value)) return '';
  value = `${value}`;
  if (
    value.includes(delimiter) ||
    value.includes('\n') ||
    value.includes('"')
  )
    return `"${value.replace(/"/g, '""').replace(/\n/g, '\\n')}"`;
  return value;
};

const serializeRow = (row, delimiter = ',') =>
  row.map(value => serializeValue(`value`, delimiter)).join(delimiter);

serializeRow(['a', 'b']);
// 'a,b'
serializeRow(['a', null]);
// 'a,'
serializeRow(['a,b', 'c']);
// '"a,b",c'
serializeRow(['a\nb', 'c']);
// '"a\\nb",c'
serializeRow(['a"b', 'c']);
// '"a""b",c'


const arrayToCSV = (arr, delimiter = ',') =>
  arr.map(row => serializeRow(row, delimiter)).join('\n');

arrayToCSV([['a', 'b'], ['c', 'd']]);
// 'a,b\nc,d'
arrayToCSV([['a,b', 'c'], ['d', 'e\n"f"']]) ;
// '"a,b",c\nd,"e\\n""f"""'


const extractHeaders = (arr) =>
  [...arr.reduce((acc, obj) => {
    Object.keys(obj).forEach((key) => acc.add(key));
    return acc;
  }, new Set())];

extractHeaders([
  { a: 1, b: 2 },
  { a: 3, b: 4, c: 5 },
  { a: 6 },
  { b: 7 },
]);
// ['a', 'b', 'c']



const objectToCSV = (
  arr,
  headers = extractHeaders(arr),
  omitHeaders = false,
  delimiter = ','
) => {
  const headerRow = serializeRow(headers, delimiter);
  const bodyRows = arr.map(obj =>
    serializeRow(
      headers.map(key => obj[key]),
      delimiter
    )
  );
  return omitHeaders
    ? bodyRows.join('\n')
    : [headerRow, ...bodyRows].join('\n');
};

objectToCSV(
  [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }]
);
// 'a,b,c\n1,2,\n3,4,5\n6,,\n,7,'
objectToCSV(
  [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }],
  ['a', 'b']
);
// 'a,b\n1,2\n3,4\n6,\n,7'
objectToCSV(
  [{ a: 1, b: 2 }, { a: 3, b: 4, c: 5 }, { a: 6 }, { b: 7 }],
  ['a', 'b'],
  true
);
// '1,2\n3,4\n6,\n,7'

const JSONToCSV = (json, headers, omitHeaders) =>
  objectToCSV(JSON.parse(json), headers, omitHeaders);

JSONToCSV(
  '[{"a":1,"b":2},{"a":3,"b":4,"c":5},{"a":6},{"b":7}]'
);
// 'a,b,c\n1,2,\n3,4,5\n6,,\n,7,'
JSONToCSV(
  '[{"a":1,"b":2},{"a":3,"b":4,"c":5},{"a":6},{"b":7}]',
  ['a', 'b']
);
// 'a,b\n1,2\n3,4\n6,\n,7'
JSONToCSV(
  '[{"a":1,"b":2},{"a":3,"b":4,"c":5},{"a":6},{"b":7}]',
  ['a', 'b'],
  true
);
// '1,2\n3,4\n6,\n,7'



const deserializeRow = (row, delimiter = ',') => {
  const values = [];
  let index = 0, matchStart = 0, isInsideQuotations = false;
  while (true) {
    if (index === row.length) {
      values.push(row.slice(matchStart, index));
      break;
    }
    const char = row[index];
    if (char === delimiter && !isInsideQuotations) {
      values.push(
        row
          .slice(matchStart, index)
          .replace(/^"|"$/g, '')
          .replace(/""/g, '"')
          .replace(/\\n/g, '\n')
      );
      matchStart = index + 1;
    }
    if (char === '"')
      if (row[index + 1] === '"') index += 1;
      else isInsideQuotations = !isInsideQuotations;
    index += 1;
  }
  return values;
};

deserializeRow('a,b');
// ['a', 'b']
deserializeRow('a,');
// ['a', '']
deserializeRow('"a,b",c');
// ['a,b', 'c']
deserializeRow('"a""b",c');
// ['a"b', 'c']
deserializeRow('"a\\nb",c');
// ['a\nb', 'c']

const deserializeCSV = (data, delimiter = ',') =>
  data.split('\n').map(row => deserializeRow(row, delimiter));

deserializeCSV('a,b\nc,d');
// [['a', 'b'], ['c', 'd']]
deserializeCSV('a;b\nc;d', ';');
// [['a', 'b'], ['c', 'd']]
deserializeCSV('"a,b",c\n"a""b",c');
// [['a,b', 'c'], ['a"b', 'c']]
deserializeCSV('a,\n"a\\nb",c');
// [['a', ''], ['a\nb', 'c']]


const CSVToArray = (data, delimiter = ',', omitHeader = false) => {
  const rows = data.split('\n');
  if (omitHeader) rows.shift();
  return rows.map(row => deserializeRow(row, delimiter));
};

CSVToArray('a,b\nc,d');
// [['a', 'b'], ['c', 'd']]
CSVToArray('a;b\nc;d', ';');
// [['a', 'b'], ['c', 'd']]
CSVToArray('col1,col2\na,b\nc,d', ',', true);
// [['a', 'b'], ['c', 'd']]


const CSVtoObject = (data, delimiter = ',') => {
  const rows = data.split('\n');
  const headers = deserializeRow(rows.shift(), delimiter);
  return rows.map((row) => {
    const values = deserializeRow(row, delimiter);
    return headers.reduce((obj, key, index) => {
      obj[key] = values[index];
      return obj;
    }, {});
  });
};

CSVtoObject('col1,col2\na,b\nc,d');
// [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}]
CSVtoObject('col1;col2\na;b\nc;d', ';');
// [{'col1': 'a', 'col2': 'b'}, {'col1': 'c', 'col2': 'd'}]


const CSVToJSON = (data, delimiter = ',') =>
  JSON.stringify(CSVtoObject(data, delimiter));

CSVToJSON('col1,col2\na,b\nc,d');
// '[{"col1":"a","col2":"b"},{"col1":"c","col2":"d"}]'
CSVToJSON('col1;col2\na;b\nc;d', ';');
// '[{"col1":"a","col2":"b"},{"col1":"c","col2":"d"}]'