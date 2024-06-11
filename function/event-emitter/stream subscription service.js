class Stream {
    constructor() {
      this.subscribers = new Set();
    }
  
    subscribe(subscriber) {
      this.subscribers.add(subscriber);
    }
  
    unsubscribe(subscriber) {
      this.subscribers.delete(subscriber);
    }
  
    notify(data) {
      this.subscribers.forEach(subscriber => {
        subscriber(data);
      });
    }
  }
  
  // Example usage:
  // Define a function to handle new data
  const onDataReceived = data => {
    console.log("Received data:", data);
  };
  
  // Create a stream
  const stream = new Stream();
  
  // Subscribe to the stream
  stream.subscribe(onDataReceived);
  
  // Notify subscribers with new data
  stream.notify("New data 1");
  
  // Unsubscribe from the stream
  stream.unsubscribe(onDataReceived);
  
  // Notify subscribers with new data (after unsubscribing)
  stream.notify("New data 2");
  