import { useState } from 'react';

export const useEditableData = (initialData: any[]) => {
  const [editableData, setEditableData] = useState(initialData);

  const updateEditableData = (rowIndex: number, columnId: string, value: any) => {
    setEditableData((prevData) => {
      const newData = [...prevData];
      newData[rowIndex] = { ...newData[rowIndex], [columnId]: value };
      return newData;
    });
  };

  return { editableData, updateEditableData };
};

