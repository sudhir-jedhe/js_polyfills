**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
 * Read FAQs section on the left for more information on how to use the editor
**/
/**
* Keep the name as `VDocument` only
**/

// write your solution below
class Node {
  constructor(name, innerHTML = ''){
    this.name = name;
    this.innerHTML = innerHTML;
    this.children = [];
  }
  
  appendChild(child){
    this.children.push(child);
    return this;
  }
  
}

class VDocument extends Node{
  constructor(){
    super('html');
  }
  
  createElement(elementName){
    return new Node(elementName);
  }
  
  render(){
    let spacing = 4;
      
    function getLevelSpaces(level){
        const space  = " ";
        return Array(spacing*level).fill(space).join("");
    }     

    function pushNode(node, level){
         if(!node.name){
             throw Error('Unnamed node detected!')
         }
         let result = `${getLevelSpaces(level)}<${node.name}>\n`;
         if(node.innerHTML){
             result += `${getLevelSpaces(level+1)}${node.innerHTML}\n`;
         }
         if(node.children.length){
             for(let c = 0; c < node.children.length; c++){
                 result += pushNode(node.children[c], level+1)
             }
         }
         result += `${getLevelSpaces(level)}</${node.name}>\n`;
        return result;
     }

    let result = pushNode(this, 0);
    return result;   
  }
  
}

// let vDocument = new VDocument();
// let body = vDocument.createElement("body");
// let div = vDocument.createElement("div");
// let div2 = vDocument.createElement("div");
// let div21 = vDocument.createElement("div");

// div.innerHTML = "Hello, I am a div!";
// div2.innerHTML = "Hello, I am another div!";
// div21.innerHTML = "Hello, I am div inside a div";
// div2.appendChild(div21);
// body.appendChild(div);
// body.appendChild(div2);
// vDocument.appendChild(body);

// // proper html structure 
// const html = vDocument.render();
// console.log(html);