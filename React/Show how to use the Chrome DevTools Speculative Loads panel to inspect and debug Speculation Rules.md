Chrome DevTools includes a dedicated **Speculative loads** panel in the **Application** tab designed to inspect, debug, and trace speculation rules (both prefetch and prerender).

---

### Step 1: Open the Speculative Loads Panel

1. Open DevTools (`F12` or `Cmd + Option + I` / `Ctrl + Shift + I`).
2. Navigate to the **Application** tab.
3. In the left-hand sidebar, scroll down to the **Background services** section and select **Speculative loads**.

```
Application Tab
 └── Background services
      └── Speculative loads
           ├── Rules
           └── Speculations

```

---

### Step 2: Inspect Declared Rules (`Rules` view)

Click the **Rules** tab at the top of the pane to verify that the browser has discovered and parsed your speculation rules without syntax errors.

* **Rule Set status:** Look for **Valid** (green) or **Invalid** (red).
* **Source:** Shows where the rule was defined (e.g., inline `<script type="speculationrules">` or via the `Speculation-Rules` HTTP header).
* **Rule Content:** Click a rule set to view the raw JSON configuration and verify patterns like `eagerness`, `where`, and target URLs.

---

### Step 3: Track Real-Time Speculative Execution (`Speculations` view)

Switch to the **Speculations** tab. This view lists every candidate URL the browser has evaluated or triggered.

**Columns to Monitor:**

* **URL:** The target link evaluated for prefetching/prerendering.
* **Action:** `Prefetch` or `Prerender`.
* **Rule Set:** The rule responsible for triggering the speculation.
* **Status:**
* **`Ready`:** Successfully prefetched or fully prerendered in the background (ready for instant activation).
* **`Running`:** Currently downloading or rendering.
* **`Not triggered`:** Matched by a rule (e.g., with `eagerness: "moderate"`), but waiting for a hover/pointer event.
* **`Failure`:** The speculative load failed or was aborted.

---

### Step 4: Diagnosing Common Failures

If a speculative load shows **Failure**, click the specific row. The bottom detail pane displays the exact reason:

| Failure Reason in DevTools            | Root Cause                                                                                                  | Solution                                                           |
| ------------------------------------- | ----------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| **`User has disabled preloading`**    | Chrome setting *"Preload pages for faster browsing"* is turned off or **Data Saver** is active.             | Enable preloading under `chrome://settings/performance`.           |
| **`Response has non-2xx code`**       | Target server returned `404`, `500`, or redirect loop.                                                      | Verify the URL is valid and returns a `200 OK`.                    |
| **`Opt-out header present`**          | Target page returned `Supports-Loading-Mode: no-prerender`.                                                 | Remove the header if prerendering should be allowed.               |
| **`Cross-origin speculation failed`** | Prerendering cross-origin targets without proper credentialed CORS setup.                                   | Ensure target supports cross-origin speculation or use `prefetch`. |
| **`Unsafe operation triggered`**      | Page attempted restricted APIs during background render (`window.alert`, `Notification.requestPermission`). | Gate client-side APIs behind `document.prerenderingchange`.        |

---

### Step 5: Testing User Triggers Live

1. With DevTools open to **Application > Speculative loads > Speculations**, find a link defined with `eagerness: "moderate"`.
2. Notice the status says **`Not triggered`**.
3. Hover your mouse over the link on the webpage for ~200ms.
4. Watch the status transition in real-time: **`Not triggered` → `Running` → `Ready**`.
5. Click the link: The page will activate immediately with 0ms navigation latency.
