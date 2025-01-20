import React, { useState } from 'react';
import useList from './useList';

const ListManager = () => {
  const { list, addItem, removeItem, updateItem, clearList } = useList();
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  const handleAddItem = () => {
    if (newItem) {
      addItem(newItem);
      setNewItem('');
    }
  };

  const handleUpdateItem = () => {
    if (editIndex !== null && editValue) {
      updateItem(editIndex, editValue);
      setEditIndex(null);
      setEditValue('');
    }
  };

  return (
    <div>
      <h2>List Manager</h2>

      {/* Add Item */}
      <div>
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add new item"
        />
        <button onClick={handleAddItem}>Add Item</button>
      </div>

      {/* Edit Item */}
      <div>
        {editIndex !== null && (
          <>
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              placeholder="Edit item"
            />
            <button onClick={handleUpdateItem}>Update Item</button>
          </>
        )}
      </div>

      {/* List Display */}
      <ul>
        {list.map((item, index) => (
          <li key={index}>
            {item}
            <button onClick={() => removeItem(index)}>Remove</button>
            <button
              onClick={() => {
                setEditIndex(index);
                setEditValue(item);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>

      {/* Clear List */}
      <button onClick={clearList}>Clear List</button>
    </div>
  );
};

export default ListManager;
