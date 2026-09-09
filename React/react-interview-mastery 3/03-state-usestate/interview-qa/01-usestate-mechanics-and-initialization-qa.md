***  01-usestate-mechanics-and-initialization-qa.md ***

# Interview Q&A — `useState` Mechanics and Initialization

**Q: What does `useState` return, and how does the returned pair typically get used?**
It returns a two-element array: the current state value and a setter function to update it. The standard idiom is array destructuring with descriptive names: `const [count, setCount] = useState(0)`. Calling the setter schedules a re-render of the component with the new value; the state itself persists across re-renders of the same component instance.

**Q: Why does the argument passed to `useState` only matter on the first render?**
Because React uses it purely as the seed value for that component instance's state slot when it's created (mounted). On every subsequent render, React returns whatever the current value of that state slot is and ignores the argument entirely — even if the argument expression evaluates to something different on a later render (e.g., a changed prop being passed in).

**Q: What's the difference between `useState(expensiveFn())` and `useState(() => expensiveFn())`?**
The first form calls `expensiveFn()` on every single render (because JavaScript evaluates function arguments before the call happens), even though React only uses the result on the first render — wasting the computation on every subsequent render. The second, "lazy initializer" form passes a function instead, and React only invokes it once, during the initial mount, which is the correct pattern for expensive initial-state computation.
