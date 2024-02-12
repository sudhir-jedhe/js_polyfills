function collectionSize(collection) {
  if (Array.isArray(collection)) {
    return collection.length;
  } else if (collection instanceof Set) {
    return collection.size;
  } else if (collection instanceof Map) {
    return collection.size;
  } else {
    throw new Error("Invalid collection type");
  }
}
