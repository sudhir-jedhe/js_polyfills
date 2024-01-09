fetch('http://time.jsontest.com')
    .then(res => res.json())
    .then((out) => {
        console.log('Output: ', out);
}).catch(err => console.error(err));


{
    "users": [
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
      },
      {
        "id": 4,
        "first_name": "Robert",
        "last_name": "Brown",
        "email": "bobbrown432@yahoo.com"
      },
      {
        "id": 5,
        "first_name": "Roger",
        "last_name": "Bacon",
        "email": "rogerbacon12@yahoo.com"
      }
    ]
  }

  const logBtn = document.getElementById('log');
logBtn.addEventListener('click', fetchData);

async function fetchData() {

    const response = await fetch('http://localhost:3000/users/');
    const data = await response.json();

    data.forEach(obj => {
        Object.entries(obj).forEach(([key, value]) => {
            console.log(`${key} ${value}`);
        });
        console.log('-------------------');
    });
}