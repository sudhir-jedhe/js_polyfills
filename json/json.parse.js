console.log(JSON.parse('-3'));
console.log(JSON.parse('12'));
console.log(JSON.parse('true'));
console.log(JSON.parse('"falcon"'));


/******************************************** */


let data = `[
    {
      "id": 1,
      "first_name": "Robert",
      "last_name": "Schwartz",
      "email": "rob23@gmail.com"
    },
    {
      "id": 2,
      "first_name": "Lucy",
      "last_name": "Ballmer",
      "email": "lucyb56@gmail.com"
    },
    {
      "id": 3,
      "first_name": "Anna",
      "last_name": "Smith",
      "email": "annasmith23@gmail.com"
    }
  ]`;
  
  let users = JSON.parse(data);
  
  console.log(typeof users)
  console.log('-------------------');
  console.log(users[1])
  console.log('-------------------');
  console.log(users);
  /*************************************************** */

  let user = `{
    "username": "John Doe",
    "email": "john.doe@example.com",
    "state": "married",
    "profiles": [
        {"name": "jd7", "job": "actor" },
        {"name": "johnd7", "job": "spy"}
    ],
    "active": true,
    "employed": true
}`;

let data = JSON.parse(user);

function printValues(obj) {
    for(var k in obj) {
        if(obj[k] instanceof Object) {
            printValues(obj[k]);
        } else {
            console.log(obj[k]);
        };
    }
};

printValues(data);

console.log('-------------------');

Object.entries(data).map((e) => {
    console.log(e);
});

/******************************************************* */

let data = '{ "name": "John Doe", "dateOfBirth": "1976-12-01", "occupation": "gardener"}';

let user = JSON.parse(data, (k, v) => {

  if (k == "dateOfBirth") {
    return new Date(v);
  } else {
    return v;
  }
});

console.log(user);

