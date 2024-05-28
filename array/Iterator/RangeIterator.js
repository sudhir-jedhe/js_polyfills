function makeRangeIterator(start = 1, end = Infinity, step = 1) {
    let nextIndex = start;
    let iterationCount = 0;

    next() {
        return {value: 1, done: false}
    }
}

const rangeIterator = makeRangeIterator(1, 10 , 2)