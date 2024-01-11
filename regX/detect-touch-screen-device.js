function is_touch_enabled() {
  return (
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

// ontouchstart: An event handler that handles event triggered after touching a DOM element.
// maxTouchPoints: A read-only property of a Navigator interface returns the maximum number of simultaneous touch contact points that the device supports.
// msMaxTouchPoints: Same as above, just with vendor prefix “ms” to target browsers IE 10 and below.
