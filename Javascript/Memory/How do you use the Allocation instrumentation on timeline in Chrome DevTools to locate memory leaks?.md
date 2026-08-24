**Allocation instrumentation on timeline** (also called the Allocation Timeline) provides a real-time recording of memory allocations as vertical bar spikes on a timeline. It lets you isolate the exact moment and JavaScript line number responsible for uncollected memory.

---

### Step-by-Step Profiling Workflow

1. **Open Memory Panel & Select Profiler Type:**
Open Chrome DevTools (`F12` or `Cmd + Option + I`). Navigate to the **Memory** tab and select the radio button for **Allocation instrumentation on timeline**.

2. **Start Recording & Establish Baseline:**
Click **Start**. Allow the recording to run idle for 3–5 seconds so initial background allocations settle.

3. **Perform the Suspicious User Action Repeatedly:**
Execute the workflow suspected of leaking (e.g., open and close a modal, sort a table, navigate between tabs) 3 to 5 times at regular intervals.

4. **Stop the Recording:**
Click the red **Stop recording** button. DevTools will automatically assemble the timeline and constructor breakdown.

---

### How to Read the Timeline Bars

At the top of the panel, you will see a chronological timeline with vertical bars representing memory allocation events:

```text
Time  ──[  |  ]──[  |  ]──[  |  ]──[  |  ]──[  |  ]──>
Color:     Blue     Blue     Blue     Gray     Blue

```

* **Blue Bars:** Memory allocated during that time slice that is **still alive and retained in memory** at the end of the recording.
* **Gray Bars:** Memory allocated during that time slice that was **successfully garbage-collected (freed)**.
* **Diagnosing a Leak:** If an action was reversed (e.g., closing a dialog), its corresponding bar should turn **gray**. If solid **blue bars persist** across completed actions, those bars represent leaked objects.

---

### Isolating Leaked Objects

**1. Zoom into Suspicious Time Windows:**

* Click and drag your mouse across the timeline at the top to highlight only the specific blue spikes that occurred during completed actions.
* The table below immediately filters to show **only** objects allocated within that specific time window that are still alive.

```
Timeline:  [=== Selected Window ===]
           |   |   |   |   |   |   |

```

**2. Analyze the Constructor View:**

* Look at the constructors with the highest **Retained Size** and **Count** (e.g., `system / Context`, `Array`, `Detached HTMLDivElement`, custom class names).
* Expand the constructor to view the individual allocated instances.

**3. Trace the Allocation Call Stack & Retainers:**

* Select an object instance in the upper pane.
* In the bottom pane, switch between:
* **Allocation Stack:** Shows the exact JavaScript file and line number that created the object.
* **Retainers:** Shows the reference chain preventing the garbage collector from freeing the object.

---

### Comparison: Allocation Timeline vs Heap Snapshot

| Feature                   | Allocation Timeline                                                        | Heap Snapshot                                                        |
| ------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| **Primary Strength**      | Shows **when** and **where in code** allocations happened chronologically. | Deep structural analysis of the entire heap at a single moment.      |
| **Call Stack Visibility** | Captures the function call stack that instantiated the object.             | Does not record creation stack traces (only current retainers).      |
| **Performance Overhead**  | Higher runtime overhead during recording.                                  | Lower overhead during runtime (pauses only during snapshot capture). |
| **Best Used For**         | Pinpointing short-lived workflows with leaky allocations.                  | Detecting total retained memory size and overall growth trends.      |
