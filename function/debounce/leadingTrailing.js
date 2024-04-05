Debouncing is a technique that is used in programming to reduce the function invocation.

It runs with the assumption that rather than invoking the functions on every action, allows the user to complete their thought process and invoke the function only after a certain buffer between two actions.

For example, if the user is typing something in the search box, rather than making a network request on every word that the user types, we should allow the user to finish typing and only when he stops for X amount of time, the function to make a network request should be invoked.

It is one of the classic frontend interview questions, but because the classic debounce has been common, nowadays its variation is asked during interviews like debounce with immediate flag.

This is another variation of debounce in which we have to use the trailing and leading options.

If trailing is enabled, the debounce will invoke after the delay just like classic implementation. If leading is enabled, it will invoke at the beginning. If both are enabled then it will invoke twice at the beginning and after the delay.


const debounce = (fn, delay, option = { leading: true, trailing: true}) => {
    let timeout;
    let isLeadingInvoked = false;
    
    return function (...args) {
      const context = this;
      
      //base condition
      if(timeout){
        clearTimeout(timeout);
      }
      
      // handle leading
      if(option.leading && !timeout){
        fn.apply(context, args);
        isLeadingInvoked = true;
      }else{
        isLeadingInvoked = false;
      }
      
      // handle trailing
      timeout = setTimeout(() => {
        if(option.trailing && !isLeadingInvoked){
          fn.apply(context, args);
        }
        
        timeout = null;
      }, delay);
    }
  }

  const onChange = (e) => {
    console.log(e.target.value);
  }
  
  const debouncedSearch = debounce(onChange, 1000);
  
  const input = document.getElementById("search");
  input.addEventListener('keyup', debouncedSearch);