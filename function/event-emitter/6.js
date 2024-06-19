class EventEmitter {
    constructor() {
        this.events = {};
    }

    on(eventName, listener) {
        if (typeof eventName !== 'string' || typeof listener !== 'function') {
            throw new Error('Event name must be a string and listener must be a function');
        }

        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({ listener, once: false });
    }

    once(eventName, listener) {
        if (typeof eventName !== 'string' || typeof listener !== 'function') {
            throw new Error('Event name must be a string and listener must be a function');
        }

        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }

        this.events[eventName].push({ listener, once: true });
    }

    emit(eventName, ...args) {
        if (this.events[eventName]) {
            this.events[eventName].forEach((event, index) => {
                event.listener.apply(this, args);
                if (event.once) {
                    this.events[eventName].splice(index, 1);
                }
            });
        }
    }

    off(eventName, listener) {
        if (this.events[eventName]) {
            this.events[eventName] = this.events[eventName].filter(event => event.listener !== listener);
        }
    }
}
