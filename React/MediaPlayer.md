*** copy MediaPlayer.md ***

Here is the updated implementation adding a custom volume slider, a mute toggle that remembers the previous volume level, and `localStorage` persistence.

### Updated Component (`MediaPlayer.jsx`)

```jsx
import React, { useRef, useState, useEffect } from "react";
import "./SeekBar.css";

const STORAGE_KEY_VOLUME = "react_player_volume";
const STORAGE_KEY_MUTED = "react_player_muted";

export default function MediaPlayer() {
  const mediaRef = useRef(null);
  const progressBarRef = useRef(null);

  // Playback States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tooltip States
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Volume & Mute States (Initialized from localStorage)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_MUTED) === "true";
  });
  const [prevVolume, setPrevVolume] = useState(volume || 0.8);

  // Sync volume state with HTML5 media element & localStorage
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = isMuted ? 0 : volume;
      mediaRef.current.muted = isMuted;
    }
    localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
    localStorage.setItem(STORAGE_KEY_MUTED, isMuted.toString());
  }, [volume, isMuted]);

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    const media = mediaRef.current;
    if (!media) return;
    setCurrentTime(media.currentTime);

    if (media.buffered.length > 0) {
      for (let i = 0; i < media.buffered.length; i++) {
        if (
          media.buffered.start(i) <= media.currentTime &&
          media.currentTime <= media.buffered.end(i)
        ) {
          const loaded = (media.buffered.end(i) / media.duration) * 100;
          setBufferedPercent(Math.min(100, Math.max(0, loaded)));
          break;
        }
      }
    }
  };

  const handleProgress = () => {
    const media = mediaRef.current;
    if (media && media.buffered.length > 0 && media.duration > 0) {
      const last = media.buffered.length - 1;
      const loaded = (media.buffered.end(last) / media.duration) * 100;
      setBufferedPercent(Math.min(100, Math.max(0, loaded)));
    }
  };

  const handleSeek = (e) => {
    const target = Number(e.target.value);
    if (mediaRef.current) mediaRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPos(pos);
    setHoverTime((pos / rect.width) * duration);
    setIsHovering(true);
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) mediaRef.current.pause();
    else mediaRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Volume slider interaction
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    } else if (val === 0) {
      setIsMuted(true);
    }
  };

  // Toggle mute button
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const playedPercent = duration ? (currentTime / duration) * 100 : 0;
  const currentVolumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="player-container">
      <audio
        ref={mediaRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => setDuration(mediaRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Controls Bar */}
      <div className="controls-row">
        <button className="icon-btn" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Volume Control Group */}
        <div className="volume-group">
          <button className="icon-btn volume-btn" onClick={toggleMute} aria-label="Toggle mute">
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="custom-range volume-slider"
            style={{ "--fill": `${currentVolumePercent}%` }}
          />
        </div>
      </div>

      {/* Seek Track */}
      <div className="seek-wrapper">
        <span className="timestamp">{formatTime(currentTime)}</span>

        <div
          className="slider-container"
          ref={progressBarRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering && (
            <div className="hover-tooltip" style={{ left: `${hoverPos}px` }}>
              {formatTime(hoverTime)}
            </div>
          )}

          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="custom-range custom-seekbar"
            style={{
              "--played": `${playedPercent}%`,
              "--buffered": `${Math.max(playedPercent, bufferedPercent)}%`,
            }}
          />
        </div>

        <span className="timestamp">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

```

---

### Updated Stylesheet (`SeekBar.css`)

```css
.player-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 480px;
  padding: 16px;
  background: #18181b;
  border-radius: 8px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #fafafa;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: #2563eb;
}

/* Volume Group */
.volume-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-btn {
  background: transparent;
  padding: 4px 6px;
  font-size: 16px;
}

.volume-btn:hover {
  background: #27272a;
}

/* Shared Range Slider Base */
.custom-range {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  border-radius: 3px;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.custom-range:hover::-webkit-slider-thumb {
  transform: scale(1.2);
}

.custom-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.custom-range:hover::-moz-range-thumb {
  transform: scale(1.2);
}

/* Volume-specific Slider */
.volume-slider {
  width: 80px;
  height: 4px;
  background: linear-gradient(
    to right,
    #fafafa 0%,
    #fafafa var(--fill),
    #3f3f46 var(--fill),
    #3f3f46 100%
  );
}

/* Seek Bar */
.seek-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timestamp {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: #a1a1aa;
}

.slider-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.custom-seekbar {
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 var(--played),
    #52525b var(--played),
    #52525b var(--buffered),
    #27272a var(--buffered),
    #27272a 100%
  );
}

.hover-tooltip {
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  background: #27272a;
  color: #f4f4f5;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  border: 1px solid #3f3f46;
  white-space: nowrap;
}

```

