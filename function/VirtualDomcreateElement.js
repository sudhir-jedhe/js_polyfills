function createElement(type, props, ...children) {
    return {
      type,
      props: {
        ...props,
        children
      }
    }
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
//   React.createElement(
//     type,
//     [props],
//     [...children]
//   )
  

//   const h = createElement
// render(h(
//   'div',
//   {},
//   h('h1', {}, ' this is '),
//   h(
//     'p',
//     { className: 'paragraph' },
//     ' a ',
//     h('button', {}, ' button '),
//     ' from ',
//     h('a', 
//       { href: 'https://bfe.dev' }, 
//       h('b', {}, 'BFE'),
//       '.dev')
//   )
// ))