import React, { Component } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

class RadioGroup extends Component {
  static propTypes = {
    options: PropTypes.arrayOf(
      PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
        disabled: PropTypes.bool
      })
    ).isRequired,

    name: PropTypes.string.isRequired,

    /* Will be triggered when there is change in selected optiomn */
    onChange: PropTypes.func,

    /* Applied when the component is not controlled*/
    prefillValue: PropTypes.any,

    /*Applies to value of the selected option*/
    value: PropTypes.any,

    /* All radio items will be inline-flexed if this is true */
    inline: PropTypes.bool,

    /* Applied to container of all radio items */
    className: PropTypes.string,

    /* Applies to each item in this group */
    itemClassName: PropTypes.string,

    /* Applies to the label of each item in this group */
    labelClassName: PropTypes.string,

    /* Applies to actual input */
    inputClassName: PropTypes.string,

    /* Applies to circle part of radio button */
    customLabelClassName: PropTypes.string,

    /* ref of the component */
    ref: PropTypes.instanceOf(Element)
  };

  static defaultProps = {
    itemClassName: "",
    className: "",
    labelClassName: ""
  };

  constructor(props) {
    super(props);

    this.state = {
      value: props.prefillValue || props.value
    };
  }

  componentDidUpdate(previousProps) {
    const { value } = this.props;
    //If value is different then only update the state
    if (previousProps.value != this.props.value) {
      this.setState({ value });
    }
  }

  handleOnChange = e => {
    const { name, onChange } = this.props;
    const { value } = e.target;

    if (onChange) {
      onChange({ name, value });
    } else {
      this.setState({ value });
    }
  };

 render() {
    const {
      itemClassName,
      className,
      labelClassName,
      name,
      inline,
      options,
      inputClassName,
      customLabelClassName
    } = this.props;

    const { value } = this.state;

    const _itemClassName = cx(itemClassName, styles.item, {
      [styles.inlineItem]: inline
    });

    const _labelClassName = cx(labelClassName, styles.label);

    const _inputClassName = cx(styles.radio, inputClassName);

    const _customLabelClassName = cx(styles.customLabel, customLabelClassName);

    return (
      <div className={className} ref={this.props.ref}>
        
        {options.map((option, index) => (
          <div
            className={cx(_itemClassName, {
              [styles.disabled]: option.disabled
            })}
            key={index}
          >
            <input
              type="radio"
              name={name}
              id={`${name}-${option.value}`}
              value={option.value}
              onChange={this.handleOnChange}
              checked={value === option.value}
              className={_inputClassName}
            />

            <label
              htmlFor={`${name}-${option.value}`}
              className={_customLabelClassName}
            ></label>

            <label
              htmlFor={`${name}-${option.value}`}
              className={_labelClassName}
            >
              {option.label}
            </label>

          </div>
        ))}

      </div>
    );
  }
}

export default RadioGroup;


//index.module.css
.radio {
    display: none;
  }
  
  //Sibling selector +
  .radio:checked + .customLabel {
    border-color: #68c721;
  }
  
  .radio:checked + .customLabel:after {
    content: "";
  }
  
  .customLabel {
    border: 1px solid #a8acb1;
    background-color: #fff;
    border-radius: 50%;
    min-width: 20px;
    min-height: 20px;
    cursor: pointer;
  }
  
  .customLabel::after {
    width: 10px;
    height: 10px;
    background: #68c721;
    border-radius: 50%;
    display: block;
    margin-top: 4px;
    margin-left: 4px;
  }
  
  .white .radio:checked + .customLabel {
    background: transparent;
    border-color: #a8acb1;
  }
  
  .white .radio:checked + .customLabel::after {
    border-color: #2d2d2d;
  }
  
  .item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
  }
  
  .item.disabled {
    opacity: 0.3;
  }
  
  .item.disabled .label,
  .item.disabled .customLabel {
    cursor: default;
  }
  
  .inlineItem {
    display: inline-flex;
  }
  
  .label {
    cursor: pointer;
    margin-left: 15px;
    font-size: 14px;
  }


  ReactDOM.render(
    <div className="abc">
      <RadioGroup
        options={[
          { label: "I am not checked", value: "xyz", disabled: false },
          { label: "I am checked", value: "abc", disabled: false }
        ]}
        name="radio"
        prefillValue="abc"
        inline={true}
      />
    </div>,
    document.getElementById("root")
  );