---

### Core Mechanics

* **Lazy State Initialization:** `useState(() => localStorage.getItem(...))` parses stored values synchronously during initial render without hydration flash or layout jumps.
* **Volume Memory (`prevVolume`):** When clicking the mute button, `prevVolume` stores the previous gain level so unmuting restores the exact user preference instead of defaulting to maximum.
* **Declarative Syncing:** The `useEffect` keeps the real HTML5 `audio.volume` and `audio.muted` DOM properties matched with React's state while persisting updates to `localStorage`.

Here is the updated implementation adding a custom volume slider, a mute toggle that remembers the previous volume level, and `localStorage` persistence.

### Updated Component (`MediaPlayer.jsx`)

```jsx
import React, { useRef, useState, useEffect } from "react";
import "./SeekBar.css";

const STORAGE_KEY_VOLUME = "react_player_volume";
const STORAGE_KEY_MUTED = "react_player_muted";

export default function MediaPlayer() {
  const mediaRef = useRef(null);
  const progressBarRef = useRef(null);

  // Playback States
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [bufferedPercent, setBufferedPercent] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Tooltip States
  const [hoverTime, setHoverTime] = useState(0);
  const [hoverPos, setHoverPos] = useState(0);
  const [isHovering, setIsHovering] = useState(false);

  // Volume & Mute States (Initialized from localStorage)
  const [volume, setVolume] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY_VOLUME);
    return saved !== null ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY_MUTED) === "true";
  });
  const [prevVolume, setPrevVolume] = useState(volume || 0.8);

  // Sync volume state with HTML5 media element & localStorage
  useEffect(() => {
    if (mediaRef.current) {
      mediaRef.current.volume = isMuted ? 0 : volume;
      mediaRef.current.muted = isMuted;
    }
    localStorage.setItem(STORAGE_KEY_VOLUME, volume.toString());
    localStorage.setItem(STORAGE_KEY_MUTED, isMuted.toString());
  }, [volume, isMuted]);

  const formatTime = (time) => {
    if (isNaN(time) || time < 0) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleTimeUpdate = () => {
    const media = mediaRef.current;
    if (!media) return;
    setCurrentTime(media.currentTime);

    if (media.buffered.length > 0) {
      for (let i = 0; i < media.buffered.length; i++) {
        if (
          media.buffered.start(i) <= media.currentTime &&
          media.currentTime <= media.buffered.end(i)
        ) {
          const loaded = (media.buffered.end(i) / media.duration) * 100;
          setBufferedPercent(Math.min(100, Math.max(0, loaded)));
          break;
        }
      }
    }
  };

  const handleProgress = () => {
    const media = mediaRef.current;
    if (media && media.buffered.length > 0 && media.duration > 0) {
      const last = media.buffered.length - 1;
      const loaded = (media.buffered.end(last) / media.duration) * 100;
      setBufferedPercent(Math.min(100, Math.max(0, loaded)));
    }
  };

  const handleSeek = (e) => {
    const target = Number(e.target.value);
    if (mediaRef.current) mediaRef.current.currentTime = target;
    setCurrentTime(target);
  };

  const handleMouseMove = (e) => {
    if (!progressBarRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const pos = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    setHoverPos(pos);
    setHoverTime((pos / rect.width) * duration);
    setIsHovering(true);
  };

  const togglePlay = () => {
    if (!mediaRef.current) return;
    if (isPlaying) mediaRef.current.pause();
    else mediaRef.current.play();
    setIsPlaying(!isPlaying);
  };

  // Volume slider interaction
  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (val > 0 && isMuted) {
      setIsMuted(false);
    } else if (val === 0) {
      setIsMuted(true);
    }
  };

  // Toggle mute button
  const toggleMute = () => {
    if (isMuted) {
      setIsMuted(false);
      setVolume(prevVolume > 0 ? prevVolume : 0.8);
    } else {
      setPrevVolume(volume);
      setIsMuted(true);
    }
  };

  const playedPercent = duration ? (currentTime / duration) * 100 : 0;
  const currentVolumePercent = isMuted ? 0 : volume * 100;

  return (
    <div className="player-container">
      <audio
        ref={mediaRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        onTimeUpdate={handleTimeUpdate}
        onProgress={handleProgress}
        onLoadedMetadata={() => setDuration(mediaRef.current?.duration || 0)}
        onEnded={() => setIsPlaying(false)}
      />

      {/* Controls Bar */}
      <div className="controls-row">
        <button className="icon-btn" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </button>

        {/* Volume Control Group */}
        <div className="volume-group">
          <button className="icon-btn volume-btn" onClick={toggleMute} aria-label="Toggle mute">
            {isMuted || volume === 0 ? "🔇" : volume < 0.5 ? "🔉" : "🔊"}
          </button>

          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={isMuted ? 0 : volume}
            onChange={handleVolumeChange}
            className="custom-range volume-slider"
            style={{ "--fill": `${currentVolumePercent}%` }}
          />
        </div>
      </div>

      {/* Seek Track */}
      <div className="seek-wrapper">
        <span className="timestamp">{formatTime(currentTime)}</span>

        <div
          className="slider-container"
          ref={progressBarRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          {isHovering && (
            <div className="hover-tooltip" style={{ left: `${hoverPos}px` }}>
              {formatTime(hoverTime)}
            </div>
          )}

          <input
            type="range"
            min={0}
            max={duration || 0}
            step="0.1"
            value={currentTime}
            onChange={handleSeek}
            className="custom-range custom-seekbar"
            style={{
              "--played": `${playedPercent}%`,
              "--buffered": `${Math.max(playedPercent, bufferedPercent)}%`,
            }}
          />
        </div>

        <span className="timestamp">{formatTime(duration)}</span>
      </div>
    </div>
  );
}

```

