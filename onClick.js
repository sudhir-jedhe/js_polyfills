// Map<node, Array<[predicate, hanlder]>>
const allHandlers = new Map()
/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
  if (allHandlers.has(root)) {
    allHandlers.get(root).push([predicate, handler])
    return
  }
  allHandlers.set(root, [[predicate, handler]])
  // attach the real handler
  root.addEventListener('click', function(e) {
    // from e.target -> root
    // check if element shoulded applied witht handler
    let el = e.target
    const handlers = allHandlers.get(root)
    let isPropagationStopped = false
    e.stopPropagation = () => {
      isPropagationStopped = true
    }
    while (el) {
      
      let isImmediatePropagationStopped = false
      e.stopImmediatePropagation = () => {
        isImmediatePropagationStopped = true
        isPropagationStopped = true
      }
      for (const [predicate, handler] of handlers) {
        if (predicate(el)) {
          handler.call(el, e)
          // check immediatepropagtion
          if (isImmediatePropagationStopped) {
            break
          }
        }
      }
      // check propagation
      if (el === root || isPropagationStopped) break
      el = el.parentElement
    }
  }, false)
}


/*********************************** */



/**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
    if (root.handlers) {
      root.handlers.push([predicate, handler]);
    } else {
      const orginalstopImmediatePropagation = Event.prototype.stopImmediatePropagation;
      Event.prototype.stopImmediatePropagation = function () {
        this.immediatePropagationStopped = true;
        orginalstopImmediatePropagation.apply(this, arguments); 
      }
      root.addEventListener('click', function (e) {
        let node = e.target;
        while (node !== root) {
          for (const [p, h] of root.handlers) {
            if (p(node)) h.call(node, e);
            if (e.immediatePropagationStopped) return
          }
          if (e.cancelBubble) return;
          node = node.parentElement;
        }
      });
      root.handlers = [[predicate, handler]];
    }
  }
  


  /********************************************* */

  /**
 * @param {HTMLElement} root
 * @param {(el: HTMLElement) => boolean} predicate
 * @param {(e: Event) => void} handler
 */
function onClick(root, predicate, handler) {
    // if cache doesn't exist, it's the first time we invoke this function
    if (!root.cache) {
      // we want to modify the stopImmediatePropagation to add a flag so that it will signal us to stop
      // running the handlers right after the first one.
      Event.prototype.stopImmediatePropagation = (function(protoMethod) {
        return function() {
          this.__stopPropagationImmediately = true;
          protoMethod.apply(this, arguments);
        }
      // maintains the original Event.prototype.stopImmediatePropagation
      })(Event.prototype.stopImmediatePropagation);
      // we do the same for stopPropagation but we add a different flag to differentiate them
      // technically, the default Event.cancelBubble works but it's a feature that's no longer recommended
      Event.prototype.stopPropagation = (function(protoMethod) {
        return function() {
          this.__stopPropagation = true;
          protoMethod.apply(this, arguments);
        }
      // maintains the original Event.prototype.stopPropagation
      })(Event.prototype.stopPropagation);
      root.addEventListener('click', function (event) {
        let node = event.target;
        // add the event bubbling behavior, where we start invoking the handlers
        // from the target element all the way up until parentElement is null
        while (node !== root) {
          for (const { predicate, handler } of root.cache) {
            if (predicate(node)) handler.call(node, event);
            // if stopPropagationImmediately is called, we shouldn't run the other handlers
            // see: https://developer.mozilla.org/en-US/docs/Web/API/Event/stopImmediatePropagation
            if (event.__stopPropagationImmediately) return ;
          }
          // if stopPropagation is called, we run all handlers but stop right after the target node
          // see: https://developer.mozilla.org/en-US/docs/Web/API/Event/stopPropagation
          if (event.__stopPropagation) return;
          node = node.parentElement;
        }
      })
      root.cache = [{
        predicate,
        handler,
      }]
    } else {
      // if the eventListener has been setup, simply append the handlers and it's predicate
      root.cache.push({ predicate, handler });
    }
  }