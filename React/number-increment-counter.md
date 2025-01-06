//App.js
import React, { useState } from "react";

const App = () => {
  const [number, setNumber] = useState(0);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(false);
  
  //If any input changes reset
  const basicReset = () => {
    setStart(false);
  };
  
  //store number
  const numberChangeHandler = (e) => {
    const { value } = e.target;
    setNumber(value);
    basicReset();
  };
  
  //store duration
  const durationChangeHandler = (e) => {
    const { value } = e.target;
    setDuration(value);
    basicReset();
  };
  
  const startHandler = () => {
    // trigger the animation
  };

  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <main style={{ width: "500px", margin: "50px auto" }}>
      <section className="input-area">
        <div>
          <div>
            <label htmlFor="number">Number:</label>{" "}
            <input
              id="number"
              type="number"
              value={number}
              onChange={numberChangeHandler}
            />
          </div>
          <div>
            <label htmlFor="duration">Duration:</label>{" "}
            <input
              id="duration"
              type="number"
              value={duration}
              onChange={durationChangeHandler}
            />
          </div>
        </div>
        <br />
        <div>
          <button onClick={startHandler}>start</button>{" "}
          <button onClick={resetHandler}>reset</button>
        </div>
      </section>
    </main>
  );
};

export default App;



//CountMethods.js
import React, { useEffect, useState, useRef } from "react";

//setInterval
const CountSetInterval = (props) => {
  const intervalRef = useRef();
  const countRef = useRef();

  // label of counter
  // number to increment to
  // duration of count in seconds
  const { number, duration } = props;

  // number displayed by component
  const [count, setCount] = useState("0");

  // calc time taken for computation
  const [timeTaken, setTimeTaken] = useState(Date.now());

  useEffect(() => {
    let start = 0;
    // first three numbers from props
    const end = parseInt(number);
    // if zero, return
    if (start === end) return;

    // find duration per increment
    let totalMilSecDur = parseInt(duration);
    let incrementTime = (totalMilSecDur / end) * 1000;

    // timer increments start counter
    // then updates count
    // ends if start reaches end
    let timer = setInterval(() => {
      start += 1;

      //update uisng state
      setCount(String(start));

      //update using ref
      //   countRef.current.innerHTML = start;

      if (start === end) {
        clearInterval(timer);
        const diff = Date.now() - timeTaken;
        setTimeTaken(diff / 1000);
        
        //uncomment this when using ref
        // setCount(String(start));
      }
    }, incrementTime);

    // dependency array
  }, [number, duration]);

  return (
    <>
      <span ref={countRef} className="Count">
        {count}
      </span>{" "}
      {"     "}
      {number === count && (
        <span>
          | Took : <b>{timeTaken}</b> seconds to complete
        </span>
      )}
    </>
  );
};

import React, { useState } from "react";
import { CountSetInterval } from "./CountMethods";

const App = () => {
  const [number, setNumber] = useState(0);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(false);
  
  //If any input changes reset
  const basicReset = () => {
    setStart(false);
  };
  
  //store number
  const numberChangeHandler = (e) => {
    const { value } = e.target;
    setNumber(value);
    basicReset();
  };
  
  //store duration
  const durationChangeHandler = (e) => {
    const { value } = e.target;
    setDuration(value);
    basicReset();
  };
  
  const startHandler = () => {
    // trigger the animation
    setStart(true);
  };

  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <main style={{ width: "500px", margin: "50px auto" }}>
      <section className="input-area">
        <div>
          <div>
            <label>Number:</label>{" "}
            <input
              type="number"
              value={inputValue}
              onChange={inputChangeHandler}
            />
          </div>
          <div>
            <label>Duration:</label>{" "}
            <input
              type="number"
              value={duration}
              onChange={durationChangeHandler}
            />
          </div>
        </div>
        <br />
        <div>
          <button onClick={startHandler}>start</button>{" "}
          <button onClick={resetHandler}>reset</button>
        </div>
      </section>
      <br />
      <section className="result-area">
        <div>
          SetInterval:{" "}
          {(start && (
            <CountSetInterval
              label={"count"}
              number={inputValue}
              duration={parseInt(duration)}
            />
          )) ||
            0}
        </div>
      </section>
    </main>
  );
};

