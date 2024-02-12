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
