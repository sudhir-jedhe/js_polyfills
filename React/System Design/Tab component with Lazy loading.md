# Tab Component with Lazy Loading in React

## Frontend System Design + Complete Interview-Ready Code

Tabs are one of the most commonly asked **React frontend machine coding** questions.

Used in:

```txt
Gmail
Notion
YouTube Studio
Amazon Product Page
Slack Settings
LinkedIn Profile
```

Interviewers often extend it with:

✅ Reusable API

✅ Controlled and uncontrolled behavior

✅ Keyboard accessibility

✅ **Lazy loading** of tab content (Senior-level)

✅ Preserve state per tab

✅ Async tab data

✅ ARIA support

---

# 1. Requirements

## Functional

✅ Show tab labels

✅ Highlight active tab

✅ Show active tab content

✅ Lazy load content (only when tab is opened)

✅ Preserve loaded content between switches

✅ Reusable API

✅ Keyboard navigation

✅ Accessibility

---

# 2. Why Lazy Loading?

Loading all tabs at mount:

```txt
❌ Wastes network
❌ Slower initial render
❌ More memory usage
❌ Unnecessary API calls
```

Lazy load benefits:

```txt
✅ Faster page load
✅ Smaller memory
✅ Only load what user opens
```

---

# 3. System Design

```txt
Tabs Container
   │
   ├── TabList
   │    ├── Tab 1
   │    ├── Tab 2
   │    └── Tab 3
   │
   └── TabPanels
        ├── Lazy Load Panel 1
        ├── Lazy Load Panel 2
        └── Lazy Load Panel 3
```

---

# 4. State Design

```jsx
const [activeTab, setActiveTab] = useState(defaultTab);

const [loadedTabs, setLoadedTabs] = useState(new Set([defaultTab]));
```

Why store loaded tabs?

Because once loaded, we should **keep them** to avoid reloading.

---

# 5. Data Model

```jsx
const tabs = [
  {
    id: "home",
    label: "Home",
    content: <HomePanel />,
  },
  {
    id: "profile",
    label: "Profile",
    content: <ProfilePanel />,
  },
  {
    id: "settings",
    label: "Settings",
    content: <SettingsPanel />,
  },
];
```

---

# 6. Component Structure

```txt
TabsGroup
    │
    ├── TabList
    │     └── Tab
    │
    └── TabPanels
          └── LazyPanel
```

---

# 7. Basic Tabs Component

```jsx
import { useState } from "react";

export default function Tabs({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const [loadedTabs, setLoadedTabs] = useState(
    new Set([defaultTab || tabs[0].id]),
  );

  function handleTabChange(tabId) {
    setActiveTab(tabId);

    setLoadedTabs((prev) => {
      const next = new Set(prev);

      next.add(tabId);

      return next;
    });
  }

  return (
    <div className="tabs">
      <div className="tab-list" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            className={activeTab === tab.id ? "active" : ""}
            onClick={() => handleTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="tab-panels">
        {tabs.map((tab) => {
          if (!loadedTabs.has(tab.id)) {
            return null;
          }

          return (
            <div key={tab.id} role="tabpanel" hidden={activeTab !== tab.id}>
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

---

# 8. Sample Tab Content

Simulate async lazy loading using React.lazy:

```jsx
import React, { Suspense, lazy } from "react";

const HomePanel = lazy(() => import("./panels/HomePanel"));

const ProfilePanel = lazy(() => import("./panels/ProfilePanel"));

const SettingsPanel = lazy(() => import("./panels/SettingsPanel"));
```

---

## HomePanel.jsx

```jsx
export default function HomePanel() {
  return <div>Welcome to Home Panel</div>;
}
```

---

## ProfilePanel.jsx

```jsx
export default function ProfilePanel() {
  return <div>User Profile Info</div>;
}
```

---

## SettingsPanel.jsx

```jsx
export default function SettingsPanel() {
  return <div>App Settings Content</div>;
}
```

---

# 9. Full App.jsx

```jsx
import React, { Suspense, lazy } from "react";

import Tabs from "./Tabs";

const HomePanel = lazy(() => import("./panels/HomePanel"));

const ProfilePanel = lazy(() => import("./panels/ProfilePanel"));

const SettingsPanel = lazy(() => import("./panels/SettingsPanel"));

