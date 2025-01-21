import React from "react"
import VirtualizedList from "./components/VirtualizedList"
import PaginatedList from "./components/PaginatedList"
import VirtualizedTable from "./components/VirtualizedTable"
import "./App.css"

function App() {
  return (
    <div className="App">
      <h1>React Virtualization Demo</h1>
      <section>
        <h2>Virtualized List (react-window)</h2>
        <VirtualizedList />
      </section>
      <section>
        <h2>Paginated List (react-virtualized)</h2>
        <PaginatedList />
      </section>
      <section>
        <h2>Virtualized Table (react-virtualized)</h2>
        <VirtualizedTable />
      </section>
    </div>
  )
}

export default App