export default App;


//setTimeout
const CountSetTimeout = (props) => {
    const intervalRef = useRef();
    const countRef = useRef();
  
    // label of counter
    // number to increment to
    // duration of count in seconds
    const { number, duration } = props;
  
    // number displayed by component
    const [count, setCount] = useState("0");
  
    // calc time taken for computation
    const [timeTaken, setTimeTaken] = useState(Date.now());
  
    useEffect(() => {
      let start = 0;
      // first three numbers from props
      const end = parseInt(number);
      // if zero, return
      if (start === end) return;
  
      // find duration per increment
      let totalMilSecDur = parseInt(duration);
      let incrementTime = (totalMilSecDur / end) * 1000;
  
      // timer increments start counter
      // then updates count
      // ends if start reaches end
      let counter = () => {
        intervalRef.current = setTimeout(() => {
          start += 1;
  
          //update using state
          setCount(String(start));
  
          //update using ref
          // countRef.current.innerHTML = start;
          counter();
  
          if (start === end) {
            clearTimeout(intervalRef.current);
            const diff = Date.now() - timeTaken;
  
            //uncomment this when using ref
            //   setCount(String(start));
            setTimeTaken(diff / 1000);
          }
        }, incrementTime);
      };
  
      //invoke
      counter();
  
      // dependency array
    }, [number, duration]);
  
    return (
      <>
        <span ref={countRef} className="Count">
          {count}
        </span>{" "}
        {"     "}
        {number === count && (
          <span>
            | Took : <b>{timeTaken}</b> seconds to complete
          </span>
        )}
      </>
    );
  };




  import React, { useState } from "react";
import { CountSetTimeout } from "./CountMethods";

const App = () => {
  const [number, setNumber] = useState(0);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(false);
  
  //If any input changes reset
  const basicReset = () => {
    setStart(false);
  };
  
  //store number
  const numberChangeHandler = (e) => {
    const { value } = e.target;
    setNumber(value);
    basicReset();
  };
  
  //store duration
  const durationChangeHandler = (e) => {
    const { value } = e.target;
    setDuration(value);
    basicReset();
  };
  
  const startHandler = () => {
    // trigger the animation
    setStart(true);
  };

  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <main style={{ width: "500px", margin: "50px auto" }}>
      <section className="input-area">
        <div>
          <div>
            <label>Number:</label>{" "}
            <input
              type="number"
              value={inputValue}
              onChange={inputChangeHandler}
            />
          </div>
          <div>
            <label>Duration:</label>{" "}
            <input
              type="number"
              value={duration}
              onChange={durationChangeHandler}
            />
          </div>
        </div>
        <br />
        <div>
          <button onClick={startHandler}>start</button>{" "}
          <button onClick={resetHandler}>reset</button>
        </div>
      </section>
      <br />
      <section className="result-area">
        <div>
          SetInterval:{" "}
          {(start && (
            <CountSetTimeout
              label={"count"}
              number={inputValue}
              duration={parseInt(duration)}
            />
          )) ||
            0}
        </div>
      </section>
    </main>
  );
};

export default App;


// This is taking more time than the setInterval.

// Why is this happening?.

// If you read the definition of each of these methods you will realize that.

// setTimeout: This method sets a timer which executes a function or specified piece of code once the timer expires.
// setInterval: This method repeatedly calls a function or executes a code snippet, with a fixed time delay between each call.
// Which means the time specified for either of these functions are the minimum time, but it can take longer than that.

// After some research on MDN, I found out that there are two major reasons which is causing the delay.

// 1. Clamping.

// In modern browsers, setTimeout()/setInterval() calls are throttled to a minimum of once every 4 ms when successive calls are triggered due to callback nesting (where the nesting level is at least a certain depth), or after certain number of successive intervals.

// 2.Execution context

// The timer can also fire later when the page (or the OS/browser itself) is busy with other tasks. One important case to note is that the function or code snippet cannot be executed until the thread that called setTimeout() has terminated.

// It turns out that, setTimeout or setInterval function won’t function properly when

// Delay is less than 4 ms.
// There is execution happening inside timer functions which is blocking the next execution.
// If we can somehow avoid using the timer functions, we should be able to solve this problem. But is there a way without using them?.

// After googling for some time, I found out that there is a solution for this.

