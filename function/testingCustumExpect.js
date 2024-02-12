function customExpect(actual) {
  // write your solution here
  return {
    toBe(expected) {
      if (expected !== actual) throw new Error();
    },
    not: {
      toBe(expected) {
        if (expected === actual) throw new Error();
      },
    },
  };
}

function customExpect(actual) {
  // write your solution here

  return {
    toBe(expected) {
      if (actual === expected) {
        // No error, do not return anything
      } else {
        throw new Error(`Expected ${actual} to be ${expected}`);
      }
    },
    not: {
      toBe(expected) {
        if (actual !== expected) {
          // No error, do not return anything
        } else {
          throw new Error(`Expected ${actual} not to be ${expected}`);
        }
      },
    },
  };
}

function customExpect(actual) {
  // write your solution here

  function toBe(expected) {
    if (expected !== actual) {
      throw new Error();
    }
  }

  function notToBe(expected) {
    if (expected === actual) {
      throw new Error();
    }
  }

  return {
    toBe,
    not: {
      toBe: notToBe,
    },
  };
}

console.log(customExpect(2).toBe(2));
console.log(customExpect(2).not.toBe(3));

// Syntax
customExpect(actual).toBe(expected);
customExpect(actual).not.toBe(expected);

customExpect(3).toBe(3); // no error | Do not return anything
customExpect(2).toBe(3); // should throw an error

customExpect(2).not.toBe(3); // no error | Do not return anything
customExpect(2).not.toBe(2); // should throw an error
