// A strong password will be of a minimum 8 characters to max range according to user need (max limit is set to 15 characters for this post). It must include the following:

// At least one lowercase alphabet i.e. [a-z]
// At least one uppercase alphabet i.e. [A-Z]
// At least one Numeric digit i.e. [0-9]
// At least one special character i.e. [‘@’, ‘$’, ‘.’, ‘#’, ‘!’, ‘%’, ‘*’, ‘?’, ‘&’, ‘^’]
// Also, the total length must be in the range [8-15]

let regex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,15}$/;

let pass1 = "Geeks@123";
let pass2 = "GeeksforGeeks";
let pass3 = "Geeks123";

console.log(pass1, regex.test(pass1));
console.log(pass2, regex.test(pass2));
console.log(pass3, regex.test(pass3));

// Geeks@123 true
// GeeksforGeeks false
// Geeks123 false

/*************************************** */

const strength = {
  1: "very Weak",
  2: "Weak",
  3: "Meduim",
  4: "Strong",
};
function checkStrength(pass) {
  if (pass.length > 15) return console.log(pass + " Password is too lengthy");
  else if (pass.length < 8) return console.log(pass + " Password is too short");

  let regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!^%*?&]{8,15}$/;
  if (regex.test(pass)) {
    return console.log(pass + " Password is strong");
  }
  let count = 0;
  let regex1 = /[a-z]/;
  if (regex1.test(pass)) count++;
  let regex2 = /[A-Z]/;
  if (regex2.test(pass)) count++;
  let regex3 = /[\d]/;
  if (regex3.test(pass)) count++;
  let regex4 = /[!@#$%^&*.?]/;
  if (regex4.test(pass)) count++;

  console.log(pass, "Pasword is " + strength[count]);
}
let passwords = [
  "u4thdkslfheogica",
  "G!2ks",
  "GeeksforGeeks",
  "Geeks123",
  "GEEKS123",
  "Geeks@123#",
];
passwords.map((e) => checkStrength(e));

// u4thdkslfheogica Password is too lengthy
// G!2ks Password is too short
// GeeksforGeeks Pasword is Weak
// Geeks123 Pasword is Meduim
// GEEKS123 Pasword is Weak
// Geeks@123# Password is strong
