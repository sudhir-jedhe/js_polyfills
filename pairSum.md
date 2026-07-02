Below is a clean **JavaScript / TypeScript interview-style implementation** for **Count Pair Sums with Updates**.

This is similar to the common problem:

> Given two arrays `nums1` and `nums2`, support:
>
> * `add(index, value)` → update `nums2[index] += value`
> * `count(total)` → return number of pairs `(i, j)` where `nums1[i] + nums2[j] === total`

***

# Problem Example

```js
const pairCounter = new FindSumPairs(
  [1, 1, 2, 2, 2, 3],
  [1, 4, 5, 2, 5, 4]
);

console.log(pairCounter.count(7)); // 8

pairCounter.add(3, 2); // nums2[3] = 2 + 2 = 4

console.log(pairCounter.count(8)); // updated result
```

***

# Brute Force Approach

```js
class FindSumPairs {
  constructor(nums1, nums2) {
    this.nums1 = nums1;
    this.nums2 = nums2;
  }

  add(index, value) {
    this.nums2[index] += value;
  }

  count(total) {
    let pairs = 0;

    for (let i = 0; i < this.nums1.length; i++) {
      for (let j = 0; j < this.nums2.length; j++) {
        if (this.nums1[i] + this.nums2[j] === total) {
          pairs++;
        }
      }
    }

    return pairs;
  }
}
```

## Complexity

```text
add    -> O(1)
count  -> O(n * m)
```

This is not good if `count()` is called many times.

***

# Optimised Approach Using Frequency Map

The key idea:

* Keep `nums1` as it is.
* Maintain frequency map of values in `nums2`.
* For every number in `nums1`, calculate:

```js
needed = total - nums1[i]
```

Then check how many times `needed` exists in `nums2`.

***

# JavaScript Implementation

```js
class FindSumPairs {
  constructor(nums1, nums2) {
    this.nums1 = nums1;
    this.nums2 = nums2;
    this.freqMap = new Map();

    for (const num of nums2) {
      this.freqMap.set(num, (this.freqMap.get(num) || 0) + 1);
    }
  }

  add(index, value) {
    const oldValue = this.nums2[index];
    const newValue = oldValue + value;

    // Remove old value frequency
    this.freqMap.set(oldValue, this.freqMap.get(oldValue) - 1);

    if (this.freqMap.get(oldValue) === 0) {
      this.freqMap.delete(oldValue);
    }

    // Update nums2
    this.nums2[index] = newValue;

    // Add new value frequency
    this.freqMap.set(newValue, (this.freqMap.get(newValue) || 0) + 1);
  }

  count(total) {
    let pairs = 0;

    for (const num of this.nums1) {
      const required = total - num;

      pairs += this.freqMap.get(required) || 0;
    }

    return pairs;
  }
}
```

***

# Usage

```js
const obj = new FindSumPairs(
  [1, 1, 2, 2, 2, 3],
  [1, 4, 5, 2, 5, 4]
);

console.log(obj.count(7)); 
// pairs where nums1[i] + nums2[j] === 7

obj.add(3, 2);
// nums2[3] was 2, now becomes 4

console.log(obj.count(8));
```

***

# Dry Run

```js
nums1 = [1, 2, 3]
nums2 = [3, 4, 5]
total = 6
```

Frequency map of `nums2`:

```js
{
  3 => 1,
  4 => 1,
  5 => 1
}
```

Now check each value in `nums1`:

```text
num = 1
required = 6 - 1 = 5
freqMap[5] = 1

num = 2
required = 6 - 2 = 4
freqMap[4] = 1

num = 3
required = 6 - 3 = 3
freqMap[3] = 1
```

Total pairs:

```text
1 + 1 + 1 = 3
```

***

# Why Frequency Map Works

Instead of checking every possible pair:

```text
nums1[i] + nums2[j]
```

we convert the problem into:

```text
nums2[j] = total - nums1[i]
```

So for each `nums1[i]`, we only need to know:

> How many times does the required value exist in `nums2`?

That is why a `Map` is useful.

***

# TypeScript Version

