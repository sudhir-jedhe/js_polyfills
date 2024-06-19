const createShapeCheckerProxy = shape => {
    const types = {
      bool: v => typeof v === 'boolean',
      num: v => typeof v === 'number' && v === v,
      str: v => typeof v === 'string',
      date: v => v instanceof Date
    };
    const validProps = Object.keys(shape);
  
    const handler = {
      set(target, prop, value) {
        if (!validProps.includes(prop)) return false;
        const validator = types[shape[prop]];
        if (!validator || typeof validator !== 'function') return false;
        if (!validator(value)) return false;
        target[prop] = value;
      }
    };
  
    return obj => new Proxy(obj, handler);
  };
  
  const shapeCheckerProxy = createShapeCheckerProxy({
    name: 'str', age: 'num', active: 'bool', birthday: 'date'
  });
  
  const obj = {};
  const proxiedObj = shapeCheckerProxy(obj);
  
  // These are valid
  proxiedObj.name = 'John';
  proxiedObj.age = 34;
  proxiedObj.active = false;
  proxiedObj.birthday = new Date('1989-04-01');
  
  // These will fail
  proxiedObj.name = 404;
  proxiedObj.age = false;
  proxiedObj.active = 'no';
  proxiedObj.birthday = null;
  proxiedObj.whatever = 'something';