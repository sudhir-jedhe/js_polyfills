import React, { useEffect, useState, useRef } from "react";

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

export { countAnimate, CountSetInterval, CountSetTimeout };



import React, { useState, useRef } from "react";
import {
  countAnimate,
  CountSetInterval,
  CountSetTimeout,
} from "./CountMethods";

const App = () => {
  const [inputValue, setInputValue] = useState(0);
  const [duration, setDuration] = useState(0);
  const [start, setStart] = useState(false);
  const countRef = useRef();

  const basicReset = () => {
    setStart(false);
    countRef.current.innerHTML = "0";
  };

  const inputChangeHandler = (e) => {
    const { value } = e.target;
    setInputValue(value);
    basicReset();
  };

  const durationChangeHandler = (e) => {
    const { value } = e.target;
    setDuration(value);
    basicReset();
  };

  const startHandler = () => {
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
          SetTimeout:{" "}
          {(start && (
            <CountSetTimeout
              label={"count"}
              number={inputValue}
              duration={parseInt(duration)}
            />
          )) ||
            0}
        </div>
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
        <div>
          Animate: <span ref={countRef}>0</span>
        </div>
      </section>
    </main>
  );
};

export default App;