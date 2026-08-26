Here is the complete, cleanly separated implementation of BFE.dev coding/type challenges **1 through 63** in both **TypeScript** (type-level computations) and **JavaScript** (runtime-level functions).

---
<!-- 
1. implement Partial<T>
TypeScript
easy
2. implement Required<T>
TypeScript
easy
3. implement Readonly<T>
TypeScript
easy
4. implement Record<K, V>
TypeScript
easy
5. implement Pick<T, K>
TypeScript
easy
6. implement Omit<T, K>
TypeScript
easy
7. implement Exclude<T, E>
TypeScript
easy
8. implement Extract<T, U>
TypeScript
easy
9. implement NonNullable<T>
TypeScript
easy
10. implement Parameters<T>
TypeScript
easy
11. implement ConstructorParameters<T>
TypeScript
easy
12. implement ReturnType<T>
TypeScript
easy
13. implement InstanceType<T>
TypeScript
easy
14. implement ThisParameterType<T>
TypeScript
easy
15. implement OmitThisParameter<T>
TypeScript
easy
16. implement FirstChar<T>
TypeScript
easy
17. implement LastChar<T>
TypeScript
easy
18. implement TupleToUnion<T>
TypeScript
easy
19. implement FirstItem<T>
TypeScript
easy
20: implement IsNever<T>
TypeScript
easy
21. implement LastItem<T>
TypeScript
easy
22. implement StringToTuple<T>
TypeScript
easy
23. implement LengthOfTuple<T>
TypeScript
easy
24. implement LengthOfString<T>
TypeScript
easy
25. implement UnwrapPromise<T>
TypeScript
easy
26. implement ReverseTuple<T>
TypeScript
easy
27. implement Flat<T>
TypeScript
easy
28. implement IsEmptyType<T>
TypeScript
easy
29. implement Shift<T>
TypeScript
easy
30. implement IsAny<T>
TypeScript
easy
31. implement Push<T, I>
TypeScript
easy
32. implement RepeatString<T, C>
TypeScript
easy
33. implement TupleToString<T>
TypeScript
easy
34. implement Repeat<T, C>
TypeScript
easy
35. implement Filter<T, A>
TypeScript
easy
36. implement LargerThan<A, B>
TypeScript
easy
37. implement SmallerThan<A, B>
TypeScript
easy
38. implement Add<A, B>
TypeScript
easy
39. implement ToNumber<T>
TypeScript
easy
40. implement UnionToIntersection<T>
TypeScript
easy
41. implement FindIndex<T, E>
TypeScript
easy
42. implement Equal<A, B>
TypeScript
easy
43. implement Trim<T>
TypeScript
easy
44. implement ReplaceAll<S, F, T>
TypeScript
easy
45. implement Slice<A, S, E>
TypeScript
easy
46. implement Subtract<A, B>
TypeScript
easy
47. implement Multiply<A, B>
TypeScript
easy
48. implement Divide<A, B>
TypeScript
easy
49. asserts never
TypeScript
easy
50. implement Sort<T>
TypeScript
easy
51. implement Capitalize<T>
TypeScript
easy
52. implement Split<S, D>
TypeScript
easy
53. Implement SnakeCase<S>
TypeScript
easy
54. Implement CamelCase<S>
TypeScript
easy
55. implement StringToNumber<S>
TypeScript
easy
56. implement Abs<N>
TypeScript
easy
57. implement ObjectPaths<O> -->
TypeScript
easy
58. implement Diff<A, B>
TypeScript
easy
59. implement MapStringUnionToObjectUnion<U>
TypeScript
easy
60. implement UndefinedToNull<T>
TypeScript
easy
61. implement Prefix<T, P>
TypeScript
easy
62. implement Unique<T extends any[]>
TypeScript
easy

## Part 1: TypeScript Type Implementations (1 to 63)

