import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const Tab = props => {
  const { activeIndex, tabs, onChange } = props;

  const disabledTabsList = () => {
    return tabs.map(e => (e.disabled ? e.label : null));
  };

  const isTabDisabled = index => {
    const disabled = disabledTabsList();
    const tab = tabs[index];
    return disabled.includes(tab.label);
  };

  const onClick = i => {
    const isDisabled = isTabDisabled(i);
    if (!isDisabled) {
      onChange(i);
    }
  };

  //Get the list of tab
  const generateTabsHeading = () => {
    const isDisabled = isTabDisabled(activeIndex);
    const disabled = disabledTabsList();

    return tabs.map((e, i) => {
      return (
        <div
          key={e.label}
          onClick={() => onClick(i)}
          className={cx(styles.tab, {
            [styles.active]: activeIndex === i && !isDisabled,
            [styles.disabled]: disabled.includes(e.label)
          })}
        >
          <span className={styles.label}>{e.label}</span>
        </div>
      );
    });
  };
 
  //Get the content of only active tab
  const getActiveTab = () => {
    const disabled = isTabDisabled(activeIndex);

    if (activeIndex > tabs.length || disabled) {
      return null;
    }

    const content = tabs[activeIndex] && tabs[activeIndex].content;
    return <div className={styles.content}>{content}</div>;
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.tabsHeading}>{generateTabsHeading()}</div>
      <div className={styles.tabsContent}>{getActiveTab()}</div>
    </div>
  );
};

Tab.propTypes = {
  activeIndex: PropTypes.number.isRequired,
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      content: PropTypes.node.isRequired,
      disabled: PropTypes.bool.isRequired
    })
  ).isRequired,
  onChange: PropTypes.func.isRequired
};

Tab.defaultProps = {
  activeIndex: 0
};

export default Tab;



//index.module.css
.wrapper {
    padding: 10px;
  }
  
  .tabsHeading {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 15px;
  }
  
  .tab {
    display: inline-flex;
    text-align: center;
    font-size: 16px;
    font-weight: 600;
    color: #000;
    padding: 3px 15px;
    margin: 0 2px;
    line-height: 20px;
    transition: all 200ms cubic-bezier(0.4, 0.14, 0.3, 1);
    text-transform: capitalize;
    border: 1px solid;
    cursor: pointer;
  }
  
  .tab:hover {
    background-color: #e0f7fa;
  }
  
  .active {
    cursor: pointer;
    border-color: #000;
    background-color: #3776d1;
    color: #fff;
  }
  
  .active:hover {
    background-color: #3776d1;
  }
  
  .disabled {
    cursor: not-allowed;
    color: #d8d2d2;
  }
  
  .disabled:hover {
    background-color: transparent;
  }
  
  .tabsContent {
    padding: 5px 10px;
    display: block;
    box-shadow: rgba(0, 0, 0, 0.4) 0 1px 3px;
    background-color: #fff;
    margin: 23px 0;
  }



  //test.js
import React, { Component } from "react";
import Tab from "./index";

class TabTest extends Component {
  state = {
    activeIndex: 0
  };

  onChange = activeIndex => {
    this.setState({
      activeIndex
    });
  };

  render() {
    const { activeIndex } = this.state;
    const tabs = [
      {
        label: "Tab 1",
        content: (
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book. It has survived not
            only five centuries, but also the leap into electronic typesetting,
            remaining essentially unchanged. It was popularised in the 1960s
            with the release of Letraset sheets containing Lorem Ipsum passages,
            and more recently with desktop publishing software like Aldus
            PageMaker including versions of Lorem Ipsum.
            <br />
            <br />
            Contrary to popular belief, Lorem Ipsum is not simply random text.
            It has roots in a piece of classical Latin literature from 45 BC,
            making it over 2000 years old. Richard McClintock, a Latin professor
            at Hampden-Sydney College in Virginia, looked up one of the more
            obscure Latin words, consectetur, from a Lorem Ipsum passage, and
            going through the cites of the word in classical literature,
            discovered the undoubtable source. Lorem Ipsum comes from sections
            1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes
            of Good and Evil) by Cicero, written in 45 BC. This book is a
            treatise on the theory of ethics, very popular during the
            Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit
            amet..", comes from a line in section 1.10.32.
          </div>
        ),
        disabled: false
      },
      {
        label: "Tab 2",
        content: (
          <div>
            It is a long established fact that a reader will be distracted by
            the readable content of a page when looking at its layout. The point
            of using Lorem Ipsum is that it has a more-or-less normal
            distribution of letters, as opposed to using 'Content here, content
            here', making it look like readable English. Many desktop publishing
            packages and web page editors now use Lorem Ipsum as their default
            model text, and a search for 'lorem ipsum' will uncover many web
            sites still in their infancy. Various versions have evolved over the
            years, sometimes by accident, sometimes on purpose (injected humour
            and the like).
            <br />
            <br />
            There are many variations of passages of Lorem Ipsum available, but
            the majority have suffered alteration in some form, by injected
            humour, or randomised words which don't look even slightly
            believable. If you are going to use a passage of Lorem Ipsum, you
            need to be sure there isn't anything embarrassing hidden in the
            middle of text. All the Lorem Ipsum generators on the Internet tend
            to repeat predefined chunks as necessary, making this the first true
            generator on the Internet. It uses a dictionary of over 200 Latin
            words, combined with a handful of model sentence structures, to
            generate Lorem Ipsum which looks reasonable. The generated Lorem
            Ipsum is therefore always free from repetition, injected humour, or
            non-characteristic words etc.
          </div>
        ),
        disabled: false
      }
    ];

    return (
      <Tab activeIndex={activeIndex} onChange={this.onChange} tabs={tabs} />
    );
  }
}

export default TabTest;