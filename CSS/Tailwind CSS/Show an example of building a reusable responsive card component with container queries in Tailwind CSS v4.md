***  Show an example of building a reusable responsive card component with container queries in Tailwind CSS v4.md ***

A responsive card built with container queries adapts smoothly whether it is placed inside a narrow `300px` sidebar or a full-width main feed—without relying on the screen or viewport width.

---

### Component Implementation (React / JSX)

```jsx
export function PostCard({ title, category, author, readTime, date, imageSrc }) {
  return (
    /* 1. Establish the container boundary */
    <div className="@container">
      {/* 2. Layout morphs:
             - Stacked column by default (< 384px)
             - Side-by-side row at container width ≥ 384px (@sm:)
             - Wide horizontal layout with larger padding at ≥ 576px (@xl:) */}
      <article className="flex flex-col @sm:flex-row gap-4 p-4 @xl:p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
        
        {/* Image: fixed aspect square on stacked, fixed size on wide */}
        <div className="w-full @sm:w-36 @xl:w-48 shrink-0 aspect-video @sm:aspect-square overflow-hidden rounded-xl bg-slate-100 dark:bg-slate-800">
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col justify-between flex-1 min-w-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                {category}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {readTime}
              </span>
            </div>

            {/* Typography scales with container size */}
            <h3 className="mt-2 font-bold text-slate-900 dark:text-white text-base @sm:text-lg @xl:text-xl leading-snug line-clamp-2">
              {title}
            </h3>

            {/* Excerpt appears only when the container is wide enough (≥ 448px) */}
            <p className="hidden @md:block mt-2 text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
              Learn how to leverage container queries directly in your Tailwind v4 projects to build robust, drop-in components.
            </p>
          </div>

          {/* Footer Metadata */}
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>By {author}</span>
            <span>{date}</span>
          </div>
        </div>
      </article>
    </div>
  );
}

```

---

### How It Renders in Different Contexts

Because the component manages its own responsiveness, you can reuse the exact same `<PostCard/>` component across varying slot sizes on the same page:

```jsx
export default function PageLayout() {
  const post = {
    title: "Building Micro-Layouts with Modern CSS",
    category: "CSS",
    author: "Jane Doe",
    readTime: "4 min read",
    date: "Aug 2026",
    imageSrc: "/preview.jpg"
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
      {/* Context 1: Narrow Sidebar (w-full in 1 column) -> Renders vertical stacked */}
      <aside className="space-y-4">
        <h2 className="text-lg font-bold">Sidebar (Narrow)</h2>
        <PostCard {...post} />
      </aside>

      {/* Context 2: Wide Main Content (spans 2 columns) -> Renders horizontal layout */}
      <main className="lg:col-span-2 space-y-4">
        <h2 className="text-lg font-bold">Main Feed (Wide)</h2>
        <PostCard {...post} />
      </main>
    </div>
  );
}

```

---

### Key Takeaways

* **Zero Page-Level Media Queries:** You don't need distinct `<SidebarPostCard/>` and `<FeedPostCard/>` components.
* **Granular Visibility:** Elements like excerpts and secondary meta can be toggled using `@md:block` or `@md:hidden` relative to parent container space.
* **Component Encapsulation:** The component handles its own layout transitions without knowing where it will be placed in the DOM hierarchy.
