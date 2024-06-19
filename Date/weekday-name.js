const dayName = (date, locale) =>
    date.toLocaleDateString(locale, { weekday: 'long' });
  
  dayName(new Date()); // 'Monday'
  dayName(new Date('05/27/2024'), 'de-DE'); // 'Montag'


  const shortDayName = (date, locale) =>
    date.toLocaleDateString(locale, { weekday: 'short' });
  
  shortDayName(new Date()); // 'Mon'
  shortDayName(new Date('05/27/2024'), 'de-DE'); // 'Mo'

  const narrowDayName = (date, locale) =>
    date.toLocaleDateString(locale, { weekday: 'narrow' });
  
  narrowDayName(new Date()); // 'M'
  narrowDayName(new Date('05/27/2024'), 'de-DE'); // 'M'