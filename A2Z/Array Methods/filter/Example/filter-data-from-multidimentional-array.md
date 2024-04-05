```js


const filter = (arr, test) => {
    // Store the output
    const result = [];

    //iterate the array
    for (let a of arr) {
        //if sub-array
        if (Array.isArray(a)) {
            //recursively filter the sub-array
            const output = filter(a, test);

            //store the result
            result.push(output);
        } else {
            //if not an array
            //test the element
            //if it passes the test, store its result
            if (test(a)) {
            result.push(a);
            }
        }
    }

    //return the result
    return result;
};



Array.prototype.multiFilter = function (test) {

    //original array;
    const originalArray = this;

    const filter = (arr, test) => {
        // Store the output
        const result = [];

        //iterate the array
        for (let a of arr) {
            //if sub-array
            if (Array.isArray(a)) {
                //recursively filter the sub-array
                const output = filter(a, test);

                //store the result
                result.push(output);
            } else {
                //if not an array
                //test the element
                //if it passes the test, store its result
                if (test(a)) {
                result.push(a);
                }
            }
        }

        //return the result
        return result;
    };

    //filter and return
    return filter(originalArray, test);
};


Input:
const arr = [[1, [2, [3, "foo", { a: 1, b: 2 }]], "bar"]];
const filtered = arr.multiFilter((e) => typeof e === "number");
console.log(JSON.stringify(filtered));

Output:
[[1,[2,[3]]]]


Input:
const arr = [[1, [2, [3, 'foo', {'a': 1, 'b': 2}]], 'bar']];
const filtered = arr.multiFilter((e) => typeof e === 'string');
console.log(filtered);

Output:
[[[["foo"]],"bar"]]


```