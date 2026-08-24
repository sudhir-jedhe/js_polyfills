# Snippet: Getting the User's Current Position

```html
<button id="locate">Show my location</button>
<p id="output"></p>

<script>
  document.getElementById('locate').addEventListener('click', () => {
    const output = document.getElementById('output');

    if (!('geolocation' in navigator)) {
      output.textContent = 'Geolocation is not supported by this browser.';
      return;
    }

    output.textContent = 'Locating…';

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        output.textContent = `Lat ${latitude.toFixed(4)}, Lng ${longitude.toFixed(4)} (±${Math.round(accuracy)}m)`;
      },
      (error) => {
        output.textContent = `Error: ${error.message}`;
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 0 }
    );
  });
</script>
```
