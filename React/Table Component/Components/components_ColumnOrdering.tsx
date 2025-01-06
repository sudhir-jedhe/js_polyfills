import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

interface Column {
  accessor: string;
  Header: string;
}

interface ColumnOrderingProps {
  columns: Column[];
  columnOrder: string[];
  onColumnOrderChange: (newOrder: string[]) => void;
}

const ColumnOrdering: React.FC<ColumnOrderingProps> = ({ columns, columnOrder, onColumnOrderChange }) => {
  const onDragEnd = (result: any) => {
    if (!result.destination) {
      return;
    }

    const newOrder = Array.from(columnOrder);
    const [reorderedItem] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, reorderedItem);

    onColumnOrderChange(newOrder);
  };

  return (
    <div className="mb-4">
      <h3 className="text-lg font-medium leading-6 text-gray-900 mb-2">Column Ordering</h3>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="column-list" direction="horizontal">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex flex-wrap gap-2"
            >
              {columnOrder.map((columnId, index) => {
                const column = columns.find(c => c.accessor === columnId);
                if (!column) return null;
                return (
                  <Draggable key={columnId} draggableId={columnId} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white border border-gray-300 rounded px-3 py-2 cursor-move"
                      >
                        {column.Header}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ColumnOrdering;

