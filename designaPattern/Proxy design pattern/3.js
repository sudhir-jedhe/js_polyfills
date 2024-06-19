const obj = { foo: 'bar  ', baz: '  qux ', quux: 1 };

// Dynamic getters
const proxiedObj = new Proxy(obj, {
  get(target, prop) {
    if (prop in target && typeof target[prop] === 'string')
      return target[prop].trim();
    return target[prop];
  }
});

proxiedObj.foo; // 'bar'
proxiedObj.baz; // 'qux'
proxiedObj.quux; // 1
proxiedObj.quuz; // undefined

// Dynamic setters
const obj = {};

const proxiedObj = new Proxy(obj, {
  set(target, prop, value) {
    if (prop in target) return false;
    if (typeof prop === 'string' && prop.match(/^\d{4}-\d{2}-\d{2}$/)) {
      target[prop] = value;
      return true;
    }
    return false;
  }
});

proxiedObj['2023-01-01'] = 1;
proxiedObj['2023-01-01'] = 2; // This will fail, the property is already set
proxiedObj['2023-ab-cd'] = 1; // This will fail, the property name is not a date
proxiedObj; // { '2023-01-01': 1 }


const getHandler = {
    get: (target, prop) => {
      return value => {
        if (typeof value !== 'undefined') {
          target[prop] = value;
          return new Proxy(target, getHandler);
        }
        return target[prop];
      };
    }
  };
  
  const styles = {};
  const proxiedStyles = new Proxy(styles, getHandler);
  
  proxiedStyles.color('#101010').background('#fefefe').margin('4px 8px');
  
  proxiedStyles.color(); // #101010
  proxiedStyles.background(); // #fefefe
  proxiedStyles.margin(); // 4px 8px