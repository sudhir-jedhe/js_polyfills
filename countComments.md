# Count Total Comments (Nested Comments Interview Question)

This is a common JavaScript/Frontend interview problem.

You are given a nested comment tree and need to count **all comments**, including replies at any depth. Nested comment systems are typically represented as a tree where each comment can have child replies recursively. [\[frontenddummies.com\]](https://frontenddummies.com/design/nested-comments-system), [\[jaynil-gag...shnode.dev\]](https://jaynil-gaglani.hashnode.dev/infinitely-nested-comment-reply-feature)

***

# Problem

```js
const comments = [
  {
    id: 1,
    text: "Comment 1",
    replies: [
      {
        id: 2,
        text: "Reply 1",
        replies: [],
      },
      {
        id: 3,
        text: "Reply 2",
        replies: [
          {
            id: 4,
            text: "Nested Reply",
            replies: [],
          },
        ],
      },
    ],
  },
];
```

Output:

```js
4
```

***

# Solution 1: DFS Recursion (Most Common)

Depth-first traversal is a natural fit for nested comment trees. [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-13-count-nested-comments-atlassian-activity-7372585113743925248-QcLY), [\[youtube.com\]](https://www.youtube.com/watch?v=zo84_CINvto)

```js
function countComments(
  comments
) {
  let count = 0;

  for (const comment of comments) {
    count++;

    if (
      comment.replies?.length
    ) {
      count +=
        countComments(
          comment.replies
        );
    }
  }

  return count;
}
```

### Usage

```js
console.log(
  countComments(comments)
);
```

Output:

```js
4
```

***

# Dry Run

```text
Comment 1
    count = 1

Reply 1
    count = 2

Reply 2
    count = 3

Nested Reply
    count = 4
```

Result:

```text
4
```

***

# Solution 2: Iterative DFS

Avoid recursion stack issues.

```js
function countComments(
  comments
) {
  let count = 0;

  const stack = [
    ...comments,
  ];

  while (
    stack.length
  ) {
    const current =
      stack.pop();

    count++;

    if (
      current.replies
    ) {
      stack.push(
        ...current.replies
      );
    }
  }

  return count;
}
```

***

# Solution 3: BFS

```js
function countComments(
  comments
) {
  let count = 0;

  const queue = [
    ...comments,
  ];

  while (
    queue.length
  ) {
    const current =
      queue.shift();

    count++;

    queue.push(
      ...(current.replies ||
        [])
    );
  }

  return count;
}
```

DFS and BFS are both suitable ways to traverse hierarchical comment structures. [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-13-count-nested-comments-atlassian-activity-7372585113743925248-QcLY), [\[youtube.com\]](https://www.youtube.com/watch?v=zo84_CINvto)

***

# Follow-Up: Count Per Level

Input:

```text
Level 0: 1 comment
Level 1: 2 replies
Level 2: 1 reply
```

Output:

```js
{
  0: 1,
  1: 2,
  2: 1
}
```

```js
function countByLevel(
  comments
) {
  const result = {};

  const queue =
    comments.map(
      comment => ({
        comment,
        level: 0,
      })
    );

  while (
    queue.length
  ) {
    const {
      comment,
      level,
    } = queue.shift();

    result[level] =
      (result[level] ||
        0) + 1;

    for (const reply of comment.replies ||
      []) {
      queue.push({
        comment: reply,
        level:
          level + 1,
      });
    }
  }

  return result;
}
```

***

# Follow-Up: Handle Circular References

Interviewers sometimes add:

```js
commentA.replies.push(
  commentB
);

commentB.replies.push(
  commentA
);
```

Prevent infinite loops:

```js
function countComments(
  comments
) {
  const visited =
    new Set();

  let count = 0;

  function dfs(
    comment
  ) {
    if (
      visited.has(
        comment.id
      )
    ) {
      return;
    }

    visited.add(
      comment.id
    );

    count++;

    for (const reply of comment.replies ||
      []) {
      dfs(reply);
    }
  }

  comments.forEach(
    dfs
  );

  return count;
}
```

Handling malformed structures and circular references is often discussed as an important edge case for nested comment trees. [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-13-count-nested-comments-atlassian-activity-7372585113743925248-QcLY), [\[youtube.com\]](https://www.youtube.com/watch?v=zo84_CINvto)

***

# Complexity

### Recursive DFS

```text
Time:  O(n)

Space: O(h)
```

where:

```text
n = total comments
h = tree height
```

### Iterative DFS/BFS

```text
Time:  O(n)

Space: O(n)
```

***

# Senior Interview Answer

> A nested comment system forms a tree. The optimal solution is to traverse the tree using DFS (recursive or iterative) and increment a counter for every node visited. This guarantees O(n) time complexity because every comment is visited exactly once. For production systems, I'd also guard against malformed data and circular references using a visited set. [\[frontenddummies.com\]](https://frontenddummies.com/design/nested-comments-system), [\[linkedin.com\]](https://www.linkedin.com/posts/subham-rohilla-50191096_day-13-count-nested-comments-atlassian-activity-7372585113743925248-QcLY)
