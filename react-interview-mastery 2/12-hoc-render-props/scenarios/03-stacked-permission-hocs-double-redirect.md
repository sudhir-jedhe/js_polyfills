# Scenario: Stacking Two `withPermission(role)` HOCs Causes a Double-Redirect Flicker

Your team built a `withPermission(requiredRole)(Component)` HOC that redirects unauthorized users. Two different pages need to check *two different* permissions before rendering, and nesting `withPermission('admin')(withPermission('billing')(Page))` feels wrong and the redirect logic fires twice, causing a flicker. How do you fix it?

**Approach:** Redesign as a single hook that accepts multiple required roles, so there's one gate, one redirect decision, and no wrapper stacking:

```jsx
// Before: two independent HOCs, each with its own redirect effect — races/double-redirects
function withPermission(role) {
  return function (Wrapped) {
    return function WithPermission(props) {
      const { roles } = useAuth();
      if (!roles.includes(role)) {
        useEffect(() => { navigate('/403'); }, []);
        return null;
      }
      return <Wrapped {...props} />;
    };
  };
}

// After: one hook, one decision
function useRequirePermissions(requiredRoles) {
  const { roles } = useAuth();
  const navigate = useNavigate();
  const allowed = requiredRoles.every(r => roles.includes(r));
  useEffect(() => {
    if (!allowed) navigate('/403');
  }, [allowed, navigate]);
  return allowed;
}

function BillingAdminPage() {
  const allowed = useRequirePermissions(['admin', 'billing']);
  if (!allowed) return null;
  return <PageContent />;
}
```

This collapses two wrapper layers (and two independent effects that could both fire a redirect) into a single explicit check with one redirect path, which also makes it trivial to test in isolation by mocking `useAuth`.
