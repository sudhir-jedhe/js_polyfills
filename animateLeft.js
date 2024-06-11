function animateLeft(elementID, distance, duration) {
    const element = document.getElementById(elementID);
    const start = performance.now();
    const end = start + duration;
    const startPosition = element.getBoundingClientRect().left;
    const endPosition = startPosition - distance;

    function step(timestamp) {
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = startPosition - progress * distance;
        element.style.left = newPosition + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

// Example usage:
// animateLeft('myElement', 200, 1000); // Moves 'myElement' 200px to the left over 1000ms



/*************************************************************************** */
function animateLeft(elementID, distance, duration) {
    const element = document.getElementById(elementID);
    const startPosition = element.getBoundingClientRect().left;
    const endPosition = startPosition - distance;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = startPosition - progress * distance;
        element.style.left = newPosition + 'px';

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Reset position once animation completes
            element.style.left = startPosition + 'px';
            start = null;
            requestAnimationFrame(step); // Continue animation
        }
    }

    requestAnimationFrame(step);
}

// Example usage:
// animateLeft('myElement', 200, 1000); // Moves 'myElement' 200px to the left over 1000ms with a marquee effect



/************************************* */
function animateLeftGallery(containerID, distance, duration) {
    const container = document.getElementById(containerID);
    const containerWidth = container.offsetWidth;
    const startPosition = container.scrollLeft;
    const endPosition = startPosition - distance;
    let start = null;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;
        const progress = Math.min(elapsed / duration, 1);
        const newPosition = startPosition - progress * distance;
        container.scrollLeft = newPosition;

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            // Reset position once animation completes
            container.scrollLeft = 0;
            start = null;
            requestAnimationFrame(step); // Continue animation
        }
    }

    requestAnimationFrame(step);
}

// Example usage:
// animateLeftGallery('galleryContainer', 200, 5000); // Scrolls the 'galleryContainer' 200px to the left over 5000ms with a marquee effect
