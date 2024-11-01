// const el = <div>
//  <h1> this is </h1>
//  <p className="paragraph"> a <button> button </button> from <a href="https://bfe.dev"><b>BFE</b>.dev</a>
//  </p>
// </div>;

// console.log(el)


{
    type: 'div',
    props: {
      children: [
        {
          type: 'h1',
          props: {
            children: ' this is '
          }
        },
        {
          type: 'p',
          props: {
            className: 'paragraph',
            children: [
              ' a ',
              {
                type: 'button',
                props: {
                  children: ' button '
                }
              },
              ' from',
              {
                type: 'a',
                props: {
                  href: 'https://bfe.dev',
                  children: [
                    {
                      type: 'b',
                      props: {
                        children: 'BFE'
                      }
                    },
                    '.dev'
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }


// ADS VIA CARBON
// The core of this problem is familiar with DOM API, and there are few I used:

// Create

// document.createElement(tagName)
// document.createTextNode(tagName)
// Add

// node.append(childNode)
// node.classList.add(className)
// Set

// node.setAttribute(name, value)
// Check

// node.hasChildNodes()
// node.hasAttributes()
// Get

// node.childNodes
// node.tagName
// node.attributes // {0: {name: xxx, value: xxx}, 1: {name: xxx, value: xxx}...}
// NodeType

// node.nodeType == 1 // element node
// node.nodeType == 2 // attribute node
// node.nodeType == 3 // text node


/**
 * @param {HTMLElement} 
 * @return {object} object literal presentation
 */
function virtualize(element) {
    const result = {
      type: element.tagName.toLowerCase(),
      props: {}
    };
  
    const props = {};
  
    // handle props
    if (element.hasAttributes()) {
      for (let { name, value } of element.attributes) {
        props[name == 'class' ? 'className' : name] = value;
      }
    }
  
    // handle children
    const children = [];
    if (element.hasChildNodes()) {
      for (let node of element.childNodes) {
        if (node.nodeType == 1) {
          children.push(virtualize(node));
        } else if (node.nodeType == 3) {
          children.push(node.textContent)
        }
      }
    }
  
    if (children.length) {
      if (children.length == 1) {
        props.children = children[0];
      } else {
        props.children = children;
      }
    }
  
    result.props = props;
    return result;
  }
  
  
  /**
   * @param {object} valid object literal presentation
   * @return {HTMLElement} 
   */
  function render(obj) {
    // render self
    let { type, props: { className, children, ...restProps } } = obj;
    const ele = document.createElement(type);
  
    // add className
    if (className) ele.classList.add(className);
  
    // append children
    if (children) {
      // make sure children is Array
      if (!(children instanceof Array)) {
        children = [children];
      }
      // render each child and append it to parent
      children.forEach(child => {
        // text node
        if(typeof child == 'string'){
          ele.append(document.createTextNode(child));
        }else{
          ele.append(render(child));
        }
      })
    }
  
    // add rest props to ele
    if(restProps){
      Object.entries(restProps).forEach(([key, value])=>{
        ele.setAttribute(key, value);
      })
    }
    return ele;
  }
  
  
  
  const json = {
    type: 'div',
    props: {
      children: [
        {
          type: 'h1',
          props: {
            children: ' this is '
          }
        },
        {
          type: 'p',
          props: {
            className: 'paragraph',
            children: [
              ' a ',
              {
                type: 'button',
                props: {
                  children: ' button '
                }
              },
              ' from ',
              {
                type: 'a',
                props: {
                  href: 'https://bfe.dev',
                  children: [
                    {
                      type: 'b',
                      props: {
                        children: 'BFE'
                      }
                    },
                    '.dev'
                  ]
                }
              }
            ]
          }
        }
      ]
    }
  }
  const html = render(json)



  /********************************************************* */
  /**
 * @param {HTMLElement} 
 * @return {object} JSON presentation
 */
function virtualize(element) {
    // virtualize top level element
    // recursively handle the children (childNodes)
    const result = {
      type: element.tagName.toLowerCase(),
      props: {}
    }
    // props (without children)
    for (let attr of element.attributes) {
      const name = attr.name === 'class' ? 'className' : attr.name
      result.props[name] = attr.value
    }
    // children
    const children = []
    for (let node of element.childNodes) {
      if (node.nodeType === 3) { // text node
        children.push(node.textContent)
      } else {
        children.push(virtualize(node))
      }
    }
    
    result.props.children = children.length === 1 ? children[0] : children
    
    return result
  }
  
  
  /**
   * @param {object} valid JSON presentation
   * @return {HTMLElement} 
   */
  function render(json) {
    // create the top level emlement
    // recursively append the children
    // textnode
    if (typeof json === 'string') {
      return document.createTextNode(json)
    }
    
    // element
    const {type, props: {children, ...attrs}} = json
    const element = document.createElement(type)
    
    for (let [attr, value] of Object.entries(attrs)) {
      element[attr] = value
    }
    
    const childrenArr = Array.isArray(children) ? children : [children]
    
    for (let child of childrenArr) {
      element.append(render(child))
    }
    
    return element
  }