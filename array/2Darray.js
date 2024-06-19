const initialize2DArray = (width, height, val = null) =>
    Array.from({ length: height }).map(() =>
      Array.from({ length: width }).fill(val)
    );
  
  initialize2DArray(2, 2, 0); // [[0, 0], [0, 0]]



  const initializeNDArray = (val, ...args) =>
    args.length === 0
      ? val
      : Array.from({ length: args[0] }).map(() =>
          initializeNDArray(val, ...args.slice(1))
        );
  
  initializeNDArray(1, 3); // [1, 1, 1]
  initializeNDArray(5, 2, 2, 2); // [[[5, 5], [5, 5]], [[5, 5], [5, 5]]]


  const initializeMapped2DArray = (width, height, mapFn = () => null) =>
    Array.from({ length: height }).map((_, i) =>
      Array.from({ length: width }).map((_, j) => mapFn(i, j))
    );
  
  initializeMapped2DArray(2, 2, (x, y) => `(${x}, ${y})`);
  // [['(0, 0)', '(0, 1)'], ['(1, 0)', '(1, 1)']]


  const initializeSkewed2DArray = (
    heigh,
    widthFn = () => h,
    mapFn = () => null
  ) =>
    Array.from({ length: heigh }, (_, i) =>
      Array.from({ length: widthFn(i) }).map((_, j) => mapFn(i, j))
    );
  
  initializeSkewed2DArray(
    5,
    i => i + 1,
    (x, y) => x * y
  );
  // [[0], [0, 1], [0, 2, 4], [0, 3, 6, 9], [0, 4, 8, 12, 16]]