const startDay = 1; // Monday
const endDay = 5; // Friday
const startHour = 9; // 9:00 AM
const endHour = 17; // 5:00 PM

const isInsideBusinessHours = (date = new Date()) => {
  const day = date.getDay();
  const hour = date.getHours();
  return day >= startDay && day <= endDay &&
         hour >= startHour && hour < endHour;
};

// The above code is configured to work with business hours from 9:00 AM to 5:00 PM (both inclusive), Monday to Friday. You can easily change the startDay, endDay, startHour, and endHour variables to match your business hours.

const holidays = [
    [1, 1], // New Year's Day
    [6, 1], // Epiphany
    [25, 3], // Greek Independence Day
    [1, 5], // Labour Day
    [15, 8], // Dormition of the Holy Virgin
    [28, 10], // Ochi Day
    [25, 12], // Christmas Day
    [26, 12] // Boxing Day
  ];
  
  const dateTimeFormatOptions = {
    timeZone: 'Europe/Athens',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    weekday: 'narrow',
    hour: 'numeric',
    hour12: false,
    minute: 'numeric'
  };
  
  const startHour = 9, endHour = 17;
  
  const isInsideHours = (hour) => hour >= startHour && hour < endHour;
  
  const isWeekday = (weekday) => weekday !== 'S';
  
  const isHoliday = (day, month) =>
    holidays.some(([hDay, hMonth]) => hDay === day && hMonth === month);
  
  const parseDateSegments = (date = new Date()) =>
    new Intl.DateTimeFormat('en-US', dateTimeFormatOptions)
      .formatToParts(date)
      .reduce((acc, part) => {
        const { type, value } = part;
        if (type === 'weekday') acc.weekday = value;
        else if (type !== 'literal') acc[type] = parseInt(value, 10);
        return acc;
      }, {});
  
  export const isInsideBusinessHours = (date = new Date()) => {
    const { weekday, day, month, hour } = parseDateSegments(date);
  
    return isInsideHours(hour) && isWeekyday(weekday) && !isHoliday(day, month);
  };