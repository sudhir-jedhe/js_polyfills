// Object mutability and its relation to the const keyword is a very common headache for developers. More often than not, when looking for ways to make an object immutable, Object.freeze() will pop up as a solution. We’ve explored this approach previously, elaborating on deep freezing solutions. You can read more about it in this article.

// While Object.freeze() is the more straightforward approach, it might not always be the best solution. This may be especially true when dealing with extensive object nesting or when objects have a very short life. For such cases, a different approach using the Proxy object might make more sense. Here’s what that looks like:


const term = {
    id: 1,
    value: 'hello',
    properties: [{ type: 'usage', value: 'greeting' }],
  };
  
  const immutable = obj =>
    new Proxy(obj, {
      get(target, prop) {
        return typeof target[prop] === 'object'
          ? immutable(target[prop])
          : target[prop];
      },
      set() {
        throw new Error('This object is immutable.');
      },
    });
  
  const immutableTerm = immutable(term);
  const immutableProperty = immutableTerm.properties[0];
  
  immutableTerm.name = 'hi';            // Error: This object is immutable.
  immutableTerm.id = 2;                 // Error: This object is immutable.
  immutableProperty.value = 'pronoun';  // Error: This object is immutable.




  /******************************* */

  type Obj = Array<any> | Record<any, any>;

function makeImmutable(obj: Obj): Obj {
    const arrayHandler: ProxyHandler<Array<any>> = {
        set: (_, prop) => {
            throw `Error Modifying Index: ${String(prop)}`;
        },
    };
    const objectHandler: ProxyHandler<Record<any, any>> = {
        set: (_, prop) => {
            throw `Error Modifying: ${String(prop)}`;
        },
    };
    const fnHandler: ProxyHandler<Function> = {
        apply: target => {
            throw `Error Calling Method: ${target.name}`;
        },
    };
    const fn = ['pop', 'push', 'shift', 'unshift', 'splice', 'sort', 'reverse'];
    const dfs = (obj: Obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'object' && obj[key] !== null) {
                obj[key] = dfs(obj[key]);
            }
        }
        if (Array.isArray(obj)) {
            fn.forEach(f => (obj[f] = new Proxy(obj[f], fnHandler)));
            return new Proxy(obj, arrayHandler);
        }
        return new Proxy(obj, objectHandler);
    };
    return dfs(obj);
}

/**
 * const obj = makeImmutable({x: 5});
 * obj.x = 6; // throws "Error Modifying x"
 */