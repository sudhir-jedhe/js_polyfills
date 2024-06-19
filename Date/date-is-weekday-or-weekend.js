const isWeekday = date => date.getDay() % 6 !== 0;
const isWeekend = date => date.getDay() % 6 === 0;

isWeekday(new Date('2024-01-05')); // true
isWeekend(new Date('2024-01-05')); // false

isWeekday(new Date('2024-01-06')); // false
isWeekend(new Date('2024-01-06')); // true