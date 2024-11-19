import React from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./index.module.css";

const TimeLine = props => {
  let { events, orientation, startFrom } = props;

  //Reverse the list
  if (startFrom === "last") {
    events = events.reverse();
  }

  //Mapped List
  const eventsMappedToElements = events.map((e, i) => (
    <div
      key={e.time}
      className={cx(styles.timelineItem, { [styles.right]: i % 2 !== 0 })}
    >
      <div className={styles.timelineContent}>
        <span className={styles.time}>{e.time}</span>
        <span className={styles.title}>{e.title}</span>
        <p className={styles.desc}>{e.desc}</p>
      </div>
    </div>
  ));

  return (
    <div
      className={cx({
        [styles.vertical]: orientation === "vertical",
        [styles.horizontal]: orientation === "horizontal"
      })}
    >
      {eventsMappedToElements}
    </div>
  );
};

TimeLine.propTypes = {
  events: PropTypes.arrayOf(
    PropTypes.shape({
      time: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      desc: PropTypes.string.isRequired
    })
  ).isRequired,
  orientation: PropTypes.oneOf(["horizontal", "vertical"]).isRequired,
  startFrom: PropTypes.oneOf(["first", "last"]).isRequired
};

TimeLine.defaultProps = {
  orientation: "vertical",
  startFrom: "last"
};

export default TimeLine;



/* Common Style */
.time {
    display: inline-block;
    width: 100%;
    font-size: 24px;
    margin-bottom: 5px;
  }
  
  .title {
    display: inline-block;
    width: 100%;
    font-size: 18px;
    margin-bottom: 5px;
  }
  
  .desc {
    margin: 0;
  }





  /* Vertical */
.vertical {
    position: relative;
    width: 1200px;
    margin: 0 auto;
    padding: 15px;
    background-color: #ce93d8;
  }
  
  .vertical:after {
    content: "";
    position: absolute;
    width: 6px;
    background-color: white;
    top: 0;
    bottom: 0;
    left: 50%;
    margin-left: -3px;
  }
  
  .vertical .timelineItem {
    width: 50%;
    padding: 10px 45px;
    position: relative;
    text-align: center;
  }
  
  .vertical .timelineContent {
    background-color: #ec407a;
    padding: 15px;
    border-radius: 4px;
  }
  
  .vertical .timelineItem:before {
    content: " ";
    height: 0;
    position: absolute;
    top: 22px;
    width: 0;
    z-index: 1;
    right: 35px;
    border: medium solid #880e4f;
    border-width: 10px 0 10px 10px;
    border-color: transparent transparent transparent #880e4f;
  }
  
  .vertical .timelineItem::after {
    content: "";
    position: absolute;
    width: 25px;
    height: 25px;
    right: -16px;
    background-color: white;
    border: 4px solid #e91e63;
    top: 19px;
    border-radius: 50%;
    z-index: 1;
  }
  
  .vertical .timelineItem.right {
    left: 50%;
  }
  
  .vertical .timelineItem.right:before {
    left: 35px;
    border-width: 10px 10px 10px 0;
    border-color: transparent #880e4f transparent transparent;
  }
  
  .vertical .timelineItem.right::after {
    left: -16px;
  }





  /* Horizontal */
.horizontal {
    position: relative;
    height: 926px;
    max-height: 926px;
    overflow-x: auto;
    background: red;
    display: flex;
    flex-wrap: unset;
    align-items: flex-start;
  }
  
  .horizontal .timelineItem {
    position: relative;
    flex: 0 0 500px;
    max-width: 500px;
    min-height: 294px;
    padding: 50px 10px;
  }
  
  .horizontal .timelineItem:after {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    bottom: 0;
    background: #fff;
  }
  
  .horizontal .timelineItem.right {
    align-self: flex-end;
  }
  
  .horizontal .timelineItem.right:after {
    display: none;
  }
  
  .horizontal .timelineItem.right:before {
    content: "";
    position: absolute;
    width: 100%;
    height: 5px;
    top: 0;
    background: #fff;
  }
  
  .horizontal .timelineContent {
    position: relative;
    padding: 30px;
    background-color: #fff;
  }
  
  .horizontal .timelineContent:before {
    content: " ";
    height: 0;
    position: absolute;
    bottom: -10px;
    width: 0;
    z-index: 1;
    left: 35px;
    border: medium solid #880e4f;
    border-width: 10px 10px 0 10px;
    border-color: #fff transparent transparent transparent;
  }
  
  .horizontal .timelineContent::after {
    content: "";
    position: absolute;
    width: 25px;
    height: 25px;
    left: 27px;
    background-color: white;
    border: 4px solid #e91e63;
    bottom: -65px;
    border-radius: 50%;
    z-index: 1;
  }
  
  .horizontal .right .timelineContent::before {
    top: -10px;
    border-width: 0 10px 10px 10px;
    border-color: transparent transparent #fff transparent;
  }
  
  .horizontal .right .timelineContent::after {
    top: -65px;
  }



  import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import TimeLine from "./Components/Timeline";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
  <div className="abc">
    <TimeLine
      events={[
        {
          time: "1942",
          title: "The great plague",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1945",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1946",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1947",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1948",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1949",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        },
        {
          time: "1950",
          title: "The great flu",
          desc:
            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum"
        }
      ]}
      startFrom={"last"}
      orientation={"horizontal"}
    />
  </div>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();