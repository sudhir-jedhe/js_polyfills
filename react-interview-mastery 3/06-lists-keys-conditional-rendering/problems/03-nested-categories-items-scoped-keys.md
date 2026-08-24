# Problem: Nested list (categories → items) with correctly scoped keys at each level

## Task

Render a product catalog structured as categories, each containing items, each item containing tags — three nesting levels — with keys correctly scoped at every level (no accidental key collisions or reused parent keys on children).

## Solution

```jsx
const CATALOG = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    items: [
      { id: 'item-1', name: 'Headphones', tags: [{ id: 'tag-1', label: 'wireless' }, { id: 'tag-2', label: 'noise-cancelling' }] },
      { id: 'item-2', name: 'Keyboard', tags: [{ id: 'tag-3', label: 'mechanical' }] },
    ],
  },
  {
    id: 'cat-kitchen',
    name: 'Kitchen',
    items: [
      { id: 'item-3', name: 'Kettle', tags: [{ id: 'tag-4', label: 'electric' }, { id: 'tag-5', label: 'stainless' }] },
    ],
  },
];

function TagList({ tags }) {
  // Keys here only need to be unique among THIS item's tags — a different
  // item's tags array can reuse the same tag ids without any conflict.
  return (
    <ul className="tag-list">
      {tags.map((tag) => (
        <li key={tag.id} className="tag">{tag.label}</li>
      ))}
    </ul>
  );
}

function ItemRow({ item }) {
  return (
    <li>
      <span>{item.name}</span>
      <TagList tags={item.tags} />
    </li>
  );
}

function CategorySection({ category }) {
  return (
    <section>
      <h2>{category.name}</h2>
      <ul>
        {/* Keyed by item.id — scoped to this category's own items only */}
        {category.items.map((item) => (
          <ItemRow key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function Catalog() {
  return (
    <div>
      {/* Keyed by category.id — scoped to the top-level list of categories */}
      {CATALOG.map((category) => (
        <CategorySection key={category.id} category={category} />
      ))}
    </div>
  );
}

export default Catalog;
```

## Why this works

- Each `.map()` call gets its own key scoped to its own immediate siblings: `CATALOG.map` keys categories by `category.id`, `category.items.map` (inside `CategorySection`) keys items by `item.id`, and `item.tags.map` (inside `TagList`) keys tags by `tag.id`. None of these need to avoid collisions with each other — `tag-1` in one item's tag list and a hypothetical `tag-1` in a different item's tag list would be perfectly fine, since React only compares keys within one parent's own children.
- A common mistake this avoids: reusing the *outer* item's id as the key for *inner* list elements (e.g. `<li key={item.id}>` for every tag inside that item) — that would give every tag in an item the same key, causing the exact "duplicate key" warning and misrendering covered in `output-based/04-duplicate-inner-keys.md`.
- Splitting each nesting level into its own component (`TagList`, `ItemRow`, `CategorySection`) keeps each `.map()` small and makes it obvious, by scope, which data each key needs to be unique against — the id used always comes from the array being mapped in that exact function, not from an ancestor's data.
- All ids here (`cat-*`, `item-*`, `tag-*`) come from the data itself, not from array position, so adding, removing, or reordering categories, items, or tags at any level keeps every other level's state and DOM identity correctly attached to the right node.
