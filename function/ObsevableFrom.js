// Creates an Observable from an Array, an array-like object, a Promise, an
// iterable object, or an Observable-like object.

from([1, 2, 3]).subscribe(console.log);
// 1 2 3

/**
 * @param {Array | ArrayLike | Promise | Iterable | Observable} input
 * @return {Observable}
 */
function from(input) {
  if (input instanceof Observable) {
    return observableFromObservable(input);
  }
  if (input instanceof Promise) {
    return observableFromPromise(input);
  }
  if (Array.isArray(input) || typeof input[Symbol.iterator] === "function") {
    return observableFromIterable(input);
  }
  if ("length" in input) {
    return observableFromArrayLike(input);
  }
  throw new Error("Incorrect input type");
}

function observableFromObservable(input) {
  return new Observable((sub) => {
    input.subscribe(sub);
  });
}

function observableFromPromise(input) {
  return new Observable((sub) => {
    input
      .then(
        (val) => {
          sub.next(val);
        },
        (err) => {
          sub.error(err);
        }
      )
      .then(() => {
        sub.complete();
      });
  });
}

function observableFromIterable(input) {
  return new Observable((sub) => {
    try {
      for (let el of input) {
        sub.next(el);
      }
    } catch (err) {
      sub.error(err);
    }
    sub.complete();
  });
}

function observableFromArrayLike(input) {
  return new Observable((sub) => {
    try {
      for (let i = 0; i < input.length; i++) {
        sub.next(input[i]);
      }
    } catch (err) {
      sub.error(err);
    }
    sub.complete();
  });
}

/************************************** */

/**
 * @param {Array | ArrayLike | Promise | Iterable | Observable} input
 * @return {Observable}
 */
function from(input) {
  if (Array.isArray(input) || !isNaN(input.length)) {
    return new Observable((sub) => {
      for (let i = 0; i < input.length; i++) {
        sub.next(input[i]);
      }
      sub.complete();
    });
  }

  if (Object.prototype.toString.call(input) === "[object Promise]") {
    return new Observable(async (sub) => {
      try {
        const res = await input;
        sub.next(res);
        sub.complete();
      } catch (e) {
        sub.error(e);
      }
    });
  }

  if (
    typeof input[Symbol.iterator] === "function" ||
    typeof input.next === "function"
  ) {
    return new Observable((sub) => {
      try {
        for (let i of input) {
          sub.next(i);
        }
        sub.complete();
      } catch (e) {
        sub.error(e);
      }
    });
  }

  if (input instanceof Observable) {
    return input;
  }

  throw new Error("boo");
}

/************************************ */

/**
 *
  - What is array-like object?
    - Has attribute length in it
  - What is observable-like object?
    - Observable instance
    - Symbol.observable?
 *
 * @param {Array | ArrayLike | Promise | Iterable | Observable} input
 * @return {Observable}
 */
function from(input) {
  // divide work by type that is passed in
  if (Array.isArray(input) || input[Symbol.iterator] instanceof Function) {
    return observableFromArray(input);
  } else if ("length" in input) {
    return observableFromArrayLike(input);
  } else if (input instanceof Promise) {
    return observableFromPromise(input);
  } else if (input instanceof Observable) {
    return observableFromObservable(input);
  }

  function observableFromArray(input) {
    return new Observable((subscriber) => {
      try {
        for (let el of input) {
          subscriber.next(el);
        }
      } catch (err) {
        subscriber.error(err);
      }
      subscriber.complete();
    });
  }

  function observableFromArrayLike(input) {
    return new Observable((subscriber) => {
      for (let i = 0; i < input.length; ++i) {
        try {
          subscriber.next(input[i]);
        } catch {
          subscriber.error(input[i]);
        }
      }
      subscriber.complete();
    });
  }

  function observableFromPromise(input) {
    return new Observable((subscriber) => {
      Promise.resolve(input)
        .then((val) => {
          subscriber.next(val);
        })
        .then(() => subscriber.complete())
        .catch((err) => subscriber.error(err));
    });
  }

  function observableFromObservable(input) {
    return new Observable((subscriber) => {
      input.subscribe(subscriber);
    });
  }
}
