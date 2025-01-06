```js
import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const Accordion = ({ children, onChange, isOpen, label }) => {
  const onChangeHandler = () => {
    onChange && onChange(!isOpen);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={cx(styles.toggler, { [styles.active]: isOpen })}
        onClick={onChangeHandler}
        aria-expanded={isOpen}
        aria-controls="accordion-content"
      >
        {label}
      </button>
      <div
        id="accordion-content"
        className={cx(styles.panel, { [styles.active]: isOpen })}
        role="region"
        aria-hidden={!isOpen}
      >
        <div className={styles.contentWrapper}>{children}</div>
      </div>
    </div>
  );
};

Accordion.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onChange: PropTypes.func,
  children: PropTypes.node,
  label: PropTypes.string.isRequired
};

Accordion.defaultProps = {
  isOpen: false,
  children: null,
  label: "Accordion"
};

export default Accordion;

```
```css

//index.module.css
.toggler {
    position: relative;
    display: block;
    background-color: #f9f9f9;
    color: #444;
    cursor: pointer;
    padding: 8px;
    width: 100%;
    text-align: left;
    border: none;
    outline: none;
    transition: 0.4s;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  }
  
  .toggler:after {
    content: "\02795";
    position: absolute;
    right: 10px;
    font-size: 10px;
    top: 48%;
    transform: translateY(-50%);
  }
  
  .toggler.active:after {
    content: "\2796";
  }
  
  .panel {
    transition: 0.4s;
    background-color: #90a4ae;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
    overflow: hidden;
    max-height: 0;  //Keep the panel hidden
  }
  
  .panel > .contentWrapper {
    padding: 10px;
  }
  
  .wrapper {
    padding: 5px 10px;
  }
  
  //Shows the panel and adjusts the height accordingly
  .panel.active {
    max-height: 100vh;
  }

```

```js

  import React, { Component } from "react";
import Accordion from "./index";

class AccordionTest extends Component {
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
    return (
      <Accordion isOpen={isOpen} onChange={this.onChange}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry's standard dummy text ever
        since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum.
      </Accordion>
    );
  }
}

export default AccordionTest;

````