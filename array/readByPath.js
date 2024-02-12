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
