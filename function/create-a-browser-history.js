// new BrowserHistory() - when you open a new tab, it is set with an empty
// history goBack() - go to last entry, notice the entries are kept so that
// forward() could get us back forward() - go to next visited entry visit() -
// when you enter a new address or click a link, this adds a new entry but
// truncate the entries which we could forward() to.

// Say we start a new tab, this is the empty history.

// [ ]
// Then visit url A, B, C in turn.

// [ A, B, C]
//         ↑
// We are currently at C, we could goBack() to B, then to A

// [ A, B, C]
//   ↑
// forward() get us to B

// [ A, B, C]
//      ↑
// Now if we visit a new url D, since we are currently at B, C is truncated.

// [ A, B, D]
//         ↑
// You are asked to implement a BrowserHistory class to mimic the behavior.

class BrowserHistory {
  /**
   * @param {string} url
   * if url is set, it means new tab with url
   * otherwise, it is empty new tab
   */
  constructor(url) {
    this.history = [];
    this.pointer = 0;
    if (url !== undefined) {
      this.history.push(url);
    }
  }
  /**
   * @param { string } url
   */
  visit(url) {
    this.history.length = this.pointer + 1;
    this.history.push(url);
    this.pointer++;
  }

  /**
   * @return {string} current url
   */
  get current() {
    return this.history[this.pointer];
  }

  // go to previous entry
  goBack() {
    this.pointer = Math.max(0, --this.pointer);
  }

  // go to next visited url
  forward() {
    this.pointer = Math.min(this.history.length - 1, ++this.pointer);
  }
}

/************************************** */
class BrowserHistory {
  /**
   * @param {string} url
   * if url is set, it means new tab with url
   * otherwise, it is empty new tab
   */
  constructor(url) {
    this.entries = [];
    this.currentIndex = 0;
    if (url !== undefined) {
      this.entries.push(url);
    }
  }
  /**
   * @param { string } url
   */
  visit(url) {
    this.entries.length = this.currentIndex + 1;
    this.entries.push(url);
    this.currentIndex += 1;
  }

  /**
   * @return {string} current url
   */
  get current() {
    return this.entries[this.currentIndex];
  }

  // go to previous entry
  goBack() {
    this.currentIndex = Math.max(0, this.currentIndex - 1);
  }

  // go to next visited url
  forward() {
    this.currentIndex = Math.min(
      this.entries.length - 1,
      this.currentIndex + 1
    );
  }
}

/************************************ */
class BrowserHistory {
  /**
   * @param {string} url
   * if url is set, it means new tab with url
   * otherwise, it is empty new tab
   */
  constructor(url) {
    this.history = [url];
    this.currentPage = 0;
  }
  /**
   * @param { string } url
   */
  visit(url) {
    this.history[++this.currentPage] = url;
  }

  /**
   * @return {string} current url
   */
  get current() {
    return this.history[this.currentPage];
  }

  // go to previous entry
  goBack() {
    this.currentPage = Math.max(0, this.currentPage - 1);
  }

  // go to next visited url
  forward() {
    this.currentPage = Math.min(this.history.length - 1, this.currentPage + 1);
  }
}



/**************** */

class CustomHistory {
  constructor() {
      this.historyStack = [];
      this.currentIndex = -1; // No history at the start
  }

  // Push a new state to the history stack
  pushState(state, title, url) {
      // If we're not at the end of the stack, slice off any forward history
      if (this.currentIndex < this.historyStack.length - 1) {
          this.historyStack = this.historyStack.slice(0, this.currentIndex + 1);
      }

      this.historyStack.push({ state, title, url });
      this.currentIndex++;
      console.log(`Pushed: ${url}`);
  }

  // Replace the current state in the history stack
  replaceState(state, title, url) {
      if (this.currentIndex >= 0) {
          this.historyStack[this.currentIndex] = { state, title, url };
          console.log(`Replaced: ${url}`);
      } else {
          console.error('No history to replace');
      }
  }

  // Go back in history
  back() {
      if (this.currentIndex > 0) {
          this.currentIndex--;
          const { state, title, url } = this.historyStack[this.currentIndex];
          console.log(`Back to: ${url}`);
          return { state, title, url };
      } else {
          console.error('No more history to go back');
          return null;
      }
  }

  // Go forward in history
  forward() {
      if (this.currentIndex < this.historyStack.length - 1) {
          this.currentIndex++;
          const { state, title, url } = this.historyStack[this.currentIndex];
          console.log(`Forward to: ${url}`);
          return { state, title, url };
      } else {
          console.error('No more history to go forward');
          return null;
      }
  }

  // Get current state
  getCurrentState() {
      if (this.currentIndex >= 0) {
          return this.historyStack[this.currentIndex];
      }
      return null;
  }
}

// Example usage
const customHistory = new CustomHistory();

// Simulating user navigation
customHistory.pushState({ page: 1 }, 'Page 1', '/page1');
customHistory.pushState({ page: 2 }, 'Page 2', '/page2');
customHistory.pushState({ page: 3 }, 'Page 3', '/page3');

// Current state
console.log(customHistory.getCurrentState()); // { page: 3, title: 'Page 3', url: '/page3' }

// Go back
customHistory.back(); // Back to: /page2
console.log(customHistory.getCurrentState()); // { page: 2, title: 'Page 2', url: '/page2' }

// Replace current state
customHistory.replaceState({ page: 2, modified: true }, 'Modified Page 2', '/modified-page2');
console.log(customHistory.getCurrentState()); // { page: 2, modified: true, title: 'Modified Page 2', url: '/modified-page2' }

// Go forward
customHistory.forward(); // Forward to: /page3
console.log(customHistory.getCurrentState()); // { page: 3, title: 'Page 3', url: '/page3' }
