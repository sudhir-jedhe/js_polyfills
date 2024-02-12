function processing() {
  return Promise.reject("Something went wrong!");
}

function init() {
  try {
    return processing();
  } catch (err) {
    console.log("Error in processing.");
  }
}

init().then(() => {
  console.log("End");
});
