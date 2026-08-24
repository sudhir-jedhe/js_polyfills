**Stack** and **Heap** are the two primary memory regions allocated by an operating system to a running program.

The fundamental difference lies in **how memory is managed, structured, and allocated**:

* **Stack:** Static, structured, fast memory managed automatically in a **Last-In, First-Out (LIFO)** manner.
* **Heap:** Dynamic, unstructured, flexible memory where variables can be allocated and resized dynamically at runtime, managed manually or via garbage collection.

---

### High-Level Comparison

| Feature                  | Stack Memory                                           | Heap Memory                                          |
| ------------------------ | ------------------------------------------------------ | ---------------------------------------------------- |
| **Data Structure**       | Stack (LIFO: Last-In, First-Out)                       | Hierarchical / Free-list tree pool                   |
| **Allocation Mechanism** | Automatic by CPU / runtime call stack                  | Dynamic (explicit via `new`/`malloc`, or runtime GC) |
| **Access Speed**         | **Extremely fast** (sequential memory access)          | **Slower** (requires pointer dereferencing)          |
| **Size & Limits**        | Small, fixed size (e.g., 1 MB – 8 MB per thread)       | Large, bounded only by physical RAM/virtual memory   |
| **What It Stores**       | Function frames, local primitive variables, references | Objects, arrays, dynamic data structures, closures   |
| **Lifetime**             | Tied strictly to the function call's execution         | Persists until deallocated or garbage-collected      |
| **Failure Mode**         | `StackOverflowError` (deep/infinite recursion)         | `OutOfMemoryError` (memory leaks)                    |

---

### How They Work Together

When a function executes, the CPU creates a **Stack Frame** on top of the call stack.

* Fixed-size primitive values are stored **directly on the stack**.
* Dynamic or composite data (objects, arrays) are stored in the **Heap**, and a small, fixed-size **pointer/memory reference** to that heap location is kept on the stack.

```
       STACK (Fast, Structured)                      HEAP (Dynamic Pool)
 ┌──────────────────────────────────┐        ┌──────────────────────────────────┐
 │ main() frame                     │        │                                  │
 │   - id = 101                     │        │  [0x004F]                        │
 │   - userPtr = 0x004F ────────────┼───────>│  { name: "Kiara", age: 30 }      │
 ├──────────────────────────────────┤        │                                  │
 │ calculate() frame                │        │  [0x00A1]                        │
 │   - tempVal = 42                 │        │  [ 10, 20, 30, 40 ]              │
 │   - scoresPtr = 0x00A1 ──────────┼───────>│                                  │
 └──────────────────────────────────┘        └──────────────────────────────────┘

```

#### Code Walkthrough

```javascript
function processData() {
  const count = 5;                        // Stack: primitive number
  const record = { title: "Report" };    // Stack: reference -> Heap: object
  
  return record;
}

const result = processData();

```

1. **Invocation:** `processData()` is pushed onto the call stack.
2. **Allocation:**

* `count` (5) is placed directly on the stack inside the frame.
* An object `{ title: "Report" }` is allocated in the Heap; its memory address (e.g., `0x004F`) is stored in `record` on the stack.

1. **Completion:** When `processData()` finishes, its stack frame is popped immediately, reclaiming stack memory.
2. **Heap Persistence:** Because `result` in the outer scope still references `0x004F`, the Heap object remains alive. Once no references point to it, the Garbage Collector (GC) frees that heap memory.

---

### Memory Failures: Stack vs. Heap

#### 1. Stack Overflow

Occurs when the call stack exceeds its allocated size limit (typically caused by unbounded or deep recursion):

```javascript
function infinite() {
  infinite(); // Exceeds stack frame limits
}
// RangeError: Maximum call stack size exceeded

```

#### 2. Out of Memory (Heap Exhaustion / Memory Leaks)

Occurs when memory is continuously allocated in the heap faster than the garbage collector or manual deallocation can free it:

```javascript
const leakyArray = [];
while (true) {
  leakyArray.push(new Array(1000000)); // Retains heap references indefinitely
}
// JavaScript heap out of memory

```

---

### Memory Management Across Languages

* **C / C++:** The developer manually allocates and frees heap memory (`malloc()` / `free()`, `new` / `delete`). If unhandled, dangling pointers or memory leaks occur.
* **Rust:** Tracks memory ownership and lifetimes at compile time. Heap memory is deallocated deterministically the moment the owner goes out of scope (no garbage collector, no manual `free()`).
* **JavaScript / Java / Go / Python:** Feature an automatic **Garbage Collector (GC)** that tracks active references (Mark-and-Sweep) and reclaims unreferenced heap memory.
