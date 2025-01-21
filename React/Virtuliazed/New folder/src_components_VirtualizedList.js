import React from "react"
import { FixedSizeList as List } from "react-window"

const Row = ({ index, style }) => (
  <div style={{ ...style, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd" }}>
    Row {index + 1}
  </div>
)

const VirtualizedList = () => {
  return (
    <List height={300} itemCount={1000} itemSize={50} width={300} style={{ margin: "0 auto" }}>
      {Row}
    </List>
  )
}

export default VirtualizedList

