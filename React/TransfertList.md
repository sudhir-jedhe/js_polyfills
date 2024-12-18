To implement the requirements you mentioned in React using mock APIs and promises, follow the steps below. We'll break the task into parts for clarity.

### 1. **Create Mock APIs Using Promises:**

We'll simulate two APIs that return a list of student objects, each having a `name`, `marks`, and a `registrationId`.

### 2. **Merge Data from Both APIs and Remove Duplicates:**

After fetching the data from the two APIs, we'll merge the lists and remove duplicates based on the `registrationId`.

### 3. **Render Data in `box1` with Checkboxes:**

In `box1`, display the students with checkboxes, allowing the user to select multiple students.

### 4. **Move Selected Students to `box2`:**

We'll create two boxes (`box1` and `box2`). Students can be moved from `box1` to `box2` by clicking the right arrow, and vice versa with the left arrow.

---

### Complete Code Example in React:

```javascript
import React, { useState, useEffect } from 'react';

// Simulate the API calls using promises
const getStudentsFromAPI1 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'John Doe', marks: 85, registrationId: '1' },
        { name: 'Jane Smith', marks: 90, registrationId: '2' },
        { name: 'Alex Johnson', marks: 75, registrationId: '3' },
      ]);
    }, 1000);
  });
};

const getStudentsFromAPI2 = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { name: 'Sam Green', marks: 88, registrationId: '4' },
        { name: 'Emily White', marks: 92, registrationId: '2' }, // Duplicate registrationId with API1
        { name: 'Chris Brown', marks: 80, registrationId: '5' },
      ]);
    }, 1000);
  });
};

const App = () => {
  const [students, setStudents] = useState([]);
  const [box1, setBox1] = useState([]);
  const [box2, setBox2] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);

  // Fetch data from both APIs and merge them
  useEffect(() => {
    const fetchData = async () => {
      const studentsFromAPI1 = await getStudentsFromAPI1();
      const studentsFromAPI2 = await getStudentsFromAPI2();

      // Merge the data and remove duplicates based on registrationId
      const allStudents = [...studentsFromAPI1, ...studentsFromAPI2];
      const uniqueStudents = Array.from(
        new Map(allStudents.map(student => [student.registrationId, student])).values()
      );

      setBox1(uniqueStudents); // Initially, all students are in box1
    };

    fetchData();
  }, []);

  const handleSelect = (studentId) => {
    setSelectedStudents((prevSelected) => {
      if (prevSelected.includes(studentId)) {
        return prevSelected.filter(id => id !== studentId);
      } else {
        return [...prevSelected, studentId];
      }
    });
  };

  const moveToBox2 = () => {
    const selectedData = box1.filter(student => selectedStudents.includes(student.registrationId));
    setBox2([...box2, ...selectedData]);
    setBox1(box1.filter(student => !selectedStudents.includes(student.registrationId)));
    setSelectedStudents([]); // Clear selection
  };

  const moveToBox1 = () => {
    const selectedData = box2.filter(student => selectedStudents.includes(student.registrationId));
    setBox1([...box1, ...selectedData]);
    setBox2(box2.filter(student => !selectedStudents.includes(student.registrationId)));
    setSelectedStudents([]); // Clear selection
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      {/* Box 1: Students List with checkboxes */}
      <div>
        <h3>Box 1</h3>
        <ul>
          {box1.map((student) => (
            <li key={student.registrationId}>
              <input
                type="checkbox"
                checked={selectedStudents.includes(student.registrationId)}
                onChange={() => handleSelect(student.registrationId)}
              />
              {student.name} - {student.marks}
            </li>
          ))}
        </ul>
      </div>

      {/* Buttons to move students between boxes */}
      <div>
        <button onClick={moveToBox2}>➔</button>
        <button onClick={moveToBox1}>➔</button>
      </div>

      {/* Box 2: Selected Students List */}
      <div>
        <h3>Box 2</h3>
        <ul>
          {box2.map((student) => (
            <li key={student.registrationId}>
              {student.name} - {student.marks}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default App;
```

---

### Key Points of the Code:

1. **Mock API Simulation**:
   - `getStudentsFromAPI1` and `getStudentsFromAPI2` simulate asynchronous API calls using `setTimeout` and return promises.
   
2. **Merging and Removing Duplicates**:
   - We combine the data from both APIs using the spread operator. The `Map` is used to remove duplicates based on the `registrationId`, as `Map` ensures unique keys.

3. **Rendering Students in `box1`**:
   - The students are initially rendered in `box1` as a list with checkboxes. The `checked` state of each checkbox depends on whether the student is selected.

4. **Moving Students Between Boxes**:
   - When the right arrow button (`➔`) is clicked, the selected students are moved from `box1` to `box2`, and vice versa for the left arrow button (`➔`).
   
5. **Handling Selection**:
   - We maintain a list of selected students in `selectedStudents`, which is updated as checkboxes are checked or unchecked.

---

### How It Works:
- Upon loading, the component fetches student data from both APIs and removes duplicates based on the `registrationId`.
- Students are initially displayed in `box1` with checkboxes.
- The user can select multiple students, and click the right arrow to move them to `box2` or the left arrow to move them back to `box1`.

This is a basic implementation of your requirements in React.