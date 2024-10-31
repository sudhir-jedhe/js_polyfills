function joinClassNames(...classNames) {
  // Flatten the classNames array into a single array of strings.
  const flattenedClassNames = classNames.flat();

  // Remove any empty strings from the array.
  const filteredClassNames = flattenedClassNames.filter(
    (className) => className
  );

  // Deduplicate the array of class names.
  const deduplicatedClassNames = new Set(filteredClassNames);

  // Convert any function values to strings.
  const stringifiedClassNames = deduplicatedClassNames.map((className) => {
    if (typeof className === "function") {
      return className();
    } else {
      return className;
    }
  });

  // Join the array of class names into a single string.
  return stringifiedClassNames.join(" ");
}

const classNames = ["button", "primary", isActive ? "active" : ""];

const classNameString = joinClassNames(classNames);

// classNameString will be equal to "button primary active" if isActive is true,
// or "button primary" if isActive is false.

const button = (
  <button className={joinClassNames("button", isActive ? "active" : "")}>
    Click me
  </button>
);



/***************************** */

/**
 * @param {any[]} args
 * @returns {string}
 */
// first try , a little chaotic
// function classNames(...args) {
//   return args.filter(item => {
//     if (['string', 'number', 'object'].includes(typeof item)) {
//       return item !== null
//     }
//     return false
//   }).map(item => {
//     if (Array.isArray(item)) {
//       return classNames(...item)
//     }
    
//     if (['string', 'number'].includes(typeof item)) {
//       return item
//     }
    
//     return classNames(...Object.keys(item).filter(key => !!item[key]))
//   }).join(' ')
// }
// cleaner code with reduce
function classNames(...args) {
  return args.flat(Infinity).reduce((result, item) => {
    
    if (item === null) return result
    
    switch (typeof item) {
      case 'string':
      case 'number':
        result.push(item)
        break
      case 'object':
        for (let [key, value] of Object.entries(item)) {
          if (!!value) {
            result.push(key)
          }
        }
        break
    }
    
    return result
  }, []).join(' ')
}
