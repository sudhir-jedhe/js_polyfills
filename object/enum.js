const daysEnum = Object.freeze({
    monday: 0,
    tuesday: 1,
    wednesday: 2,
    thursday: 3,
    friday: 4,
    saturday: 5,
    sunday: 6
  });
  Taking this one step further, one could extract the logic into a function with a variable number of arguments and producing a frozen object. There is very little benefit to this technique, so a better alternative would be to create a simple class. After all, enums are more common in object-oriented programming languages, so this sounds like a great fit.
  
  An Enum class would only require a constructor with a variable number of arguments. Its job is to add each key to the enum object and freeze the newly created instance. A potential enhancement would be to provide access to the enum values as strings. Obviously, this can be accomplished using Object.keys(), but a named method could result in a conflict with one of the enum's values, let alone the method polluting the result.
  
  Using an ES6 symbol is the obvious solution here, as it will not pollute the result of Object.keys() and it will never conflict with any values in the enum. Taking this one step further, Symbol.iterator would be a great choice as it would allow for the enum to be considered iterable and make it even more useful. Putting all of this together, here's my Enum class and how to use it:
  
  class Enum {
    constructor(...keys) {
      keys.forEach((key, i) => {
        this[key] = i;
      });
      Object.freeze(this);
    }
  
    *[Symbol.iterator]() {
      for (let key of Object.keys(this)) yield key;
    }
  }
  
  const daysEnum = new Enum(
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday'
  );
  
  const days = [...daysEnum]; // Array of the enum values as strings