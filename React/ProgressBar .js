import React, { PureComponent } from "react";
import cx from "classnames";
import PropTypes from "prop-types";
import styles from "./index.module.css";

class ProgressBar extends PureComponent {
  static propTypes = {
    /* Custom color for progress bar */
    color: PropTypes.string,
    size: PropTypes.oneOf(["xs", "sm", "md", "lg", "xl"]).isRequired,
    /* starts progress bar */
    visible: PropTypes.bool,
    /* provide a function to perform actions when progress reaches 100%  */
    onCompleteHandler: PropTypes.func,
    /* Any custom class to modify the appearance for future requ. */
    className: PropTypes.string,
    /* percentage to increment the progress bar */
    percentage: PropTypes.number,
    children: PropTypes.node
  };

  static defaultProps = {
    visible: false,
    size: "xs",
    className: "",
    progress: 0
  };

  componentDidUpdate() {
    const { percentage, onCompleteHandler } = this.props;
    if (percentage === 100) {
      onCompleteHandler();
    }
  }

  render() {
    const _class = cx(
      this.props.className,
      styles.progress,
      styles[this.props.size]
    );

    const _style = {
      ...(this.props.color && {
        backgroundColor: this.props.color
      }),
      width: `${this.props.percentage < 100 ? this.props.percentage : 100}%`
    };

    return (
      <div className={_class}>
        <div style={_style} className={styles.progress_bar}></div>
        {this.props.children}
      </div>
    );
  }
}

export default ProgressBar;


//index.module.css
:root {
    --base-size: 4px;
    --size-multiplier: 3;
  }
  
  .progress {
    background: #eee;
    position: relative;
    overflow: hidden;
    transition: width 0.3s ease-in;
    border-radius: 25px;
  }
  
  .progress .progress_bar {
    background: linear-gradient(45deg, #1d9241, #77de7b);
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    will-change: width;
    transition: width 0.3s;
    border-radius: 25px;
  }
  
  .xs {
    height: var(--base-size);
  }
  
  .sm {
    height: calc(var(--base-size) * var(--size-multiplier));
  }
  
  .md {
    height: calc(2 * var(--base-size) * var(--size-multiplier));
  }
  
  .lg {
    height: calc(3 * var(--base-size) * var(--size-multiplier));
  }
  
  .xl {
    height: calc(4 * var(--base-size) * var(--size-multiplier));
  }



  import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ProgressBar from "./Components/ProgressBar";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <div className="abc">
    <ProgressBar size="lg" visible={true} percentage={80} />
  </div>,
  document.getElementById("root")
);

/******************************************* */

import React, { useState, useEffect, useRef } from 'react';

function ProgressBar() {
  const [progress, setProgress] = useState(0); // Current progress percentage
  const [isRunning, setIsRunning] = useState(false); // Is the progress bar running?
  const [queue, setQueue] = useState([]); // Queue to handle multiple progress bars

  const intervalRef = useRef(null); // To keep track of the interval

  // Function to start the progress bar
  const startProgress = (duration) => {
    if (isRunning) {
      setQueue((prevQueue) => [...prevQueue, duration]);
      return;
    }
    setIsRunning(true);
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += (100 / duration);
      setProgress(Math.min(currentProgress, 100));

      if (currentProgress >= 100) {
        clearInterval(interval);
        setIsRunning(false);
        // Start the next progress if there is a queue
        if (queue.length > 0) {
          const nextDuration = queue.shift();
          setQueue([...queue]); // Trigger re-render with the updated queue
          startProgress(nextDuration); // Start the next one
        }
      }
    }, 1000);

    intervalRef.current = interval;
  };

  // Cleanup interval when the component unmounts or progress resets
  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div>
      <button onClick={() => startProgress(5)}>Start 5s Progress</button>
      <button onClick={() => startProgress(10)}>Start 10s Progress</button>

      <div style={{ width: '100%', backgroundColor: '#f3f3f3', height: '20px', marginTop: '20px' }}>
        <div
          style={{
            width: `${progress}%`,
            backgroundColor: 'green',
            height: '100%',
            transition: 'width 1s ease-out',
          }}
        ></div>
      </div>
      <div style={{ marginTop: '10px' }}>
        {isRunning ? `Progressing... ${Math.round(progress)}%` : 'Idle'}
      </div>
    </div>
  );
}

export default ProgressBar;


const fetchData = new Promise((resolve, reject) => {
  const success = true; // Simulating success or failure
  setTimeout(() => {
    if (success) {
      resolve('Data fetched successfully!');
    } else {
      reject('Error fetching data!');
    }
  }, 2000);
});

fetchData
  .then((data) => {
    console.log(data); // "Data fetched successfully!"
  })
  .catch((error) => {
    console.error(error); // If the promise is rejected
  });



  // const fetchData = async () => {
  //   try {
  //     const result = await new Promise((resolve, reject) => {
  //       const success = true;
  //       setTimeout(() => {
  //         if (success) {
  //           resolve('Data fetched successfully!');
  //         } else {
  //           reject('Error fetching data!');
  //         }
  //       }, 2000);
  //     });
  
  //     console.log(result); // "Data fetched successfully!"
  //   } catch (error) {
  //     console.error(error); // If the promise is rejected
  //   }
  // };
  
  // fetchData();
  


//   Key Differences:
// Feature	Promises	Async-Await
// Syntax	.then(), .catch()	                                                            async functions and await keyword
// Readability	Chaining can become harder to read (especially with multiple .then())	    More readable and looks synchronous
// Error Handling	.catch()	                                                            try-catch block
// Sequential Execution	Needs chaining or Promise.all	                                  Can use await to execute tasks sequentially


const fetchData1 = () => new Promise((resolve) => setTimeout(() => resolve('Data 1'), 2000));
const fetchData2 = () => new Promise((resolve) => setTimeout(() => resolve('Data 2'), 1000));

const fetchDataSequentially = async () => {
  try {
    const data1 = await fetchData1();
    console.log(data1); // "Data 1"
    const data2 = await fetchData2();
    console.log(data2); // "Data 2"
  } catch (error) {
    console.error('Error:', error);
  }
};

fetchDataSequentially();
