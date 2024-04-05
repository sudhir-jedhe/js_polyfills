const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

sleep(500).then(() => {
  //do stuff
  console.log("I run after 500 milliseconds");
});

const performAction = async () => {
  await sleep(2000);
  //do stuff
};

performAction();
