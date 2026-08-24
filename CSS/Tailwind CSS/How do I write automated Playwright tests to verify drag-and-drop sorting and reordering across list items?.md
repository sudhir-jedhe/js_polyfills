Testing drag-and-drop reordering in Playwright requires handling two different implementation types:

1. **HTML5 Native Drag-and-Drop API** (`dragstart`, `dragover`, `drop`)
2. **Pointer/Mouse-Event Libraries** (e.g., `@dnd-kit`, `react-beautiful-dnd`, `Pragmatic drag and drop`) which rely on `pointerdown`, `pointermove`, and `pointerup`.

---

### Step 1: Create Drag-and-Drop Test Helpers

Create `e2e/helpers/drag-drop.ts` with dedicated helpers for both pointer-based libraries and native HTML5 drag-and-drop:

```typescript
// e2e/helpers/drag-drop.ts
import { Page, Locator, expect } from "@playwright/test";

export interface DragOptions {
  /** Offset from target center in pixels (useful for inserting above/below midpoints) */
  targetOffset?: { x: number; y: number };
  /** Number of intermediate steps to trigger threshold drag-over calculations */
  steps?: number;
}

/**
 * Simulates pointer/mouse drag-and-drop (Works with @dnd-kit, react-beautiful-dnd, Pragmatic DnD)
 */
export async function dragAndDropPointer(
  page: Page,
  source: Locator,
  target: Locator,
  options: DragOptions = {}
) {
  const { targetOffset = { x: 0, y: 0 }, steps = 10 } = options;

  const sourceBox = await source.boundingBox();
  const targetBox = await target.boundingBox();

  if (!sourceBox || !targetBox) {
    throw new Error("Unable to retrieve bounding box for drag elements.");
  }

  const startX = sourceBox.x + sourceBox.width / 2;
  const startY = sourceBox.y + sourceBox.height / 2;

  const endX = targetBox.x + targetBox.width / 2 + targetOffset.x;
  const endY = targetBox.y + targetBox.height / 2 + targetOffset.y;

  // 1. Move to source center and initiate drag
  await page.mouse.move(startX, startY);
  await page.mouse.down();

  // 2. Move in incremental steps to fire intermediate pointermove / dragover events
  await page.mouse.move(endX, endY, { steps });

  // 3. Brief pause to allow DOM state / sorting preview to settle
  await page.waitForTimeout(100);

  // 4. Release mouse
  await page.mouse.up();
}

/**
 * Native HTML5 Drag and Drop fallback using Playwright's locator.dragTo()
 */
export async function dragAndDropNative(
  source: Locator,
  target: Locator,
  options: { sourcePosition?: { x: number; y: number }; targetPosition?: { x: number; y: number } } = {}
) {
  await source.dragTo(target, {
    sourcePosition: options.sourcePosition,
    targetPosition: options.targetPosition,
  });
}

/**
 * Helper to assert current ordered text sequence of a list
 */
export async function expectListOrder(listItemsLocator: Locator, expectedOrder: string[]) {
  await expect(listItemsLocator).toHaveText(expectedOrder);
}

```

---

### Step 2: Write List Reordering Tests

Test pointer-based sorting (moving items down, moving items up, and using drag handles):

