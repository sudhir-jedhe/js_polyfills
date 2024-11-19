import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const input = (props, ref) => {
  const handleOnBlur = event => {
    const { value } = event.target;
    const { onBlur, name } = props;
    onBlur && onBlur({ value, name, event });
  };

  const handleOnChange = event => {
    const { value } = event.target;
    const { onChange, name } = props;
    onChange && onChange({ value, name, event });
  };

  const handleFocus = event => {
    const { name, onFocus, value } = props;

    // To fix the issue with cursor at beginning
    if (value) {
      event.target.value = "";
      event.target.value = value;
    }

    onFocus && onFocus({ event, name, value });
  };

  const handleKeyDown = event => {
    const { name, onKeyDown } = props;
    const { value } = event.target;
    onKeyDown && onKeyDown({ value, name, event });
  };

  const {
    className,
    inputClassName,
    labelClassName,
    type,
    label,
    placeholder,
    readOnly,
    multi,
    maxLength,
    autoFocus,
    value,
    error,
    helperText
  } = props;

  const _className = cx(styles.container, className);

  const _inputClassName = cx(
    {
      [styles.input]: !multi,
      [styles.textarea]: multi,
      [styles.readonly]: readOnly,
      [styles.hasError]: error
    },
    inputClassName
  );

  const _labelClassName = cx(styles.label, labelClassName, {
    [styles.error]: error
  });

  const _helperTextClassName = cx(styles.helperText, { [styles.error]: error });

  let _props = {
    autoFocus,
    placeholder,
    value,
    readOnly,
    maxLength,
    className: _inputClassName,
    onChange: handleOnChange,
    onFocus: handleFocus,
    onBlur: handleOnBlur,
    onKeyDown: handleKeyDown
  };

  return (
    <div className={_className}>
      {label ? <label className={_labelClassName}>{label}</label> : null}

      {multi ? (
        <textarea {..._props} ref={ref}></textarea>
      ) : (
        <input {..._props} type={type} ref={ref} />
      )}

      {helperText && helperText.length ? (
        <span className={_helperTextClassName}>{helperText}</span>
      ) : null}
    </div>
  );
};

input.propTypes = {
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf([
    "text",
    "number",
    "password",
    "date",
    "email",
    "tel",
    "url",
    "search"
  ]).isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  autoFocus: PropTypes.bool,
  required: PropTypes.bool,
  maxLength: PropTypes.number,
  pattern: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  onKeyDown: PropTypes.func,
  /* Will be applied to container */
  className: PropTypes.string,
  /* Will be applied to underlying input/textarea tag */
  inputClassName: PropTypes.string,
  /* Will be applied to label */
  labelClassName: PropTypes.string,
  /* Renders a textarea if true */
  multi: PropTypes.bool,
  /* Value */
  value: PropTypes.string,
  error: PropTypes.bool,
  helperText: PropTypes.string
};

input.defaultProps = {
  className: "",
  inputClassName: "",
  labelClassName: "",
  type: "text",
  label: "",
  placeholder: "",
  readOnly: false,
  multi: false
};

export default React.forwardRef((props, ref) => input(props, ref));



/********************************** */

//index.module.css
.container {
    position: relative;
  }
  
  .label {
    display: block;
    font-weight: 600;
    font-size: 14px;
    line-height: 24px;
    margin-bottom: 4px;
    letter-spacing: -0.05px;
    color: #4c4c56;
  }
  
  .input,
  .textarea {
    padding: 0 10px;
    height: 40px;
    color: #4c4c56;
    resize: none;
    width: 100%;
    font-size: 14px;
    margin-bottom: 20px;
    border-radius: 3px;
    transition: 200ms ease all;
    border: 1px solid #607d8b;
  }
  
  .input:focus,
  .textarea:focus {
    box-shadow: rgba(67, 90, 111, 0.14) 0px 0px 2px inset,
      rgb(87, 154, 217) 0px 0px 0px 1px inset,
      rgba(16, 112, 202, 0.14) 0px 0px 0px 3px;
    outline: none;
  }
  
  .hasError {
    border-color: #eb5055;
  }
  
  .hasError:focus {
    border-color: #eb5055;
  }
  
  .readonly {
    box-shadow: rgba(67, 90, 111, 0.14) 0px 0px 0px 1px inset;
    background-color: rgb(245, 246, 247);
  }
  
  .readonly:focus {
    box-shadow: none;
    cursor: no-drop;
  }
  
  .textarea {
    line-height: 1.5em;
    height: 100px;
    padding: 10px;
  }
  
  .helperText {
    font-weight: 600;
    font-size: 14px;
    text-transform: capitalize;
    letter-spacing: 0.3px;
    display: block;
    position: relative;
    bottom: 5px;
    color: #7cb342;
  }
  
  .error {
    color: #eb5055;
  }

  /****************************************** */


  ReactDOM.render(
    <div className="abc">
      <Input
        type="text"
        placeholder="Enter Text"
        label="Input Box"
        helperText="I am a text type input box"
        name="typeText"
      />
      <hr />
      <Input
        type="email"
        placeholder="Enter Email Address"
        label="Email Box"
        helperText="I am an email type box"
        name="typeEmail"
      />
      <hr />
      <Input
        type="password"
        placeholder="Enter Password"
        label="Password Box"
        helperText="I am a password type box"
        name="typePassword"
      />
      <hr />
      <Input
        type="date"
        placeholder="Enter date"
        label="Date Box"
        helperText="I am a Date type input box"
        name="typeDate"
      />
      <hr />
      <Input
        type="tel"
        placeholder="Enter Telephone Number"
        label="Telephone Box"
        helperText="I am a Telephone type input box"
        name="typeTel"
      />
      <hr />
    </div>,
    document.getElementById("root")
  );