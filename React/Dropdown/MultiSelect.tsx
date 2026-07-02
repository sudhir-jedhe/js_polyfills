import React, { useState } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

const options: DropdownItem[] = [
  { label: "React JS", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Playwright", value: "playwright" },
  { label: "Redux Toolkit", value: "redux" },
];

const MultiSelectExample = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Dropdown
      items={options}
      placeholder="Select technologies"
      multiSelect
      selectedValue={selectedValues}
      onChange={(value) => setSelectedValues(value as string[])}
    />
  );
};

export default MultiSelectExample;