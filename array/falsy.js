const dataWithFalsyValue = [1, 2, "Sudhir", null, undefined, NaN, false, "", 0];

const data = dataWithFalsyValue.filter(Boolean);
console.log(data);
