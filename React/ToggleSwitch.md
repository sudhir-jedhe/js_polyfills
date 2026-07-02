import React, { useState } from "react";
import PropTypes from "prop-types";
import cx from "classnames";
import styles from "./style.css";

const ToggleSwitch = ({
      checked, 
      defaultChecked, 
      name, 
      onChange, 
      rounded, 
      checkedChildren,
      uncheckedChildren,
      className,
      variant,
      innerRef
    }) => {

  const [_checked, setChecked] = useState(defaultChecked || checked || false);
  
  const handleChange = e => {
    const { checked } = e.target;
    setChecked(checked);
    onChange &&
      onChange({
        name,
        checked
      });
  };

    const _className = cx("wrapper", className);

    const _slideClassName = cx("slider", variant, {
      ["round"]: rounded
    });

    const _checkedChildrenClassName = cx("children", "checked", {
      ["visible"]: _checked
    });

    const _uncheckedChildrenClassName = cx("children", "unchecked", {
      ["visible"]: !_checked
    });

    return (
      <span className={_className}>
        <span className={"switch"}>
          <input
            type="checkbox"
            checked={_checked}
            onChange={handleChange}
            name={name}
            ref={innerRef}
          />

          {/* Overlay */}
          <span className={_slideClassName} />

          {/* Childrens */}
          <>
            <span className={_checkedChildrenClassName}>
              {checkedChildren || null}
            </span>
            <span className={_uncheckedChildrenClassName}>
              {uncheckedChildren || null}
            </span>
          </>
        </span>
      </span>
    );
};

ToggleSwitch.propTypes = {
  name: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  className: PropTypes.string,
  rounded: PropTypes.bool,
  variant: PropTypes.oneOf(["primary", "success", "danger"]),
  /* Children to show on active state  */
  checkedChildren: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element
  ]),
  /* Children to show on inactive state */
  uncheckedChildren: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.element
  ]),
  innerRef: PropTypes.instanceOf(Element)
};

ToggleSwitch.defaultProps = {
  defaultChecked: false,
  checked: false,
  variant: "primary"
}

export default React.forwardRef((props, ref) => {
  return <ToggleSwitch {...props} innerRef={ref} />;
});


/************************** */

.wrapper {
    display: inline-flex;
    margin: 0 10px;
  }
  
  .switch {
    position: relative;
    display: inline-block;
    width: 60px;
    height: 34px;
  }
  
  .switch input {
    opacity: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    position: relative;
    cursor: pointer;
  }
  
  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  
  .slider:before {
    position: absolute;
    content: "";
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    -webkit-transition: 0.4s;
    transition: 0.4s;
  }
  
  /* Different variants*/
  input:checked + .slider.primary {
    background-color: #2196f3;
  }
  
  input:focus + .slider.primary {
    box-shadow: 0 0 1px #2196f3;
  }
  
  input:checked + .slider.danger {
    background-color: #ff5722;
  }
  
  input:focus + .slider.danger {
    box-shadow: 0 0 1px #ff5722;
  }
  
  input:checked + .slider.success {
    background-color: #7cb342;
  }
  
  input:focus + .slider.success {
    box-shadow: 0 0 1px #7cb342;
  }
  
  input:checked + .slider:before {
    -webkit-transform: translateX(26px);
    -ms-transform: translateX(26px);
    transform: translateX(26px);
  }
  
  /* Rounded sliders */
  .slider.round {
    border-radius: 34px;
  }
  
  .slider.round:before {
    border-radius: 50%;
  }
  
  /*Childrens style */
  .children {
    position: absolute;
    top: 58%;
    height: 26px;
    width: 26px;
    text-align: center;
    line-height: 26px;
    transition: 0.12s;
    opacity: 0;
    transform: translateY(-50%);
  }
  
  .checked {
    left: 2px;
  }
  
  .unchecked {
    right: 2px;
  }
  
  .visible {
    opacity: 1;
  }


  /***************** */

  import React from "react";
import ToggleSwitch from "./App";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";

const Test = () => {
  return <>
    <ToggleSwitch name="abc" rounded={true} checked={true}/>
    <ToggleSwitch name="abc" variant="success" />
    <ToggleSwitch
      name="abc"
      rounded={true}
      variant="danger"
      defaultChecked={true}
      checkedChildren={<CheckOutlined />}
      uncheckedChildren={<CloseOutlined />}
    />
    <ToggleSwitch
      name="abc"
      defaultChecked={true}
      variant="danger"
      checkedChildren={<CheckOutlined />}
      uncheckedChildren={<CloseOutlined />}
    />
  </>
};

