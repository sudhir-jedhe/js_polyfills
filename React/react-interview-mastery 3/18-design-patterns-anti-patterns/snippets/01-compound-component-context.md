# Compound Component Sharing Implicit State via Context

```jsx
const AccordionContext = createContext();

function Accordion({ children }) {
  const [openIndex, setOpenIndex] = useState(null);
  return (
    <AccordionContext.Provider value={{ openIndex, setOpenIndex }}>
      {children}
    </AccordionContext.Provider>
  );
}

function AccordionItem({ index, title, children }) {
  const { openIndex, setOpenIndex } = useContext(AccordionContext);
  const isOpen = openIndex === index;
  return (
    <div>
      <button onClick={() => setOpenIndex(isOpen ? null : index)}>{title}</button>
      {isOpen && <div>{children}</div>}
    </div>
  );
}
```