```typescript
// e2e/drag-and-drop.spec.ts
import { test, expect } from "@playwright/test";
import { dragAndDropPointer, expectListOrder } from "./helpers/drag-drop";

test.describe("Drag and Drop List Sorting", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/iframe.html?id=components-sortablelist--default&viewMode=story");
    await page.waitForLoadState("networkidle");
  });

  test("reorders items by dragging from top to bottom", async ({ page }) => {
    const items = page.getByRole("listitem");

    // 1. Assert initial order: [Item 1, Item 2, Item 3, Item 4]
    await expectListOrder(items, ["Item 1", "Item 2", "Item 3", "Item 4"]);

    const firstItem = items.nth(0);
    const thirdItem = items.nth(2);

    // 2. Drag Item 1 below Item 3 (positive Y offset to guarantee placement below midpoint)
    await dragAndDropPointer(page, firstItem, thirdItem, {
      targetOffset: { x: 0, y: 15 },
      steps: 12,
    });

    // 3. Verify updated order: [Item 2, Item 3, Item 1, Item 4]
    await expectListOrder(items, ["Item 2", "Item 3", "Item 1", "Item 4"]);
  });

  test("reorders items by dragging upward", async ({ page }) => {
    const items = page.getByRole("listitem");
    const lastItem = items.nth(3); // Item 4
    const firstItem = items.nth(0); // Item 1

    // Drag Item 4 above Item 1 (negative Y offset)
    await dragAndDropPointer(page, lastItem, firstItem, {
      targetOffset: { x: 0, y: -15 },
      steps: 12,
    });

    // Verify updated order: [Item 4, Item 1, Item 2, Item 3]
    await expectListOrder(items, ["Item 4", "Item 1", "Item 2", "Item 3"]);
  });

  test("reorders items using explicit drag handle buttons", async ({ page }) => {
    const items = page.getByRole("listitem");

    // Scope drag action to the drag handle within the list item
    const firstHandle = items.nth(0).getByRole("button", { name: /drag handle/i });
    const secondItem = items.nth(1);

    await dragAndDropPointer(page, firstHandle, secondItem, {
      targetOffset: { x: 0, y: 10 },
      steps: 8,
    });

    await expectListOrder(items, ["Item 2", "Item 1", "Item 3", "Item 4"]);
  });
});

```

---

### Step 3: Test Keyboard Accessible Drag-and-Drop

Accessible sortable libraries (like `@dnd-kit`) allow reordering using keyboard commands (`Space` to pick up, `ArrowUp`/`ArrowDown` to move, `Space` to drop):

```typescript
// e2e/keyboard-sorting.spec.ts
import { test, expect } from "@playwright/test";
import { expectListOrder } from "./helpers/drag-drop";

test("reorders list items via keyboard navigation", async ({ page }) => {
  await page.goto("/iframe.html?id=components-sortablelist--accessible&viewMode=story");
  await page.waitForLoadState("networkidle");

  const items = page.getByRole("listitem");
  const firstItemHandle = items.nth(0).getByRole("button", { name: /reorder item 1/i });

  // 1. Focus the first item drag handle
  await firstItemHandle.focus();

  // 2. Pick up item with Space (activates drag mode)
  await page.keyboard.press("Space");

  // 3. Move item down two positions using ArrowDown
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");

  // 4. Drop item in new position with Space
  await page.keyboard.press("Space");

  // 5. Verify live screen reader announcement and updated list order
  const liveRegion = page.getByRole("status");
  await expect(liveRegion).toHaveText(/moved item 1 to position 3/i);

  await expectListOrder(items, ["Item 2", "Item 3", "Item 1", "Item 4"]);
});

```

---

### Common Failure Modes & Solutions

| Failure Mode                        | Root Cause                                                                                      | Fix                                                                                              |
| ----------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| **Drop event doesn't trigger**      | `steps: 1` jumps instantly without firing mouse movement increments needed by sensor thresholds | Set `steps: 8` to `15` in `page.mouse.move()`                                                    |
| **Item drops in wrong index**       | Mouse dropped exactly at center `(x, y)` where collision detection fluctuates                   | Apply a small `targetOffset: { x: 0, y: 15 }` to drop clearly above or below the target midpoint |
| **Virtual scrolling lists fail**    | Target list item is off-screen and unrendered                                                   | Call `await target.scrollIntoViewIfNeeded()` before calculating bounding boxes                   |
| **Native DnD ignores `page.mouse**` | Application uses HTML5 DragEvent (`dataTransfer`) instead of PointerEvents                      | Use `source.dragTo(target)` instead of `page.mouse`                                              |
