The export declaration is used to export values from a JavaScript module.
Exported values can then be imported into other programs with the import declaration or dynamic import. The value of an imported binding is subject to change in the module that exports it — when a module updates the value of a binding that it exports, the update will be visible in its imported value.

```js
// Exporting declarations
export let name1, name2/*, … */; // also var
export const name1 = 1, name2 = 2/*, … */; // also var, let
export function functionName() { /* … */ }
export class ClassName { /* … */ }
export function* generatorFunctionName() { /* … */ }
export const { name1, name2: bar } = o;
export const [ name1, name2 ] = array;

// Export list
export { name1, /*…, */ nameN };
export { variable1 as name1, variable2 as name2, /* …, */ nameN };
export { variable1 as "string name" };
export { name1 as default /*, …*/ };

// Default exports
export default expression;
export default function functionName() { /*… */ }
export default class ClassName { /* … */ }
export default function* generatorFunctionName() { /* … */ }
export default function () { /* … */ }
export default class { /* … */ }
export default function* () { /*…*/ }

// Aggregating modules
export *from "module-name";
export* as name1 from "module-name";
export { name1, /*…, */ nameN } from "module-name";
export { import1 as name1, import2 as name2, /* …, */ nameN } from "module-name";
export { default, /* …,*/ } from "module-name";
export { default as name1 } from "module-name";


```

Export before declarations

```js
// export an array
export let months = ['Jan', 'Feb', 'Mar','Apr', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// export a constant
export const MODULES_BECAME_STANDARD_YEAR = 2015;

// export a class
export class User {
  constructor(name) {
    this.name = name;
  }
}

```

Export apart from declarations

```js
// 📁 say.js
function sayHi(user) {
  alert(`Hello, ${user}!`);
}

function sayBye(user) {
  alert(`Bye, ${user}!`);
}

```

Import “as”
We can also use as to import under different names.

```js
// 📁 main.js
import {sayHi as hi, sayBye as bye} from './say.js';

hi('John'); // Hello, John!
bye('John'); // Bye, John!
```

Export “as”
The similar syntax exists for export.

Let’s export functions as hi and bye:

```js
// 📁 say.js
...
export {sayHi as hi, sayBye as bye};

```

Now hi and bye are official names for outsiders, to be used in imports:

```js
// 📁 main.js
import * as say from './say.js';

say.hi('John'); // Hello, John!
say.bye('John'); // Bye, John!
```

Export default
In practice, there are mainly two kinds of modules.

Modules that contain a library, pack of functions, like say.js above.
Modules that declare a single entity, e.g. a module user.js exports only class User.

```js
/ 📁 user.js
export default class User { // just add "default"
  constructor(name) {
    this.name = name;
  }
}
```

```js
// 📁 main.js
import User from './user.js'; // not {User}, just User

new User('John');
```
