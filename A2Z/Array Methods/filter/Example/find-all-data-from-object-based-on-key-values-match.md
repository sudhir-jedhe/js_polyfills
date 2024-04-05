```js
const users = [
  { name: "John", city: "London", born: "2001-04-01" },
  { name: "Lenny", city: "New York", born: "1997-12-11" },
  { name: "Andrew", city: "Boston", born: "1987-02-22" },
  { name: "Peter", city: "Prague", born: "1936-03-24" },
  { name: "Anna", city: "Bratislava", born: "1973-11-18" },
  { name: "Albert", city: "Bratislava", born: "1940-12-11" },
  { name: "Adam", city: "Trnava", born: "1983-12-01" },
  { name: "Robert", city: "Bratislava", born: "1935-05-15" },
  { name: "Robert", city: "Prague", born: "1998-03-14" },
];

let res = users.filter((user) => user.city === "Bratislava");
console.log(res);

let res = users.filter(
  (user) => user.city === "Bratislava" && user.name.startsWith("A")
);
console.log(res);

function getAge(dt) {
  return moment.duration(moment() - moment(dt, "YYYY-MM-DD", true)).years();
}

let res = users.filter((user) => getAge(user.born) > 40);

console.log(res);
```