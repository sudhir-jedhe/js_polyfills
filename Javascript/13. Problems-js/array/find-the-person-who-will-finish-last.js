/**
 * Find the person who will finish last.
 *
 * Two classic readings:
 *   1. Josephus problem — people in a circle, every k-th is eliminated;
 *      who survives?
 *   2. A queue of tasks where each person's finish time is their total
 *      work; who finishes last?
 */

/**
 * Josephus survivor, 0-indexed. Recurrence: J(1) = 0,
 * J(n) = (J(n-1) + k) % n.
 * Time  O(n), Space O(1)
 */
function josephusSurvivor(n, k) {
  let survivor = 0;
  for (let i = 2; i <= n; i++) survivor = (survivor + k) % i;
  return survivor;
}

/** 1-indexed answer, which is how the puzzle is usually stated. */
const josephusSurvivorOneBased = (n, k) => josephusSurvivor(n, k) + 1;

/** The full elimination order, when you want to see the process. */
function josephusOrder(n, k) {
  const people = Array.from({ length: n }, (_, i) => i + 1);
  const eliminated = [];
  let index = 0;

  while (people.length > 1) {
    index = (index + k - 1) % people.length;
    eliminated.push(people.splice(index, 1)[0]);
  }

  return { eliminated, survivor: people[0] };
}

/**
 * Queue version: each person has a list of task durations. The person who
 * finishes last is the one with the largest total, ties going to the later
 * position in the queue.
 */
function lastToFinish(people) {
  let last = null;

  people.forEach((person, index) => {
    const total = Array.isArray(person.tasks)
      ? person.tasks.reduce((a, b) => a + b, 0)
      : Number(person.work ?? 0);

    if (!last || total >= last.total) last = { ...person, index, total };
  });

  return last;
}

/**
 * Round-robin queue: everyone takes one unit per turn. The person who
 * finishes last is simply the one with the most work, ties broken by the
 * later queue position.
 */
function lastInRoundRobin(workloads) {
  let bestIndex = 0;

  for (let i = 1; i < workloads.length; i++) {
    if (workloads[i] >= workloads[bestIndex]) bestIndex = i;
  }

  return bestIndex;
}

// ---- Examples ----
console.log(josephusSurvivorOneBased(7, 3));  // 4
console.log(josephusSurvivorOneBased(5, 2));  // 3
console.log(josephusOrder(5, 2));             // eliminated order + survivor
console.log(lastToFinish([
  { name: 'a', tasks: [2, 3] },
  { name: 'b', tasks: [10] },
])); // b, total 10
console.log(lastInRoundRobin([3, 7, 7, 2]));  // 2  (later of the two 7s)

module.exports = { josephusSurvivor, josephusSurvivorOneBased, josephusOrder, lastToFinish, lastInRoundRobin };
