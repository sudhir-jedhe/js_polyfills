// Scroll indicator is used to indicate how much of a page has been scrolled, so that user gets a good idea about what is the length of the content.


import React, { Component } from "react";
import styles from "./index.module.css";

class ScrollIndicator extends Component {
  state = {
    scrolledPercentage: 0
  };

  calculateScrolledInPercentage = () => {
    //How much scrolled
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;

    //Full height
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    //Percentage scrolled
    const scrolledPercentage = (winScroll / height) * 100;

    //Update state
    this.setState({
      scrolledPercentage
    });
  };

  componentDidMount() {
    window.addEventListener("scroll", this.calculateScrolledInPercentage);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", () => {});
  }

  render() {
    const { scrolledPercentage } = this.state;

    return (
      <div className={styles.header}>
        <h1>Scroll Indicator</h1>
        <div className={styles.progressContainer}>
          {/* Update the width in percentage */}
          <div
            className={styles.progressBar}
            style={{ width: `${scrolledPercentage}%` }}
          ></div>
        </div>
      </div>
    );
  }
}

export default ScrollIndicator;




.header {
    position: fixed;
    top: 0;
    z-index: 1;
    width: 100%;
    background-color: #f44336;
    text-align: center;
    box-shadow: 0 1px 3px #000;
  }
  
  /* The progress container (grey background) */
  .progressContainer {
    width: 100%;
    height: 8px;
    background: #ccc;
  }
  
  /* The progress bar (scroll indicator) */
  .progressBar {
    height: 8px;
    background: #4caf50;
    width: 0%;
    transition: width 0.2s linear;
  }