```typescript
// 1. Partial<T>
type MyPartial<T> = {
  [P in keyof T]?: T[P];
};

// 2. Required<T>
type MyRequired<T> = {
  [P in keyof T]-?: T[P];
};

// 3. Readonly<T>
type MyReadonly<T> = {
  readonly [P in keyof T]: T[P];
};

// 4. Record<K, V>
type MyRecord<K extends keyof any, V> = {
  [P in K]: V;
};

// 5. Pick<T, K>
type MyPick<T, K extends keyof T> = {
  [P in K]: T[P];
};

// 6. Omit<T, K>
type MyOmit<T, K extends keyof any> = MyPick<T, MyExclude<keyof T, K>>;

// 7. Exclude<T, E>
type MyExclude<T, E> = T extends E ? never : T;

// 8. Extract<T, U>
type MyExtract<T, U> = T extends U ? T : never;

// 9. NonNullable<T>
type MyNonNullable<T> = T extends null | undefined ? never : T;

// 10. Parameters<T>
type MyParameters<T extends (...args: any[]) => any> = T extends (...args: infer P) => any
  ? P
  : never;

// 11. ConstructorParameters<T>
type MyConstructorParameters<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: infer P) => any ? P : never;

// 12. ReturnType<T>
type MyReturnType<T extends (...args: any[]) => any> = T extends (...args: any[]) => infer R
  ? R
  : any;

// 13. InstanceType<T>
type MyInstanceType<T extends abstract new (...args: any) => any> =
  T extends abstract new (...args: any) => infer R ? R : any;

// 14. ThisParameterType<T>
type MyThisParameterType<T> = T extends (this: infer U, ...args: any[]) => any
  ? U
  : unknown;

// 15. OmitThisParameter<T>
type MyOmitThisParameter<T> = unknown extends ThisParameterType<T>
  ? T
  : T extends (this: any, ...args: infer A) => infer R
  ? (...args: A) => R
  : T;

// 16. FirstChar<T>
type FirstChar<T extends string> = T extends `${infer F}${infer _R}` ? F : never;

// 17. LastChar<T>
type LastChar<T extends string, Prev = never> = T extends `${infer F}${infer R}`
  ? LastChar<R, F>
  : Prev;

// 18. TupleToUnion<T>
type TupleToUnion<T extends any[]> = T[number];

// 19. FirstItem<T>
type FirstItem<T extends any[]> = T extends [infer F, ...infer _R] ? F : never;

// 20. IsNever<T>
type IsNever<T> = [T] extends [never] ? true : false;

// 21. LastItem<T>
type LastItem<T extends any[]> = T extends [...infer _R, infer L] ? L : never;

// 22. StringToTuple<T>
type StringToTuple<T extends string> = T extends `${infer F}${infer R}`
  ? [F, ...StringToTuple<R>]
  : [];

// 23. LengthOfTuple<T>
type LengthOfTuple<T extends any[]> = T['length'];

// 24. LengthOfString<T>
type LengthOfString<T extends string, Acc extends string[] = []> =
  T extends `${infer _F}${infer R}`
    ? LengthOfString<R, [...Acc, '']>
    : Acc['length'];

// 25. UnwrapPromise<T>
type UnwrapPromise<T> = T extends Promise<infer U> ? UnwrapPromise<U> : T;

// 26. ReverseTuple<T>
type ReverseTuple<T extends any[]> = T extends [infer F, ...infer R]
  ? [...ReverseTuple<R>, F]
  : [];

// 27. Flat<T>
type Flat<T extends any[]> = T extends [infer F, ...infer R]
  ? F extends any[]
    ? [...Flat<F>, ...Flat<R>]
    : [F, ...Flat<R>]
  : [];

// 28. IsEmptyType<T>
type IsEmptyType<T> = [keyof T] extends [never]
  ? [T] extends [Record<PropertyKey, unknown>]
    ? true
    : false
  : false;

// 29. Shift<T>
type Shift<T extends any[]> = T extends [_infer F, ...infer R] ? R : [];

// 30. IsAny<T>
type IsAny<T> = 0 extends 1 & T ? true : false;

// 31. Push<T, I>
type Push<T extends any[], I> = [...T, I];

// 32. RepeatString<T, C>
type RepeatString<
  T extends string,
  C extends number,
  Count extends any[] = [],
  Res extends string = ''
> = Count['length'] extends C
  ? Res
  : RepeatString<T, C, [...Count, any], `${Res}${T}`>;

// 33. TupleToString<T>
type TupleToString<T extends string[]> = T extends [
  infer F extends string,
  ...infer R extends string[]
]
  ? `${F}${TupleToString<R>}`
  : '';

// 34. Repeat<T, C>
type Repeat<T, C extends number, Acc extends T[] = []> = Acc['length'] extends C
  ? Acc
  : Repeat<T, C, [...Acc, T]>;

// 35. Filter<T, A>
type Filter<T extends any[], A> = T extends [infer F, ...infer R]
  ? [F] extends [A]
    ? [F, ...Filter<R, A>]
    : Filter<R, A>
  : [];

// 36. LargerThan<A, B>
type LargerThan<
  A extends number,
  B extends number,
  Count extends any[] = []
> = Count['length'] extends A
  ? false
  : Count['length'] extends B
  ? true
  : LargerThan<A, B, [...Count, any]>;

// 37. SmallerThan<A, B>
type SmallerThan<
  A extends number,
  B extends number,
  Count extends any[] = []
> = Count['length'] extends B
  ? false
  : Count['length'] extends A
  ? true
  : SmallerThan<A, B, [...Count, any]>;

// Helper for arithmetic
type BuildTuple<N extends number, Acc extends any[] = []> = Acc['length'] extends N
  ? Acc
  : BuildTuple<N, [...Acc, any]>;

// 38. Add<A, B>
type Add<A extends number, B extends number> = [
  ...BuildTuple<A>,
  ...BuildTuple<B>
]['length'];

// 39. ToNumber<T>
type ToNumber<T extends string> = T extends `${infer N extends number}` ? N : never;

// 40. UnionToIntersection<T>
type UnionToIntersection<U> = (
  U extends any ? (k: U) => void : never
) extends (k: infer I) => void
  ? I
  : never;

// 41. FindIndex<T, E>
type IsEqual<X, Y> = (<T>() => T extends X ? 1 : 2) extends <T>() => T extends Y ? 1 : 2
  ? true
  : false;

type FindIndex<T extends any[], E, Acc extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? IsEqual<F, E> extends true
    ? Acc['length']
    : FindIndex<R, E, [...Acc, any]>
  : never;

// 42. Equal<A, B>
type Equal<A, B> = IsEqual<A, B>;

// 43. Trim<T>
type WhiteSpace = ' ' | '\t' | '\n';
type TrimLeft<T extends string> = T extends `${WhiteSpace}${infer R}` ? TrimLeft<R> : T;
type TrimRight<T extends string> = T extends `${infer R}${WhiteSpace}` ? TrimRight<R> : T;
type Trim<T extends string> = TrimLeft<TrimRight<T>>;

// 44. ReplaceAll<S, F, T>
type ReplaceAll<S extends string, F extends string, T extends string> = F extends ''
  ? S
  : S extends `${infer Left}${F}${infer Right}`
  ? `${Left}${T}${ReplaceAll<Right, F, T>}`
  : S;

// 45. Slice<A, S, E>
type Slice<
  A extends any[],
  S extends number = 0,
  E extends number = A['length'],
  StartCount extends any[] = [],
  EndCount extends any[] = [],
  Res extends any[] = []
> = A extends [infer F, ...infer R]
  ? EndCount['length'] extends E
    ? Res
    : StartCount['length'] extends S
    ? Slice<R, S, E, StartCount, [...EndCount, any], [...Res, F]>
    : Slice<R, S, E, [...StartCount, any], [...EndCount, any], Res>
  : Res;

// 46. Subtract<A, B>
type Subtract<A extends number, B extends number> = BuildTuple<A> extends [
  ...BuildTuple<B>,
  ...infer Rest
]
  ? Rest['length']
  : never;

// 47. Multiply<A, B>
type Multiply<
  A extends number,
  B extends number,
  Count extends any[] = [],
  Res extends any[] = []
> = Count['length'] extends B
  ? Res['length']
  : Multiply<A, B, [...Count, any], [...Res, ...BuildTuple<A>]>;

// 48. Divide<A, B>
type Divide<
  A extends number,
  B extends number,
  Count extends any[] = []
> = B extends 0
  ? never
  : BuildTuple<A> extends [...BuildTuple<B>, ...infer Rest]
  ? Divide<Rest['length'], B, [...Count, any]>
  : Count['length'];

// 49. asserts never
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${JSON.stringify(value)}`);
}

