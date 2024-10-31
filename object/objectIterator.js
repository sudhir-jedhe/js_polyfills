let myObject = {
    data: [ 'foo', 'bar', 'baz' ],
    *[Symbol.iterator]() {
        for (let item of this.data) {
            yield item;
        }
    }
};

// Now you can iterate over myObject using for...of loop
for (let value of myObject) {
    console.log(value);
}

let iterable = (obj) => {
    return {
        ...obj,
        [Symbol.iterator]: function* () {
            for (const key in obj) {
                yield [key, obj[key]];
            }
        }
    }
}

const obj = iterable({name: 'Sudhir', id:'1', designation: 'Engineer'});

for (const [key, value] of obj) {
    console.log(key, value);
}