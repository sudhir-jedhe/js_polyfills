const Loader = ({ numberOfDots }) => {
    const renderDots = (dots) => {
      const arrayOfDots = new Array(dots).fill(' ');
      return arrayOfDots.map((dot, index) => (
        <div
          className="dot"
          style={{ animationDelay: `${index * 100}ms`}}
        />
      ))
    }
  
    return(
      <div className="loader">
        {renderDots(numberOfDots)}
      </div>
    );
  };
  
  export default Loader;
  

  * {
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
  -webkit-font-smoothing: auto;
  -moz-font-smoothing: auto;
  -moz-osx-font-smoothing: grayscale;
  font-smoothing: auto;
  text-rendering: optimizeLegibility;
  font-smooth: always;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
}

main {
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.loader {
  display: flex;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  background-color: #414141;
  border-radius: 50%;
  animation: bounce 0.5s infinite alternate;
}

@keyframes bounce {
  100% {
    translate: 0 -10px;
  }
}


/*************************** */

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const Loader = props => {
  const { image, fullScreen, bgColor, loaderColor, width, height } = props;
  const { top, bottom, left, right } = loaderColor;

  const loaderStyle = {
    borderTopColor: top,
    borderBottomColor: bottom,
    borderLeftColor: left,
    borderRightColor: right,
    width,
    height
  };

  return (
    <div
      className={cx(styles.loaderArea, {
        [styles.fullscreen]: fullScreen
      })}
      style={{ backgroundColor: bgColor }}
    >
      {image ? (
        image
      ) : (
        <div className={styles.loader} style={loaderStyle}></div>
      )}
    </div>
  );
};

Loader.propTypes = {
  image: PropTypes.element,
  fullScreen: PropTypes.bool.isRequired,
  bgColor: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
  loaderColor: PropTypes.shape({
    top: PropTypes.string,
    bottom: PropTypes.string,
    left: PropTypes.string,
    right: PropTypes.string
  }).isRequired
};

Loader.defaultProps = {
  image: null,
  fullScreen: false,
  bgColor: "rgba(0, 0, 0, 0)",
  loaderColor: {
    top: "blue",
    bottom: "pink",
    left: "green",
    right: "red"
  },
  width: "140px",
  height: "140px"
};

export default Loader;


//index.module.css
.loaderArea {
  display: inline-block;
}

.fullscreen {
  position: fixed;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.loader {
  border: 16px solid #f3f3f3;
  border-top: 16px solid #3498db;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}



import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Loader from "./Components/Loader";
import * as serviceWorker from "./serviceWorker";
import image from "./loader.gif";

ReactDOM.render(
  <div className="abc">
    {/* With image */}
    <Loader
      image={
        <img
          src={image}
          alt="loader"
          style={{ display: "inline-block", verticalAlign: "middle" }}
        />
      }
      fullScreen={true}
    />

    {/* default */}
    <Loader
      fullScreen={true}
      width="120px"
      height="120px"
      bgColor="rgba(0,0,0,.5)"
    />
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

/****************************** */



import { useState } from "react";

function getRandomBool(n) {
  const threshold = 1000;
  if (n > threshold) n = threshold;
  return Math.floor(Math.random() * threshold) % n === 0;
}

const FAILURE_COUNT = 10;
const LATENCY = 1000;

function mockServer() {
  return new Promise((resolve, reject) => {
    const randomTimeout = Math.random() * LATENCY;
    setTimeout(() => {
      if (getRandomBool(FAILURE_COUNT)) {
        reject();
      } else {
        resolve();
      }
    }, randomTimeout);
  });
}

export default function App() {
  const [isLoading, setLoading] = useState(false);
  const [apiData, setApiData] = useState("");

  const handleClick = async () => {
    try {
      setLoading(true);
      let resp = await mockServer();
      setApiData("Hello World");
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={handleClick}>Make api call</button>

      {isLoading ? <Loader /> : <p>{apiData ? "Api call complete" : ""}</p>}
    </div>
  );
}

const Loader = () => {
  return <p>Loading</p>;
};