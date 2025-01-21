import React, { useState } from "react"
import { List, AutoSizer } from "react-virtualized"

const PaginatedList = () => {
  const [currentPage, setCurrentPage] = useState(0)
  const itemsPerPage = 10
  const totalItems = 100

  const rowRenderer = ({ index, key, style }) => {
    const itemIndex = currentPage * itemsPerPage + index
    return (
      <div
        key={key}
        style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd" }}
      >
        Item {itemIndex + 1}
      </div>
    )
  }

  return (
    <div>
      <div style={{ width: "300px", height: "300px", margin: "0 auto" }}>
        <AutoSizer>
          {({ width, height }) => (
            <List width={width} height={height} rowCount={itemsPerPage} rowHeight={50} rowRenderer={rowRenderer} />
          )}
        </AutoSizer>
      </div>
      <div>
        <button onClick={() => setCurrentPage((prev) => Math.max(0, prev - 1))} disabled={currentPage === 0}>
          Previous Page
        </button>
        <span>
          {" "}
          Page {currentPage + 1} of {Math.ceil(totalItems / itemsPerPage)}{" "}
        </span>
        <button
          onClick={() => setCurrentPage((prev) => Math.min(Math.ceil(totalItems / itemsPerPage) - 1, prev + 1))}
          disabled={currentPage === Math.ceil(totalItems / itemsPerPage) - 1}
        >
          Next Page
        </button>
      </div>
    </div>
  )
}

export default PaginatedList

