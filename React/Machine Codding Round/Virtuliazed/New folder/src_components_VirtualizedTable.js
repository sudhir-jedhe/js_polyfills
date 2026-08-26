import React from "react"
import { AutoSizer, Table, Column } from "react-virtualized"

const VirtualizedTable = () => {
  const list = Array(1000)
    .fill()
    .map((_, index) => ({
      id: index,
      name: `Item ${index}`,
      description: `Description for item ${index}`,
    }))

  return (
    <div style={{ height: "400px", width: "100%", maxWidth: "600px", margin: "0 auto" }}>
      <AutoSizer>
        {({ height, width }) => (
          <Table
            width={width}
            height={height}
            headerHeight={20}
            rowHeight={30}
            rowCount={list.length}
            rowGetter={({ index }) => list[index]}
          >
            <Column label="ID" dataKey="id" width={100} />
            <Column width={200} label="Name" dataKey="name" />
            <Column width={300} label="Description" dataKey="description" />
          </Table>
        )}
      </AutoSizer>
    </div>
  )
}

export default VirtualizedTable

