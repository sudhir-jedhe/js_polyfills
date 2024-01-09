console.dir(JSON.stringify(1));
console.dir(JSON.stringify(5.9));
console.dir(JSON.stringify(true));
console.dir(JSON.stringify(false));
console.dir(JSON.stringify('falcon'));
console.dir(JSON.stringify("sky"));
console.dir(JSON.stringify(null));


console.dir(JSON.stringify({ x: 5, y: 6 }));
console.dir(JSON.stringify(new Number(6)));
console.dir(JSON.stringify(new String('falcon'))); 
console.dir(JSON.stringify(new Boolean(false)));
console.dir(JSON.stringify(new Date(2020, 0, 6, 21, 4, 5)));
console.dir(JSON.stringify(new Int8Array([1, 2, 3])));
console.dir(JSON.stringify(new Int16Array([1, 2, 3])));
console.dir(JSON.stringify(new Int32Array([1, 2, 3])));
console.dir(JSON.stringify({ x: 2, y: 3, toJSON() { return this.x + this.y; }}));


let users = [
    {
        id: 1,
        first_name: 'Robert',
        last_name: 'Schwartz',
        email: 'rob23@gmail.com'
    },
    {
        id: 2,
        first_name: 'Lucy',
        last_name: 'Ballmer',
        email: 'lucyb56@gmail.com'
    },
    {
        id: 3,
        first_name: 'Anna',
        last_name: 'Smith',
        email: 'annasmith23@gmail.com'
    }
];

let data = JSON.stringify(users, null, 2);

console.log(typeof data);
console.log(typeof users);
console.log('------------------');
console.dir(data);
console.log('------------------');
console.dir(users);

/************************************************** */
function replacer(key, value) {
    if (typeof value === 'string') {
      return value.toUpperCase();
    }
    return value;
  }
  
  var user = { name: 'John Doe', occupation: 'gardener', age: 34, 
    dob: new Date('1992-12-31') };
  
  console.dir(JSON.stringify(user, replacer));

  /******************************* */
  var user = { name: 'John Doe', occupation: 'gardener', dob: new Date('1992-12-31') };

console.dir(JSON.stringify(user, ['name', 'occupation']));
/****************************** */
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>

    <script>
        fetch('https://jsonplaceholder.typicode.com/todos/1')
            .then(response => response.json())
            .then(json =>
                document.body.appendChild(document.createElement('pre')).innerHTML = JSON.stringify(json, null, 4));
    </script>
</body>

</html>