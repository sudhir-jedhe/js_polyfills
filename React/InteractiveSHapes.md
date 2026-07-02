# Interactive Shape in React (Machine Coding / Frontend Interview)

An **Interactive Shape** component allows users to:

```text
✅ Draw shapes
✅ Select shapes
✅ Drag shapes
✅ Resize shapes
✅ Rotate shapes
✅ Delete shapes
✅ Multi-select shapes
```

Common use cases:

```text
Figma
Miro
Whiteboard Apps
Diagram Editors
Image Annotation Tools
Canvas Editors
```

Interactive shape editors are commonly implemented using SVG or canvas libraries such as React Konva, which provide drag, resize, transform, and event handling capabilities for shapes. [\[konvajs.org\]](https://konvajs.org/docs/react/Drag_And_Drop.html), [\[somethingsblog.com\]](https://www.somethingsblog.com/2024/10/18/mastering-canvas-manipulation-in-react-with-konva/)

***

# Approach 1: Pure SVG + React

Simple draggable rectangle:

```tsx
import React, {
  useState,
} from "react";

export default function App() {
  const [
    position,
    setPosition,
  ] = useState({
    x: 100,
    y: 100,
  });

  const [
    dragging,
    setDragging,
  ] = useState(false);

  return (
    <svg
      width="600"
      height="400"
      style={{
        border:
          "1px solid black",
      }}
      onMouseMove={e => {
        if (!dragging)
          return;

        setPosition({
          x: e.nativeEvent
            .offsetX,
          y: e.nativeEvent
            .offsetY,
        });
      }}
      onMouseUp={() =>
        setDragging(false)
      }
    >
      <rect
        x={position.x}
        y={position.y}
        width="100"
        height="100"
        fill="royalblue"
        onMouseDown={() =>
          setDragging(true)
        }
      />
    </svg>
  );
}
```

SVG elements work well with React because they are DOM elements that can be updated efficiently through React state. [\[fusionbox.com\]](https://www.fusionbox.com/blog/detail/creating-interactive-react-components-with-svgs/614/)

***

# Shape Data Structure

```ts
interface Shape {
  id: string;

  type:
    | "rect"
    | "circle"
    | "triangle";

  x: number;
  y: number;

  width: number;
  height: number;

  rotation: number;
}
```

***

# Rendering Multiple Shapes

```tsx
{
  shapes.map(shape => (
    <rect
      key={shape.id}
      x={shape.x}
      y={shape.y}
      width={shape.width}
      height={shape.height}
    />
  ));
}
```

***

# Selection Logic

```tsx
const [
  selectedId,
  setSelectedId,
] = useState(null);
```

```tsx
<rect
  stroke={
    selectedId === shape.id
      ? "red"
      : "black"
  }
  onClick={() =>
    setSelectedId(
      shape.id
    )
  }
/>
```

***

# Resize Handles

```text
 ┌─────────────┐
 │             │
 │   Rectangle │
 │             │
 └─────────────┘
       ◉
```

Render handle:

```tsx
<circle
  cx={
    shape.x +
    shape.width
  }
  cy={
    shape.y +
    shape.height
  }
  r={6}
/>
```

Drag handle to resize.

***

# React-Konva (Recommended)

For interviews and production tooling:

```bash
npm install react-konva konva
```

React Konva provides built-in shapes, drag-and-drop support, event handling, and transformation tools, reducing the amount of low-level canvas code. [\[blog.logrocket.com\]](https://blog.logrocket.com/canvas-manipulation-react-konva/), [\[somethingsblog.com\]](https://www.somethingsblog.com/2024/10/18/mastering-canvas-manipulation-in-react-with-konva/)

***

# Draggable Shape Example

```tsx
import {
  Stage,
  Layer,
  Rect,
} from "react-konva";

function App() {
  return (
    <Stage
      width={600}
      height={400}
    >
      <Layer>
        <Rect
          x={100}
          y={100}
          width={120}
          height={100}
          fill="blue"
          draggable
        />
      </Layer>
    </Stage>
  );
}
```

Konva supports drag-and-drop through the `draggable` property. [\[konvajs.org\]](https://konvajs.org/docs/react/Drag_And_Drop.html)

***

# Resizing with Transformer

```tsx
import {
  Transformer,
} from "react-konva";
```

```tsx
<Transformer
  ref={transformerRef}
/>
```

The Transformer component provides resize and transform handles for selected shapes. [\[somethingsblog.com\]](https://www.somethingsblog.com/2024/10/18/mastering-canvas-manipulation-in-react-with-konva/)

***

# Shape Editor Architecture

```text
App
 │
 ▼
ShapeEditor
 │
 ├── Toolbar
 ├── Canvas
 │
 ├── Rectangle
 ├── Circle
 ├── Triangle
 │
 ▼
Properties Panel
```

A shape editor commonly separates toolbar controls, canvas rendering, and shape state management. [\[atlantbh.com\]](https://atlantbh.com/building-interactive-shapes-with-react-hooks/), [\[github.com\]](https://github.com/DmitriPopov/react-shape-editor)

***

# Advanced Features

### Undo / Redo

```text
Ctrl + Z
Ctrl + Y
```

Store history stack.

***

### Multi Select

```text
Shift + Click
```

```ts
selectedIds: string[]
```

***

### Snap to Grid

```text
10px Grid
```

```js
x =
  Math.round(x / 10) *
  10;
```

***

### Zoom

```text
Ctrl + Mouse Wheel
```

***

### Keyboard Support

```text
Delete
Arrow Keys
Copy/Paste
```

***

# Performance (Senior Level)

When rendering:

```text
1000+
shapes
```

Avoid:

```text
Re-rendering entire canvas
```

Optimise with:

```text
React.memo
useCallback
useRef
Centralised state
```

Shape editors can suffer performance issues as interactions increase, making state-management and render optimisation important considerations. [\[atlantbh.com\]](https://atlantbh.com/building-interactive-shapes-with-react-hooks/)

***

# Senior Interview Answer

> I would model each shape as data and render it declaratively through React. For simple editors, SVG works well because shapes are DOM elements and easy to manipulate. For production-grade editors with drag, resize, selection, and transformations, I would use React Konva, which provides canvas-based rendering, built-in drag-and-drop, Transformer handles, and better performance for large numbers of shapes. [\[fusionbox.com\]](https://www.fusionbox.com/blog/detail/creating-interactive-react-components-with-svgs/614/), [\[blog.logrocket.com\]](https://blog.logrocket.com/canvas-manipulation-react-konva/), [\[somethingsblog.com\]](https://www.somethingsblog.com/2024/10/18/mastering-canvas-manipulation-in-react-with-konva/)
