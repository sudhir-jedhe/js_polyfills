# Dynamic Segment Extracted With `useParams`

```jsx
// <Route path="/posts/:postId" element={<Post />} />
function Post() {
  const { postId } = useParams();
  return <h1>Post #{postId}</h1>; // /posts/7 -> "Post #7"
}
```
