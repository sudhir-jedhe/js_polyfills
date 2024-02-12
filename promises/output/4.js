function processing() {
  return new Promise((resolve, reject) => {
    resolve(1);
    reject("Failed");
    resolve(2);
  });
}

function init() {
  processing()
    .then((v) => console.log(v + 1))
    .catch((err) => console.log(err));
}

init();
