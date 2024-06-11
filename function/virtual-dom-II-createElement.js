// Suppose you have solved above problem, now let's take a look at React.createElement():

React.createElement(type, [props], [...children]);
// First argument is type, it could be set to Custom Component, but here in this problem, it would only be HTML tag name
// Second argument is props, here in this problem, it would only be the (common) camelCased HTML attributes
// the rest arguments are the children, which in React supports many data types, but in this problem, it only has the element type of MyElement, or string for TextNode.
// You are asked to create your own createElement() and render(), so that following code could create the exact HTMLElement in 113. Virtual DOM I.

const h = createElement;

render(
  h(
    "div",
    {},
    h("h1", {}, " this is "),
    h(
      "p",
      { className: "paragraph" },
      " a ",
      h("button", {}, " button "),
      " from ",
      h("a", { href: "https://bfe.dev" }, h("b", {}, "BFE"), ".dev")
    )
  )
);

/**
 * MyElement is the type your implementation supports
 *
 * type MyNode = MyElement | string
 */

/**
 * @param { string } type - valid HTML tag name
 * @param { object } [props] - properties.
 * @param { ...MyNode} [children] - elements as rest arguments
 * @return { MyElement }
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

/**
 * @param {object} valid JSON presentation
 * @return {HTMLElement}
 */
function render(json) {
  // create the top level emlement
  // recursively append the children
  // textnode
  if (typeof json === "string") {
    return document.createTextNode(json);
  }

  // element
  const {
    type,
    props: { children, ...attrs },
  } = json;
  const element = document.createElement(type);

  for (let [attr, value] of Object.entries(attrs)) {
    element[attr] = value;
  }

  const childrenArr = Array.isArray(children) ? children : [children];

  for (let child of childrenArr) {
    element.append(render(child));
  }

  return element;
}

/******************** */

/**
 * MyElement is the type your implementation supports
 *
 * type MyNode = MyElement | string
 */

/**
 * @param { string } type - valid HTML tag name
 * @param { object } [props] - properties.
 * @param { ...MyNode} [children] - elements as rest arguments
 * @return { MyElement }
 */
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children,
    },
  };
}

/**
 * @param { json }
 * @returns { HTMLElement }
 */
function render(json) {
  if (typeof json === "string") {
    return document.createTextNode(json);
  }
  const {
    type,
    props: { children, ...attrs },
  } = json;
  const node = document.createElement(type);
  for (let [attr, value] of Object.entries(attrs)) {
    node[attr] = value;
  }
  const childrenArr = Array.isArray(children) ? children : [children];
  for (let child of childrenArr) {
    node.append(render(child));
  }
  return node;
}

/************************************* */

/**
 * MyElement is the type your implementation supports
 *
 * type MyNode = MyElement | string
 */

/**
 * @param { string } type - valid HTML tag name
 * @param { object } [props] - properties.
 * @param { ...MyNode} [children] - elements as rest arguments
 * @return { MyElement }
 */
function createElement(type, props, ...children) {
  // your code here
  const element = document.createElement(type);

  // Add attributes
  for (let key in props) {
    element.setAttribute(key === "className" ? "class" : key, props[key]);
  }

  for (let child of children) {
    if (typeof child === "string") {
      element.append(document.createTextNode(child));
    } else {
      element.append(child);
    }
  }
  return element;
}

/**
 * @param { MyElement }
 * @returns { HTMLElement }
 */
function render(myElement) {
  // your code here
  return myElement;
}



/************************************************************ */

class VirtualDOM {
  static virtualize(element) {
      if (!element) return null; // Return null if element is null or undefined

      const virtualNode = {
          tag: element.tagName.toLowerCase(), // Get tag name in lowercase
          attributes: {},
          children: []
      };

      // Copy attributes from real DOM element to virtual node
      for (const { name, value } of element.attributes) {
          virtualNode.attributes[name] = value;
      }

      // Recursively virtualize child nodes
      for (const childNode of element.childNodes) {
          const childVirtualNode = VirtualDOM.virtualize(childNode);
          if (childVirtualNode) {
              virtualNode.children.push(childVirtualNode);
          }
      }

      return virtualNode;
  }

  static render(virtualNode) {
      if (!virtualNode) return null; // Return null if virtualNode is null or undefined

      const element = document.createElement(virtualNode.tag);

      // Set attributes from virtual node to real DOM element
      for (const [name, value] of Object.entries(virtualNode.attributes)) {
          element.setAttribute(name, value);
      }

      // Recursively render child nodes
      for (const childVirtualNode of virtualNode.children) {
          const childElement = VirtualDOM.render(childVirtualNode);
          if (childElement) {
              element.appendChild(childElement);
          }
      }

      return element;
  }
}

// Example usage:
// Assuming `realElement` is the reference to a real DOM element
// const virtualNode = VirtualDOM.virtualize(realElement);
// console.log(virtualNode);

// Assuming `virtualNode` is a virtual node created previously
// const realElement = VirtualDOM.render(virtualNode);
// document.body.appendChild(realElement);


/*********************************************** */

class VirtualDOM {
  static virtualize(element) {
      if (!element) return null; // Return null if element is null or undefined

      const virtualNode = {
          tag: element.tagName.toLowerCase(), // Get tag name in lowercase
          attributes: {},
          children: []
      };

      // Copy attributes from real DOM element to virtual node
      for (const { name, value } of element.attributes) {
          virtualNode.attributes[name] = value;
      }

      // Recursively virtualize child nodes
      for (const childNode of element.childNodes) {
          const childVirtualNode = VirtualDOM.virtualize(childNode);
          if (childVirtualNode) {
              virtualNode.children.push(childVirtualNode);
          }
      }

      return virtualNode;
  }

  static render(virtualNode) {
      if (!virtualNode) return null; // Return null if virtualNode is null or undefined

      const element = document.createElement(virtualNode.tag);

      // Set attributes from virtual node to real DOM element
      for (const [name, value] of Object.entries(virtualNode.attributes)) {
          element.setAttribute(name, value);
      }

      // Recursively render child nodes
      for (const childVirtualNode of virtualNode.children) {
          const childElement = VirtualDOM.render(childVirtualNode);
          if (childElement) {
              element.appendChild(childElement);
          }
      }

      return element;
  }
}

// Example usage:
// Assuming `realElement` is the reference to a real DOM element
// const virtualNode = VirtualDOM.virtualize(realElement);
// console.log(virtualNode);

// Assuming `virtualNode` is a virtual node created previously
// const realElement = VirtualDOM.render(virtualNode);
// document.body.appendChild(realElement);
