*** copy 07-independent-hook-instances.md ***

# Snippet: Two Independent Calls to the Same Custom Hook Never Share State

```jsx
function useCounter(initial = 0) {
  const [count, setCount] = useState(initial);
  return [count, () => setCount((c) => c + 1)];
}

function Dashboard() {
  const [likes, incrementLikes] = useCounter(0);
  const [shares, incrementShares] = useCounter(0);
  // likes and shares are fully independent, even though both come from useCounter
  return (
    <div>
      <button onClick={incrementLikes}>Likes: {likes}</button>
      <button onClick={incrementShares}>Shares: {shares}</button>
    </div>
  );
}
```