// 50. Sort<T>
type InsertSorted<T extends number[], N extends number> = T extends [
  infer F extends number,
  ...infer R extends number[]
]
  ? LargerThan<F, N> extends true
    ? [N, F, ...R]
    : [F, ...InsertSorted<R, N>]
  : [N];

type Sort<T extends number[], Acc extends number[] = []> = T extends [
  infer F extends number,
  ...infer R extends number[]
]
  ? Sort<R, InsertSorted<Acc, F>>
  : Acc;

// 51. Capitalize<T>
type MyCapitalize<T extends string> = T extends `${infer F}${infer R}`
  ? `${Uppercase<F>}${R}`
  : T;

// 52. Split<S, D>
type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends `${infer F}${D}${infer R}`
  ? [F, ...Split<R, D>]
  : [S];

// 53. SnakeCase<S>
type SnakeCase<S extends string> = S extends `${infer F}${infer R}`
  ? F extends Uppercase<F>
    ? F extends Lowercase<F>
      ? `${F}${SnakeCase<R>}`
      : `_${Lowercase<F>}${SnakeCase<R>}`
    : `${F}${SnakeCase<R>}`
  : S;

// 54. CamelCase<S>
type CamelCase<S extends string> = S extends `${infer Left}_${infer Right}`
  ? `${Lowercase<Left>}${Capitalize<CamelCase<Right>>}`
  : Lowercase<S>;

