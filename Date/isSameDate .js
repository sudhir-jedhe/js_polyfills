const isSameDate = (dateA, dateB) =>
    dateA.toISOString() === dateB.toISOString();
  
  isSameDate(new Date('2020-10-20'), new Date('2020-10-20')); // true


  const isBeforeDate = (dateA, dateB) => dateA < dateB;

isBeforeDate(new Date('2020-10-20'), new Date('2020-10-21')); // tru

const isAfterDate = (dateA, dateB) => dateA > dateB;

isAfterDate(new Date('2020-10-21'), new Date('2020-10-20')); // true

isBetweenDates(
    new Date('2020-10-20'),
    new Date('2020-10-30'),
    new Date('2020-10-19')
  ); // false
  isBetweenDates(
    new Date('2020-10-20'),
    new Date('2020-10-30'),
    new Date('2020-10-25')
  ); // true