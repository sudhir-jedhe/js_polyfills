# Nested Suspense Boundaries for Staggered Loading

```jsx
const Comments = React.lazy(() => import("./Comments"));

function Article({ post }) {
  return (
    <Suspense fallback={<ArticleSkeleton />}>
      <ArticleBody post={post} />
      {/* Comments has its own inner boundary so slow comments
          don't block the article body from appearing */}
      <Suspense fallback={<p>Loading comments...</p>}>
        <Comments postId={post.id} />
      </Suspense>
    </Suspense>
  );
}
```
