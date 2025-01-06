import React, { Component } from "react";
import PropTypes from "prop-types";
import ReactSelect from "react-select";
import cx from "classnames";
import { map, isEqual } from "lodash";
import styles from "./index.module.css";

class Select extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired
      })
    ).isRequired,
    name: PropTypes.string.isRequired,
    /* Render multi dropdown */
    multi: PropTypes.bool,
    onChange: PropTypes.func,
    onBlur: PropTypes.func,
    prefillValue: PropTypes.any,
    label: PropTypes.node,
    className: PropTypes.string,
    labelClassName: PropTypes.string,
    value: PropTypes.any,
    helperText: PropTypes.string,
    innerRef: PropTypes.instanceOf(Element),
    error: PropTypes.bool,
    disabled: PropTypes.bool,
    disableOptionsByValue: PropTypes.arrayOf(PropTypes.any)
  };

  static defaultProps = {
    className: "",
    size: "default",
    disabled: false,
    disableOptionsByValue: []
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value || props.prefillValue || ""
    };
  }

  componentDidUpdate(previousProps) {
    const { value } = this.props;

    //Update the state when recieved value is different
    if (!isEqual(previousProps.value, this.props.value)) {
      this.setState({ value });
    }
  }

  //When single option will be selected
  handleOnChange = data => {
    data = data || {};
    const { name, onChange } = this.props;

    if (onChange) {
      onChange({ name, value: data });
    } else {
      this.setState({
        value: data
      });
    }
  };

  //When multiple option will be selected
  handleMultiChange = value => {
    const { name, onChange } = this.props;

    if (onChange) {
      onChange({ name, value });
    } else {
      this.setState({
        value: map(value)
      });
    }
  };

  //OnBlur event
  handleOnBlur = event => {
    const { name, onBlur } = this.props;
    onBlur && onBlur({ name, event });
  };

  render() {
    const {
      className,
      multi,
      options,
      labelClassName,
      label,
      innerRef,
      error,
      helperText,
      disableOptionsByValue,
      disabled,
      ..._props
    } = this.props;

    let { value } = this.state;

    const _className = cx(className, styles.container, {
      [styles.hasError]: error
    });

    const _labelClassName = cx(labelClassName, styles.label, {
      [styles.error]: error
    });

    const _helperTextClassName = cx(styles.helperText, {
      [styles.error]: error
    });

    const _selectErrorStyle = error
      ? {
          control: (provided, state) => {
            const style = {
              ...provided,
              borderColor: "red",
              "&:hover": {
                borderColor: "red"
              }
            };

            if (state.isFocused) {
              return {
                ...style,
                boxShadow: "0 0 0 1px red"
              };
            } else {
              return {
                ...style
              };
            }
          },
          clearIndicator: provided => ({
            ...provided,
            color: "red"
          }),
          dropdownIndicator: provided => ({
            ...provided,
            color: "red"
          })
        }
      : {};

    return (
      <div className={_className}>
        {label ? <label className={_labelClassName}>{label}</label> : null}

        <ReactSelect
          {..._props}
          styles={_selectErrorStyle}
          options={options}
          isMulti={multi}
          onChange={multi ? this.handleMultiChange : this.handleOnChange}
          value={value}
          onBlur={this.handleOnBlur}
          ref={innerRef}
          isOptionDisabled={({ value }) =>
            disableOptionsByValue.includes(value)
          }
          disabled={disabled}
        />

        {helperText && helperText.length ? (
          <label className={_helperTextClassName}>{helperText}</label>
        ) : null}
      </div>
    );
  }
}

export default React.forwardRef((props, ref) => {
  return <Select {...props} innerRef={ref} />;
});



//index.module.css
.container {
    display: inline-block;
    width: 100%;
    margin-bottom: 20px;
    padding: 0 10px;
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
  
  .hasError {
    border-color: #eb5055;
  }
  
  .hasError:focus {
    border-color: #eb5055;
  }
  
  .helperText {
    font-weight: 600;
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1px;
    display: block;
    position: absolute;
    bottom: 5px;
    color: #adb1b3;
    font-family: sans-serif;
  }
  
  .error {
    color: #eb5055;
  }




  ReactDOM.render(
    <div className="abc">
      <Select
        name="abc"
        options={[
          { value: "car1", label: "Toyota" },
          { value: "car2", label: "Honda" },
          { value: "car3", label: "Hyundai" },
          { value: "car4", label: "BMW" }
        ]}
        label="Single Selection"
      />
      <Select
        name="abc"
        options={[
          { value: "car1", label: "Toyota" },
          { value: "car2", label: "Honda" },
          { value: "car3", label: "Hyundai" },
          { value: "car4", label: "BMW" }
        ]}
        multi={true}
        disableOptionsByValue={["car4"]}
        label="Mutliple Selection"
        value={[{ value: "car2", label: "Honda" }]}
      />
      <Select
        name="abc"
        options={[
          { value: "car1", label: "Toyota" },
          { value: "car2", label: "Honda" },
          { value: "car3", label: "Hyundai" },
          { value: "car4", label: "BMW" }
        ]}
        disabled={true}
        label="Disabled"
      />
      <Select
        name="abc"
        options={[
          { value: "car1", label: "Toyota" },
          { value: "car2", label: "Honda" },
          { value: "car3", label: "Hyundai" },
          { value: "car4", label: "BMW" }
        ]}
        error={true}
        label="Error"
      />
    </div>,
    document.getElementById("root")
  );