import "./style.css";
import { board, make2dcopy } from "./board/board";

export const board = [
    ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],
    ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
    ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],
    ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
    ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],
    ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
    ['white', 'black', 'white', 'black', 'white', 'black', 'white', 'black'],
    ['black', 'white', 'black', 'white', 'black', 'white', 'black', 'white'],
  ];
  
  export const make2dcopy=(arr) =>{
    return arr.map(row => [...row]);
  }


  body {
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  h1,
  p {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen,
      Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  }
  
  .field-container {
    display: flex;
    flex-wrap: wrap;
    width: 35rem;
    margin: auto;
  }
  
  .field {
    width: 4rem;
    height: 4rem;
    border: 1px solid rgba(0, 0, 0, 0.3);
  }
  .btn {
    background-color: rgb(43, 137, 226);
    color: white;
    padding: 0.5rem 1rem;
    width: fit-content;
    margin: 1rem auto;
    cursor: pointer;
  }
  

  import React, { useState, useRef } from 'react';

export default function App() {
  const [fields, setFields] = useState(make2dcopy(board));

  const changeColor = (row, column) => {
    const updatedFields = [...fields];
    updatedFields[row][column] = 'red';
    setFields(updatedFields);
  };
  const resetField = () => {
    setFields(make2dcopy(board));
  };
  const diagnoltopleft = (row, column) => {
    if (row >= 0 && column >= 0) {
      changeColor(row, column);
      diagnoltopleft(row - 1, column - 1);
    }
  };
  const diagnolbottomright = (row, column) => {
    if (row <= 7 && column <= 7) {
      changeColor(row, column);
      diagnolbottomright(row + 1, column + 1);
    }
  };
  const diagnolbottomleft = (row, column) => {
    if (row <= 7 && column >= 0) {
      changeColor(row, column);
      diagnolbottomleft(row + 1, column - 1);
    }
  };
  const diagnoltopright = (row, column) => {
    if (row >= 0 && column <= 7) {
      changeColor(row, column);
      diagnoltopright(row - 1, column + 1);
    }
  };
  return (
    <div>
      {console.log(board)}
      <div className="field-container">
        {fields.map((e, row) => {
          return e.map((e1, column) => {
            return (
              <div
                className="field"
                key={row + column}
                style={{ background: `${e1}` }}
                onClick={() => {
                  resetField();
                  diagnoltopleft(row, column);
                  diagnoltopright(row, column);
                  diagnolbottomright(row, column);
                  diagnolbottomleft(row, column);
                }}
              ></div>
            );
          });
        })}
      </div>
      <div className="btn" onClick={resetField}>
        clear
      </div>
    </div>
  );
}
