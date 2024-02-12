/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Keep the name as `VDocument` only
 **/

// write your solution below
const SPACE = "\t";
export class Element {
  tagName = null;
  children = [];

  _innerHTML = "";

  constructor(tagName) {
    this.tagName = tagName;
  }

  set innerHTML(newHtml) {
    this._innerHTML = newHtml;
    this.children = [];
  }

  getHTML() {
    if (this._innerHTML) {
      return SPACE + this._innerHTML;
    } else {
      return this.children
        .map((ele) => {
          const lines = ele.innerHTML.split("\n");
          return lines.map((line) => SPACE + line).join("\n");
        })
        .join("\n");
    }
  }

  get innerHTML() {
    return `<${this.tagName}>\n${SPACE}${this.getHTML()}\n${SPACE}</${
      this.tagName
    }>`;
  }

  appendChild(child) {
    this.children.push(child);
  }
}

export class VDocument {
  children = [];
  tagName = "html";
  constructor() {}

  createElement(tagName) {
    return new Element(tagName);
  }

  appendChild(node) {
    this.children.push(node);
  }

  getHTML() {
    if (this.innerHTML) {
      return this.innerHTML;
    } else {
      return this.children
        .map((ele) => {
          const lines = ele.innerHTML.split("\n");
          return lines.map((line) => SPACE + line).join("\n");
        })
        .join("\n");
    }
  }

  render() {
    return `<${this.tagName}>\n${SPACE}${this.getHTML()}\n</${this.tagName}>`;
  }
}
