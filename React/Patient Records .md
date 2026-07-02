# Patient Records CRUD + Search + Sort + Filter (React Machine Coding)

This is a very common **React interview challenge** that combines:

```text
✅ Create Patient
✅ Read Patients
✅ Update Patient
✅ Delete Patient
✅ Search
✅ Filter
✅ Sort
✅ Pagination (optional)
✅ Form Validation
```

***

# Patient Data Model

```ts
interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  disease: string;
  admissionDate: string;
  status: "Admitted" | "Discharged";
}
```

***

# Sample Data

```jsx
const initialPatients = [
  {
    id: 1,
    name: "John Smith",
    age: 35,
    gender: "Male",
    disease: "Diabetes",
    admissionDate: "2026-01-15",
    status: "Admitted",
  },
  {
    id: 2,
    name: "Alice Brown",
    age: 28,
    gender: "Female",
    disease: "Asthma",
    admissionDate: "2026-03-10",
    status: "Discharged",
  },
];
```

***

# Complete Component

```jsx
import {
  useMemo,
  useState,
} from "react";

export default function PatientManagement() {
  const [patients, setPatients] =
    useState(initialPatients);

  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [sortBy, setSortBy] =
    useState("name");

  const [form, setForm] =
    useState({
      name: "",
      age: "",
      gender: "",
      disease: "",
      admissionDate: "",
      status: "Admitted",
    });

  const [editingId, setEditingId] =
    useState(null);

  // CREATE / UPDATE

  const handleSubmit = e => {
    e.preventDefault();

    if (editingId) {
      setPatients(prev =>
        prev.map(patient =>
          patient.id === editingId
            ? {
                ...patient,
                ...form,
                age: Number(form.age),
              }
            : patient
        )
      );

      setEditingId(null);
    } else {
      setPatients(prev => [
        ...prev,
        {
          id: Date.now(),
          ...form,
          age: Number(form.age),
        },
      ]);
    }

    resetForm();
  };

  const resetForm = () => {
    setForm({
      name: "",
      age: "",
      gender: "",
      disease: "",
      admissionDate: "",
      status: "Admitted",
    });
  };

  // EDIT

  const handleEdit = patient => {
    setEditingId(patient.id);

    setForm({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      disease: patient.disease,
      admissionDate:
        patient.admissionDate,
      status: patient.status,
    });
  };

  // DELETE

  const handleDelete = id => {
    setPatients(prev =>
      prev.filter(
        patient =>
          patient.id !== id
      )
    );
  };

  // SEARCH + FILTER + SORT

  const filteredPatients =
    useMemo(() => {
      let result = [...patients];

      // Search

      result = result.filter(
        patient =>
          patient.name
            .toLowerCase()
            .includes(
              search.toLowerCase()
            ) ||
          patient.disease
            .toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );

      // Filter

      if (
        statusFilter !== "All"
      ) {
        result =
          result.filter(
            patient =>
              patient.status ===
              statusFilter
          );
      }

      // Sort

      switch (sortBy) {
        case "name":
          result.sort((a, b) =>
            a.name.localeCompare(
              b.name
            )
          );
          break;

        case "age":
          result.sort(
            (a, b) =>
              a.age - b.age
          );
          break;

        case "date":
          result.sort(
            (a, b) =>
              new Date(
                a.admissionDate
              ) -
              new Date(
                b.admissionDate
              )
          );
          break;

        default:
          break;
      }

      return result;
    }, [
      patients,
      search,
      statusFilter,
      sortBy,
    ]);

  return (
    <div>
      <h1>
        Patient Records
      </h1>

      {/* SEARCH */}

      <input
        placeholder="Search patient..."
        value={search}
        onChange={e =>
          setSearch(
            e.target.value
          )
        }
      />

      {/* FILTER */}

      <select
        value={statusFilter}
        onChange={e =>
          setStatusFilter(
            e.target.value
          )
        }
      >
        <option>All</option>
        <option>
          Admitted
        </option>
        <option>
          Discharged
        </option>
      </select>

      {/* SORT */}

      <select
        value={sortBy}
        onChange={e =>
          setSortBy(
            e.target.value
          )
        }
      >
        <option value="name">
          Sort By Name
        </option>
        <option value="age">
          Sort By Age
        </option>
        <option value="date">
          Sort By Date
        </option>
      </select>

      {/* FORM */}

      <form
        onSubmit={
          handleSubmit
        }
      >
        <input
          placeholder="Name"
          value={form.name}
          onChange={e =>
            setForm({
              ...form,
              name: e.target.value,
            })
          }
        />

        <input
          type="number"
          placeholder="Age"
          value={form.age}
          onChange={e =>
            setForm({
              ...form,
              age: e.target.value,
            })
          }
        />

        <input
          placeholder="Disease"
          value={form.disease}
          onChange={e =>
            setForm({
              ...form,
              disease:
                e.target.value,
            })
          }
        />

        <select
          value={form.status}
          onChange={e =>
            setForm({
              ...form,
              status:
                e.target.value,
            })
          }
        >
          <option>
            Admitted
          </option>
          <option>
            Discharged
          </option>
        </select>

        <button
          type="submit"
        >
          {editingId
            ? "Update"
            : "Add"}
        </button>
      </form>

      {/* TABLE */}

      <table
        border="1"
        width="100%"
      >
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Disease</th>
            <th>Status</th>
            <th>
              Admission Date
            </th>
            <th>
              Actions
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredPatients.map(
            patient => (
              <tr
                key={
                  patient.id
                }
              >
                <td>
                  {patient.name}
                </td>

                <td>
                  {patient.age}
                </td>

                <td>
                  {
                    patient.disease
                  }
                </td>

                <td>
                  {
                    patient.status
                  }
                </td>

                <td>
                  {
                    patient.admissionDate
                  }
                </td>

                <td>
                  <button
                    onClick={() =>
                      handleEdit(
                        patient
                      )
                    }
                  >
                    Edit
                  </button>

                  <button
                    onClick={() =>
                      handleDelete(
                        patient.id
                      )
                    }
                  >
                    Delete
                  </button>
                </td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
}
```

***

# Interview Enhancements

### Search

```text
Search by:
✓ Name
✓ Disease
✓ ID
✓ Doctor
```

### Filters

```text
✓ Status
✓ Gender
✓ Disease
✓ Age Range
```

### Sorting

```text
✓ Name
✓ Age
✓ Date
✓ Status
```

### Advanced Features

```text
✅ Pagination

✅ Server Side Sorting

✅ Debounced Search

✅ React Query

✅ Redux Toolkit

✅ Export CSV

✅ PDF Report

✅ Audit History

✅ Role Based Access
```

***

# Time Complexity

```text
Search  O(n)

Filter  O(n)

Sort    O(n log n)

Render  O(n)
```

### Senior Interview Answer

> Keep patient data in a single source of truth, derive search/filter/sort results using `useMemo`, use a shared form for create/update operations, and perform immutable CRUD updates. For large datasets, move filtering, sorting, and pagination to the backend and fetch data using React Query or Redux Toolkit Query.
