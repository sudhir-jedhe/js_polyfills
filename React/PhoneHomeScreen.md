# Phone Home Screen (React Machine Coding Interview)

This is a very common **Senior React / Frontend Machine Coding Round**.

### Features

✅ App Grid (4x5)

✅ Clock

✅ Status Bar

✅ Search Bar

✅ Bottom Dock

✅ App Click

✅ Responsive Mobile Layout

✅ Dynamic App Data

✅ Reusable Components

***

# Folder Structure

```text
src/
├── App.tsx
├── PhoneHomeScreen.tsx
├── components/
│    ├── StatusBar.tsx
│    ├── AppGrid.tsx
│    ├── AppIcon.tsx
│    └── Dock.tsx
└── styles.css
```

***

# PhoneHomeScreen.tsx

```tsx
import { useEffect, useState } from "react";

const apps = [
  { id: 1, name: "Phone", icon: "📞" },
  { id: 2, name: "Messages", icon: "💬" },
  { id: 3, name: "Photos", icon: "🖼️" },
  { id: 4, name: "Camera", icon: "📷" },
  { id: 5, name: "Music", icon: "🎵" },
  { id: 6, name: "Settings", icon: "⚙️" },
  { id: 7, name: "Maps", icon: "🗺️" },
  { id: 8, name: "Mail", icon: "📧" },
];

export default function PhoneHomeScreen() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateTime = () => {
      setTime(
        new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })
      );
    };

    updateTime();

    const interval = setInterval(
      updateTime,
      1000
    );

    return () =>
      clearInterval(interval);
  }, []);

  const openApp = (name: string) => {
    alert(`Opening ${name}`);
  };

  return (
    <div className="phone">
      <div className="status-bar">
        <span>{time}</span>

        <div>
          📶 🔋
        </div>
      </div>

      <div className="clock">
        {time}
      </div>

      <input
        className="search"
        placeholder="Search Apps"
      />

      <div className="grid">
        {apps.map(app => (
          <button
            key={app.id}
            className="app"
            onClick={() =>
              openApp(app.name)
            }
          >
            <div className="icon">
              {app.icon}
            </div>

            <div className="label">
              {app.name}
            </div>
          </button>
        ))}
      </div>

      <div className="dock">
        <span>📞</span>
        <span>💬</span>
        <span>🌐</span>
        <span>📷</span>
      </div>
    </div>
  );
}
```

***

# App.tsx

```tsx
import PhoneHomeScreen from "./PhoneHomeScreen";
import "./styles.css";

export default function App() {
  return <PhoneHomeScreen />;
}
```

***

# styles.css

```css
body {
  margin: 0;
  background: #1f2937;

  display: flex;
  justify-content: center;

  padding: 30px;

  font-family: sans-serif;
}

.phone {
  width: 375px;
  height: 750px;

  border-radius: 40px;

  overflow: hidden;

  background:
    linear-gradient(
      135deg,
      #4f46e5,
      #9333ea
    );

  padding: 20px;

  color: white;

  position: relative;
}

.status-bar {
  display: flex;

  justify-content:
    space-between;

  font-size: 14px;
}

.clock {
  margin-top: 35px;

  font-size: 52px;

  text-align: center;

  font-weight: bold;
}

.search {
  width: 100%;

  border: none;

  margin-top: 20px;

  padding: 12px;

  border-radius: 20px;
}

.grid {
  margin-top: 40px;

  display: grid;

  grid-template-columns:
    repeat(4, 1fr);

  gap: 20px;
}

.app {
  background: none;

  border: none;

  color: white;

  cursor: pointer;
}

.icon {
  width: 60px;
  height: 60px;

  font-size: 30px;

  border-radius: 16px;

  background:
    rgba(
      255,
      255,
      255,
      0.2
    );

  display: flex;

  align-items: center;
  justify-content: center;

  margin: auto;
}

.label {
  margin-top: 8px;

  font-size: 12px;
}

.dock {
  position: absolute;

  bottom: 20px;

  left: 20px;
  right: 20px;

  height: 70px;

  border-radius: 25px;

  background:
    rgba(
      255,
      255,
      255,
      0.2
    );

  display: flex;

  justify-content:
    space-around;

  align-items: center;

  font-size: 30px;
}
```

***

# Advanced Interview Enhancements

### 1. Drag & Drop Apps

```tsx
react-beautiful-dnd
```

```text
Move icons like Android/iPhone
```

***

### 2. App Folder

```text
📁 Social
 ├ WhatsApp
 ├ Facebook
 └ Instagram
```

***

### 3. Multiple Screens

```text
Swipe Left
Page 1

Swipe Right
Page 2
```

***

### 4. Notification Badges

```tsx
{
  name: "Mail",
  unread: 12
}
```

```text
📧 🔴12
```

***

### 5. Dark / Light Theme

```tsx
const [theme, setTheme]
```

***

### 6. Widget Support

```text
Clock Widget
Weather Widget
Calendar Widget
```

***

### Senior-Level Discussion Points

```text
HomeScreen
    │
    ├── StatusBar
    ├── SearchBar
    ├── AppGrid
    │      ├── AppIcon
    │      └── Folder
    ├── WidgetArea
    └── Dock
```

**Common interview follow-ups:**

1. Drag & Drop App Reordering
2. Folder Creation
3. Infinite Home Screen Pages
4. App Search
5. Notification Center
6. Virtualized Grid
7. Persist Layout in LocalStorage
8. Context API / Redux State Management

This is typically the **Phone Home Screen machine-coding problem** asked in React, similar to an Android/iPhone launcher UI.
