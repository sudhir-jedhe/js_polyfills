// Avoid returning the entire state from useSelector hook, instead access individual properties of state.

// So instead of writing code like this:

// const { albums } = useSelector((state) => state);

// write it like this:

// const albums = useSelector((state) => state.albums);

// Because whenever we use the useSelector hook in any component, and the store gets updated, the component using the useSelector hook gets re-rendered.

// So directly returning the entire state, causes your component to re-render unnecessarily, when anything changes in the entire store.