const tabs = [
  {
    id: "home",
    label: "Home",
    content: (
      <Suspense fallback={<p>Loading Home...</p>}>
        <HomePanel />
      </Suspense>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    content: (
      <Suspense fallback={<p>Loading Profile...</p>}>
        <ProfilePanel />
      </Suspense>
    ),
  },
  {
    id: "settings",
    label: "Settings",
    content: (
      <Suspense fallback={<p>Loading Settings...</p>}>
        <SettingsPanel />
      </Suspense>
    ),
  },
];

export default function App() {
  return (
    <div className="container">
      <h1>Tabs Lazy Loading</h1>

      <Tabs tabs={tabs} defaultTab="home" />
    </div>
  );
}
```

---

# 10. CSS

```css
.container {
  padding: 20px;
  font-family: Arial;
}

.tabs {
  border: 1px solid #ddd;

  border-radius: 8px;
  overflow: hidden;
}

.tab-list {
  display: flex;

  background: #f9fafb;
  border-bottom: 1px solid #ddd;
}

.tab-list button {
  flex: 1;

  padding: 12px;
  border: none;

  background: transparent;

  cursor: pointer;
  font-weight: 600;
}

.tab-list button.active {
  background: white;

  border-bottom: 3px solid #2563eb;

  color: #2563eb;
}

.tab-panels {
  padding: 20px;
}
```

---

# 11. How Lazy Loading Works

## Case 1: Click Home Tab

```txt
Home is loaded first time
       ↓
Rendered
       ↓
Added to loadedTabs = ["home"]
```

## Case 2: Click Profile Tab

```txt
Profile loaded now (lazy import)
       ↓
Rendered
       ↓
loadedTabs = ["home", "profile"]
```

## Case 3: Switch back to Home

```txt
Home already loaded
       ↓
No reload
       ↓
Just show it
```

Perfect for scaling.

---

# 12. State Preservation Between Tabs

Because we render loaded tabs but hide them:

```jsx
hidden={activeTab !== tab.id}
```

The DOM state (form inputs, scroll position, etc.) is preserved.

Alternative:

Unmount tabs to save memory:

```jsx
{
  activeTab === tab.id && tab.content;
}
```

Reload happens every switch.

---

## Trade-Off

| Behaviour     | Preserve DOM | Save Memory |
| ------------- | ------------ | ----------- |
| Hidden Panels | ✅           | ❌          |
| Unmounted     | ❌           | ✅          |

Choose based on:

✅ Data-heavy tabs → hidden (preserve state)

✅ Rare tabs → unmounted (save memory)

---

# 13. Keyboard Accessibility

Users expect:

```txt
ArrowRight → Next Tab
ArrowLeft  → Previous Tab
Home       → First Tab
End        → Last Tab
Enter/Space → Activate Tab
```

---

## Keyboard Handler

```jsx
function handleKeyDown(event, index) {
  const { key } = event;

  const total = tabs.length;

  let nextIndex = index;

  switch (key) {
    case "ArrowRight":
      nextIndex = (index + 1) % total;
      break;

    case "ArrowLeft":
      nextIndex = (index - 1 + total) % total;
      break;

    case "Home":
      nextIndex = 0;
      break;

    case "End":
      nextIndex = total - 1;
      break;

    default:
      return;
  }

  handleTabChange(tabs[nextIndex].id);

  event.preventDefault();
}
```

Attach to tab button:

```jsx
onKeyDown={(e) =>
  handleKeyDown(e, index)
}
```

Now fully accessible.

---

# 14. ARIA Attributes

```jsx
role = "tablist";
role = "tab";
role = "tabpanel";

aria - selected;
aria - controls;
aria - labelledby;
```

Improves screen reader support.

---

# 15. Complexity

## Tab Change

```txt
O(1)
```

## Rendering

```txt
O(k) where k = loaded tabs
```

## Memory

```txt
O(k)
```

Very efficient.

---

# 16. Advanced Extensions

✅ Preload adjacent tab

✅ Persist active tab in URL query param

✅ Save scroll position per tab

✅ Async data fetching per tab

✅ Cache API responses

✅ Skeleton UI during load

✅ Server-side rendering support

✅ Route-based tabs (React Router)

✅ Vertical tabs

✅ Draggable tabs (like browsers)

---

## Preload Adjacent Tab

For instant switching:

```jsx
useEffect(() => {
  const idx = tabs.findIndex((t) => t.id === activeTab);

  const next = tabs[idx + 1];

  if (next) {
    import(`./panels/${next.file}`);
  }
}, [activeTab]);
```

---

## Persist Tab in URL

```jsx
useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  params.set("tab", activeTab);

  window.history.replaceState({}, "", `?${params.toString()}`);
}, [activeTab]);
```

Users can refresh and stay on same tab.

---

## Save Scroll Position

```jsx
const scrollMap = useRef({});

