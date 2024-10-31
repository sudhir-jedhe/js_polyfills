const generateSelector = (root, target) => {
  // trace the selector from target to root
  const selectors = [];

  // iterate till root parent is found
  while (target !== root) {
    // get the position of the current element as its parent child
    // add one to it ass CSS nth-child is not like array, it starts from 1.
    const nthChild = Array.from(target.parentNode.children).indexOf(target) + 1;
    const selector = `${target.tagName.toLowerCase()}:nth-child(${nthChild})`;

    // add the selector at the front
    selectors.unshift(selector);

    // move to the parent
    target = target.parentNode;
  }

  // add the root's tag name at the beginning
  // with your preferred selector
  // id is used here
  selectors.unshift(`${target.tagName.toLowerCase()}[id="${target.id}"]`);

  // join the path of the selector and return them
  return selectors.join(" > ");
};

Input: <div id="root">
  <article>Prepare for interview</article>
  <section>
    on
    <p>
      <span>
        Learnersbucket
        <button>click me!</button>
        <button id="target">click me!</button>
      </span>
    </p>
  </section>
</div>;

const root = document.getElementById("root");
const target = document.getElementById("target");
console.log(generateSelector(root, target));

Output: "div[id='root'] > section:nth-child(2) > p:nth-child(1) > span:nth-child(1) > button:nth-child(2)";


/******************************* */

Discuss (43)
Create a Post
Most Liked
Recent
Looping through parents using tagName and id to generate selector string
6
undefined's avatar
heyimabhi
dfs to record path
4
undefined's avatar
caomeinaix
Simple root > tag:nth-child(n) solution
4
Saratov
backtracking solution
3
ibrahim
Tag based straightforward solution
3
bt4R9
Solution using recursion
1
Kizer256
Simplest JS code
1
fuLMaRg
DFS and nth:child pseudo selector
1
djSlim
DFS Approach
1
HelloWorld
Use id or > tag:nth-child()
1
undefined's avatar
__init__
O(1)
undefined's avatar
cwmohit
Traversing through parentNode
undefined's avatar
PranjalM
backtracking
34QAcKe
Is that cheating?
undefined's avatar
BdtGd
simple solution
deepakk
O(n)
STvegas
Simple DFS
mayur124
Travel back solution with explaination.
cxpC22y
向上递归，不断的找父元素，并通过子元素选择符连接起来。
YKOmNsk
My Solution
9FT1VeS
Show More
Looping through parents using tagName and id to generate selector string
undefined's avatar
heyimabhi
2022-6-23
function generateSelector(root, target) {
  let current = target;
  let result = "";
  while(current !== root){
    result = `> ${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ""} ${result}`
    current = current.parentElement;
  }
  return `${root.tagName.toLowerCase()} ${result}`;
}


/******** */


function generateSelector(root: HTMLElement, target: HTMLElement): string {
  if (target.id) return `#${target.id}`
  let res = ''
  dfs(root, [])
  return res
  function dfs(cur: HTMLElement, path: string[]): void {
    if (cur === target) {
      res = path.join(' > ')
      return
    }
    const children = Array.from(cur.children)
    for (const child of children) {
      path.push(child.tagName.toLowerCase())
      dfs(child as HTMLElement, path)
      path.pop()
    }
  }
}


/*************************** */

function generateSelector(root, target) {
  // your code here
  if(target.id) return "#" + target.id
  const path = []
  helper(root, target, path)
  path.push(root.tagName.toLowerCase())
  return path.reverse().join(" > ")
}
function helper(root, target, path){
  if(root === target ){
    return true
  }
  for(let el of root.children){
   if(helper(el, target, path)){
     path.push(el.tagName.toLowerCase())
     return true
   }
   path.pop()
  }
}



/*********************************** */

const getSelector = (element: HTMLElement) => {
  const tag       = element.tagName.toLowerCase()
  const id        = element.id
  const className = element.className
  return `${tag}${id ? `#${id}` : ''}${className ? `.${className}` : ''}`
}
const generateSelector = (root: HTMLElement, target: HTMLElement): string => {
  const selectors = [getSelector(target)]
  const getParent = (node: HTMLElement) => {
    if (node !== root) {
      const parent = node.parentNode as HTMLElement
      if (parent) {
        selectors.unshift(getSelector(parent))
        getParent(parent)
      }
    }
  }
  getParent(target)
  return selectors.join(' > ')
}


/************************************** */

function generateSelector(root, target) {
  let current = target;
  let result = "";
  while(current !== root){
    result = `> ${current.tagName.toLowerCase()}${current.id ? `#${current.id}` : ""} ${result}`
    current = current.parentElement;
  }
  return `${root.tagName.toLowerCase()} ${result}`;
}