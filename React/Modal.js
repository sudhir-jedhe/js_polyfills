import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
import cx from "classnames";

const Modal = props => {
  const {
    isActive,
    title,
    width,
    children,
    footerNode,
    hideCloseButton,
    onClose,
    className,
    onMouseDown,
    onMouseUp,
    onTouchStart,
    onTouchEnd
  } = props;

  if (!isActive) {
    return null;
  }

  return (
    <div
      className={cx(styles.root, className)}
      onMouseDown={onMouseDown}
      onMouseUp={onMouseUp}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Modal Container */}
      <div className={styles.container}>
        <div
          className={styles.main}
          style={{
            width: `${width}px`
          }}
        >
          {/* Header starts */}
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <div
              className={cx(
                styles.close,
                `${hideCloseButton ? styles.hideButton : ""}`
              )}
              onClick={onClose}
            />
          </div>

          {/* Content Starts */}
          <div className={styles.content}>{children}</div>

          {/* Footer starts */}
          {footerNode && <div className={styles.footer}>{footerNode}</div>}
        </div>
      </div>
    </div>
  );
};

Modal.propTypes = {
  children: PropTypes.element,
  footerNode: PropTypes.element,
  isActive: PropTypes.bool.isRequired,
  title: PropTypes.string,
  width: PropTypes.number,
  onClose: PropTypes.func,
  hideCloseButton: PropTypes.bool,
  className: PropTypes.string,
  onMouseDown: PropTypes.func,
  onMouseUp: PropTypes.func,
  onTouchStart: PropTypes.func,
  onTouchEnd: PropTypes.func
};

Modal.defaultProps = {
  width: 600,
  title: "Modal"
};

export default Modal;



//index.module.css
.root {
    position: fixed;
    z-index: 999999;
    right: 0px;
    bottom: 0px;
    top: 0px;
    left: 0px;
  }
  
  .backdrop {
    width: 100%;
    height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.3);
    top: 0;
    right: 0;
    transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  }
  
  .container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    outline: none;
    z-index: 1000;
  }
  
  .main {
    display: flex;
    max-height: calc(100% - 70px);
    flex-direction: column;
    text-align: left;
    background: #fff;
    overflow-y: auto;
    position: relative;
    border-radius: 4px;
    z-index: 1000;
  }
  
  .content {
    flex: 1 1 auto;
    padding: 10px;
  }
  
  .header {
    background: #000;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 10px;
  }
  
  .title {
    text-transform: capitalize;
    font-size: 24px;
    color: #fff;
    font-weight: 500;
    letter-spacing: 0.18px;
  }
  
  .close {
    position: relative;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    background: #795548;
  }
  
  .close:before,
  .close:after {
    content: " ";
    position: absolute;
    top: 8px;
    left: 15px;
    height: 16px;
    width: 3px;
    background-color: #b4b7bc;
  }
  
  .close:before {
    transform: rotate(45deg);
  }
  
  .close:after {
    transform: rotate(-45deg);
  }
  
  .hideButton {
    display: none;
  }
  
  .footer {
    position: sticky;
    bottom: 0;
    display: flex;
    justify-content: flex-end;
    height: 64px;
    background-color: #f0f0f0;
    padding: 16px;
  }


  import React, { Component } from "react";
import Modal from "./index";
import Button from "../Button";

class ModalTest extends Component {
  state = {
    isActive: false
  };

  onClose = () => {
    this.setState({
      isActive: false
    });
  };

  showModal = () => {
    this.setState({
      isActive: true
    });
  };

  render() {
    const { isActive } = this.state;
    return (
      <>
        <Button onClick={this.showModal} label="Show Modal" variant="primary" />
        <Modal isActive={isActive} onClose={this.onClose} title="Modal">
          <h1>Hello Modal!.</h1>
        </Modal>
      </>
    );
  }
}

export default ModalTest;