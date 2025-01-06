import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";

class DropDown extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
    onChange: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    label: "DropDown",
    children: null
  };

  state = {
    isOpen: this.props.isOpen
  };

  componentDidMount() {
    //Assign click handler to listen the click to close the dropdown when clicked outside
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    //Remove the listener
    document.removeEventListener("click", this.handleClickOutside);
  }

  //If click is outside the dropdown button or display area
  //Close the dropdown
  handleClickOutside = event => {
    const path = event.path || (event.composedPath && event.composedPath());
    const { onChange } = this.props;

    if (
      !path.includes(this.displayAreaRef) &&
      !path.includes(this.dropTogglerRef)
    ) {
      this.setState({
        isOpen: false
      });

      onChange && onChange(false);
    }
  };

  //DropDown toggler
  toggleDropDown = () => {
    const { onChange } = this.props;
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });

    onChange && onChange(!isOpen);
  };

  render() {
    const { label, children } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={styles.wrapper}>
        <div
          className={styles.dropToggler}
          onClick={this.toggleDropDown}
          ref={ref => (this.dropTogglerRef = ref)}
        >
          <span className={styles.label}>{label}</span>
          <span className={styles.arrow}>{isOpen ? "\u25B2" : "\u25BC"}</span>
        </div>
        <div className={styles.displayArea}>
          {isOpen && (
            <div
              className={styles.children}
              ref={ref => (this.displayAreaRef = ref)}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DropDown;




import React, { Component } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";

class DropDown extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    children: PropTypes.node,
    onChange: PropTypes.func
  };

  static defaultProps = {
    isOpen: false,
    label: "DropDown",
    children: null
  };

  state = {
    isOpen: this.props.isOpen
  };

  componentDidMount() {
    //Assign click handler to listen the click to close the dropdown when clicked outside
    document.addEventListener("click", this.handleClickOutside);
  }

  componentWillUnmount() {
    //Remove the listener
    document.removeEventListener("click", this.handleClickOutside);
  }

  //If click is outside the dropdown button or display area
  //Close the dropdown
  handleClickOutside = event => {
    const path = event.path || (event.composedPath && event.composedPath());
    const { onChange } = this.props;

    if (
      !path.includes(this.displayAreaRef) &&
      !path.includes(this.dropTogglerRef)
    ) {
      this.setState({
        isOpen: false
      });

      onChange && onChange(false);
    }
  };

  //DropDown toggler
  toggleDropDown = () => {
    const { onChange } = this.props;
    const { isOpen } = this.state;
    this.setState({
      isOpen: !isOpen
    });

    onChange && onChange(!isOpen);
  };

  //To control component
  componentDidUpdate() {
    if (this.props.isOpen !== this.state.isOpen) {
      this.setState({
        isOpen: this.props.isOpen
      });
    }
  }

  render() {
    const { label, children } = this.props;
    const { isOpen } = this.state;

    return (
      <div className={styles.wrapper}>
        <div
          className={styles.dropToggler}
          onClick={this.toggleDropDown}
          ref={ref => (this.dropTogglerRef = ref)}
        >
          <span className={styles.label}>{label}</span>
          <span className={styles.arrow}>{isOpen ? "\u25B2" : "\u25BC"}</span>
        </div>
        <div className={styles.displayArea}>
          {isOpen && (
            <div
              className={styles.children}
              ref={ref => (this.displayAreaRef = ref)}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default DropDown;



//index.module.css
.wrapper {
    display: inline-flex;
    position: relative;
    flex-direction: column;
  }
  
  .dropToggler {
    position: relative;
    padding: 10px;
    border: 1px solid #000;
    border-radius: 5px;
    font-size: 14px;
    color: #607d8b;
    cursor: pointer;
  }
  
  .dropToggler > .arrow {
    margin-left: 10px;
  }
  
  .displayArea {
    position: relative;
  }
  
  .displayArea > .children {
    position: absolute;
    left: 1px;
    top: 8px;
    min-width: 200px;
    min-height: 200px;
    background: #bdb8b8;
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 3px;
  }

// controlled Component

  //test.js
import React, { Component } from "react";
import DropDown from "./index";

class DropDownTest extends Component {
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
    return <DropDown isOpen={isOpen} onChange={this.onChange} />
  }
}

export default DropDownTest;


// Uncontrolled Component

import React, { Component } from "react";
import DropDown from "./index";

class DropDownTest extends Component {
  onChange = isOpen => {
    console.log(isOpen);
  };

  render() {
    return <DropDown isOpen={true} onChange={this.onChange} />
  }
}

export default DropDownTest;