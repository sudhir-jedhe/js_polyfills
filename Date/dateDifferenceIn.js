const dateDifferenceInSeconds = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 1_000;
  
  dateDifferenceInSeconds(
    new Date('2020-12-24 00:00:15'),
    new Date('2020-12-24 00:00:17')
  ); // 2


  const dateDifferenceInMinutes = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 60_000;
  
  dateDifferenceInMinutes(
    new Date('2021-04-24 01:00:15'),
    new Date('2021-04-24 02:00:15')
  ); // 60


  const dateDifferenceInHours = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 3_600_000;
  
  dateDifferenceInHours(
    new Date('2021-04-24 10:25:00'),
    new Date('2021-04-25 10:25:00')
  ); // 24

  const dateDifferenceInDays = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 86_400_000;
  
  dateDifferenceInDays(
    new Date('2017-12-13'),
    new Date('2017-12-22')
  ); // 9


  const isWeekday = date => date.getDay() % 6 !== 0;
const addDaysToDate = (date, n) => {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
};

const dateDifferenceInWeekdays = (startDate, endDate) =>
  Array
    .from({ length: (endDate - startDate) / 86_400_000 })
    .filter((_, i) => isWeekday(addDays(startDate, i + 1)))
    .length;

dateDifferenceInWeekdays(
  new Date('Oct 05, 2020'),
  new Date('Oct 06, 2020')
); // 1
dateDifferenceInWeekdays(
  new Date('Oct 05, 2020'),
  new Date('Oct 14, 2020')
); // 7


const dateDifferenceInWeeks = (dateInitial, dateFinal) =>
    (dateFinal - dateInitial) / 604_800_000;
  
  dateDifferenceInWeeks(
    new Date('2023-01-01'),
    new Date('2023-01-08')
  ); // 1


  const dateDifferenceInMonths = (dateInitial, dateFinal) =>
    Math.max(
      (dateFinal.getFullYear() - dateInitial.getFullYear()) * 12 +
        dateFinal.getMonth() -
        dateInitial.getMonth(),
      0
    );
  
  dateDifferenceInMonths(
    new Date('2017-12-13'),
    new Date('2018-04-29')
  ); // 4


  const dateDifferenceInYears = (dateInitial, dateFinal) =>
    dateDifferenceInMonths(dateInitial, dateFinal) / 12;
  
  dateDifferenceInYears(
    new Date('2017-12-13'),
    new Date('2019-12-15')
  ); // 2