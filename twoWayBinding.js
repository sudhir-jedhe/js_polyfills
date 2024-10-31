/**
 * @param {{value: string}} state
 * @param {HTMLInputElement} element
 */
function model(state, element) {
    // 1. initialized the element value with state value
    element.value = state.value
    // 2. Two conditions: 
    // (1) Update the state value, then it will also update element value with new state value
    // (2) Update input element value, then it will also update state value with element value
    Object.defineProperty(state, 'value', {
      get() { return element.value },
      set(new_value) { element.value = new_value; return }
    })
    element.addEventListener('change', (event) => {
      // this will update state value then `state's` setter method will update input value
      state.value = event.target.value;
    })
  }


  /***************************** */

  function model(state, element) {
    element.value = state.value;
    Object.defineProperty(state, 'value', {
      get: () => element.value,
      set: (value) => element.value = value
    })
  }

  
  /**************************** */


  /**
 * @param {{value: string}} state
 * @param {HTMLInputElement} element
 */
function model(state, element) {
    let stateValue
    
    function syncState(newVal) {
      stateValue = newVal
      element.value = newVal
    }
    // initialize
    syncState(state.value)
    // stateValue will be update after 'change' event is triggered 
    element.addEventListener('change', function (e) {
      stateValue = e.target.value
    })
    Object.defineProperty(state, 'value', {
      get() {
        return stateValue
      },
      set: syncState,
    })
  }

  
  