function gfg_Run() {
  console.log(
    Array.from(
      {
        length: 10,
      },
      () => Math.floor(Math.random() * 10)
    )
  );
}
gfg_Run();

/************************ */
let a = [];
for (i = 0; i < 10; ++i) a[i] = i;

// Array like[1, 2, 3, 4, ...]

function createRandom(arr) {
  let tmp,
    cur,
    tp = arr.length;
  if (tp)
    // Run until tp becomes 0.
    while (--tp) {
      // Generating the random index.
      cur = Math.floor(Math.random() * (tp + 1));

      // Getting the index(cur) value in variable(tmp).
      tmp = arr[cur];

      // Moving the index(tp) value to index(cur).
      arr[cur] = arr[tp];

      // Moving back the tmp value to
      // index(tp), Swapping is done.
      arr[tp] = tmp;
    }
  return arr;
}

function gfg_Run() {
  console.log(createRandom(a));
}
gfg_Run();
