import React, { Component } from "react";
import styles from "./index.module.css";
import PropTypes from "prop-types";
import cx from "classnames";
import { Spring } from "react-spring/renderprops";

class ToolTip extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
    active: PropTypes.bool.isRequired,
    classname: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    text: "",
    placement: "bottom",
    active: false
  };

  state = {
    active: this.props.active
  };

  show = () => {
    this.setState({
      active: true
    });
  };

  hide = () => {
    this.setState({
      active: false
    });
  };

  render() {
    const { text, placement, children, classname } = this.props;
    const { active } = this.state;

    return (
      <div
        className={cx(styles.tooltip, classname)}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        {children}
        {active && (
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
            {props => (
              <span
                className={cx(styles.tooltiptext, styles[placement])}
                style={props}
              >
                {text}
              </span>
            )}
          </Spring>
        )}
      </div>
    );
  }
}

export default ToolTip;


import React, { Component } from "react";
import styles from "./index.module.css";
import PropTypes from "prop-types";
import cx from "classnames";
import { Spring } from "react-spring/renderprops";

class ToolTip extends Component {
  static propTypes = {
    text: PropTypes.string.isRequired,
    placement: PropTypes.oneOf(["top", "bottom", "left", "right"]).isRequired,
    active: PropTypes.bool.isRequired,
    classname: PropTypes.string,
    children: PropTypes.node
  };

  static defaultProps = {
    text: "",
    placement: "bottom",
    active: false
  };

  state = {
    active: this.props.active
  };

  show = () => {
    this.setState({
      active: true
    });
  };

  hide = () => {
    this.setState({
      active: false
    });
  };

  render() {
    const { text, placement, children, classname } = this.props;
    const { active } = this.state;

    return (
      <div
        className={cx(styles.tooltip, classname)}
        onMouseEnter={this.show}
        onMouseLeave={this.hide}
      >
        {children}
        {active && (
          <Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
            {props => (
              <span
                className={cx(styles.tooltiptext, styles[placement])}
                style={props}
              >
                {text}
              </span>
            )}
          </Spring>
        )}
      </div>
    );
  }
}

export default ToolTip;



import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import ToolTip from "./Components/Tooltip";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <div className="abc">
    <ToolTip text="Left" placement={"left"} active={true}>
      <div style={{ padding: "5px", border: "2px solid", borderRadius: "4px" }}>
        ToolTip Left
      </div>
    </ToolTip>
    <ToolTip text="Right" placement={"right"} active={true}>
      <div style={{ padding: "5px", border: "2px solid", borderRadius: "4px" }}>
        ToolTip Right
      </div>
    </ToolTip>
    <ToolTip text="Top" placement={"top"} active={true}>
      <div style={{ padding: "5px", border: "2px solid", borderRadius: "4px" }}>
        ToolTip Top
      </div>
    </ToolTip>
    <ToolTip text="Bottom" placement={"bottom"} active={true}>
      <div style={{ padding: "5px", border: "2px solid", borderRadius: "4px" }}>
        ToolTip Bottom
      </div>
    </ToolTip>
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();