export default Test;



/*******************/

A **Tooltip for an Anchor Element** is a common frontend system-design/interview question that tests:

* Positioning logic
* Hover/focus accessibility
* Portal rendering
* Floating UI concepts
* Collision detection

***

# Requirements

### Functional

✅ Show tooltip on hover

✅ Show tooltip on keyboard focus

✅ Hide on mouse leave

✅ Support placement

```tsx
top
bottom
left
right
```

✅ Dynamic content

✅ Accessible

***

# Component API

```tsx
<Tooltip
  content="Open user profile"
  placement="top"
>
  <a href="/profile">
    Profile
  </a>
</Tooltip>
```

***

# Basic Implementation

## Tooltip.tsx

```tsx
import React, {
  useRef,
  useState
} from "react";

interface TooltipProps {
  content: React.ReactNode;
  placement?: "top" | "bottom" | "left" | "right";
  children: React.ReactNode;
}

export default function Tooltip({
  content,
  placement = "top",
  children,
}: TooltipProps) {
  const [visible, setVisible] =
    useState(false);

  const tooltipRef =
    useRef<HTMLSpanElement>(null);

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() =>
        setVisible(true)
      }
      onMouseLeave={() =>
        setVisible(false)
      }
      onFocus={() =>
        setVisible(true)
      }
      onBlur={() =>
        setVisible(false)
      }
    >
      {children}

      {visible && (
        <span
          className={`tooltip tooltip--${placement}`}
          role="tooltip"
          ref={tooltipRef}
        >
          {content}
        </span>
      )}
    </span>
  );
}
```

***

# CSS

```css
.tooltip-wrapper {
  position: relative;
  display: inline-block;
}

.tooltip {
  position: absolute;
  padding: 8px 12px;
  background: #1f2937;
  color: white;
  border-radius: 6px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
}

.tooltip--top {
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 8px;
}

.tooltip--bottom {
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 8px;
}

.tooltip--left {
  right: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-right: 8px;
}

.tooltip--right {
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  margin-left: 8px;
}
```

***

# Usage with Anchor Element

```tsx
<Tooltip
  content="View GitHub Profile"
  placement="top"
>
  <a
    href="https://github.com"
    target="_blank"
    rel="noreferrer"
  >
    GitHub
  </a>
</Tooltip>
```

***

# Accessibility

For anchors:

```tsx
/about
  About
</a>
```

Tooltip:

```tsx
<span
  id="tooltip-id"
  role="tooltip"
>
  Learn more
</span>
```

Best practices:

✅ Show on hover

✅ Show on focus

✅ Hide on blur

✅ Screen reader support

***

# Advanced Positioning Using getBoundingClientRect

Instead of CSS-only positioning:

```tsx
const rect =
  anchorRef.current.getBoundingClientRect();
```

Calculate:

```tsx
top =
  rect.top -
  tooltipHeight -
  8;

left =
  rect.left +
  rect.width / 2;
```

Useful when:

* Tooltip size is unknown
* Dynamic content
* Viewport collision handling

***

# Portal-Based Tooltip

Production systems typically use a portal.

```tsx
import { createPortal }
from "react-dom";
```

```tsx
return createPortal(
  <Tooltip />,
  document.body
);
```

Benefits:

✅ Escapes parent overflow

✅ Solves z-index issues

✅ Works inside modals

✅ Works inside tables

***

# Auto Flip Behaviour

Example:

```text
Requested:
Top
```

But anchor is near top of screen.

```text
Actual:
Bottom
```

Logic:

```tsx
if (notEnoughSpaceTop) {
  placement = "bottom";
}
```

Libraries:

```bash
npm install @floating-ui/react
```

or

```bash
npm install @popperjs/core
```

***

# Enterprise-Level API

```tsx
<Tooltip
  content="Profile Settings"
  placement="top"
  delay={200}
  maxWidth={300}
  interactive
  offset={8}
  autoFlip
>
  /settings
    Settings
  </a>
</Tooltip>
```

```ts
interface TooltipProps {
  content: ReactNode;

  placement?:
    | "top"
    | "bottom"
    | "left"
    | "right";

  delay?: number;

  offset?: number;

  autoFlip?: boolean;

  interactive?: boolean;

  maxWidth?: number;
}
```

***

# Interview Follow-Up Discussion

