# Design a Scalable Video Player (Senior Frontend System Design)

This is a classic **Senior Frontend / Staff Engineer** interview where they are less interested in coding and more interested in:

```text
✅ API Design
✅ Scalability
✅ Accessibility
✅ Performance
✅ Extensibility
✅ Team Adoption
✅ Trade-offs
✅ Developer Experience
```

The key question is:

> "How would you design a Video Player component that will be used by millions of users and dozens of teams?"

***

# 1. Functional Requirements

## Core Features

```text
Play / Pause
Seek
Volume
Mute
Fullscreen
Playback Speed
Captions
Quality Selection
Picture-in-Picture
```

## Advanced Features

```text
Analytics
Advertising
DRM
Live Streaming
Chapter Navigation
Keyboard Shortcuts
Custom Controls
```

***

# 2. Non-Functional Requirements

```text
Accessibility
Theming
Performance
SSR Compatibility
Cross Browser Support
Mobile Support
Extensibility
```

***

# 3. High Level Architecture

```text
VideoPlayer
│
├── VideoSurface
│
├── Controls
│   ├── PlayButton
│   ├── SeekBar
│   ├── VolumeControl
│   ├── Fullscreen
│   └── Settings
│
├── Captions
│
├── QualitySelector
│
├── Analytics Layer
│
└── Plugin System
```

***

# 4. Component API Design

Bad API:

```jsx
<VideoPlayer
 play={true}
 pause={true}
 volume={50}
 customTheme={...}
 analytics={...}
 ads={...}
/>
```

Too many props.

***

Better API:

```jsx
{videoUrl}
  <VideoPlayer.Controls />

  <VideoPlayer.Captions />

  <VideoPlayer.Analytics />
</VideoPlayer>
```

Compound Components provide:

```text
✅ Extensibility
✅ Flexibility
✅ Good DX
```

***

# 5. State Management

Separate:

## UI State

```text
Fullscreen
Settings Open
Controls Visible
```

## Media State

```text
Current Time
Duration
Volume
Playback Rate
```

***

Example Store

```ts
{
 currentTime,
 duration,
 volume,
 isPlaying,
 isFullscreen
}
```

***

# 6. Avoid Re-renders

Bad:

```jsx
currentTime
updates every 100ms

Entire player rerenders
```

***

Better:

```jsx
VideoContext

SeekBar subscribes only
to currentTime
```

Use:

```text
Context Selectors
Zustand
Redux Toolkit
```

Large-scale apps should prevent unnecessary re-renders.

***

# 7. Accessibility (Very Important)

Most candidates forget this.

***

### Keyboard Support

```text
Space = Play/Pause

← = Seek Back

→ = Seek Forward

M = Mute

F = Fullscreen
```

***

### Screen Readers

```jsx
<button
  aria-label="Play video"
/>
```

***

### Captions

```text
WebVTT Support

Multiple Languages
```

***

### Focus Management

```text
Tab Navigation
```

***

# 8. Theming Strategy

Bad:

```jsx
playButtonColor
seekBarColor
volumeColor
...
```

***

Better:

```jsx
<ThemeProvider theme={theme}>
  <VideoPlayer />
</ThemeProvider>
```

Theme:

```js
{
 colors: {
   primary: "#1976d2",
   background: "#111"
 }
}
```

***

# 9. Performance Optimisations

***

## Lazy Load Controls

```jsx
const SettingsPanel =
 lazy(() =>
   import("./Settings")
 );
```

***

## Avoid Time Updates Causing Renders

Bad:

```jsx
setCurrentTime
every 50ms
```

***

Better:

```jsx
requestAnimationFrame()
```

***

## Virtualise Comments

```text
10,000 comments
```

Use:

```text
react-window
react-virtualized
```

***

# 10. Video Streaming Considerations

For scale:

```text
MP4
HLS
DASH
```

***

### Adaptive Bitrate

```text
240p

480p

720p

1080p
```

Switch automatically based on:

```text
Bandwidth
CPU
```

***

# 11. Analytics Architecture

Never attach analytics to components.

Bad:

```jsx
PlayButton
  ↓
Analytics
```

***

Better:

```text
Player Event Bus
       ↓
 Analytics Service
```

Example:

```js
eventBus.emit(
 "VIDEO_PLAY"
);
```

Benefits:

```text
Decoupled
Reusable
```

***

# 12. Plugin Architecture

Future teams will request:

```text
Ads
DRM
Recommendations
Quizzes
Annotations
```

Do not hardcode.

***

```ts
VideoPlayer.use(
  AnalyticsPlugin
);

VideoPlayer.use(
  AdsPlugin
);
```

***

# 13. Mobile Considerations

```text
Touch Gestures

Pinch Zoom

Double Tap Seek

Orientation Changes
```

***

Example:

```text
Double Tap Left
= -10 Seconds

Double Tap Right
= +10 Seconds
```

***

# 14. Failure Handling

```text
Video Load Error

Network Error

Unsupported Codec

DRM Failure
```

