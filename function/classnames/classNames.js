// The following are good questions to ask the interviewer to demonstrate your thoughtfulness. Depending on their response, you might need to adjust the implementation accordingly.

// Can there be duplicated classes in the input? Should the output contain duplicated classes?

// Yes, there can be. In this case the output will contain duplicated classes. However, we will not test for this case.

// What if a class was added and then later turned off? E.g. classNames('foo', { foo: false })?

// In the library implementations, the final result will be 'foo'. However, we will not test for this case.

// Solution
// The tricky part of this solution is the recursive nature of the function. Hence we can separate out the solution into two parts:

// Handling of each data type.
// Recursing for array type.
// We will need a data structure, classes to collect all the classes for the lifetime of the function that the recursive calls have access to. In our solution we use an Array for the collection, but you can also use a Set.

// To recursively process each argument and collect the classes, a few approaches come to mind:

// Pure recursive function: Recursive calls do not depend on external values nor modify the arguments.
// Inner recursive helper that modifies an external value: The collection is defined at the top level of the function. Inner recursive functions modify the external top-level collection by adding to that collection.
// Inner recursive helper that modifies the argument: The collection is defined at the top level of the function, passed as an argument into recursive calls, and recursive calls add to the argument.
// Here's how we will handle each data type:

// Falsey values: Ignore.
// String: Add it to the classes collection.
// Number: Add it to the classes collection.
// Array: Recursively invoke the classNames function or inner recursive function.
// Object: Loop through the key/value pairs and add the keys with truthy values into the classes collection.
// Approach 1: Pure recursive function
// In this approach, the classNames function calls itself and its return value is a string that can be composed by parent recursive calls.


JavaScript

TypeScript
/**
 * @param {...(any|Object|Array<any|Object|Array>)} args
 * @return {string}
 */
export default function classNames(...args) {
  const classes = [];

  args.forEach((arg) => {
    // Ignore falsey values.
    if (!arg) {
      return;
    }

    const argType = typeof arg;

    // Handle string and numbers.
    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
      return;
    }

    // Handle arrays.
    if (Array.isArray(arg)) {
      classes.push(classNames(...arg));
      return;
    }

    // Handle objects.
    if (argType === 'object') {
      for (const key in arg) {
        // Only process non-inherited keys.
        if (Object.hasOwn(arg, key) && arg[key]) {
          classes.push(key);
        }
      }

      return;
    }
  });

  return classes.join(' ');
}
Approach 2: Inner recursive helper that modifies an external value
In this approach, an inner classNamesImpl helper function is defined and it accesses the top-level classes collection within recursive calls. The helper function does not return anything, it's main purpose is to process each argument and add them to classes.

export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Array<string> = [];

  function classNamesImpl(...args: Array<ClassValue>) {
    args.forEach((arg) => {
      // Ignore falsey values.
      if (!arg) {
        return;
      }

      const argType = typeof arg;

      // Handle string and numbers.
      if (argType === 'string' || argType === 'number') {
        classes.push(String(arg));
        return;
      }

      // Handle arrays.
      if (Array.isArray(arg)) {
        for (const cls of arg) {
          classNamesImpl(cls);
        }

        return;
      }

      // Handle objects.
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          // Only process non-inherited keys.
          if (Object.hasOwn(objArg, key) && objArg[key]) {
            classes.push(key);
          }
        }

        return;
      }
    });
  }

  classNamesImpl(...args);

  return classes.join(' ');
}
Approach 3: Inner recursive helper that modifies the argument
In this approach, an inner classNamesImpl helper function is defined and it accepts a classesArr argument. The classesArr is modified and passed along within recursive calls and all classNamesImpl calls reference the same instance of classesArr. The helper function does not return anything, it's main purpose is to process each argument and add them to the classesArr argument.

export type ClassValue =
  | ClassArray
  | ClassDictionary
  | string
  | number
  | null
  | boolean
  | undefined;
export type ClassDictionary = Record<string, any>;
export type ClassArray = Array<ClassValue>;

export default function classNames(...args: Array<ClassValue>): string {
  const classes: Array<string> = [];

  function classNamesImpl(
    classesArr: Array<string>,
    ...args: Array<ClassValue>
  ) {
    args.forEach((arg) => {
      // Ignore falsey values.
      if (!arg) {
        return;
      }

      const argType = typeof arg;

      // Handle string and numbers.
      if (argType === 'string' || argType === 'number') {
        classesArr.push(String(arg));
        return;
      }

      // Handle arrays.
      if (Array.isArray(arg)) {
        for (const cls of arg) {
          classNamesImpl(classesArr, cls);
        }

        return;
      }

      // Handle objects.
      if (argType === 'object') {
        const objArg = arg as ClassDictionary;
        for (const key in objArg) {
          // Only process non-inherited keys.
          if (Object.hasOwn(objArg, key) && objArg[key]) {
            classesArr.push(key);
          }
        }

        return;
      }
    });
  }

  classNamesImpl(classes, ...args);

  return classes.join(' ');
}
// Follow-up: De-duplicating classes
// The provided solution doesn't handle de-duplicating classes, which would be a nice optimization. Without du-duplication, classNames('foo', 'foo') will give you 'foo foo' which is unnecessary as far as the browser result is concerned.

// In some cases, de-duplication can also affect the result, e.g. in the case of classNames('foo', { foo: false }), { foo: false } appears later in the arguments, so the user probably did not mean for 'foo' to appear in the final result.

// This can be handled by using Set to collect the classes from the start, adding or removing classes where necessary.

// De-duplicating classes is usually out of the scope for interviews but is a possible follow-up question. You can practice the de-duplicating functionality in Classnames II.

// Techniques
// Familiar with JavaScript value types and how to check for them
// Recursion
// Converting from Arrays to Sets and vice versa (for the unique classes follow-up)
// Handling of variadic arguments
// Notes
// typeof [] gives 'object', so you need to handle arrays before objects.
// You likely don't have to handle these scenario, but you should mention them:
// Possibility of stack overflow. This applies to any recursive solution.
// Possibility of circular references for arrays and objects. This applies to any input which has arbitrary depth.
// Library implementation
// For your reference, this is how the classnames npm package is implemented:

var hasOwn = {}.hasOwnProperty;

export default function classNames() {
  var classes = [];

  for (var i = 0; i < arguments.length; i++) {
    var arg = arguments[i];
    if (!arg) continue;

    var argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        var inner = classNames.apply(null, arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object') {
      if (arg.toString === Object.prototype.toString) {
        for (var key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(' ');
}
Resources


// Follow-up: De-duplicating classes
// The provided solution doesn't handle de-duplicating classes, which would be a nice optimization. Without du-duplication, classNames('foo', 'foo') will give you 'foo foo' which is unnecessary as far as the browser result is concerned.

// In some cases, de-duplication can also affect the result, e.g. in the case of classNames('foo', { foo: false }), { foo: false } appears later in the arguments, so the user probably did not mean for 'foo' to appear in the final result.

// This can be handled by using Set to collect the classes from the start, adding or removing classes where necessary.

// De-duplicating classes is usually out of the scope for interviews but is a possible follow-up question. You can practice the de-duplicating functionality in Classnames II