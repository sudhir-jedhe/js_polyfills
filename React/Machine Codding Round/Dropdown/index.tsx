import React, { useState } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

const options: DropdownItem[] = [
  { label: "React JS", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Node.js", value: "node" },
  { label: "GraphQL", value: "graphql" },
  { label: "Disabled Option", value: "disabled", disabled: true },
];

const App = () => {
  const [selectedSkill, setSelectedSkill] = useState<string>("");

  return (
    <div style={{ padding: "40px" }}>
      <h2>Single Select Dropdown</h2>

      <Dropdown
        items={options}
        placeholder="Select a skill"
        selectedValue={selectedSkill}
        onChange={(value) => setSelectedSkill(value as string)}
      />

      <p>Selected value: {selectedSkill}</p>
    </div>
  );
};

export default App;