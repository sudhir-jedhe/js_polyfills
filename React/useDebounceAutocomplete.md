import React, { useState, useCallback, useRef } from "react";
import cx from "classnames";
import "./index.module.css";

const useDebounce = (fn, delay, immediate = false) => {
  // ref the timer
  const timerId = useRef();

  // create a memoized debounce
  const debounce = useCallback(
    function () {
      // reference the context and args for the setTimeout function
      let context = this,
        args = arguments;

      // should the function be called now? If immediate is true
      // and not already in a timeout then the answer is: Yes
      const callNow = immediate && !timerId.current;

      // base case
      // clear the timeout to assign the new timeout to it.
      // when event is fired repeatedly then this helps to reset
      clearTimeout(timerId.current);

      // set the new timeout
      timerId.current = setTimeout(function () {
        // Inside the timeout function, clear the timeout variable
        // which will let the next execution run when in 'immediate' mode
        timerId.current = null;

        // check if the function already ran with the immediate flag
        if (!immediate) {
          // call the original function with apply
          fn.apply(context, args);
        }
      }, delay);

      // immediate mode and no wait timer? Execute the function immediately
      if (callNow) fn.apply(context, args);
    },
    [fn, delay, immediate]
  );

  return debounce;
};

const ITEMS_API_URL = "https://demo.dataverse.org/api/search";

const DEBOUNCE_DELAY = 1000;

const AutoComplete = ({onChange, onSelectItem}) => {
  const [inputStr, setInputStr] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState({status: false, message: {}});

  const fetchItems = async () => {
    setIsLoading(true);

    try {
      //Update the state
      const res = await fetch(`${ITEMS_API_URL}?q=${inputStr}`);
      const json = await res.json();
      const { data } = json;
      const { items } = data;
      setItems(items);

      //Return the data to the parent
      onChange && onChange(items);
    } catch (e) {
      setError({
          status: true,
          message: e
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const delayedCallback = useDebounce(fetchItems, DEBOUNCE_DELAY);

  const onInputChangeHandler = e => {
    const { value } = e.target;

    setInputStr(value);

    delayedCallback();
  };

  const onItemClick = (e) => {
    //Notify the parent
    onSelectItem && onSelectItem(e);
  }  

  //Generate the list of returned suggestions
  const list = items.map((e, i) => (
    <span
      key={e.name + i}
      onClick={() => onItemClick(e)}
      className={"listItem"}
    >
      {e.name}
    </span>
  ));

  //Can we show the suggestions
  const canShow = list.length > 0 && !isLoading;
  return (
    <div className={"wrapper"}>
      {/* Add loading state to the search area */}
      <div
        className={cx("control", {
          ["isLoading"]: isLoading
        })}
      >
        {/* Search box */}
        <input
          type="search"
          className={"searchBox"}
          onChange={onInputChangeHandler}
        />
      </div>

      {/* Show the suggestion list*/}
      {canShow && (
        <div className={cx("displayArea", "isHoverable")}>
          {list}
        </div>
      )}
    </div>
  );
}

export default AutoComplete;





//index.module.css
.wrapper {
    display: inline-flex;
    position: relative;
    flex-direction: column;
  }
  
  .searchBox {
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 14px;
    color: #607d8b;
    cursor: pointer;
  }
  
  .displayArea {
    position: relative;
    left: 1px;
    top: 8px;
    max-width: 200px;
    min-height: 100px;
    background: #f5f0f0;
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 3px;
    padding: 5px;
  }
  
  .listItem {
    padding: 5px 0;
    display: block;
    border-bottom: 1px solid #37474f;
    color: #ff9800;
  }
  
  .listItem:last-child {
    border: none;
  }