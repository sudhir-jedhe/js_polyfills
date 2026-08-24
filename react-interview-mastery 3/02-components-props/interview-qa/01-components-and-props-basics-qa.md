# Interview Q&A — Components and Props Basics

**Q: What is a function component, and what's the minimal contract it must fulfill?**
A function component is a plain JavaScript function that accepts a single `props` object as its argument and returns something React can render — JSX, a string, a number, an array of these, or `null`. React calls it during render whenever the component needs to (re-)appear in the tree, passing a fresh `props` object each time.

**Q: How do you set default values for props in a function component?**
Via default parameters in destructuring: `function Button({ label = 'Submit' }) {...}`. This is the modern idiom; the older `Component.defaultProps = {...}` static property pattern still works but is deprecated for function components as of recent React versions and is mainly seen in legacy class-component code.

**Q: What's the difference between a prop being `undefined` and a prop not being passed at all?**
Nothing, for the purposes of default values — both trigger a destructuring default, since JavaScript's default-parameter mechanism activates specifically when a value is `undefined`. Explicitly passing `null`, however, does *not* trigger the default, since `null` is a defined value; the component receives `null` as-is.
