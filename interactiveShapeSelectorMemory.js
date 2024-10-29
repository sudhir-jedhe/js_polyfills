import Box from "/Box.js";
import React, { useEffect, useMemo, useRef, useState } from "react";
import classnames from "classnames";

const Shape = ({data})=>{
  const boxes= useMemo(()=>data.flat(Infinity),[data])
  const[selected, setSelected] = useState(new Set());
  const [deselect, setDeselect] = useState(false);
  const timerRef = useRef(null);

  const countofVisibleBoxes = useMemo(()=>{
    return boxes.reduce((acc,box)=>{
      if(box === 1){
        acc+=1;
      }
      return acc
    },0)
  },[boxes])

  const handleClick=(e)=>{
    //get the index & status of the box
    //order od interaction needs to be stored in some data structure
    //obj can maintain order on the basis of insertion but not reliable 100% 
    //quick lookup : set, or map
    const {target} =e;
    const index = target.getAttribute('data-index');
    const status = target.getAttribute('data-status');

    if(!index || status === 'hidden' || deselect || selected.has(index)){
      return 
    }
    setSelected(prev => 
     new Set(prev.add(index)))
  }

  const deselectHandler =()=>{
    setDeselect(true);
    const keys = Array.from(selected.keys());
    const removeNextKey =()=>{
      if(keys.length){
        const currentKey = keys.shift();
        setSelected(prev =>{
          const updatedKeys = new Set(prev);
          updatedKeys.delete(currentKey);
          return updatedKeys;
        })
        timerRef.current = setTimeout(removeNextKey,500)
      }else{
        setDeselect(false);
        clearTimeout(timerRef.current)
      }
    }
    timerRef.current = setTimeout(removeNextKey, 100)
  }

  useEffect(()=>{
    if(selected.size>=countofVisibleBoxes){
       //deselect
      deselectHandler();
    }
  },[selected])

return (
  //event bubbling will reduce the memory usage
  <div className ="boxes" onClick={handleClick}>
    {
      boxes.map((box, index)=>{
        const status = box === 1 ? 'visible' : 'hidden';
        const isSelected = selected.has(index.toString())
        return (
          <div key ={`${box}-${index}`}
          className={
            classnames(
              'box',status,
              isSelected && 'selected'
            )
          }
         data-index={index}
         data-status={status} 
          />
        )
      })
    }
  </div>
)
}

export default Shape;


* {
    box-sizing: border-box;
  }
  
  body {
    font-family: sans-serif;
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  .boxes{
    display: grid;
    grid-template-columns: repeat(3,1fr);
    gap:20px;
    padding: 50px;
    width: fit-content;
  }
  
  .box{
    width: 80px;
    height: 80px;
    transition: background-color 0.4s ease-in-out;
  }
  
  .box.visible{
    border: 1px solid black;
    cursor:pointer
  }
  
  .box.hidden{
    opacity: 0;
    cursor: initial;
  }
  
  .box.selected{
    background-color: #0bcc59;
    cursor: not-allowed;
  }


  /************************************* */

  import { useMemo, useState, useEffect } from 'react';

const Box = ({ data }) => {
  const flatData = useMemo(() => data.flat(Infinity), [data]);
  const countBoxes = useMemo(
    () => flatData.reduce((acc, curr) => acc + curr, 0),
    [data]
  );

  const [colorSeq, setColorSeq] = useState(new Set());

  const unloadColor = () => {
    let seqArr = Array.from(colorSeq);
    for (let i = 0; i < seqArr.length; i++) {
      setTimeout(() => {
        setColorSeq((prevSet)=>{
          let newSet = new Set([...prevSet]); 
          newSet.delete(seqArr[i].toString());
          return newSet; 
        });
      }, 300 * i);
    }
  };

  const handleBoxColor = ({ target }) => {
    if (colorSeq.size < countBoxes) {
      let boxId = target.getAttribute('data-set');
      let newSet = new Set([...colorSeq]);
      newSet.add(boxId);
      setColorSeq(newSet);
    }
  };

  useEffect(() => {
    if (colorSeq.size >= countBoxes) {
      unloadColor();
    }
  }, [colorSeq]);

  return (
    <div className="boxes">
      {flatData.map((box, index) => {
        let bgColor = colorSeq.has(index.toString()) ? 'green' : 'white';

        return box === 1 ? (
          <div
            key={index}
            className="box"
            style={{ backgroundColor: bgColor }}
            data-set={index}
            onClick={handleBoxColor}
          ></div>
        ) : (
          <div></div>
        );
      })}
    </div>
  );
};

export default Box;



* {
    box-sizing: border-box;
  }
  
  body {
    font-family: sans-serif;
    -webkit-font-smoothing: auto;
    -moz-font-smoothing: auto;
    -moz-osx-font-smoothing: grayscale;
    font-smoothing: auto;
    text-rendering: optimizeLegibility;
    font-smooth: always;
    -webkit-tap-highlight-color: transparent;
    -webkit-touch-callout: none;
  }
  
  .boxes {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    width: fit-content;
    grid-gap: 1em;
  }
  .box {
    height: 50px;
    width: 50px;
    border: 1px solid black; 
    cursor: pointer;
  }

  
  // Use this data to create the shape

const BOX_DATA = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
];

export default function App() {
  return (
    <main>
      <Box data={BOX_DATA} />
    </main>
  );
}

/******************************* */