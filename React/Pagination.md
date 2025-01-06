// Whenever we show limited no of items on any particular component, we either use pagination or lazy loading to show more items on certain user actions.

// In pagination we divide the total no of items in different pages based on the limit that is provided. If user has to view more items then he needs to navigate to different page.

// The navigation can be either done by moving next or prev in which only one change will happen or moving directly to the certain page.

// Based on this we will create a simple pagination component in react.

// It will be a functional component as we don’t want this component to maintain any state, it should always be controlled by a parent component to match the list of items being shown




import React from "react";
import PropTypes from "prop-types";
import styles from "./index.module.css";
import cx from "classnames";

const Pagination = ({perPage, current, onChange, totalItems}) => {
  //Get total no of pages needed
  const getTotalPages = () => {
    return Math.ceil(totalItems / perPage);
  };

  const next = () => {
    const total = getTotalPages();

    if (current < total) {
      const start = current * perPage;
      const end = (current + 1) * perPage;
      onChange && onChange({ start, end, current: current + 1 });
    }
  };

  const prev = () => {
    const total = getTotalPages();

    if (current > 1 && current <= total) {
      const start = (current - 2) * perPage;
      const end = (current - 1) * perPage;
      onChange && onChange({ start, end, current: current - 1 });
    }
  };

  const direct = i => {
    if (current !== i) {
      const start = (i - 1) * perPage;
      const end = i * perPage;
      onChange && onChange({ start, end, current: i });
    }
  };

  const total = getTotalPages();

  let links = [];
  for (let i = 1; i <= total; i++) {
    links.push(
      <li
        onClick={() => direct(i)}
        key={i}
        className={cx({ [styles.active]: current === i })}
      >
        {i}
      </li>
    );
  }

  return (
    <ul className={styles.wrapper}>
      <li onClick={prev}>&lt;</li>
      {links}
      <li onClick={next}>&gt;</li>
    </ul>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  perPage: PropTypes.number.isRequired,
  current: PropTypes.number.isRequired,
  onChange: PropTypes.func
};

Pagination.defaultProps = {
  totalItems: 36,
  perPage: 5,
  current: 1
};

export default Pagination;



//index.module.css
.wrapper {
    display: inline-flex;
    justify-content: space-between;
    align-items: center;
    color: #5e6776;
    border: 1px solid #607D8B;
    padding: 0;
  }
  
  .wrapper > li {
    background-color: #fff;
    width: 20%;
    text-align: center;
    border-right: 1px solid #607D8B;
    padding: 8px 14px;
    list-style-type: none;
    cursor: pointer;
  }
  
  .wrapper > li:last-child {
    border: none;
  }
  
  .wrapper > li.active {
    background-color: #e9e9eb;
  }



  //test.js
import React, { useState } from "react";
import Pagination from "./App";

const PaginationTest = () => {
  const [current, setCurrent] = useState(1);

  const onChange = ({ start, end, current }) => {
    setCurrent(current);
  };

  return (
    <Pagination
      current={current}
      onChange={onChange}
      totalItems={43}
      perPage={7}
    />
  );
}

export default PaginationTest;