### Naive Solution

```text
Position: absolute
```

Problems:

* Overflow hidden containers
* Viewport clipping
* Z-index issues

***

### Production Solution

```text
Anchor Element
       ↓
getBoundingClientRect
       ↓
Tooltip Manager
       ↓
Portal
       ↓
Floating UI / Popper
```

***

### Complexity

```text
Show Tooltip    O(1)
Hide Tooltip    O(1)
Position Calc   O(1)
```

***

# Senior Frontend Interview Answer

> I would build the tooltip as a reusable component that wraps an anchor element and supports hover, focus, and keyboard accessibility. For production applications, I would render the tooltip in a React Portal and use Floating UI or Popper.js for positioning, collision detection, automatic flipping, and viewport boundary handling. This ensures the tooltip remains accessible, correctly positioned, and reusable across the application.


Below is the **complete React + TypeScript code** for a reusable **Tooltip for an Anchor Element**.

It supports:

* Anchor/link usage
* Hover + focus trigger
* Keyboard accessibility
* `top | bottom | left | right` placement
* Delay
* Offset
* Portal rendering
* Auto positioning using `getBoundingClientRect`
* `aria-describedby`
* Clean reusable API

***

# 1. `Tooltip.tsx`

```tsx
import React, {
  cloneElement,
  isValidElement,
  ReactElement,
  ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import "./Tooltip.css";

type TooltipPlacement = "top" | "bottom" | "left" | "right";

type TooltipProps = {
  content: ReactNode;
  children: ReactElement;
  placement?: TooltipPlacement;
  delay?: number;
  offset?: number;
  disabled?: boolean;
  maxWidth?: number;
};

type TooltipPosition = {
  top: number;
  left: number;
};

const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  placement = "top",
  delay = 150,
  offset = 8,
  disabled = false,
  maxWidth = 260,
}) => {
  const tooltipId = useId();

  const anchorRef = useRef<HTMLElement | null>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const timerRef = useRef<number | null>(null);

  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState<TooltipPosition>({
    top: 0,
    left: 0,
  });

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const showTooltip = () => {
    if (disabled) return;

    clearTimer();

    timerRef.current = window.setTimeout(() => {
      setVisible(true);
    }, delay);
  };

  const hideTooltip = () => {
    clearTimer();
    setVisible(false);
  };

  const calculatePosition = () => {
    const anchor = anchorRef.current;
    const tooltip = tooltipRef.current;

    if (!anchor || !tooltip) return;

    const anchorRect = anchor.getBoundingClientRect();
    const tooltipRect = tooltip.getBoundingClientRect();

    let top = 0;
    let left = 0;

    switch (placement) {
      case "top":
        top = anchorRect.top - tooltipRect.height - offset;
        left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
        break;

      case "bottom":
        top = anchorRect.bottom + offset;
        left = anchorRect.left + anchorRect.width / 2 - tooltipRect.width / 2;
        break;

      case "left":
        top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
        left = anchorRect.left - tooltipRect.width - offset;
        break;

      case "right":
        top = anchorRect.top + anchorRect.height / 2 - tooltipRect.height / 2;
        left = anchorRect.right + offset;
        break;

      default:
        break;
    }

    const viewportPadding = 8;

    const minLeft = viewportPadding;
    const maxLeft = window.innerWidth - tooltipRect.width - viewportPadding;

    const minTop = viewportPadding;
    const maxTop = window.innerHeight - tooltipRect.height - viewportPadding;

    left = Math.max(minLeft, Math.min(left, maxLeft));
    top = Math.max(minTop, Math.min(top, maxTop));

    setPosition({
      top,
      left,
    });
  };

  useEffect(() => {
    if (!visible) return;

    calculatePosition();

    const handleScroll = () => {
      calculatePosition();
    };

    const handleResize = () => {
      calculatePosition();
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [visible, placement, offset]);

  useEffect(() => {
    return () => {
      clearTimer();
    };
  }, []);

  if (!isValidElement(children)) {
    return children;
  }

  const childElement = cloneElement(children, {
    ref: (node: HTMLElement) => {
      anchorRef.current = node;

      const childRef = (children as any).ref;

      if (typeof childRef === "function") {
        childRef(node);
      } else if (childRef) {
        childRef.current = node;
      }
    },
    onMouseEnter: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseEnter?.(event);
      showTooltip();
    },
    onMouseLeave: (event: React.MouseEvent<HTMLElement>) => {
      children.props.onMouseLeave?.(event);
      hideTooltip();
    },
    onFocus: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onFocus?.(event);
      showTooltip();
    },
    onBlur: (event: React.FocusEvent<HTMLElement>) => {
      children.props.onBlur?.(event);
      hideTooltip();
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      children.props.onKeyDown?.(event);

      if (event.key === "Escape") {
        hideTooltip();
      }
    },
    "aria-describedby": visible ? tooltipId : undefined,
  });

  return (
    <>
      {childElement}

      {visible &&
        createPortal(
          <div
            id={tooltipId}
            ref={tooltipRef}
            role="tooltip"
            className={`tooltip tooltip--${placement}`}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
              maxWidth: `${maxWidth}px`,
            }}
          >
            {content}
            <span className={`tooltip__arrow tooltip__arrow--${placement}`} />
          </div>,
          document.body
        )}
    </>
  );
};

export default Tooltip;
```

