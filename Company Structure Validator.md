# Company Structure Validator (Uber Frontend Interview)

Based on public references, **Company Structure Validator** is an organisational hierarchy validation problem that tests:

* Graphs
* DFS
* Cycle Detection
* Tree Validation
* Data Structures
* Recursion [\[linkedin.com\]](https://www.linkedin.com/posts/yomeshgupta_sharing-some-interesting-frontend-interview-activity-7353997366212907010-7bJR), [\[github.com\]](https://github.com/anshpayal/org-hierarchy-validator)

***

## Problem Statement

Given employee data:

```js
const employees = [
  {
    id: 1,
    name: "CEO",
    managerId: null,
  },
  {
    id: 2,
    name: "Manager A",
    managerId: 1,
  },
  {
    id: 3,
    name: "Developer",
    managerId: 2,
  },
];
```

Validate that:

### Rules

✅ Exactly one CEO

✅ Every manager exists

✅ No circular reporting

✅ Employee cannot manage himself

✅ Organisation is connected

✅ No orphan employees

***

# Expected Output

```js
{
  valid: true,
  errors: []
}
```

or

```js
{
  valid: false,
  errors: [
    "Employee 7 reports to non-existing manager",
    "Cycle detected"
  ]
}
```

***

# Complete Solution

```js
function validateCompanyStructure(
  employees
) {
  const errors = [];

  const employeeMap =
    new Map();

  for (const employee of employees) {
    employeeMap.set(
      employee.id,
      employee
    );
  }

  /*
   -------------------------
   Rule 1: One CEO
   -------------------------
  */

  const ceos =
    employees.filter(
      employee =>
        employee.managerId ===
        null
    );

  if (ceos.length !== 1) {
    errors.push(
      "There must be exactly one CEO"
    );
  }

  /*
   -------------------------
   Rule 2: Manager Exists
   -------------------------
  */

  for (const employee of employees) {
    if (
      employee.managerId !== null &&
      !employeeMap.has(
        employee.managerId
      )
    ) {
      errors.push(
        `Employee ${employee.id} reports to non-existing manager`
      );
    }
  }

  /*
   -------------------------
   Rule 3: Self Reporting
   -------------------------
  */

  for (const employee of employees) {
    if (
      employee.id ===
      employee.managerId
    ) {
      errors.push(
        `Employee ${employee.id} reports to himself`
      );
    }
  }

  /*
   -------------------------
   Rule 4: Cycle Detection
   -------------------------
  */

  const visiting =
    new Set();

  const visited =
    new Set();

  function hasCycle(id) {
    if (
      visiting.has(id)
    ) {
      return true;
    }

    if (
      visited.has(id)
    ) {
      return false;
    }

    visiting.add(id);

    const employee =
      employeeMap.get(id);

    if (
      employee &&
      employee.managerId !==
        null
    ) {
      if (
        hasCycle(
          employee.managerId
        )
      ) {
        return true;
      }
    }

    visiting.delete(id);
    visited.add(id);

    return false;
  }

  for (const employee of employees) {
    if (
      hasCycle(employee.id)
    ) {
      errors.push(
        "Cycle detected in hierarchy"
      );
      break;
    }
  }

  /*
   -------------------------
   Rule 5: Connected Org
   -------------------------
  */

  if (
    ceos.length === 1
  ) {
    const ceo =
      ceos[0];

    const graph =
      new Map();

    for (const employee of employees) {
      graph.set(
        employee.id,
        []
      );
    }

    for (const employee of employees) {
      if (
        employee.managerId !==
        null
      ) {
        graph
          .get(
            employee.managerId
          )
          .push(employee.id);
      }
    }

    const seen =
      new Set();

    function dfs(id) {
      seen.add(id);

      const reports =
        graph.get(id);

      for (const child of reports) {
        if (
          !seen.has(child)
        ) {
          dfs(child);
        }
      }
    }

    dfs(ceo.id);

    if (
      seen.size !==
      employees.length
    ) {
      errors.push(
        "Organization contains orphan employees"
      );
    }
  }

  return {
    valid:
      errors.length === 0,
    errors,
  };
}
```

***

# Example 1 (Valid)

```js
const employees = [
  {
    id: 1,
    managerId: null,
  },
  {
    id: 2,
    managerId: 1,
  },
  {
    id: 3,
    managerId: 2,
  },
];

console.log(
  validateCompanyStructure(
    employees
  )
);
```

Output:

```js
{
  valid: true,
  errors: []
}
```

***

# Example 2 (Cycle)

```js
const employees = [
  {
    id: 1,
    managerId: 2,
  },
  {
    id: 2,
    managerId: 1,
  },
];
```

Output:

```js
{
  valid: false,
  errors: [
    "Cycle detected in hierarchy"
  ]
}
```

***

# Example 3 (Missing Manager)

```js
const employees = [
  {
    id: 1,
    managerId: null,
  },
  {
    id: 2,
    managerId: 99,
  },
];
```

Output:

```js
{
  valid: false,
  errors: [
    "Employee 2 reports to non-existing manager"
  ]
}
```

***

# TypeScript Version

```ts
interface Employee {
  id: number;
  name: string;
  managerId: number | null;
}
```

Everything else remains the same.

***

# Complexity

### Building Map

```text
O(n)
```

### Manager Validation

```text
O(n)
```

### DFS Cycle Check

```text
O(n)
```

### Connectivity Check

```text
O(n)
```

### Total

```text
Time: O(n)

Space: O(n)
```

***

# Senior Interview Follow-ups

Interviewers often extend with:

### Find CEO

```js
getCEO()
```

### Get Direct Reports

```js
getDirectReports(id)
```

### Get Entire Reporting Tree

```js
getHierarchy(id)
```

### Find Lowest Common Manager

```text
Developer A
Developer B

→ Common Manager
```

### Maximum Hierarchy Depth

```js
getMaxDepth()
```

### Salary Validation

Some company hierarchy validator variants add rules such as checking manager salary ranges and reporting depth limits. [\[github.com\]](https://github.com/luckylowkesh/company-hierarchy-validator), [\[deepwiki.com\]](https://deepwiki.com/pankajofksms/salary-analysis/3-validation)

This solution demonstrates the key concepts interviewers usually want to see: **Map-based lookup, graph modelling, DFS traversal, cycle detection, connectivity validation, and hierarchy integrity checks**.