// 55. StringToNumber<S>
type StringToNumber<S extends string> = S extends `${infer N extends number}`
  ? N
  : never;

// 56. Abs<N>
type Abs<N extends number | string | bigint> = `${N}` extends `-${infer M extends number}`
  ? M
  : `${N}` extends `-${infer S}`
  ? S
  : N;

// 57. ObjectPaths<O>
type ObjectPaths<O extends Record<string, any>> = {
  [K in keyof O]: O[K] extends Record<string, any>
    ? `${K & string}` | `${K & string}.${ObjectPaths<O[K]>}`
    : `${K & string}`;
}[keyof O];

// 58. Diff<A, B>
type Diff<A, B> = Omit<A & B, keyof (A | B)>;

// 59. MapStringUnionToObjectUnion<U>
type MapStringUnionToObjectUnion<U extends string> = U extends any
  ? { value: U }
  : never;

// 60. UndefinedToNull<T>
type UndefinedToNull<T> = {
  [K in keyof T]: [T[K]] extends [undefined]
    ? null
    : T[K] extends Record<string, any>
    ? UndefinedToNull<T[K]>
    : T[K];
};

// 61. Prefix<T, P>
type Prefix<T extends Record<string, any>, P extends string> = {
  [K in keyof T as `${P}${Capitalize<K & string>}`]: T[K];
};

// 62. Unique<T extends any[]>
type Includes<T extends any[], U> = T extends [infer F, ...infer R]
  ? IsEqual<F, U> extends true
    ? true
    : Includes<R, U>
  : false;

type Unique<T extends any[], Acc extends any[] = []> = T extends [
  infer F,
  ...infer R
]
  ? Includes<Acc, F> extends true
    ? Unique<R, Acc>
    : Unique<R, [...Acc, F]>
  : Acc;

// 63. Merge<A, B> (Combines fields with B overriding A)
type Merge<A, B> = {
  [K in keyof A | keyof B]: K extends keyof B
    ? B[K]
    : K extends keyof A
    ? A[K]
    : never;
};

```

---

## Part 2: JavaScript Runtime Implementations (1 to 63)

```javascript
// 1. Partial<T>
function toPartial(obj) {
  if (obj === null || typeof obj !== 'object') throw new TypeError('Target must be an object');
  return { ...obj };
}

// 2. Required<T>
function assertRequired(obj, requiredKeys = Object.keys(obj)) {
  if (obj === null || typeof obj !== 'object') throw new TypeError('Target must be an object');
  for (const key of requiredKeys) {
    if (obj[key] === undefined || !(key in obj)) {
      throw new Error(`Missing required property: "${String(key)}"`);
    }
  }
  return obj;
}

// 3. Readonly<T>
function toReadonly(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  return Object.freeze({ ...obj });
}

// 4. Record<K, V>
function createRecord(keys, valueOrInitializer) {
  const result = {};
  for (const key of keys) {
    result[key] = typeof valueOrInitializer === 'function' ? valueOrInitializer(key) : valueOrInitializer;
  }
  return result;
}

// 5. Pick<T, K>
function pick(obj, keys) {
  if (obj === null || typeof obj !== 'object') return {};
  const result = {};
  for (const key of keys) {
    if (key in obj) result[key] = obj[key];
  }
  return result;
}

// 6. Omit<T, K>
function omit(obj, keys) {
  if (obj === null || typeof obj !== 'object') return {};
  const keysToOmit = new Set(keys);
  const result = {};
  for (const key of Object.keys(obj)) {
    if (!keysToOmit.has(key)) result[key] = obj[key];
  }
  return result;
}

