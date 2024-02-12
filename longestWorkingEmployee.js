export function longestWorkingEmployee(logs) {
  let maxLeaveTime = 0;
  let employeeID = Infinity;

  for (const [id, leaveTime] of logs) {
    if (
      leaveTime > maxLeaveTime ||
      (leaveTime === maxLeaveTime && id < employeeID)
    ) {
      maxLeaveTime = leaveTime;
      employeeID = id;
    }
  }

  return employeeID;
}

import { longestWorkingEmployee } from "./longestWorkingEmployee.js";

const logs = [
  [1, 5],
  [2, 7],
  [3, 5],
  [4, 8],
];
console.log(longestWorkingEmployee(logs)); // Output: 4