API:

```jsx
<VideoPlayer
 onError={handleError}
/>
```

***

# 15. Scalability for Multiple Teams

The biggest challenge is:

```text
Team A wants Ads

Team B wants DRM

Team C wants Analytics

Team D wants Custom Controls
```

Solution:

```text
Headless Architecture
```

***

```jsx
useVideoPlayer()

PlayButton

SeekBar

Timeline
```

Teams build custom UIs while sharing the same engine.

***

# Trade-Off Discussion

| Decision             | Pros       | Cons                  |
| -------------------- | ---------- | --------------------- |
| Native HTML Video    | Simpler    | Less Customisation    |
| Custom Player Engine | Flexible   | More Complexity       |
| Context API          | Easy       | Re-renders at Scale   |
| Zustand              | Fast       | Extra Dependency      |
| Plugin System        | Extensible | More Architecture     |
| Headless Components  | Reusable   | Higher Learning Curve |

***

# Senior Interview Answer (2-Minute Version)

> I would separate the player into a core playback engine and a UI layer. The playback engine manages media state, buffering, events, analytics hooks, and streaming protocols, while the UI is built using compound or headless components for maximum flexibility. I would prioritise accessibility with keyboard navigation, ARIA labels, captions, and screen-reader support. For scalability, I would use a plugin architecture for analytics, ads, DRM, and future integrations. Performance would be optimised through lazy loading, selective subscriptions, requestAnimationFrame-based updates, and adaptive streaming. This ensures the player can be reused across multiple products and teams without modifying the core implementation.


Below is a **production-grade scalable React Video Player** with:

✅ Compound Component Pattern

✅ Context API

✅ Custom Controls

✅ Keyboard Shortcuts

✅ Accessibility

✅ Theming Support

✅ Analytics Hooks

✅ Fullscreen

✅ Playback Speed

✅ Volume Control

✅ Progress Bar

✅ Extensible Architecture

***

# Folder Structure

```text
src/
│
├── VideoPlayer/
│   ├── VideoPlayer.jsx
│   ├── VideoContext.js
│   ├── Controls.jsx
│   ├── ProgressBar.jsx
│   ├── PlayButton.jsx
│   ├── VolumeControl.jsx
│   ├── SpeedSelector.jsx
│   └── styles.css
│
├── App.jsx
└── index.js
```

***

# VideoContext.js

```jsx
import {
  createContext,
  useContext,
} from "react";

export const VideoContext =
  createContext(null);

export const useVideo =
  () =>
    useContext(
      VideoContext
    );
```

***

# VideoPlayer.jsx

```jsx
import React,
{
  useRef,
  useState,
  useEffect
} from "react";

import {
  VideoContext
} from "./VideoContext";

import Controls from "./Controls";

import "./styles.css";

export default function VideoPlayer({
  src,
  children,
  onPlay,
  onPause
}) {
  const videoRef =
    useRef(null);

  const [
    playing,
    setPlaying
  ] = useState(false);

  const [
    currentTime,
    setCurrentTime
  ] = useState(0);

  const [
    duration,
    setDuration
  ] = useState(0);

  const [
    volume,
    setVolume
  ] = useState(1);

  const [
    speed,
    setSpeed
  ] = useState(1);

  const play =
    () => {
      videoRef.current.play();
      setPlaying(true);

      onPlay?.();
    };

  const pause =
    () => {
      videoRef.current.pause();
      setPlaying(false);

      onPause?.();
    };

  const togglePlay =
    () => {
      playing
        ? pause()
        : play();
    };

  const seek = time => {
    videoRef.current.currentTime =
      time;

    setCurrentTime(time);
  };

  const changeVolume =
    value => {
      videoRef.current.volume =
        value;

      setVolume(value);
    };

  const changeSpeed =
    value => {
      videoRef.current.playbackRate =
        value;

      setSpeed(value);
    };

  const fullscreen =
    () => {
      videoRef.current
        .requestFullscreen();
    };

  useEffect(() => {
    const handleKey =
      e => {
        switch (e.key) {
          case " ":
            e.preventDefault();
            togglePlay();
            break;

          case "ArrowRight":
            seek(
              currentTime +
                10
            );
            break;

          case "ArrowLeft":
            seek(
              currentTime -
                10
            );
            break;

          case "m":
            changeVolume(
              volume === 0
                ? 1
                : 0
            );
            break;

          case "f":
            fullscreen();
            break;
        }
      };

    window.addEventListener(
      "keydown",
      handleKey
    );

    return () =>
      window.removeEventListener(
        "keydown",
        handleKey
      );
  });

  return (
    <VideoContext.Provider
      value={{
        playing,
        currentTime,
        duration,
        volume,
        speed,
        togglePlay,
        seek,
        changeVolume,
        changeSpeed,
        fullscreen
      }}
    >
      <div className="player">
        {src}
            setCurrentTime(
              e.target
                .currentTime
            )
          }
          onLoadedMetadata={
            e =>
              setDuration(
                e.target
                  .duration
              )
          }
        />

        {children ||
          <Controls />}
      </div>
    </VideoContext.Provider>
  );
}
```

