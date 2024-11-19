import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const SlidingMenu = props => {
  const { isOpen, children, onChange } = props;

  const onClickHandler = () => {
    onChange(!isOpen);
  };

  return (
    <div className={styles.wrapper}>
      {/* Hamburger icon */}
      <div
        onClick={onClickHandler}
        className={cx(styles.hamburger, { [styles.active]: !isOpen })}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* sliding menu */}
      <div className={cx(styles.menu, { [styles.active]: !isOpen })}>
        {children}
      </div>
    </div>
  );
};

SlidingMenu.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  children: PropTypes.node,
  onChange: PropTypes.func.isRequired
};

SlidingMenu.defaultProps = {
  isOpen: false
};

export default SlidingMenu;




//index.module.css
:root {
    --width: 300px;
  }
  
  .wrapper {
    position: relative;
  }
  
  .menu {
    position: fixed;
    width: var(--width);
    height: 100vh;
    left: 0;
    top: 0;
    transition: 0.4s;
    background: red;
    z-index: 9999;
    transform: translateX(-100%);
  }
  
  .menu.active {
    transform: translateX(0);
  }
  
  .hamburger {
    position: fixed;
    width: 40px;
    height: 40px;
    left: 0;
    top: 0;
    overflow: hidden;
    background-color: red;
    cursor: pointer;
    transition: 0.4s;
  }
  
  .hamburger > span {
    position: absolute;
    width: 80%;
    height: 2px;
    left: 10%;
    top: 48%;
    background: yellow;
    transition: 0.4s;
  }
  
  .hamburger > span:first-child {
    top: 18%;
  }
  
  .hamburger > span:last-child {
    top: 78%;
  }
  
  .hamburger.active {
    left: calc(var(--width) + 3px);
  }
  
  .hamburger.active > span {
    transform: translateX(120%);
  }
  
  .hamburger.active > span:first-child {
    top: 48%;
    transform: rotateZ(-45deg);
  }
  
  .hamburger.active > span:last-child {
    top: 48%;
    transform: rotateZ(45deg);
  }


//   Now what is pending is the styling the layout, so lets do that.

// We will use CSS variable to store the width of the sliding menu because this way we can do the further calculation of hamburger placement with very ease and it will also reduce the chances of bug.

// We will make the element fixed on the screen and place them on the left side. When the state changes to active we will slide them out.

// For hamburger will keep all three spans one above the other and in the active state hide the middle span and rotate the top and bottom to form a X.


import React, { Component } from "react";
import SlidingMenu from "./index";

class SlidingMenuTest extends Component {
  state = {
    isOpen: true
  };

  onChange = isOpen => {
    this.setState({
      isOpen
    });
  };

  render() {
    const { isOpen } = this.state;
    return <SlidingMenu isOpen={isOpen} onChange={this.onChange} />;
  }
}

export default SlidingMenuTest;