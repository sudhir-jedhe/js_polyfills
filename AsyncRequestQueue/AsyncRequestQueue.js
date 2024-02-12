class AsyncRequestQueue {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
  }

  enqueue(requestFunction) {
    return new Promise((resolve, reject) => {
      const request = { requestFunction, resolve, reject };
      this.queue.push(request);
      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  async processQueue() {
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const { requestFunction, resolve, reject } = this.queue.shift();
      try {
        const result = await requestFunction();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }
    this.isProcessing = false;
  }
}
