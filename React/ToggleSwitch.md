import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./style.css";

const ToggleSwitch = ({
      checked, 
      defaultChecked, 
      name, 
      onChange, 
      rounded, 
      checkedChildren,
      uncheckedChildren,
      className,
      variant,
      innerRef
    }) => {

  const [_checked, setChecked] = useState(defaultChecked || checked || false);
  
  const handleChange = e => {
    const { checked } = e.target;
    setChecked(checked);
    onChange &&
      onChange({
        name,
        checked
      });
  };

    const _className = cx("wrapper", className);

    const _slideClassName = cx("slider", variant, {
      ["round"]: rounded
    });

    const _checkedChildrenClassName = cx("children", "checked", {
      ["visible"]: _checked
    });

    const _uncheckedChildrenClassName = cx("children", "unchecked", {
      ["visible"]: !_checked
    });

    return (
      <span className={_className}>
        <span className={"switch"}>
          <input
            type="checkbox"
            checked={_checked}
            onChange={handleChange}
            name={name}
            ref={innerRef}
          />

          {/* Overlay */}
          <span className={_slideClassName} />

          {/* Childrens */}
          <>
            <span className={_checkedChildrenClassName}>
              {checkedChildren || null}
            </span>
            <span className={_uncheckedChildrenClassName}>
              {uncheckedChildren || null}
            </span>
          </>
        </span>
      </span>
    );
};

ToggleSwitch.propTypes = {
  name: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "success", "danger"]),
  /* Children to show on active state  */
  checkedChildren: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element
  ]),
  /* Children to show on inactive state */
  uncheckedChildren: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element
  ]),
  innerRef: PropTypes.instanceOf(Element)
};

ToggleSwitch.defaultProps = {
  defaultChecked: false,
  checked: false,
  variant: "primary"
}

export default React.forwardRef((props, ref) => {
  return <ToggleSwitch {...props} innerRef={ref} />;
});


/************************** */

.wrapper {
    display: inline-flex;
    margin: 0 10px;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    position: relative;
    cursor: pointer;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  
  /* Different variants*/
  input:checked + .slider.primary {
    background-color: #2196f3;
  }
  
  input:focus + .slider.primary {
    box-shadow: 0 0 1px #2196f3;
  }
  
  input:checked + .slider.danger {
    background-color: #ff5722;
  }
  
  input:focus + .slider.danger {
    box-shadow: 0 0 1px #ff5722;
  }
  
  input:checked + .slider.success {
    background-color: #7cb342;
  }
  
  input:focus + .slider.success {
    box-shadow: 0 0 1px #7cb342;
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  
  /*Childrens style */
  .children {
    position: absolute;
    top: 58%;
    height: 26px;
    width: 26px;
    text-align: center;
    line-height: 26px;
    transition: 0.12s;
    opacity: 0;
    transform: translateY(-50%);
  }
  
  .checked {
    left: 2px;
  }
  
  .unchecked {
    right: 2px;
  }
  
  .visible {
    opacity: 1;
  }


  /***************** */

  import React from "react";
import ToggleSwitch from "./App";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Test = () => {
  return <>
    <ToggleSwitch name="abc" rounded={true} checked={true}/>
    <ToggleSwitch name="abc" variant="success" />
    <ToggleSwitch
      name="abc"
      rounded={true}
      variant="danger"
      defaultChecked={true}
      checkedChildren={<CheckOutlined />}
      uncheckedChildren={<CloseOutlined />}
    />
    <ToggleSwitch
      name="abc"
      defaultChecked={true}
      variant="danger"
      checkedChildren={<CheckOutlined />}
      uncheckedChildren={<CloseOutlined />}
    />
  </>
};

export default Test;