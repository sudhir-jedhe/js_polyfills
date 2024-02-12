/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Read FAQs section on the left for more information on how to use the editor
 **/
/**
 * Do not change the function name
 **/

/**
 * @param {HTMLElement} root
 * @param {HTMLElement} target
 * @return {string}
 */

function getSpaces(level) {
  return Array(4 * level)
    .fill(" ")
    .join("");
}

function printTree(node, level) {
  let result = "";
  if (node && node.tagName) {
    result += `${getSpaces(level)}<${node.tagName}>\n`;
  }
  if (node && node.innerHTML) {
    result += `${getSpaces(level + 1)}${node.innerHTML}\n`;
  }
  const childArray = Array.from(node.childNodes);
  if (childArray.length) {
    for (let i = 0; i < childArray.length; i++) {
      result += printTree(childArray[i], level + 1);
    }
  }
  if (node && node.tagName) {
    result += `${getSpaces(level)}</${node.tagName}>\n`;
  }
  return result;
}
function generateSelector(root, target) {
  // write your code here
  if (target === root) {
    return target.tagName.toLowerCase();
  }

  // console.log(printTree(root, 0));

  let path = [];
  let element = target;

  while (element !== root && element.parentNode) {
    let selector = element.tagName.toLowerCase();
    let parentNode = element.parentNode;
    let currentElementIdx = -1;
    let siblingIdx = 1;
    let siblings = Array.from(parentNode.childNodes).filter((child, idx) => {
      console.log({ child, element }, child === element, idx, child.nodeType);
      if (
        child.nodeType === 1 &&
        child.tagName.toLowerCase() === element.tagName.toLowerCase()
      ) {
        if (child === element) {
          currentElementIdx = siblingIdx;
        } else {
          siblingIdx += 1;
        }
        return true;
      } else return false;
    });
    if (siblings.length > 1) {
      console.log({ siblings, currentElementIdx });
      selector += `:nth-of-type(${currentElementIdx})`;
    }
    if (element.id) {
      selector += `#${element.id}`;
    } else if (element.className) {
      const classNames = element.className.tirm().split(/\s+/).join(".");
      selector += `.${classNames}`;
    }

    path.unshift(selector);
    element = element.parentNode;
  }
  console.log({ path });
  return path.join(" > ");
}

<div>
  <h1>Devtools Tech</h1>
  <div>
    <p>Subscribe to our YT channel </p>
    <a href="youtube.com/c/devtoolstech">here</a>
  </div>
</div>;

const selector = generateSelector(root, target);
console.log(selector); // div > div > a

<section>
  <ul>
    <li>Home</li>
    <li>Services</li>
    <li>Product</li>
  </ul>
</section>;
// selecting li with text Product
const selector = generateSelector(root, target);
console.log(selector); // section > ul > li:nth-of-type(3)

/*********************** */
function generateSelector(root, target) {
  // write your code here
  let element = target;
  if (!element instanceof HTMLElement || !root instanceof HTMLElement) {
    throw new Error("Not valid element");
  }

  let pathArray = [];
  while (element != root) {
    let selector = element.tagName.toLowerCase();
    if (element.id) {
      selector += `#${element.ud}`;
      pathArray.unshift(selector);
      break;
    }
    if (element.className.trim().length > 0) {
      selector += `.${element.className.replaceAll(" ", ".")}`;
    }
    let siblingElement = element.previousElementSibling;
    let index = 0;
    while (siblingElement != null) {
      siblingElement = siblingElement.previousElementSibling;
      index++;
    }
    if (index > 0) {
      selector += `:nth-child(${index + 1})`;
    }
    pathArray.unshift(selector);
    element = element.parentElement;
  }
  pathArray.unshift(root.tagName.toLowerCase());
  const cssPath = pathArray.join(" > ");
  return cssPath;
}
