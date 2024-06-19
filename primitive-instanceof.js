// JavaScript provides two operators for typechecking:

// typeof is used to typecheck for primitive values
// instanceof is used to typecheck for class instances

class PrimitiveNumber {
    static [Symbol.hasInstance] = x  => typeof x === 'number';
  }
  123 instanceof PrimitiveNumber; // true
  
  class PrimitiveString {
    static [Symbol.hasInstance] = x => typeof x === 'string';
  }
  'abc' instanceof PrimitiveString; // true
  
  class PrimitiveBoolean {
    static [Symbol.hasInstance] = x => typeof x === 'boolean';
  }
  false instanceof PrimitiveBoolean; // true
  
  class PrimitiveSymbol {
    static [Symbol.hasInstance] = x => typeof x === 'symbol';
  }
  Symbol.iterator instanceof PrimitiveSymbol; // true
  
  class PrimitiveNull {
    static [Symbol.hasInstance] = x => x === null;
  }
  null instanceof PrimitiveNull; // true
  
  class PrimitiveUndefined {
    static [Symbol.hasInstance] = x => x === undefined;
  }
  undefined instanceof PrimitiveUndefined; // true