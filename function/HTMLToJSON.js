// helper function to get all the attributes of node
const getAllAtrributes = (node) => { 
    let obj = {};
    for (let att, i = 0, atts = node.attributes, n = atts.length; i < n; i++){
        att = atts[i];
        obj[att.nodeName] = att.nodeValue;
    }
  
    return obj;
  };
  
  const HTMLtoJSON = (node) => {
    // to store the output
    const output = {};
    
    // get the node name
    const type = node.localName;
    
    // set the children to innerText by default
    let children = node.innerText;
    
    // if the node has children
    if(node.children.length > 0){
      // recursively compute all the children
      // and return an array of them
      children = [];
      for(let child of node.children){
        children.push(HTMLtoJSON(child));
      };
    };
    
    // get all the properties of the node
    const props = getAllAtrributes(node);
    
    // if properties exist store them
    if(Object.keys(props).length){
      output['props'] = props;
    }
    
    // store the type and children
    output['children'] = children;
    output['type'] = type;
    
    return output;
  };


  Input:
<div id="foo">
  <h1>Hello</h1>
  <p class="bar">
    <span>World!</span>
  </p>
</div>

const node = document.getElementById("foo");
console.log(HTMLtoJSON(node));

Output:
{
  "props": {
    "id": "foo"
  },
  "children": [
    {
      "children": "Hello",
      "type": "h1"
    },
    {
      "props": {
        "class": "bar"
      },
      "children": [
        {
          "children": "World!",
          "type": "span"
        }
      ],
      "type": "p"
    }
  ],
  "type": "div"
}