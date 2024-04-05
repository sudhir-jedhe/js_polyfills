const searchEngine = new InMemorySearch();
searchEngine.addDocuments(
  "Movies",
  { name: "Avenger", rating: 8.5, year: 2017 },
  { name: "Black Adam", rating: 8.7, year: 2022 },
  { name: "Jhon Wick 4", rating: 8.2, year: 2023 },
  { name: "Black Panther", rating: 9.0, year: 2022 }
);
console.log(
  searchEngine.search("Movies", (e) => e.rating > 8.5, {
    key: "rating",
    asc: false,
  })
);

/*
[
  {
    "name": "Black Panther",
    "rating": 9,
    "year": 2022
  },
  {
    "name": "Black Adam",
    "rating": 8.7,
    "year": 2022
  }
]
*/

class InMemorySearch {
  constructor() {
    // to track namespace and its document
    this.entities = new Map();
  }

  // register the new namespace
  registerNameSpace(name) {
    this.entities.set(name, []);
  }

  // add document to the namespace
  addDocuments(nameSpace, ...documents) {
    const existing = this.entities.get(nameSpace);

    // if the namespace does not exists
    // create one and add the documents
    if (!existing) {
      this.entities.set(nameSpace, [...documents]);
    }
    // else add the merge the documents
    else {
      this.entities.set(nameSpace, [...existing, ...documents]);
    }
  }

  // search the documents of the given namespace
  search(nameSpace, filterFN, orderByFN) {
    // get the namespace
    const docs = this.entities.get(nameSpace);

    // get it filtered
    const filtered = docs.filter((e) => filterFN(e));

    // if orderby is requestd
    if (orderByFN) {
      const { key, asc } = orderByFN;

      // orderby the searched result
      // based on the key and order requested
      return filtered.sort((a, b) => {
        if (asc) {
          return a[key] - b[key];
        } else {
          return b[key] - a[key];
        }
      });
    }

    return filtered;
  }
}
