const toISOString = date => date.toISOString();

toISOString(
  new Date('2024-01-06T19:20:34+02:00')
); // '2024-01-06T17:20:34.000Z'



// Pad a number to 2 digits
const pad = n => `${Math.floor(Math.abs(n))}`.padStart(2, '0');
// Get timezone offset in ISO format (+hh:mm or -hh:mm)
const getTimezoneOffset = date => {
  const tzOffset = -date.getTimezoneOffset();
  const diff = tzOffset >= 0 ? '+' : '-';
  return diff + pad(tzOffset / 60) + ':' + pad(tzOffset % 60);
};

const toISOStringWithTimezone = date => {
  return date.getFullYear() +
    '-' + pad(date.getMonth() + 1) +
    '-' + pad(date.getDate()) +
    'T' + pad(date.getHours()) +
    ':' + pad(date.getMinutes()) +
    ':' + pad(date.getSeconds()) +
    getTimezoneOffset(date);
};

toISOStringWithTimezone(
  new Date('2024-01-06T19:20:34+02:00')
); /



const isISOString = val => {
    const d = new Date(val);
    return !Number.isNaN(d.valueOf()) && d.toISOString() === val;
  };
  
  const isISOStringWithTimezone = val => {
    const d = new Date(val);
    return !Number.isNaN(d.valueOf()) && toISOStringWithTimezone(d) === val;
  };
  
  isISOString('2020-10-12T10:10:10.000Z'); // true
  isISOString('2020-10-12'); // false
  isISOStringWithTimezone('2020-10-12T10:10:10+02:00'); // true
  isISOStringWithTimezone('2020-10-12T10:10:10.000Z'); // false