// This is a JavaScript Quiz from BFE.dev

function a() {
  console.log(1);
  return {
    a: function () {
      console.log(2);
      return a();
    },
  };
}

a().a();
