import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

const App = () => {
  const initialData = {
    lists: {
      'todo': { id: 'todo', title: 'To Do', cards: [] },
      'inProgress': { id: 'inProgress', title: 'In Progress', cards: [] },
      'done': { id: 'done', title: 'Done', cards: [] }
    },
  };

  // Load saved data from localStorage or fall back to initialData
  const loadStateFromLocalStorage = () => {
    const savedState = localStorage.getItem('boardState');
    return savedState ? JSON.parse(savedState) : initialData;
  };

  const [state, setState] = useState(loadStateFromLocalStorage);

  // Save to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('boardState', JSON.stringify(state));
  }, [state]);

  // Handle card creation
  const handleAddCard = (listId) => {
    const newCardTitle = prompt('Enter the title of the new card:');
    if (newCardTitle) {
      const newCard = { id: Date.now().toString(), title: newCardTitle };
      const newLists = { ...state.lists };
      newLists[listId].cards.push(newCard);
      setState({ ...state, lists: newLists });
    }
  };

  // Handle card deletion
  const handleDeleteCard = (listId, cardId) => {
    const newLists = { ...state.lists };
    newLists[listId].cards = newLists[listId].cards.filter(card => card.id !== cardId);
    setState({ ...state, lists: newLists });
  };

  // Handle drag-and-drop
  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startList = state.lists[source.droppableId];
    const finishList = state.lists[destination.droppableId];

    // Reordering within the same list
    if (startList === finishList) {
      const newCards = Array.from(startList.cards);
      newCards.splice(source.index, 1);
      newCards.splice(destination.index, 0, { id: draggableId });
      const newLists = { ...state.lists, [startList.id]: { ...startList, cards: newCards } };
      setState({ ...state, lists: newLists });
    } else {
      // Moving card from one list to another
      const startCards = Array.from(startList.cards);
      const [movedCard] = startCards.splice(source.index, 1);
      const finishCards = Array.from(finishList.cards);
      finishCards.splice(destination.index, 0, movedCard);
      const newLists = {
        ...state.lists,
        [startList.id]: { ...startList, cards: startCards },
        [finishList.id]: { ...finishList, cards: finishCards },
      };
      setState({ ...state, lists: newLists });
    }
  };

  return (
    <div className="App">
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="board">
          {Object.values(state.lists).map((list) => (
            <div key={list.id} className="list">
              <h2>{list.title}</h2>
              <button onClick={() => handleAddCard(list.id)}>Add Card</button>
              <Droppable droppableId={list.id}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="card-list"
                  >
                    {list.cards.map((card, index) => (
                      <Draggable key={card.id} draggableId={card.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="card"
                          >
                            <span>{card.title}</span>
                            <button onClick={() => handleDeleteCard(list.id, card.id)}>Delete</button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default App;


.App {
    font-family: Arial, sans-serif;
    display: flex;
    justify-content: center;
    padding: 20px;
  }
  
  .board {
    display: flex;
    gap: 20px;
  }
  
  .list {
    border: 1px solid #ccc;
    padding: 10px;
    width: 250px;
  }
  
  .card-list {
    margin-top: 10px;
  }
  
  .card {
    background-color: #f4f4f4;
    border: 1px solid #ddd;
    padding: 10px;
    margin-bottom: 10px;
    display: flex;
    justify-content: space-between;
  }
  
  button {
    padding: 5px 10px;
    cursor: pointer;
    margin-top: 10px;
  }
  
  h2 {
    margin-top: 0;
  }
  



  /******************************************************* */


  import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './App.css';

// Helper function to reorder lists after drag-and-drop
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

// Helper function to reorder cards within a list
const reorderCards = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

function App() {
  // Load board data from localStorage or set default state
  const loadBoardData = () => {
    const savedData = localStorage.getItem('boardData');
    if (savedData) {
      return JSON.parse(savedData);
    }
    return {
      lists: [
        {
          id: 'todo',
          title: 'To Do',
          cards: [
            { id: 'card-1', content: 'Learn React' },
            { id: 'card-2', content: 'Create a JIRA clone' }
          ]
        },
        {
          id: 'in-progress',
          title: 'In Progress',
          cards: []
        },
        {
          id: 'done',
          title: 'Done',
          cards: []
        }
      ]
    };
  };

  const [boardData, setBoardData] = useState(loadBoardData);

  useEffect(() => {
    // Save board state to localStorage whenever it changes
    localStorage.setItem('boardData', JSON.stringify(boardData));
  }, [boardData]);

  // Handle drag and drop event
  const onDragEnd = (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return; // Dropped outside the list
    }

    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return; // Dropped in the same spot
    }

    const startListIndex = boardData.lists.findIndex(list => list.id === source.droppableId);
    const endListIndex = boardData.lists.findIndex(list => list.id === destination.droppableId);

    const newLists = Array.from(boardData.lists);
    const startList = newLists[startListIndex];
    const endList = newLists[endListIndex];

    if (source.droppableId === destination.droppableId) {
      // Moving within the same list
      startList.cards = reorderCards(startList.cards, source.index, destination.index);
    } else {
      // Moving from one list to another
      const [movedCard] = startList.cards.splice(source.index, 1);
      endList.cards.splice(destination.index, 0, movedCard);
    }

    setBoardData({ ...boardData, lists: newLists });
  };

  const handleAddCard = (listId) => {
    const newCard = { id: `card-${Date.now()}`, content: 'New Task' };
    const updatedLists = boardData.lists.map(list => {
      if (list.id === listId) {
        return { ...list, cards: [...list.cards, newCard] };
      }
      return list;
    });

    setBoardData({ ...boardData, lists: updatedLists });
  };

  const handleDeleteCard = (listId, cardId) => {
    const updatedLists = boardData.lists.map(list => {
      if (list.id === listId) {
        return { ...list, cards: list.cards.filter(card => card.id !== cardId) };
      }
      return list;
    });

    setBoardData({ ...boardData, lists: updatedLists });
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="board">
        {boardData.lists.map(list => (
          <div key={list.id} className="list">
            <h2>{list.title}</h2>
            <button onClick={() => handleAddCard(list.id)}>Add Card</button>
            <Droppable droppableId={list.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`card-list ${snapshot.isDraggingOver ? 'dragging-over' : ''}`}
                >
                  {list.cards.map((card, index) => (
                    <Draggable key={card.id} draggableId={card.id} index={index}>
                      {(provided) => (
                        <div
                          className="card"
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="card-content">{card.content}</div>
                          <button className="delete-card" onClick={() => handleDeleteCard(list.id, card.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  );
}

export default App;



* {
    box-sizing: border-box;
  }
  
  body {
    font-family: Arial, sans-serif;
    background-color: #f4f5f7;
    margin: 0;
    padding: 0;
  }
  
  .board {
    display: flex;
    justify-content: space-around;
    padding: 20px;
  }
  
  .list {
    background-color: #ffffff;
    width: 300px;
    border-radius: 8px;
    padding: 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  }
  
  .list h2 {
    font-size: 18px;
    text-align: center;
  }
  
  .card-list {
    margin-top: 20px;
  }
  
  .card {
    background-color: #ffffff;
    border-radius: 5px;
    padding: 10px;
    margin-bottom: 10px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    cursor: move;
  }
  
  .card-content {
    margin-bottom: 10px;
  }
  
  .delete-card {
    background: red;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 3px;
    cursor: pointer;
    font-size: 12px;
  }
  
  .delete-card:hover {
    background: darkred;
  }
  
  button {
    padding: 5px 10px;
    margin-bottom: 10px;
    background-color: #5aac44;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #4d8b3e;
  }
  
  .dragging-over {
    background-color: #f0f0f0;
  }
  