---

### Updated Stylesheet (`SeekBar.css`)

```css
.player-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  max-width: 480px;
  padding: 16px;
  background: #18181b;
  border-radius: 8px;
  font-family: system-ui, -apple-system, sans-serif;
  color: #fafafa;
}

.controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.icon-btn {
  padding: 6px 14px;
  border-radius: 6px;
  border: none;
  background: #3b82f6;
  color: white;
  cursor: pointer;
  font-weight: 500;
  transition: background 0.15s;
}

.icon-btn:hover {
  background: #2563eb;
}

/* Volume Group */
.volume-group {
  display: flex;
  align-items: center;
  gap: 6px;
}

.volume-btn {
  background: transparent;
  padding: 4px 6px;
  font-size: 16px;
}

.volume-btn:hover {
  background: #27272a;
}

/* Shared Range Slider Base */
.custom-range {
  -webkit-appearance: none;
  appearance: none;
  outline: none;
  cursor: pointer;
  border-radius: 3px;
}

.custom-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.custom-range:hover::-webkit-slider-thumb {
  transform: scale(1.2);
}

.custom-range::-moz-range-thumb {
  width: 12px;
  height: 12px;
  border: none;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.5);
  transition: transform 0.1s ease;
}

.custom-range:hover::-moz-range-thumb {
  transform: scale(1.2);
}

/* Volume-specific Slider */
.volume-slider {
  width: 80px;
  height: 4px;
  background: linear-gradient(
    to right,
    #fafafa 0%,
    #fafafa var(--fill),
    #3f3f46 var(--fill),
    #3f3f46 100%
  );
}

/* Seek Bar */
.seek-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.timestamp {
  font-size: 12px;
  font-variant-numeric: tabular-nums;
  color: #a1a1aa;
}

.slider-container {
  position: relative;
  flex-grow: 1;
  display: flex;
  align-items: center;
}

.custom-seekbar {
  width: 100%;
  height: 6px;
  background: linear-gradient(
    to right,
    #3b82f6 0%,
    #3b82f6 var(--played),
    #52525b var(--played),
    #52525b var(--buffered),
    #27272a var(--buffered),
    #27272a 100%
  );
}

.hover-tooltip {
  position: absolute;
  top: -28px;
  transform: translateX(-50%);
  background: #27272a;
  color: #f4f4f5;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  pointer-events: none;
  border: 1px solid #3f3f46;
  white-space: nowrap;
}

```

---

### Core Mechanics

* **Lazy State Initialization:** `useState(() => localStorage.getItem(...))` parses stored values synchronously during initial render without hydration flash or layout jumps.
* **Volume Memory (`prevVolume`):** When clicking the mute button, `prevVolume` stores the previous gain level so unmuting restores the exact user preference instead of defaulting to maximum.
* **Declarative Syncing:** The `useEffect` keeps the real HTML5 `audio.volume` and `audio.muted` DOM properties matched with React's state while persisting updates to `localStorage`.
