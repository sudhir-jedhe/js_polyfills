import React, { useState } from "react";
import Dropdown, { DropdownItem } from "./Dropdown";

const options: DropdownItem[] = [
  { label: "React JS", value: "react" },
  { label: "TypeScript", value: "typescript" },
  { label: "Redux Toolkit", value: "redux" },
  { label: "Playwright", value: "playwright" },
];

const MultiSelectExample = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  return (
    <Dropdown
      items={options}
      placeholder="Select skills"
      multiSelect
      selectedValue={selectedValues}
      size="md"
      placement="bottom"
      align="start"
      width="trigger"
      variant="outlined"
      onChange={(value) => setSelectedValues(value as string[])}
    />
  );
};

export default MultiSelectExample;