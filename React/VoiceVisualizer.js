import React from "react";
import styles from "./index.module.css";
import PropTypes from "prop-types";

const VoiceVisualizer = ({ level }) => {
  level = level > 10 ? 9 : level;
  const height = level * 10;
  //const randomNumber = Math.random();
  const siblingHeight = height * 0.7;

  return (
    <div className={styles.wrapper}>
      <span style={{ height: `${siblingHeight}%` }}></span>
      <span style={{ height: `${height}%` }}></span>
      <span style={{ height: `${siblingHeight}%` }}></span>
    </div>
  );
};

VoiceVisualizer.propTypes = {
  level: PropTypes.number.isRequired
};

VoiceVisualizer.defaultProps = {
  level: 1
};

export default VoiceVisualizer;



//index.module.css
.wrapper {
    width: 30px;
    height: 50px;
    position: relative;
    text-align: center;
    line-height: 50px;
  }
  
  .wrapper > span {
    display: inline-block;
    width: 10px;
    height: 10%;
    background: green;
    border-radius: 20%;
    transition: height 0.05s ease-in-out;
    margin: 0 2px;
    vertical-align: bottom;
  }




  import React, { Component } from "react";
import VoiceVisualizer from "./index";

class VoiceVisualizerTest extends Component {
  state = {
    level: 1
  };

  componentDidMount = () => {
    this.interval = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 10);
      this.setState({ level: randomNumber });
    }, 100);
  };

  componentWillUnmount = () => {
    clearInterval(this.interval);
  };

  render() {
    const { level } = this.state;
    return <VoiceVisualizer level={level} />;
  }
}

export default VoiceVisualizerTest;