import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

class ScrollTop extends Component {
  state = {
    scrolled: 0
  };

  static propTypes = {
    scrollStepInPx: PropTypes.number.isRequired,
    delayInMs: PropTypes.number.isRequired,
    placement: PropTypes.oneOf(["left", "right"]).isRequired,
    showAfterInPx: PropTypes.number.isRequired
  };

  static defaultProps = {
    scrollStepInPx: 50,
    delayInMs: 16.66,
    placement: "right",
    showAfterInPx: 100
  };

  componentDidMount() {
    window.addEventListener("scroll", this.trackScrollPosition);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", () => {});
  }

  //How much page is scrolled
  trackScrollPosition = () => {
    this.setState({
      scrolled: window.pageYOffset
    });
  };

  //Scroll step by step
  scrollStep = () => {
    const { scrollStepInPx } = this.props;
    if (window.pageYOffset === 0) {
      clearInterval(this.timer);
    }
    window.scroll(0, window.pageYOffset - scrollStepInPx);
  };

  //Start scrolling to top
  scrollToTop = () => {
    const { delayInMs } = this.props;

    this.timer = setInterval(() => {
      this.scrollStep();
    }, delayInMs);
  };

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  render() {
    const { scrolled } = this.state;
    const { placement, showAfterInPx } = this.props;

    //If not in visibility the return null
    if (scrolled < showAfterInPx) {
      return null;
    }

    //Render the button
    return (
      <span
        title="Back to top"
        className={cx(styles.scroll, styles[placement])}
        onClick={this.scrollToTop}
      >
        Top
      </span>
    );
  }
}

export default ScrollTop;


/************* */


//index.module.css
.scroll {
    position: fixed;
    width: 60px;
    height: 60px;
    border-radius: 5px;
    bottom: 20px;
    background-color: red;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  
  .left {
    left: 20px;
  }
  
  .right {
    right: 20px;
  }
  /*****/
  import React from "react";
  import ReactDOM from "react-dom";
  import "./index.css";
  import ScrollTop from "./Components/ScrollTop";
  import * as serviceWorker from "./serviceWorker";
  
  const divs = ["purple", "green", "yellow", "blue"].map(e => (
    <div key={e} style={{ height: "100vh", backgroundColor: e }}></div>
  ));
  
  ReactDOM.render(
    <div className="abc">
      {divs}
      <ScrollTop />
    </div>,
    document.getElementById("root")
  );
  
  // If you want your app to work offline and load faster, you can change
  // unregister() to register() below. Note this comes with some pitfalls.
  // Learn more about service workers: https://bit.ly/CRA-PWA
  serviceWorker.unregister();
  /******************** */