function func() {
  try {
    console.log(1); // 1
    return; // return will exit try
  } catch (e) {
    console.log(2); // not execute as not caught any erro
  } finally {
    console.log(3); // finally execute before exit from function
  }
  console.log(4); // not execute as function exit
}



func(); // => 1 3