// 7. Exclude<T, E>
function exclude(collection, excludedItems) {
  const excludedSet = new Set(excludedItems);
  return collection.filter((item) => !excludedSet.has(item));
}

// 8. Extract<T, U>
function extract(collection, targetItems) {
  const targetSet = new Set(targetItems);
  return collection.filter((item) => targetSet.has(item));
}

// 9. NonNullable<T>
function filterNonNullable(collection) {
  if (Array.isArray(collection)) {
    return collection.filter((item) => item !== null && item !== undefined);
  }
  return collection !== null && collection !== undefined ? collection : null;
}

// 10. Parameters<T>
function getParameters(fn) {
  if (typeof fn !== 'function') throw new TypeError('Target must be a function');
  const fnStr = fn.toString().replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/gm, '');
  const match = fnStr.match(/\(([^)]*)\)/);
  if (!match || !match[1].trim()) return [];
  return match[1].split(',').map((p) => p.trim().split('=')[0].trim()).filter(Boolean);
}

// 11. ConstructorParameters<T>
function getConstructorParameters(constructorFn) {
  if (typeof constructorFn !== 'function') throw new TypeError('Target must be a constructor function or class');
  const fnStr = constructorFn.toString();
  const match = fnStr.match(/constructor\s*\(([^)]*)\)/) || fnStr.match(/function[^(]*\(([^)]*)\)/);
  if (!match || !match[1].trim()) return [];
  return match[1].split(',').map((p) => p.trim().split('=')[0].trim()).filter(Boolean);
}

// 12. ReturnType<T>
function invokeAndGetReturn(fn, ...args) {
  if (typeof fn !== 'function') throw new TypeError('Target must be a function');
  return fn(...args);
}

// 13. InstanceType<T>
function createInstance(ConstructorFn, ...args) {
  return Reflect.construct(ConstructorFn, args);
}

// 14. ThisParameterType<T>
function bindContext(fn, context) {
  return fn.bind(context);
}

// 15. OmitThisParameter<T>
function omitThisParameter(fn) {
  return function (...args) {
    return fn.apply(undefined, args);
  };
}

// 16. FirstChar<T>
function firstChar(str) {
  return typeof str === 'string' && str.length > 0 ? str[0] : '';
}

// 17. LastChar<T>
function lastChar(str) {
  return typeof str === 'string' && str.length > 0 ? str[str.length - 1] : '';
}

// 18. TupleToUnion<T>
function tupleToUniqueSet(arr) {
  return Array.from(new Set(arr));
}

// 19. FirstItem<T>
function firstItem(arr) {
  return Array.isArray(arr) && arr.length > 0 ? arr[0] : undefined;
}

// 20. IsNever<T>
function isNever(val) {
  return val === undefined || (Array.isArray(val) && val.length === 0);
}

// 21. LastItem<T>
function lastItem(arr) {
  return Array.isArray(arr) && arr.length > 0 ? arr[arr.length - 1] : undefined;
}

// 22. StringToTuple<T>
function stringToTuple(str) {
  return typeof str === 'string' ? Array.from(str) : [];
}

// 23. LengthOfTuple<T>
function lengthOfTuple(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

// 24. LengthOfString<T>
function lengthOfString(str) {
  return typeof str === 'string' ? Array.from(str).length : 0;
}

// 25. UnwrapPromise<T>
async function unwrapPromise(promiseOrValue) {
  let result = await promiseOrValue;
  while (result && typeof result.then === 'function') {
    result = await result;
  }
  return result;
}

// 26. ReverseTuple<T>
function reverseTuple(arr) {
  return [...arr].reverse();
}

// 27. Flat<T>
function flatArray(arr, depth = Infinity) {
  return arr.flat(depth);
}

// 28. IsEmptyType<T>
function isEmptyObject(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) return false;
  return Reflect.ownKeys(obj).length === 0;
}

// 29. Shift<T>
function shiftArray(arr) {
  return arr.slice(1);
}

// 30. IsAny<T>
function isAny(_val) {
  return true;
}

// 31. Push<T, I>
function pushArray(arr, item) {
  return [...arr, item];
}

// 32. RepeatString<T, C>
function repeatString(str, count) {
  return str.repeat(Math.max(0, count));
}

// 33. TupleToString<T>
function tupleToString(arr) {
  return arr.join('');
}