```ts
class FindSumPairs {
  private nums1: number[];
  private nums2: number[];
  private freqMap: Map<number, number>;

  constructor(nums1: number[], nums2: number[]) {
    this.nums1 = nums1;
    this.nums2 = nums2;
    this.freqMap = new Map<number, number>();

    for (const num of nums2) {
      this.freqMap.set(num, (this.freqMap.get(num) || 0) + 1);
    }
  }

  add(index: number, value: number): void {
    const oldValue = this.nums2[index];
    const newValue = oldValue + value;

    const oldFrequency = this.freqMap.get(oldValue) || 0;

    if (oldFrequency <= 1) {
      this.freqMap.delete(oldValue);
    } else {
      this.freqMap.set(oldValue, oldFrequency - 1);
    }

    this.nums2[index] = newValue;

    this.freqMap.set(
      newValue,
      (this.freqMap.get(newValue) || 0) + 1
    );
  }

  count(total: number): number {
    let result = 0;

    for (const num of this.nums1) {
      const required = total - num;
      result += this.freqMap.get(required) || 0;
    }

    return result;
  }
}
```

***

# Complexity

Let:

```text
n = nums1.length
m = nums2.length
```

## Constructor

```text
O(m)
```

Because we build frequency map for `nums2`.

## add(index, value)

```text
O(1)
```

Because map update is constant time.

## count(total)

```text
O(n)
```

Because we iterate only over `nums1`.

## Space Complexity

```text
O(m)
```

Because we store frequencies of `nums2`.

***

# Important Interview Point

Why do we build frequency map for `nums2`, not `nums1`?

Because only `nums2` is updated.

```js
add(index, value)
```

modifies `nums2`, so we need a fast way to update and query its values.

If we stored all pair sums, then every update would require recalculating many pairs, which would be expensive.

***

# Follow-Up Optimisation

If `nums1` is also large and contains duplicates, we can also store frequency map of `nums1`.

Then `count()` can iterate over unique values only.

***

## More Optimised Version With Two Frequency Maps

```js
class FindSumPairs {
  constructor(nums1, nums2) {
    this.nums1 = nums1;
    this.nums2 = nums2;

    this.freq1 = new Map();
    this.freq2 = new Map();

    for (const num of nums1) {
      this.freq1.set(num, (this.freq1.get(num) || 0) + 1);
    }

    for (const num of nums2) {
      this.freq2.set(num, (this.freq2.get(num) || 0) + 1);
    }
  }

  add(index, value) {
    const oldValue = this.nums2[index];
    const newValue = oldValue + value;

    this.freq2.set(oldValue, this.freq2.get(oldValue) - 1);

    if (this.freq2.get(oldValue) === 0) {
      this.freq2.delete(oldValue);
    }

    this.nums2[index] = newValue;

    this.freq2.set(newValue, (this.freq2.get(newValue) || 0) + 1);
  }

  count(total) {
    let result = 0;

    for (const [num1, freqNum1] of this.freq1.entries()) {
      const required = total - num1;
      const freqNum2 = this.freq2.get(required) || 0;

      result += freqNum1 * freqNum2;
    }

    return result;
  }
}
```

***

# Complexity of More Optimised Version

```text
Constructor -> O(n + m)
add         -> O(1)
count       -> O(unique nums1)
```

This is better when `nums1` contains many duplicate values.

***

# Best Interview Answer

I would present this version:

```js
class FindSumPairs {
  constructor(nums1, nums2) {
    this.nums1 = nums1;
    this.nums2 = nums2;
    this.freq2 = new Map();

    for (const num of nums2) {
      this.freq2.set(num, (this.freq2.get(num) || 0) + 1);
    }
  }

  add(index, value) {
    const oldValue = this.nums2[index];
    const newValue = oldValue + value;

    this.freq2.set(oldValue, this.freq2.get(oldValue) - 1);

    if (this.freq2.get(oldValue) === 0) {
      this.freq2.delete(oldValue);
    }

    this.nums2[index] = newValue;

    this.freq2.set(newValue, (this.freq2.get(newValue) || 0) + 1);
  }

  count(total) {
    let pairs = 0;

    for (const num of this.nums1) {
      const required = total - num;
      pairs += this.freq2.get(required) || 0;
    }

    return pairs;
  }
}
```

***

# Interview Explanation

You can explain it like this:

> Since only `nums2` changes during updates, I maintain a frequency map for `nums2`.  
> For every count query, I iterate through `nums1` and calculate the complement needed from `nums2`.  
> The frequency map gives the number of matching values in constant time.  
> This reduces count from `O(n * m)` to `O(n)`, while keeping updates `O(1)`.

This is the exact kind of reasoning interviewers expect for a Senior JavaScript / React / Frontend Engineer coding round.
