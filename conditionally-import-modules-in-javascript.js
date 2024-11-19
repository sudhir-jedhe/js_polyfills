// default import
const foo = await import(folder + '/bar.js')

// default import 2
const foo = (await import(folder + '/bar.js')).default()

// named import
const { foo } = await import(folder + '/bar.js')


// In this tutorial, we will see how to dynamically or conditionally import modules in JavaScript.

// Even though dynamic imports are not good for performance as they block the tree-shaking of code, there are scenarios where we need to conditionally import modules.