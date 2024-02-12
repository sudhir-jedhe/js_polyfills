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