***

# PlayButton.jsx

```jsx
import {
  useVideo
} from "./VideoContext";

export default function PlayButton() {
  const {
    playing,
    togglePlay
  } = useVideo();

  return (
    <button
      aria-label={
        playing
          ? "Pause Video"
          : "Play Video"
      }
      onClick={
        togglePlay
      }
    >
      {playing
        ? "⏸"
        : "▶"}
    </button>
  );
}
```

***

# ProgressBar.jsx

```jsx
import {
  useVideo
} from "./VideoContext";

export default function ProgressBar() {
  const {
    duration,
    currentTime,
    seek
  } = useVideo();

  return (
    <input
      type="range"
      min={0}
      max={duration}
      value={currentTime}
      onChange={e =>
        seek(
          Number(
            e.target
              .value
          )
        )
      }
    />
  );
}
```

***

# VolumeControl.jsx

```jsx
import {
  useVideo
} from "./VideoContext";

export default function VolumeControl() {
  const {
    volume,
    changeVolume
  } = useVideo();

  return (
    <input
      type="range"
      min="0"
      max="1"
      step="0.1"
      value={volume}
      onChange={e =>
        changeVolume(
          Number(
            e.target
              .value
          )
        )
      }
    />
  );
}
```

***

# SpeedSelector.jsx

```jsx
import {
  useVideo
} from "./VideoContext";

export default function SpeedSelector() {
  const {
    speed,
    changeSpeed
  } = useVideo();

  return (
    <select
      value={speed}
      onChange={e =>
        changeSpeed(
          Number(
            e.target
              .value
          )
        )
      }
    >
      <option value="0.5">
        0.5x
      </option>

      <option value="1">
        1x
      </option>

      <option value="1.5">
        1.5x
      </option>

      <option value="2">
        2x
      </option>
    </select>
  );
}
```

***

# Controls.jsx

```jsx
import PlayButton from "./PlayButton";

import ProgressBar from "./ProgressBar";

import VolumeControl from "./VolumeControl";

import SpeedSelector from "./SpeedSelector";

import {
  useVideo
} from "./VideoContext";

export default function Controls() {
  const {
    fullscreen
  } = useVideo();

  return (
    <div className="controls">
      <PlayButton />

      <ProgressBar />

      <VolumeControl />

      <SpeedSelector />

      <button
        onClick={
          fullscreen
        }
      >
        ⛶
      </button>
    </div>
  );
}
```

***

# styles.css

```css
.player {
  width: 800px;
  margin: auto;
  background: #111;
  padding: 20px;
}

video {
  width: 100%;
}

.controls {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

button {
  cursor: pointer;
}

input[type="range"] {
  flex: 1;
}
```

***

# App.jsx

```jsx
import VideoPlayer from "./VideoPlayer/VideoPlayer";

export default function App() {
  return (
    <div>
      <h1>
        Scalable Video
        Player
      </h1>

      https://www.w3schools.com/html/mov_bbb.mp4 =>
          console.log(
            "Analytics: Play"
          )
        }
        onPause={() =>
          console.log(
            "Analytics: Pause"
          )
        }
      />
    </div>
  );
}
```

***

# How This Scales to Millions of Users

### 1. Plugin Architecture

```jsx
<VideoPlayer
  plugins={[
    AnalyticsPlugin,
    AdsPlugin,
    DRMPlugin
  ]}
/>
```

***

### 2. Headless Hook

```jsx
const {
  playing,
  togglePlay
} = useVideoPlayer();
```

Teams build their own UI.

***

### 3. Streaming Support

```text
HLS.js
DASH.js
```

```jsx
stream.m3u8
```

***

### 4. Theme Support

```jsx
<VideoPlayer
  theme="dark"
/>
```

or

```jsx
<ThemeProvider>
```

***

### 5. Analytics Event Bus

```js
eventBus.emit(
  "VIDEO_PLAY"
);

eventBus.emit(
  "VIDEO_PAUSE"
);

eventBus.emit(
  "SEEK"
);
```

***

### 6. Accessibility

```text
ARIA Labels
Keyboard Support
Closed Captions
Focus Management
Screen Reader Support
```

***

### Senior-Level Enhancements Expected in FAANG Interviews

```text
✅ HLS Streaming
✅ DRM Playback
✅ Adaptive Bitrate
✅ Picture-in-Picture
✅ Chromecast/AirPlay
✅ Offline Support
✅ Plugin Architecture
✅ Analytics Pipeline
✅ Ads Integration
✅ Error Recovery
✅ Multi-language Captions
✅ React Query + Zustand
✅ Virtualized Comments
✅ SSR Safe
✅ Lazy-loaded Controls
✅ requestAnimationFrame Progress Updates
```

This is the type of architecture and code structure interviewers look for when asking: **"Design a Video Player used by multiple teams and millions of users."**
