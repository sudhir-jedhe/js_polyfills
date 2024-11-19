// For example suppose you are visiting an e-commerce website where there are many list of items, It does not makes any sense to load all the items at once, instead it is better to fetch more items after user has seen the previous items.

// Often we pre-fetch say 20 items and then fetch more items once the user has seen them by either scrolling down to end or with pagination.

// The no of items that needs to fetched depend upon the UI/UX and how many items we want user to see at once.

// I have already created the pagination component in react, this time I am going to do the lazy loading.

// In this you can determine when do you want to lazy load the items, I will be doing it after user has scrolled to the end vertically.

// Lazy loading in react.
// There are few extra packages which we will be utilizing for our development.

// classnames: This helps us to use CSS classes as javascript objects, we just have to name our CSS file as filename.module.css.
// lodash: Set of helpful utility function.


import React, { Component } from "react";
import styles from "./index.module.css";
import { debounce } from "lodash";

const URL = "https://reqres.in/api/users";

class LazyLoading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      currentPage: 0,
      isLoading: false,
      error: false
    };
  }

  componentDidMount() {
    this.fetchData();
    window.addEventListener("scroll", debounce(this.lazyLoad, 300));
    window.addEventListener("resize", debounce(this.lazyLoad, 300));
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", () => {});
    window.removeEventListener("resize", () => {});
  }

  lazyLoad = () => {
    const advance = 100;
    const { innerHeight, scrollY } = window;
    const { offsetHeight } = document.body;
    if (innerHeight + scrollY + advance >= offsetHeight) {
      // you're at the bottom of the page
      this.fetchData();
    }
  };

  fetchData = async () => {
    try {
      const { currentPage, list } = this.state;
      this.setState({
        error: false,
        isLoading: true
      });

      const res = await fetch(`${URL}?page=${currentPage + 1}`);
      const { data } = await res.json();

      this.setState({
        list: [...list, ...data],
        currentPage: currentPage + 1
      });
    } catch (e) {
      this.setState({
        error: true
      });
    } finally {
      this.setState({
        isLoading: false
      });
    }
  };

  render() {
    const { list, isLoading, error } = this.state;

    const items = list.map(e => (
      <div key={e.id} className={styles.item}>
        <div className={styles.wrapper}>
          <img src={e.avatar} alt={e.first_name} />
          <span>
            Name: {e.first_name} {e.last_name}
          </span>
          <span>Email: {e.email}</span>
        </div>
      </div>
    ));

    return (
      <>
        {isLoading && <div className={styles.fullScreenLoader}></div>}
        <div className={styles.container}>{items}</div>
        {error && (
          <div className={styles.error}>
            There was some error while fetching the data
          </div>
        )}
      </>
    );
  }
}

export default LazyLoading;



.container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .item {
    -webkit-box-flex: 0;
    -ms-flex: 0 0 33.333333%;
    flex: 0 0 50%;
    max-width: 50%;
    padding: 0 10px;
    margin: 10px 0;
  }
  
  .wrapper {
    box-shadow: 0 0.25rem 0.75rem rgba(0, 0, 0, 0.05);
    padding: 25px;
    text-align: center;
    background: #fbe9e7;
  }
  
  .wrapper > img {
    display: inline-block;
    width: 100%;
    max-width: 18em;
    margin: 0 auto;
  }
  
  .wrapper > span {
    display: inline-block;
    width: 100%;
    margin: 5px;
  }
  
  .fullScreenLoader {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    z-index: 99999;
    background-color: rgba(0, 0, 0, 0.75);
  }
  
  .error {
    color: red;
    text-transform: capitalize;
    font-size: 18px;
  }