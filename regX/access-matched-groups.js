const regex = /(\d{2})-(\d{2})-(\d{4})/;
const inputString = "27-06-2023";
const match = regex.exec(inputString);

const day = match[1];
const month = match[2];
const year = match[3];

console.log(day);
console.log(month);
console.log(year);

// 27
// 06
// 2023

/*************************************************** */
const regex = /(https?):\/\/([^:/\s]+)(:\d{2,5})?(\/[^\s]*)?/;
const inputString = "https://www.geeksforgeeks.com:8080/path/to/resource";
const match = regex.exec(inputString);

const protocol = match[1];
const domain = match[2];
const port = match[3];
const path = match[4];

console.log(protocol);
console.log(domain);
console.log(port);
console.log(path);

// https
// www.geeksforgeeks.com
// :8080
// /path/to/resource
