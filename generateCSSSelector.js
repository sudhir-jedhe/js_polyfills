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
    return selectors.join(' > ');
  }




  Input:
<div id="root">
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
</div>

const root = document.getElementById("root");
const target = document.getElementById("target");
console.log(generateSelector(root, target));

Output:
"div[id='root'] > section:nth-child(2) > p:nth-child(1) > span:nth-child(1) > button:nth-child(2)"