useEffect(() => {
  return () => {
    scrollMap.current[activeTab] = window.scrollY;
  };
}, [activeTab]);
```

Restore on switch:

```jsx
useEffect(() => {
  window.scrollTo(0, scrollMap.current[activeTab] || 0);
}, [activeTab]);
```

---

# 17. Data Flow Diagram

```txt
User Clicks Tab
      │
      ▼
setActiveTab
      │
      ▼
Add to loadedTabs Set
      │
      ▼
Render Panel Lazily
      │
      ▼
Preserve Loaded Panels
      │
      ▼
Return to Tab → No Reload
      │
      ▼
Optional Preload Adjacent
```

---

# 18. Senior React Interview Answer

> I would build a Tabs component as a reusable, controlled component that accepts an array of tabs with an ID, label, and content. The active tab state is tracked using `useState`, and each tab's content is loaded lazily using `React.lazy` and `Suspense`. Once a tab is opened, it is added to a `loadedTabs` set, ensuring re-opens are instant with no reload. Tabs support keyboard navigation using ArrowLeft/ArrowRight, Home, End, and Enter along with ARIA roles (`tablist`, `tab`, `tabpanel`) for accessibility. To further improve UX, I add scroll position preservation per tab, preloading of adjacent tabs, and URL-sync for deep-linking. This design produces a fast, accessible, and enterprise-grade tab system similar to those used by Gmail, YouTube Studio, and Notion.

# Advanced Tab Component Features

### Keyboard Navigation • Scroll Preservation • Adjacent Tab Preloading

These are the **three most common Senior React interview follow-ups** after implementing a Tab component with lazy loading.

They convert a basic tabs component into a **production-grade, accessible, and highly performant** system similar to:

```txt
YouTube Studio
Gmail
Slack
Notion
VS Code
Twitter Profile
```

---

# 1. Keyboard Navigation

## Why?

Users expect tab navigation like real applications:

```txt
Tab       → Focus into tabs
ArrowRight → Next tab
ArrowLeft  → Previous tab
Home       → First tab
End        → Last tab
Enter/Space → Activate tab
```

This aligns with:

```txt
WCAG 2.1
ARIA Authoring Practices
Screen Readers
Keyboard-only users
```

---

## Add Refs to Each Tab Button

Enables focus management.

```jsx
const tabRefs = useRef([]);
```

---

## Keyboard Handler

```jsx
function handleKeyDown(event, index) {
  const key = event.key;
  const total = tabs.length;

  let nextIndex = index;

  switch (key) {
    case "ArrowRight":
      nextIndex = (index + 1) % total;
      break;

    case "ArrowLeft":
      nextIndex = (index - 1 + total) % total;
      break;

    case "Home":
      nextIndex = 0;
      break;

    case "End":
      nextIndex = total - 1;
      break;

    case "Enter":
    case " ":
      handleTabChange(tabs[index].id);
      break;

    default:
      return;
  }

  // Only focus + activate arrow keys
  event.preventDefault();

  const nextTabId = tabs[nextIndex].id;

  handleTabChange(nextTabId);

  tabRefs.current[nextIndex]?.focus();
}
```

---

## Attach to Tab Buttons

```jsx
<button
  ref={(el) => (tabRefs.current[index] = el)}
  role="tab"
  aria-selected={activeTab === tab.id}
  tabIndex={activeTab === tab.id ? 0 : -1}
  onClick={() => handleTabChange(tab.id)}
  onKeyDown={(e) => handleKeyDown(e, index)}
>
  {tab.label}
</button>
```

---

## Behaviour

```txt
Tab into tablist
      ↓
Only active tab focusable
      ↓
