// Hashing is a technique used to efficiently search for elements in hash tables
// or associative arrays. It uses a hash function to map keys to specific
// positions in the data structure, allowing for constant-time retrieval of
// values..

class HashTable {
    constructor() {
        this.table = {};
    }

    hash(key) {
        // Hash function implementation
        // ... (hashing logic here)
    }

    search(key) {
        const hash = this.hash(key);
        return this.table[hash];
    }
}

// Usage example:
const hashTable = new HashTable();
hashTable.insert('name', 'John');
hashTable.insert('age', 30);

console.log(hashTable.search('age')); // Output: 30
`; // Display the code snippet document.getElementById('codeSnippet').innerHTML = codeSnippet;