***

# 2. `Tooltip.css`

```css
.tooltip {
  position: fixed;
  z-index: 9999;
  padding: 8px 12px;
  background: #111827;
  color: #ffffff;
  border-radius: 6px;
  font-size: 12px;
  line-height: 1.4;
  white-space: normal;
  pointer-events: none;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
  animation: tooltip-fade-in 0.15s ease-in-out;
}

.tooltip__arrow {
  position: absolute;
  width: 8px;
  height: 8px;
  background: #111827;
  transform: rotate(45deg);
}

.tooltip__arrow--top {
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip__arrow--bottom {
  top: -4px;
  left: 50%;
  transform: translateX(-50%) rotate(45deg);
}

.tooltip__arrow--left {
  right: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

.tooltip__arrow--right {
  left: -4px;
  top: 50%;
  transform: translateY(-50%) rotate(45deg);
}

@keyframes tooltip-fade-in {
  from {
    opacity: 0;
    transform: scale(0.96);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}
```

***

# 3. `App.tsx`

```tsx
import Tooltip from "./Tooltip";
import "./App.css";

export default function App() {
  return (
    <div className="app">
      <h1>Tooltip for Anchor Element</h1>

      <div className="demo-row">
        <Tooltip content="Open React official website" placement="top">
          https://react.dev
            React Website
          </a>
        </Tooltip>
      </div>

      <div className="demo-row">
        <Tooltip content="This tooltip appears below the anchor" placement="bottom">
          <a href="/dashboard" className="demo-link">
            Dashboard
          </a>
        </Tooltip>
      </div>

      <div className="demo-row">
        <Tooltip content="Profile settings page" placement="right">
          <a href="/profile" className="demo-link">
            Profile
          </a>
        </Tooltip>
      </div>

      <div className="demo-row">
        <Tooltip
          content="Long tooltip content example. This text wraps based on maxWidth."
          placement="left"
          maxWidth={220}
        >
          /help
            Help Centre
          </a>
        </Tooltip>
      </div>
    </div>
  );
}
```

***

# 4. `App.css`

```css
.app {
  min-height: 100vh;
  padding: 80px;
  font-family: Arial, sans-serif;
  background: #f9fafb;
}

h1 {
  margin-bottom: 40px;
  color: #111827;
}

.demo-row {
  margin-bottom: 48px;
}

.demo-link {
  color: #2563eb;
  font-weight: 600;
  text-decoration: none;
  border-bottom: 1px solid transparent;
}

.demo-link:hover {
  border-bottom-color: #2563eb;
}

.demo-link:focus {
  outline: 2px solid #2563eb;
  outline-offset: 4px;
  border-radius: 4px;
}
```

***

# 5. Folder Structure

```text
src/
  App.tsx
  App.css
  Tooltip.tsx
  Tooltip.css
  main.tsx
```

***

# 6. `main.tsx`

```tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

***

# Key Interview Points

You can explain it like this:

> I implemented the tooltip as a reusable wrapper component around an anchor element. It supports hover and focus for accessibility, uses `aria-describedby`, renders through a React Portal to avoid parent overflow and z-index issues, and calculates its position using `getBoundingClientRect`. It also supports placement, offset, delay, max width, and Escape key dismissal.

***

# Production Enhancements

For enterprise-level usage, you can further add:

* Auto flip when there is not enough viewport space
* Interactive tooltip support
* Controlled mode: `open` / `onOpenChange`
* Animation variants
* Theme tokens
* Floating UI or Popper.js integration
* Unit tests with React Testing Library
