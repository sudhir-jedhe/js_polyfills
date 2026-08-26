How does React map SyntheticEvent types to native browser events and manage priority in the scheduler?

React’s event system is not a 1:1 forwarder of native DOM events. It acts as an abstraction and scheduling pipeline that converts raw browser interactions into synthetic events and prioritizes state updates within the React runtime.

---

### 1. Mapping SyntheticEvent Types to Native Events

React normalizes discrepancies across browsers by mapping several native events into unified synthetic event interfaces.

* **Event Plugin Hub (`react-dom/client`):** React uses internal registration tables (plugins like `SimpleEventPlugin`, `EnterLeaveEventPlugin`, `ChangeEventPlugin`, `SelectEventPlugin`) that register native events to synthetic names.
* **M:N Event Normalization Examples:**
* **`onChange` in React:** In native HTML, `<input>` only fires `change` on blur. React maps `input`, `keydown`, `keyup`, and `click` to trigger a unified, real-time `onChange` SyntheticEvent.
* **`onMouseEnter` / `onMouseLeave`:** Browsers use non-bubbling `mouseenter`/`mouseleave` or bubbling `mouseover`/`mouseout`. React uses native `mouseover`/`mouseout` listeners at the root, identifies boundaries using Fiber ancestry, and synthesizes `onMouseEnter`/`onMouseLeave` calls without unwanted bubbling.
* **`onSelect`:** Combines native `selectionchange`, `focus`, `blur`, and `keyup` to reliably detect text selections across textboxes.

```
Native Browser Events              React Plugin System              Synthetic Prop
[ 'input', 'keydown', 'click' ] ──► ChangeEventPlugin   ──────────►  onChange
[ 'mouseover', 'mouseout' ]     ──► EnterLeavePlugin    ──────────►  onMouseEnter / onMouseLeave
[ 'pointerdown', 'mousedown' ]  ──► SimpleEventPlugin   ──────────►  onPointerDown / onMouseDown

```

---

### 2. Event Priority Classification

Every native event registered at the root container is tagged with an internal priority lane in React. React categorizes events into **three distinct priority levels**:

| Event Priority Level    | Triggering Native Events                                           | Scheduler / Lane Mapping                         | Behavior                                                                                                |
| ----------------------- | ------------------------------------------------------------------ | ------------------------------------------------ | ------------------------------------------------------------------------------------------------------- |
| **Discrete Priority**   | `click`, `keydown`, `keyup`, `input`, `change`, `pointerdown`      | **SyncLane** / `ImmediatePriority`               | User expects immediate, frame-by-frame UI feedback. Blocks rendering if necessary to guarantee updates. |
| **Continuous Priority** | `mousemove`, `pointermove`, `touchmove`, `wheel`, `scroll`, `drag` | **InputContinuousLane** / `UserBlockingPriority` | High-frequency events. Must update smoothly, but can be throttled or superseded by newer movements.     |
| **Default Priority**    | `load`, `error`, `animationend`, `transitionend`, `message`        | **DefaultLane** / `NormalPriority`               | Non-interactive or background lifecycle triggers.                                                       |

---

### 3. How Event Priority Drives the Scheduler

When an event triggers at the DOM root, the execution follows this pipeline:

```
Native Event Dispatched
         │
         ▼
Root Event Listener (Determines Event Priority from Type)
         │
         ▼
Set Execution Context (`setCurrentUpdatePriority(lane)`)
         │
         ▼
Execute Synthetic Event Listeners (React Fiber Tree Traversal)
         │
         ▼
setState() Called Inside Component Handler
         │
         ▼
Update Assigned the Priority Lane of Current Context
         │
         ▼
React Scheduler: `ensureRootIsScheduled()`
         │
         ├──────────────────────────────────────────┐
         ▼                                          ▼
   Sync / Immediate                           Concurrent (Time-Sliced)
(Flushes synchronously                     (Yields to browser via MessageChannel;
 in a Microtask / microtask checkpoint)    can be interrupted by higher priority lanes)

```

1. **Setting Priority Context:** Before running your event handler, React inspects the native event type and sets the global update priority (e.g., `DiscreteEventPriority` for clicks).
2. **Tagging State Updates:** Any `setState` or action dispatched synchronously inside that event handler automatically inherits that priority level.
3. **Queueing in Scheduler:**

* **Discrete Updates (e.g., `onClick`):** Scheduled as urgent work. React flushes these synchronously or at the end of the current microtask to eliminate perceived input lag.
* **Transitions (`startTransition`):** If a state update inside the handler is explicitly wrapped in `startTransition`, React overrides the default discrete priority and demotes it to a **TransitionLane**, making it interruptible by subsequent discrete events.

1. **Interruption Handling:** If a continuous/transition render is mid-flight on the virtual DOM and a user suddenly triggers a discrete event (e.g., a fast `keydown`), the Scheduler yields the main thread, aborts/pauses the transition work, and executes the discrete event's render pass first.