Arrow keys move focus
      ↓
Enter/Space activates
```

This is called **Roving Tab Index Pattern**.

Used in production tabs across all major libraries (Material UI, Ant Design, Radix UI, ChakraUI).

---

## Focus Styles

```css
button:focus {
  outline: 2px solid #2563eb;
  outline-offset: 2px;
  border-radius: 4px;
}
```

Critical for accessibility.

---

## Screen Reader Announcements

```jsx
<div aria-live="polite" className="sr-only">
  {activeTabLabel}
  tab selected
</div>
```

Announces:

```txt
Home tab selected
Profile tab selected
```

---

# 2. Preserve Scroll Position Per Tab

## Why?

Users hate losing scroll when switching tabs.

Examples:

```txt
Gmail (Inbox / Sent)
Notion Sidebar
YouTube Home / Subscriptions
Slack Threads
LinkedIn Feed / Notifications
```

We must remember scroll position:

```txt
Home Tab      → scroll = 200
Profile Tab   → scroll = 550
Settings Tab  → scroll = 0
```

Switching tabs restores previous scroll.

---

## Approach

Store scroll position per tab.

```jsx
const scrollPositions = useRef({});
```

---

## Save Scroll Before Switch

```jsx
function saveScroll(tabId) {
  scrollPositions.current[tabId] = window.scrollY;
}
```

---

## Restore Scroll After Switch

```jsx
function restoreScroll(tabId) {
  const savedY = scrollPositions.current[tabId] || 0;

  window.scrollTo(0, savedY);
}
```

---

## Add Effects

```jsx
useEffect(() => {
  restoreScroll(activeTab);

  return () => {
    saveScroll(activeTab);
  };
}, [activeTab]);
```

Or handle it inside `handleTabChange`:

```jsx
function handleTabChange(newTab) {
  saveScroll(activeTab);

  setActiveTab(newTab);
}
```

Then restore in `useEffect`.

---

## Save Scroll of Tab Content Container

If tab content is scrollable inside a container instead of window:

```jsx
const contentRef = useRef(null);

function saveScroll(tabId) {
  scrollPositions.current[tabId] = contentRef.current.scrollTop;
}

function restoreScroll(tabId) {
  contentRef.current.scrollTop = scrollPositions.current[tabId] || 0;
}
```

Ideal for:

```txt
Chat panels
Sidebars
Dashboards
Feeds
```

---

## Behaviour

```txt
User scrolls Home tab to 500px
       ↓
Switch to Profile tab
       ↓
Home scroll saved
       ↓
Profile loaded
       ↓
Return to Home
       ↓
Scroll restored to 500px
```

Feels native and polished.

---

# 3. Preload Adjacent Tabs

## Why?

Even lazy loading has a **flash delay** when switching tabs the first time.

Solution:

```txt
Preload the next tab (and optionally previous)
```

So when the user switches:

```txt
No spinner
No suspense fallback
Instant transition
```

Used by:

```txt
YouTube Studio
Gmail
Slack Threads
Notion
Twitter
```

---

## Approach

After user opens Tab A → preload Tab B in the background.

Users usually navigate to adjacent tabs, so preloading nearby tabs improves UX significantly.

---

## Preload Function

```jsx
function preloadTab(tab) {
  if (tab?.preload) {
    tab.preload();
  }
}
```

---

## Add Preload Property to Tabs Data

```jsx
const HomePanel = React.lazy(() => import("./panels/HomePanel"));

const ProfilePanel = React.lazy(() => import("./panels/ProfilePanel"));

const SettingsPanel = React.lazy(() => import("./panels/SettingsPanel"));

