const JSONtoHTML = (json) => {
  // create a fragment
  const fragment = document.createDocumentFragment();

  if (Array.isArray(json)) {
    // convert each entry of array to DOM element
    for (let entry of json) {
      // create the element
      const element = document.createElement(entry.type);

      // if props available
      // set them
      if (entry.props) {
        for (let key in entry.props) {
          element.setAttribute(key, entry.props[key]);
        }
      }

      // if array of children
      if (Array.isArray(entry.children)) {
        // recursively convert the children to DOM
        // and assign them
        for (let child of entry.children) {
          element.appendChild(JSONtoHTML(child));
        }
      }
      // if children is string / text
      else {
        element.innerText = entry.children;
      }

      // add the element back to the fragment
      fragment.appendChild(element);
    }
  }
  // if not array recursively call the same function
  // pass the entry as an array.
  else {
    return JSONtoHTML([json]);
  }

  return fragment;
};



Input:
const JSON = [
{ 
  type: 'div', 
  props: { id: 'hello', class: "foo" }, 
  children: [
    {type:'h1', children: 'HELLO' },
    {type:'p', children: [{type:'span', props: {class: "bar" }, children: 'World' }] }
  ]
},
{ 
  type: 'section', 
  props: { id: 'hello-2', class: "foo-2" }, 
  children: [
    {type:'h1', children: 'HELLO-2' },
    {type:'p', children: [{type:'span', props: {class: "bar-2" }, children: 'World' }] }
  ]
}];

console.log(JSONtoHTML(json));

Output:
<div id="hello" class="foo">
  <h1>HELLO</h1>
  <p>
    <span class="bar">World</span>
  </p>
</div>
<section id="hello-2" class="foo-2">
  <h1>HELLO-2</h1>
  <p>
    <span class="bar-2">World</span>
  </p>
</section>