import React, { useRef } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const ImageZoom = props => {
  const {
    imageURL,
    zoomImageURL,
    placement,
    imageSize,
    zoomedImageSize,
    isActive,
    zoomType
  } = props;

  let normalImageRef = useRef();
  let zoomedImageRef = useRef();

  //Set the style of normal image
  const normalImageStyle = {
    backgroundImage: `url(${imageURL})`,
    backgroundSize: `${imageSize.width}px ${imageSize.height}px`,
    width: `${imageSize.width}px`,
    height: `${imageSize.height}px`
  };

  //Set the style of zoomed image
  const zoomedImageStyle = {
    backgroundImage: `url(${zoomImageURL || imageURL})`,
    backgroundSize:
      zoomType === "click"
        ? `${zoomedImageSize.width}px ${zoomedImageSize.height}px`
        : `${zoomedImageSize.width * 1.5}px ${zoomedImageSize.height * 1.5}px`,
    backgroundRepeat: "no-repeat",
    width: `${zoomedImageSize.width}px`,
    height: `${zoomedImageSize.height}px`
  };

  //Set the events based on the type
  const eventType =
    zoomType === "click"
      ? {
          onClick: isActive ? closeZoom : openZoom
        }
      : {
          onMouseMove: openZoom,
          onMouseLeave: closeZoom,
          onTouchMove: openZoom,
          onTouchEnd: closeZoom,
          onTouchCancel: closeZoom
        };

  //Show image
  const openZoom = e => {
    if (zoomedImageRef.current) {
      moveLens(e);
    }

    const { onZoom } = props;
    onZoom && onZoom();
  };

  //Hide image
  const closeZoom = () => {
    const { onClose } = props;
    onClose && onClose();
  };

  //Get cursor position
  const getCursorPos = e => {
    let a,
      x = 0,
      y = 0;
    e = e || window.event;

    /* Get the x and y positions of the image: */
    a = normalImageRef.current.getBoundingClientRect();

    /* Calculate the cursor's x and y coordinates, relative to the image: */
    x = e.pageX - a.left;
    y = e.pageY - a.top;

    /* Consider any page scrolling: */
    x = x - window.pageXOffset;
    y = y - window.pageYOffset;

    return { x: x, y: y };
  };

  //Focus over the zommed image
  const moveLens = e => {
    const viewArea = zoomedImageRef.current;
    /* Prevent any other actions that may occur when moving over the image */
    e.preventDefault();

    /* Get the cursor's x and y positions: */
    const { x, y } = getCursorPos(e);

    //Move the zoomed image
    viewArea.style.backgroundPosition = `-${x}px -${y}px`;
  };

  return (
    <>
      {/* Actual Image */}
      <div
        className={cx(styles.normalImage, {
          [styles.zoomOutCursor]: isActive
        })}
        style={normalImageStyle}
        ref={normalImageRef}
        {...eventType}
      >
        {/* Zoomed Image View Area */}
        {isActive && (
          <div
            className={cx(styles.zoomedImage, styles[placement])}
            style={zoomedImageStyle}
            ref={zoomedImageRef}
          ></div>
        )}
      </div>
    </>
  );
};

ImageZoom.propTypes = {
  imageURL: PropTypes.string.isRequired,
  zoomImageURL: PropTypes.string.isRequired,
  placement: PropTypes.oneOf([
    "top-left",
    "top-right",
    "bottom-left",
    "bottom-right",
    "center"
  ]).isRequired,
  imageSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  zoomedImageSize: PropTypes.shape({
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired
  }),
  isActive: PropTypes.bool.isRequired,
  onZoom: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  zoomType: PropTypes.oneOf(["click", "hover"]).isRequired
};

ImageZoom.defaultProps = {
  zoomImageURL: "",
  placement: "top-right",
  imageSize: {
    width: 300,
    height: 300
  },
  zoomedImageSize: {
    width: 600,
    height: 600
  },
  isActive: false,
  zoomType: "hover"
};

export default ImageZoom;



.normalImage {
    cursor: zoom-in;
    position: relative;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  .zoomedImage {
    position: absolute;
    z-index: 999;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
  }
  
  .zoomOutCursor {
    cursor: zoom-out;
  }
  
  .center {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .top-left {
    top: 0;
    left: -110%;
  }
  
  .top-right {
    top: 0;
    left: 110%;
  }
  
  .bottm-left {
    bottom: 0;
    left: -110%;
  }
  
  .bottom-right {
    bottom: 0;
    left: 110%;
  }


  import React, { Component } from "react";
import ImageZoom from "./index";

class ImageZoomTest extends Component {
  state = {
    isActive: false
  };

  onClose = () => {
    this.setState({
      isActive: false
    });
  };

  onZoom = () => {
    this.setState({
      isActive: true
    });
  };

  render() {
    const { isActive } = this.state;
    return (
      <ImageZoom
        isActive={isActive}
        imageURL={
          "https://cdn.pixabay.com/photo/2019/12/30/13/10/lost-places-4729640_1280.jpg"
        }
        onZoom={this.onZoom}
        onClose={this.onClose}
      />
    );
  }
}

export default ImageZoomTest;