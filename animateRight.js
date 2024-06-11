function animateRight(elementID, distance, duration) {
    const element = document.getElementById(elementID);
    const start = performance.now();
    const end = start + duration;
    const startPosition = element.getBoundingClientRect().left;
    const endPosition = startPosition + distance;

    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = startPosition + progress * distance;
        element.style.left = newPosition + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Example usage:
// animateRight('myElement', 200, 1000); // Moves 'myElement' 200px to the right over 1000ms

// To animate an element moving to the right using the requestAnimationFrame API, you can calculate the position of the element at each frame based on the duration and distance to be traveled. Here's an implementation of the animateRight function: