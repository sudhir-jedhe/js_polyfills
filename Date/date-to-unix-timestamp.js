const toTimestamp = date => Math.floor(date.getTime() / 1000);
const fromTimestamp = timestamp => new Date(timestamp * 1000);

toTimestamp(new Date('2024-01-04')); // 1704326400
fromTimestamp(1704326400); // 2024-01-04T00:00:00.000Z