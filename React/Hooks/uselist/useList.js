import { useState } from 'react';

function useList(initialList = []) {
  const [list, setList] = useState(initialList);

  // Add an item to the list
  const addItem = (item) => {
    setList((prevList) => [...prevList, item]);
  };

  // Remove an item by its index
  const removeItem = (index) => {
    setList((prevList) => prevList.filter((_, i) => i !== index));
  };

  // Update an item by its index
  const updateItem = (index, updatedItem) => {
    setList((prevList) =>
      prevList.map((item, i) => (i === index ? updatedItem : item))
    );
  };

  // Clear all items in the list
  const clearList = () => {
    setList([]);
  };

  return {
    list,
    addItem,
    removeItem,
    updateItem,
    clearList,
  };
}

export default useList;