// 34. Repeat<T, C>
function repeatItem(item, count) {
  return Array.from({ length: Math.max(0, count) }, () => item);
}

// 35. Filter<T, A>
function filterArray(arr, predicateOrValue) {
  if (typeof predicateOrValue === 'function') return arr.filter(predicateOrValue);
  return arr.filter((item) => Object.is(item, predicateOrValue));
}

// 36. LargerThan<A, B>
function largerThan(a, b) {
  return a > b;
}

// 37. SmallerThan<A, B>
function smallerThan(a, b) {
  return a < b;
}

// 38. Add<A, B>
function addNumbers(a, b) {
  return a + b;
}

// 39. ToNumber<T>
function toNumber(str) {
  const num = Number(str);
  return Number.isNaN(num) ? null : num;
}

// 40. UnionToIntersection<T>
function mergeObjects(...objects) {
  return Object.assign({}, ...objects);
}

// 41. FindIndex<T, E>
function findIndexExact(arr, target) {
  return arr.findIndex((item) => Object.is(item, target));
}

// 42. Equal<A, B>
function isEqual(a, b) {
  if (Object.is(a, b)) return true;
  if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) return false;
  const keysA = Reflect.ownKeys(a);
  const keysB = Reflect.ownKeys(b);
  if (keysA.length !== keysB.length) return false;
  return keysA.every((k) => isEqual(a[k], b[k]));
}

// 43. Trim<T>
function trimString(str) {
  return str.trim();
}

// 44. ReplaceAll<S, F, T>
function replaceAll(str, find, replaceWith) {
  return str.split(find).join(replaceWith);
}

// 45. Slice<A, S, E>
function sliceArray(arr, start = 0, end = arr.length) {
  return arr.slice(start, end);
}

// 46. Subtract<A, B>
function subtractNumbers(a, b) {
  return a - b;
}

// 47. Multiply<A, B>
function multiplyNumbers(a, b) {
  return a * b;
}

// 48. Divide<A, B>
function divideNumbers(a, b) {
  if (b === 0) throw new RangeError('Division by zero');
  return a / b;
}

// 49. asserts never
function assertNeverRuntime(value) {
  throw new Error(`Unexpected unreachable value: ${JSON.stringify(value)}`);
}

// 50. Sort<T>
function sortNumbers(arr) {
  return [...arr].sort((a, b) => a - b);
}

// 51. Capitalize<T>
function capitalize(str) {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// 52. Split<S, D>
function splitString(str, delimiter) {
  return str.split(delimiter);
}

// 53. SnakeCase<S>
function snakeCase(str) {
  return str
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
}

// 54. CamelCase<S>
function camelCase(str) {
  return str
    .toLowerCase()
    .replace(/_([a-z0-9])/g, (_, char) => char.toUpperCase());
}

// 55. StringToNumber<S>
function stringToNumber(str) {
  return +str;
}

// 56. Abs<N>
function abs(num) {
  return Math.abs(Number(num));
}

// 57. ObjectPaths<O>
function objectPaths(obj, prefix = '') {
  let paths = [];
  for (const [key, value] of Object.entries(obj)) {
    const currentPath = prefix ? `${prefix}.${key}` : key;
    paths.push(currentPath);
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      paths = paths.concat(objectPaths(value, currentPath));
    }
  }
  return paths;
}

// 58. Diff<A, B>
function objectDiff(a, b) {
  const result = {};
  for (const key of Object.keys(a)) {
    if (!(key in b)) result[key] = a[key];
  }
  for (const key of Object.keys(b)) {
    if (!(key in a)) result[key] = b[key];
  }
  return result;
}

// 59. MapStringUnionToObjectUnion<U>
function mapUnionToObjectArray(values) {
  return values.map((val) => ({ value: val }));
}

// 60. UndefinedToNull<T>
function undefinedToNull(obj) {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(undefinedToNull);
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = value === undefined ? null : undefinedToNull(value);
  }
  return result;
}

// 61. Prefix<T, P>
function prefixObjectKeys(obj, prefix) {
  const result = {};
  for (const [key, value] of Object.entries(obj)) {
    const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
    result[`${prefix}${capitalizedKey}`] = value;
  }
  return result;
}

// 62. Unique<T extends any[]>
function uniqueArray(arr) {
  return Array.from(new Set(arr));
}

// 63. Merge<A, B>
function merge(a, b) {
  return { ...a, ...b };
}

```
