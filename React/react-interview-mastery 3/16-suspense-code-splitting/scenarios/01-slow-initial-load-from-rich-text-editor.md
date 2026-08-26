# Initial Load Is Slow Because of a Rarely-Used Rich Text Editor

You're building a CMS. The article editor page bundles a large WYSIWYG library that's only needed when a user clicks "Edit," but it's currently imported at the top of the file, so it ships with every page load, including the read-only article view.

**Approach:** Split the editor out with `React.lazy`, loaded only when the user actually enters edit mode, and wrap it in `Suspense` with an error boundary for failed chunk loads (e.g., a stale deploy where the chunk hash no longer exists).

```jsx
const RichTextEditor = React.lazy(() => import("./RichTextEditor"));

function ArticlePage({ article }) {
  const [editing, setEditing] = useState(false);

  return (
    <div>
      <ArticleView article={article} />
      <button onClick={() => setEditing(true)}>Edit</button>
      {editing && (
        <ErrorBoundary fallback={<EditorLoadError onRetry={() => setEditing(false)} />}>
          <Suspense fallback={<p>Loading editor...</p>}>
            <RichTextEditor initialContent={article.body} />
          </Suspense>
        </ErrorBoundary>
      )}
    </div>
  );
}
```

This keeps the read-only view's bundle lean; the editor's weight is only paid by users who actually edit.
