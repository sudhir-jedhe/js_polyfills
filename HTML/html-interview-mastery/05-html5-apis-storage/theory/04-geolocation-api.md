*** copy 04-geolocation-api.md ***

# The Geolocation API

The Geolocation API (`navigator.geolocation`) lets a page request the user's physical location, subject to explicit user permission. It's asynchronous, callback-based (predating widespread Promise use in web APIs), and has both a one-shot method and a continuous-watching method.

## Feature detection

Always check for availability before using it — not every environment has it (and it requires a secure context):

```js
if ('geolocation' in navigator) {
  // safe to use
} else {
  // fall back — e.g. ask the user to enter a location manually
}
```

## One-shot position request

```js
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    console.log(latitude, longitude, accuracy); // accuracy in meters
  },
  (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log('User denied the request');
        break;
      case error.POSITION_UNAVAILABLE:
        console.log('Location information unavailable');
        break;
      case error.TIMEOUT:
        console.log('Request timed out');
        break;
    }
  },
  {
    enableHighAccuracy: true, // trades battery/time for precision (e.g. GPS vs. Wi-Fi/IP)
    timeout: 5000,            // ms to wait before firing the error callback
    maximumAge: 0,            // 0 = never use a cached position; Infinity = always use cache if present
  }
);
```

`getCurrentPosition` takes **three arguments**: a success callback, an (optional) error callback, and an (optional) options object — it does **not** return a Promise natively (though it's trivial to wrap in one).

```js
function getPosition(options) {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

const position = await getPosition({ enableHighAccuracy: true });
```

## Continuous tracking with `watchPosition`

For live tracking (e.g., a map that follows the user), `watchPosition` calls its success callback repeatedly whenever the position changes, and returns a watch ID used to stop it:

```js
const watchId = navigator.geolocation.watchPosition(
  (position) => updateMapMarker(position.coords),
  (error) => console.error(error),
  { enableHighAccuracy: true }
);

// later, when tracking should stop:
navigator.geolocation.clearWatch(watchId);
```

Always call `clearWatch` when the tracking UI unmounts/closes — an uncleared watch keeps firing (and keeps the device's location sensor active, draining battery) indefinitely.

## The `PermissionDenied` UX flow

Calling `getCurrentPosition`/`watchPosition` triggers a native browser permission prompt the first time (per origin). Three states follow:

1. **Granted** — success callback fires with a `GeolocationPosition`.
2. **Denied** — error callback fires immediately with `code === 1` (`PERMISSION_DENIED`); the browser will **not** re-prompt automatically on subsequent calls — the user must change the permission manually via browser UI.
3. **Prompt dismissed / ignored** — behaves like a pending request; some browsers eventually time out.

Good UX explains *why* location is needed **before** triggering the native prompt (since a bare, unexplained prompt on page load is a common reason users reflexively deny it).

## Security requirement: secure context only

As of modern browsers, the Geolocation API only works on **secure origins** (`https://` or `localhost`) — calling it from a plain `http://` page (other than `localhost`) either silently fails or the browser blocks it outright. This is part of a broader trend of gating powerful/privacy-sensitive APIs (camera, microphone, geolocation, notifications) behind HTTPS.

## `coords` object reference

| Property | Meaning |
|---|---|
| `latitude` / `longitude` | Position in decimal degrees |
| `accuracy` | Radius of accuracy in meters (68% confidence) |
| `altitude` | Meters above sea level, or `null` if unavailable |
| `altitudeAccuracy` | Accuracy of altitude in meters, or `null` |
| `heading` | Direction of travel in degrees from true north, or `null` if not moving/unavailable |
| `speed` | Speed in meters/second, or `null` if unavailable |