const tabs = [
  {
    id: "home",
    label: "Home",
    preload: () => import("./panels/HomePanel"),
    content: <HomePanel />,
  },
  {
    id: "profile",
    label: "Profile",
    preload: () => import("./panels/ProfilePanel"),
    content: <ProfilePanel />,
  },
  {
    id: "settings",
    label: "Settings",
    preload: () => import("./panels/SettingsPanel"),
    content: <SettingsPanel />,
  },
];
```

---

## Preload Adjacent Tabs

Trigger preload whenever active tab changes.

```jsx
useEffect(() => {
  const idx = tabs.findIndex((t) => t.id === activeTab);

  preloadTab(tabs[idx + 1]);

  preloadTab(tabs[idx - 1]);
}, [activeTab]);
```

---

## Preload All Tabs After Delay

Optional aggressive strategy:

```jsx
useEffect(() => {
  const timer = setTimeout(() => {
    tabs.forEach(preloadTab);
  }, 3000);

  return () => clearTimeout(timer);
}, []);
```

Used for:

```txt
Small SPA
Dashboard
Critical UX
```

---

## Preload on Hover

Very common pattern used by Notion and Gmail.

```jsx
<button onMouseEnter={() => preloadTab(tab)}>{tab.label}</button>
```

Prefetches modules before user clicks.

Similar to Next.js `<Link prefetch>` behavior.

---

## Preload Priorities

You may prioritize which tabs to preload:

```txt
Preload adjacent (default)
Preload frequently visited
Preload high-priority tabs (Dashboard)
Preload only on desktop (skip mobile)
Preload only on fast networks
```

Example:

```jsx
if (navigator.connection?.effectiveType === "4g") {
  tabs.forEach(preloadTab);
}
```

---

# Full Behaviour Diagram

```txt
User clicks Tab
      │
      ▼
Save Scroll
      │
      ▼
setActiveTab
      │
      ▼
Preload adjacent tabs
      │
      ▼
Restore new tab scroll
      │
      ▼
Keyboard focus updates
      │
      ▼
Panel renders lazily
      │
      ▼
Fast, accessible, seamless UX
```

---

# Complete Enhanced Tabs

Combining all three features:

```jsx
export default function Tabs({ tabs, defaultTab }) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0].id);

  const scrollPositions = useRef({});

  const tabRefs = useRef([]);

  useEffect(() => {
    restoreScroll(activeTab);

    const idx = tabs.findIndex((t) => t.id === activeTab);

    preloadTab(tabs[idx + 1]);

    preloadTab(tabs[idx - 1]);
  }, [activeTab]);

  function preloadTab(tab) {
    if (tab?.preload) {
      tab.preload();
    }
  }

  function saveScroll(tabId) {
    scrollPositions.current[tabId] = window.scrollY;
  }

  function restoreScroll(tabId) {
    window.scrollTo(0, scrollPositions.current[tabId] || 0);
  }

  function handleTabChange(newTabId) {
    saveScroll(activeTab);
    setActiveTab(newTabId);
  }

  function handleKeyDown(event, index) {
    const total = tabs.length;

    let nextIndex = index;

    switch (event.key) {
      case "ArrowRight":
        nextIndex = (index + 1) % total;
        break;

      case "ArrowLeft":
        nextIndex = (index - 1 + total) % total;
        break;

      case "Home":
        nextIndex = 0;
        break;

      case "End":
        nextIndex = total - 1;
        break;

      case "Enter":
      case " ":
        handleTabChange(tabs[index].id);
        return;

      default:
        return;
    }

    event.preventDefault();

    handleTabChange(tabs[nextIndex].id);

    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="tabs">
      <div role="tablist">
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(el) => (tabRefs.current[index] = el)}
            role="tab"
            tabIndex={activeTab === tab.id ? 0 : -1}
            aria-selected={activeTab === tab.id}
            onClick={() => handleTabChange(tab.id)}
            onMouseEnter={() => preloadTab(tab)}
            onKeyDown={(e) => handleKeyDown(e, index)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.map((tab) => (
          <div key={tab.id} role="tabpanel" hidden={activeTab !== tab.id}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
}
```

---

# Senior React Interview Answer

> For production-grade tabs, I add three enhancements. First, keyboard navigation using the **roving tab index pattern**: only the active tab is focusable, and Arrow keys, Home, End, Enter, and Space handle navigation and activation, fully aligning with ARIA best practices. Second, scroll position preservation using a `useRef` map that stores each tab’s scroll offset. Positions are saved before switching and restored via `window.scrollTo` (or a scrollable ref) after switching, so users never lose context. Third, adjacent-tab preloading using `React.lazy`’s underlying import promise, triggered whenever the active tab changes, on hover, or after a small idle delay. Preloading prevents Suspense flashes and enables near-instant transitions. Together, these features produce a fast, accessible, and enterprise-grade tab component similar to Gmail, YouTube Studio, Notion, and VS Code.
