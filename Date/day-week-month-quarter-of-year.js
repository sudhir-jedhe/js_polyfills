const dayOfYear = (date) =>
  Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86_400_000);

dayOfYear(new Date("2024-09-28")); // 272

const weekOfYear = (date) => {
  const startOfYear = new Date(date.getFullYear(), 0, 1);
  startOfYear.setDate(startOfYear.getDate() + (startOfYear.getDay() % 7));
  return Math.round((date - startOfYear) / 604_800_000);
};

weekOfYear(new Date("2021-06-18")); // 23

const monthOfYear = (date) => date.getMonth() + 1;

monthOfYear(new Date("2024-09-28")); // 9

const quarterOfYear = (date) => Math.ceil((date.getMonth() + 1) / 3);

quarterOfYear(new Date("2024-09-28")); // 3
