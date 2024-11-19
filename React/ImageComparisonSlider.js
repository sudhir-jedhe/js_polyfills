import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
import cx from "classnames";

class ImageComparisonSlider extends Component {
  static propTypes = {
    image1: PropTypes.string.isRequired,
    image2: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired
  };

  static defaultProps = {
    width: "500px",
    height: "500px"
  };

  state = {
    canStart: false,
    imageWidth: 0
  };

  slideStart = e => {
    e.preventDefault();
    this.setState({
      canStart: true
    });
  };

  slideEnd = e => {
    e.preventDefault();
    this.setState({
      canStart: false
    });
  };

  componentDidMount() {
    //Image sliding
    window.addEventListener("mousemove", this.slideMove);
    window.addEventListener("touchmove", this.slideMove);

    //Sliding stopped
    window.addEventListener("mouseup", this.slideEnd);
    window.addEventListener("touchend", this.slideEnd);

    if (this.imageRef) {
      this.setState({
        imageWidth: this.imageRef.offsetWidth
      });
    }
  }

  slideMove = e => {
    let pos,
      w = this.state.imageWidth;
    const { canStart } = this.state;

    //If not ready then return false
    if (!canStart) return false;

    //If image and slider ref not ready then return false
    if (!this.sliderRef || !this.overlayRef) return false;

    /* Get the cursor's x position: */
    pos = this.getCursorPos(e);

    /* Prevent the slider from being positioned outside the image: */
    if (pos < 0) pos = 0;
    if (pos > w) pos = w;

    /* Execute a function that will resize the overlay image according to the cursor: */
    this.slide(pos);
  };

  getCursorPos = e => {
    let a,
      x = 0;
    e = e || window.event;

    /* Get the x positions of the image: */
    a = this.imageRef.getBoundingClientRect();

    /* Calculate the cursor's x coordinate, relative to the image: */
    x = e.pageX - a.left;

    /* Consider any page scrolling: */
    x = x - window.pageXOffset;

    return x;
  };

  slide = x => {
    /* Resize the image: */
    this.overlayRef.style.width = x + "px";
    /* Position the slider: */
    this.sliderRef.style.left = x + "px";
  };

  componentWillUnmount() {
    window.removeEventListener("mouseup", () => {});
    window.removeEventListener("touchend", () => {});
    window.removeEventListener("mousemove", () => {});
    window.removeEventListener("touchmove", () => {});
  }

  render() {
    const { image1, image2, width, height } = this.props;

    const events = {
      onMouseDown: this.slideStart,
      onTouchStart: this.slideStart
    };

    const dimension = {
      width,
      height
    };

    return (
      <div className={styles.container} style={dimension}>
        <div className={styles.image}>
          <img src={image1} style={dimension} alt="Compare 1" />
        </div>
        <div
          className={cx(styles.image, styles.overlay)}
          ref={e => (this.overlayRef = e)}
        >
          <img
            src={image2}
            ref={e => (this.imageRef = e)}
            style={dimension}
            alt="Compare 2"
          />
        </div>
        <span
          className={styles.slider}
          {...events}
          ref={e => (this.sliderRef = e)}
        ></span>
      </div>
    );
  }
}

export default ImageComparisonSlider;


.container {
    position: relative;
    display: inline-block;
    box-shadow: 0 1px 3px #000;
  }
  
  .image {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }
  
  .image > img {
    display: inline-block;
    vertical-align: middle;
  }
  
  .overlay {
    width: 50%;
    z-index: 1;
  }
  
  .slider {
    position: absolute;
    width: 50px;
    height: 50px;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    z-index: 2;
    background-color: red;
    border-radius: 50%;
    cursor: ew-resize;
  }


  import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ImageComparisonSlider from "./Components/ImageComparisonSlider";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <div className="abc">
    <ImageComparisonSlider
      image1={
        "https://cdn.pixabay.com/photo/2019/12/30/13/10/lost-places-4729640_1280.jpg"
      }
      image2={
        "https://cdn.pixabay.com/photo/2018/09/16/15/31/boy-3681679_1280.jpg"
      }
    />
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();