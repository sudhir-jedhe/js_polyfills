// Approach 2: Inner recursive helper that modifies an external value
// In this approach, an inner classNamesImpl helper function is defined
// and it accesses the top-level classes collection within recursive calls.
//  The helper function does not return anything, it's main purpose is to
// process each argument and add them to classes.


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
