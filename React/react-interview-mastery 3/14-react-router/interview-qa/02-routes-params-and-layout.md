# Interview Q&A: Routes, Params, and Layout

**Q: What does `useParams()` return, and does it do any type conversion?**
It returns an object mapping each `:param` name in the matched route's path to its string value from the URL — e.g., `{ userId: "42" }` for a route `/users/:userId` matched against `/users/42`. No conversion or validation happens automatically; values are always strings, so numeric IDs need explicit `Number()`/parsing and validation in your code.

**Q: What is an `Outlet`, and how does it relate to nested/layout routes?**
`<Outlet />` is a placeholder rendered inside a parent route's element, marking where the matched child route's element should render. It's what makes layout routes possible — a shared header/sidebar renders once in the parent, and only the `Outlet` content changes as the user navigates between child routes.

**Q: How do query parameters differ from route params, and how do you read/update them?**
Route params (`:id`) are part of the URL path structure and defined by the route's `path`; you read them with `useParams()`. Query parameters (`?sort=price`) are read and updated with `useSearchParams()`, which returns a `URLSearchParams`-like object and a setter — updating them changes the URL's query string without necessarily matching a different route.
