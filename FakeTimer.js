
// To create a FakeTimer class for managing fake time in tests or simulations, you can use JavaScript's setTimeout and clearTimeout functions to simulate the passage of time.

class FakeTimer {
    constructor() {
        this.time = 0;
        this.timeoutId = null;
        this.callbacks = new Map();
    }

    tick(ms) {
        this.time += ms;
        const callbacksToExecute = [...this.callbacks.entries()].filter(([time]) => time <= this.time);

        callbacksToExecute.forEach(([time, callback]) => {
            callback();
            this.callbacks.delete(time);
        });
    }

    setTimeout(callback, delay) {
        const scheduledTime = this.time + delay;
        const timeoutId = Symbol();
        this.callbacks.set(scheduledTime, callback);
        return timeoutId;
    }

    clearTimeout(timeoutId) {
        this.callbacks.forEach((_, time) => {
            if (time === timeoutId) {
                this.callbacks.delete(time);
            }
        });
    }

    getTime() {
        return this.time;
    }
}

// Example usage:
const fakeTimer = new FakeTimer();

// Schedule a timeout
const timeoutId = fakeTimer.setTimeout(() => {
    console.log("Timeout executed at", fakeTimer.getTime());
}, 1000);

// Tick time forward
fakeTimer.tick(500); // Simulate 500ms passing

// Cancel the timeout
fakeTimer.clearTimeout(timeoutId);

// Tick time forward again
fakeTimer.tick(1000); // Simulate another 1000ms passing

// The timeout should not be executed
