Let's create a React component that demonstrates timeout management, including setting multiple timeouts and clearing them all at once. We'll implement this using a custom hook for better React integration.

```typescriptreact project="TimeoutManagerDemo"
...
```

This implementation demonstrates the concept of managing multiple timeouts and clearing them all at once. Here's a breakdown of the key aspects:

1. **Custom Hook (useTimeoutManager)**:

1. Implements `setCustomTimeout` which sets a timeout and stores its ID.
2. Implements `clearAllTimeouts` which clears all stored timeouts.
3. Uses `useRef` to maintain the list of timeout IDs across renders.
4. Automatically removes timeout IDs from the list once they've executed.



2. **TimeoutManagerDemo Component**:

1. Uses the custom hook to manage timeouts.
2. Provides buttons to start timeouts and clear all timeouts.
3. Displays logs of timeout executions in real-time.



3. **Timeout Management**:

1. Three different timeouts are set when "Start Timeouts" is clicked.
2. All timeouts are cleared when "Clear All Timeouts" is clicked or when the component unmounts.
3. An additional timeout is set to update the UI when all timeouts have completed.



4. **State Management**:

1. Uses `useState` for managing logs and the running state.
2. Uses `useCallback` to memoize functions and prevent unnecessary re-renders.



5. **User Interface**:

1. Two buttons for starting and stopping timeouts.
2. A scrollable area to display logs of timeout executions.



6. **Styling**: Uses shadcn/ui components for consistent styling.


This implementation provides an interactive way to demonstrate how multiple timeouts can be managed and cleared simultaneously. It's a more React-friendly and maintainable approach compared to the global `MY_TIMERS` object, as it encapsulates the timeout management logic within a custom hook and component.

The component also handles edge cases, such as preventing multiple starts and ensuring all timeouts are cleared when the component unmounts, which is crucial for preventing memory leaks in React applications.