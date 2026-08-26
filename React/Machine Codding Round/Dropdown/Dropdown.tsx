import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  KeyboardEvent,
} from "react";
import "./Dropdown.css";

export type DropdownItem = {
  label: string;
  value: string;
  disabled?: boolean;
};

type DropdownPlacement = "top" | "bottom" | "left" | "right";

type DropdownProps = {
  items: DropdownItem[];
  placeholder?: string;
  selectedValue?: string | string[];
  isDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string;
  placement?: DropdownPlacement;
  multiSelect?: boolean;
  onChange?: (value: string | string[], item?: DropdownItem) => void;
};

const Dropdown: React.FC<DropdownProps> = ({
  items,
  placeholder = "Select",
  selectedValue,
  isDisabled = false,
  isLoading = false,
  errorMessage,
  placement = "bottom",
  multiSelect = false,
  onChange,
}) => {
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number>(-1);
  const [internalValue, setInternalValue] = useState<string | string[]>(
    multiSelect ? [] : ""
  );

  const currentValue = selectedValue ?? internalValue;

  const enabledItems = useMemo(
    () => items.filter((item) => !item.disabled),
    [items]
  );

  const selectedItems = useMemo(() => {
    if (multiSelect && Array.isArray(currentValue)) {
      return items.filter((item) => currentValue.includes(item.value));
    }

    if (!multiSelect && typeof currentValue === "string") {
      const selected = items.find((item) => item.value === currentValue);
      return selected ? [selected] : [];
    }

    return [];
  }, [items, currentValue, multiSelect]);

  const displayLabel = useMemo(() => {
    if (selectedItems.length === 0) return placeholder;

    if (multiSelect) {
      return selectedItems.map((item) => item.label).join(", ");
    }

    return selectedItems[0].label;
  }, [selectedItems, placeholder, multiSelect]);

  const toggleDropdown = () => {
    if (isDisabled) return;

    setIsOpen((prev) => !prev);

    if (!isOpen) {
      const firstEnabledIndex = items.findIndex((item) => !item.disabled);
      setActiveIndex(firstEnabledIndex);
    }
  };

  const closeDropdown = () => {
    setIsOpen(false);
    setActiveIndex(-1);
  };

  const handleSelect = (item: DropdownItem) => {
    if (item.disabled) return;

    let newValue: string | string[];

    if (multiSelect) {
      const currentValues = Array.isArray(currentValue) ? currentValue : [];

      newValue = currentValues.includes(item.value)
        ? currentValues.filter((value) => value !== item.value)
        : [...currentValues, item.value];
    } else {
      newValue = item.value;
      closeDropdown();
    }

    setInternalValue(newValue);
    onChange?.(newValue, item);
  };

  const moveActiveIndex = (direction: "up" | "down") => {
    if (enabledItems.length === 0) return;

    const currentItem = items[activeIndex];
    const currentEnabledIndex = enabledItems.findIndex(
      (item) => item.value === currentItem?.value
    );

    let nextEnabledIndex =
      direction === "down"
        ? currentEnabledIndex + 1
        : currentEnabledIndex - 1;

    if (nextEnabledIndex >= enabledItems.length) {
      nextEnabledIndex = 0;
    }

    if (nextEnabledIndex < 0) {
      nextEnabledIndex = enabledItems.length - 1;
    }

    const nextItem = enabledItems[nextEnabledIndex];
    const nextIndex = items.findIndex((item) => item.value === nextItem.value);

    setActiveIndex(nextIndex);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (isDisabled) return;

    switch (event.key) {
      case "Enter":
      case " ":
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          const firstEnabledIndex = items.findIndex((item) => !item.disabled);
          setActiveIndex(firstEnabledIndex);
          return;
        }

        if (activeIndex >= 0) {
          handleSelect(items[activeIndex]);
        }

        break;

      case "ArrowDown":
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          const firstEnabledIndex = items.findIndex((item) => !item.disabled);
          setActiveIndex(firstEnabledIndex);
        } else {
          moveActiveIndex("down");
        }

        break;

      case "ArrowUp":
        event.preventDefault();

        if (!isOpen) {
          setIsOpen(true);
          const lastEnabledIndex = [...items]
            .reverse()
            .findIndex((item) => !item.disabled);

          const actualIndex =
            lastEnabledIndex === -1 ? -1 : items.length - 1 - lastEnabledIndex;

          setActiveIndex(actualIndex);
        } else {
          moveActiveIndex("up");
        }

        break;

      case "Escape":
        event.preventDefault();
        closeDropdown();
        break;

      default:
        break;
    }
  };

  const isSelected = (item: DropdownItem) => {
    if (multiSelect && Array.isArray(currentValue)) {
      return currentValue.includes(item.value);
    }

    return currentValue === item.value;
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex]);

  return (
    <div
      className={`dropdown dropdown--${placement}`}
      ref={dropdownRef}
      data-disabled={isDisabled}
    >
      <button
        type="button"
        className="dropdown__trigger"
        onClick={toggleDropdown}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-disabled={isDisabled}
      >
        <span
          className={`dropdown__selected ${
            selectedItems.length === 0 ? "dropdown__placeholder" : ""
          }`}
          title={displayLabel}
        >
          {displayLabel}
        </span>

        <span className="dropdown__icon" aria-hidden="true">
          {isOpen ? "▲" : "▼"}
        </span>
      </button>

      {isOpen && (
        <ul
          className="dropdown__menu"
          role="listbox"
          aria-multiselectable={multiSelect}
        >
          {isLoading && (
            <li className="dropdown__state" role="option" aria-disabled="true">
              Loading options...
            </li>
          )}

          {!isLoading && errorMessage && (
            <li className="dropdown__state dropdown__state--error">
              {errorMessage}
            </li>
          )}

          {!isLoading && !errorMessage && items.length === 0 && (
            <li className="dropdown__state">No options available</li>
          )}

          {!isLoading &&
            !errorMessage &&
            items.map((item, index) => {
              const selected = isSelected(item);
              const active = activeIndex === index;

              return (
                <li
                  key={item.value}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  className={[
                    "dropdown__item",
                    selected ? "dropdown__item--selected" : "",
                    active ? "dropdown__item--active" : "",
                    item.disabled ? "dropdown__item--disabled" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={item.disabled}
                  title={item.label}
                  onMouseEnter={() => {
                    if (!item.disabled) setActiveIndex(index);
                  }}
                  onClick={() => handleSelect(item)}
                >
                  {multiSelect && (
                    <input
                      type="checkbox"
                      checked={selected}
                      readOnly
                      tabIndex={-1}
                      aria-hidden="true"
                    />
                  )}

                  <span className="dropdown__item-label">{item.label}</span>
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;