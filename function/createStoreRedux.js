const createStore = (reducer, initialState) => {
  let state = initialState;
  const listeners = [];

  return {
    subscribe: (listener) => {
      listeners.push(listener);
      return () => {
        listeners.filter((l) => l !== listener);
      };
    },
    getState: () => state,
    dispatch: (action) => {
      state = reducer(state, action);
    },
  };
};

import { createStore } from "redux";

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {};

const store = createStore(rootReducer, initialState);

import { createStore } from "customRedux";

const rootReducer = (state = {}, action) => {
  switch (action.type) {
    case "ADD_USER":
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

const initialState = {};

const store = createStore(rootReducer, initialState);

store.subscribe(() => {
  console.log("Listener called");
});

console.log(store.getState()); // {}

store.dispatch({
  type: "ADD_USER",
  payload: {
    id: 1,
    name: "Yomesh Gupta",
  },
});

/**
  Listener called
   { user: { id: 1, name: 'Yomesh Gupta' } }
**/
console.log(store.getState());
