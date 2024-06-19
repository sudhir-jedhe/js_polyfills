const minDate = (...dates) => new Date(Math.min(...dates));
const maxDate = (...dates) => new Date(Math.max(...dates));

const dates = [
  new Date('2017-05-13'),
  new Date('2018-03-12'),
  new Date('2016-01-10'),
  new Date('2016-01-09')
];
minDate(...dates); // 2016-01-09
maxDate(...dates); // 2018-03-12