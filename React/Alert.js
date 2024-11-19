import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

class AlertBox extends Component {
  static propTypes = {
    show: PropTypes.bool.isRequired,
    autoClose: PropTypes.bool.isRequired,
    time: PropTypes.number.isRequired,
    message: PropTypes.string.isRequired,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(["danger", "primary", "basic"]).isRequired,
    placement: PropTypes.oneOf(["top", "bottom"]).isRequired
  };

  static defaultProps = {
    message: "",
    show: false,
    autoClose: false,
    time: 3000,
    variant: "primary",
    placement: "top"
  };

  state = {
    show: this.props.show
  };

  startTimer = () => {
    const { autoClose, time, show, onClose } = this.props;
    if (autoClose && show) {
      this.timer = setTimeout(() => {
        this.setState({
          show: false
        });

        onClose && onClose(false);
      }, time);
    }
  };

  componentDidMount() {
    this.startTimer();
  }

  componentWillUnmount() {
    clearTimeout(this.timer);
  }

  componentDidUpdate(prevProps) {
    const { show } = this.props;
    if (show !== prevProps.show) {
      this.setState({
        show
      });

      if (show) {
        this.startTimer();
      } else {
        clearTimeout(this.timer);
      }
    }
  }

  onClose = () => {
    const { onClose } = this.props;
    this.setState({
      show: false
    });
    onClose && onClose(false);
    clearTimeout(this.timer);
  };

  render() {
    const { message, variant, placement } = this.props;
    const { show } = this.state;
    return (
      show && (
        <div
          className={cx(styles.alertBox, styles[variant], styles[placement])}
        >
          <div>{message}</div>
          <span onClick={this.onClose} className={styles.close}>
            x
          </span>
        </div>
      )
    );
  }
}

export default AlertBox;


/********************* */
//index.module.css
.alertBox {
    position: fixed;
    width: 80%;
    left: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-radius: 5px;
    background: #eee;
    border: 1px solid #aba3a3;
  }
  
  .bottom {
    bottom: 5%;
  }
  
  .top {
    top: 5%;
  }
  
  .danger {
    background: #ff5722;
    border: 1px solid #bf360c;
  }
  
  .primary {
    background: #8bc34a;
    border: 1px solid #33691e;
  }
  
  .basic {
    background: #00bcd4;
    border: 1px solid #006064;
  }
  
  .close {
    font-size: 20px;
    cursor: pointer;
    font-weight: 600;
  }


  /*********************** */

  import React, { Component } from "react";
import AlertBox from "./index";

class AlertBoxTest extends Component {
  state = {
    isActive: true
  };

  onChange = isActive => {
    this.setState({
      isActive
    });
  };

  onClick = () => {
    this.setState({
      isActive: !this.state.isActive
    });
  };

  render() {
    const { isActive } = this.state;
    return (
      <>
        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Primary!: AlertBox"}
          autoClose={false}
        />

        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Danger!: AlertBox"}
          autoClose={false}
          variant={"danger"}
        />

        <AlertBox
          show={isActive}
          onClose={this.onChange}
          message={"Basic!: AlertBox"}
          autoClose={false}
          variant={"basic"}
        />
      </>
    );
  }
}

export default AlertBoxTest;