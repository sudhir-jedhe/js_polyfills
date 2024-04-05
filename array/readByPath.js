function read(collection, property) {
  const isCollectionInvalid = !collection || typeof collection !== "object";
  const isPropertyInvalid =
    !property || !property.trim().length || typeof property !== "string";

  if (isCollectionInvalid || isPropertyInvalid) {
    return undefined;
  }

  // cleaning the property and splitting it
  let path = property.replaceAll("[", ".");

  path = path.replaceAll("]", ".");
  path = path.split(".").filter(Boolean);

  let i;
  let currentKey;
  let currentItem = collection;

  for (i = 0; i < path.length; i++) {
    currentKey = path[i];

    // escape condition
    // if the currentKey doesn't exists in the currentItem
    // then return undefined
    if (!Object.prototype.hasOwnProperty.call(currentItem, currentKey)) {
      currentItem = undefined;
      break;
    }

    // updating currentItem
    currentItem = currentItem[currentKey];
  }

  // return the value
  return currentItem;
}

const collection = {
  a: {
    b: {
      c: {
        d: {
          e: 2,
        },
      },
    },
  },
};

// should return 2
read(collection, "a.b.c.d.e");

// should return undefined
read(collection, "a.b.c.f");

/******************************* */
const get = (obj, path) => {
  // replace the square brackets with the period operator
  path = path.replaceAll("[", ".");
  path = path.replaceAll("]", "");

  // split the keys and get it filtered on the truthy values
  const keys = path.split(".").filter(Boolean);

  // create a reference of the input object
  let current = obj;

  // traverse the key
  for (let key of keys) {
    current = current[key];

    // if an invalid key
    // return undefined
    if (current === undefined) {
      return undefined;
    }
  }

  // return the value
  return current;
};

Input: console.log(get({ developer: "Software Engineer" }, "developer"));
console.log(
  get(
    { developer: { firstName: "Tom", lastName: "Cruz" } },
    "developer.lastName"
  )
);
console.log(get([{ developer: "Tom" }, { count: [0, 1] }], "[1].count[0]"));
console.log(get([{ developer: "Tom" }, [0, null]], "[1][1]"));
console.log(get([{ developer: "Tom" }, [0, null]], "[1][3]"));

Output: "Software Engineer";
("Cruz");
("0");
null;
undefined;