// Using requestAnimationFrame method.
// Using this method we can come up with a solution which would increment the count from 0 to the specified number in given duration.

// First, let us understand what is this method.

// According to MDN –

// The window.requestAnimationFrame() method tells the browser that you wish to perform an animation and requests that the browser calls a specified function to update an animation before the next repaint. The method takes a callback as an argument to be invoked before the repaint.

// In simple terms what this method does is ask’s browser to perform animation, which in turn refreshes the screen very fast. At-least 60 frames per second to perform animations.

// Now how this is useful in creating a increment counter?.

// Read this text from MDN for better understanding.

// You should call this method whenever you’re ready to update your animation onscreen. This will request that your animation function be called before the browser performs the next repaint. The number of callbacks is usually 60 times per second, but will generally match the display refresh rate in most web browsers as per W3C recommendation.

// This function takes a callback function and pass current timestamp to that callback function as argument.

// Now using a startTime variable which stores the time before invoking the function and this current timestamp which we receive in the callback every time, we can recursively invoke this function for the given duration and using a good calculation we can increment the count.

// Considering at-least 60 frames are refreshed in one second, which means if we have to count from 0 to 1000 in 1 second we should be incrementing the number by 60/1000 = ~16.667 using which we can come with clever calc which will increment the number based on much time has passed of animation.

// Depend upon how often this function is invoked we will see an increment animation happening on the screen.

// For bigger numbers this is not incrementing the count by 1 but still the animation is happening so fast that human eyes will not be able to differentiate.


//Animation
const countAnimate = (obj, initVal, lastVal, duration) => {
    let startTime = null;
  
    //get the current timestamp and assign it to the currentTime variable
    let currentTime = Date.now();
  
    //pass the current timestamp to the step function
    const step = (currentTime) => {
      //if the start time is null, assign the current time to startTime
      if (!startTime) {
        startTime = currentTime;
      }
  
      //calculate the value to be used in calculating the number to be displayed
      const progress = Math.min((currentTime - startTime) / duration, 1);
  
      //calculate what to be displayed using the value gotten above
      obj.innerHTML = Math.floor(progress * (lastVal - initVal) + initVal);
  
      //checking to make sure the counter does not exceed the last value (lastVal)
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        window.cancelAnimationFrame(window.requestAnimationFrame(step));
  
        // add time diff
        const diff = currentTime - startTime;
        const elm = document.createElement("SPAN");
        elm.innerHTML = `  | Took : <b>${diff / 1000}</b> seconds to complete`;
        obj.appendChild(elm);
      }
    };
  
    //start animating
    window.requestAnimationFrame(step);
  };


  import React, { useState, useRef } from "react";
import { countAnimate } from "./CountMethods";

const App = () => {
  const [number, setNumber] = useState(0);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(false);
  const countRef = useRef();

  //If any input changes reset
  const basicReset = () => {
    setStart(false);
    countRef.current.innerHTML = "0";
  };
  
  //store number
  const numberChangeHandler = (e) => {
    const { value } = e.target;
    setNumber(value);
    basicReset();
  };
  
  //store duration
  const durationChangeHandler = (e) => {
    const { value } = e.target;
    setDuration(value);
    basicReset();
  };
  
  const startHandler = () => {
    // trigger the animation
    setStart(true);
    countAnimate(
      countRef.current,
      0,
      parseInt(inputValue),
      parseInt(duration) * 1000
    );
  };

  const resetHandler = () => {
    window.location.reload();
  };

  return (
    <main style={{ width: "500px", margin: "50px auto" }}>
      <section className="input-area">
        <div>
          <div>
            <label>Number:</label>{" "}
            <input
              type="number"
              value={inputValue}
              onChange={inputChangeHandler}
            />
          </div>
          <div>
            <label>Duration:</label>{" "}
            <input
              type="number"
              value={duration}
              onChange={durationChangeHandler}
            />
          </div>
        </div>
        <br />
        <div>
          <button onClick={startHandler}>start</button>{" "}
          <button onClick={resetHandler}>reset</button>
        </div>
      </section>
      <br />
      <section className="result-area">
        <div>
          Animate: <span ref={countRef}>0</span>
        </div>
      </section>
    </main>
  );
};

export default App;