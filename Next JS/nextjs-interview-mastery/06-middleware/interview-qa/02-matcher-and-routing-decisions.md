# Interview Q&A: Matcher and Routing Decisions

**Q: What's the difference between scoping middleware via `config.matcher` versus an `if (pathname.startsWith(...))` check inside the function body?**
A: `matcher` decides whether the middleware function executes *at all* for a given request; the in-function check only decides what happens once it's already running. Skipping `matcher` and relying purely on in-function checks means middleware still incurs its fixed execution cost (however small) on every single request, including ones it immediately no-ops on — like every static asset request. `matcher` is both a performance optimization and a form of self-documentation: a reviewer can see the protected scope at a glance.

**Q: When would you choose `NextResponse.rewrite` over `NextResponse.redirect`?**
A: Whenever the user should keep seeing the URL they requested while different content is served — A/B test variants, locale-based content serving without exposing `/en`/`/fr` in the URL, multi-tenant subdomain-to-path mapping, or serving a maintenance page. `redirect` is correct whenever the user's actual destination has genuinely changed and the URL bar/browser history should reflect that, like an auth gate sending them to `/login`.

**Q: Why might `matcher: ['/dashboard']` fail to protect `/dashboard/settings`?**
A: Because that matcher pattern is an exact-path match with no wildcard — it doesn't implicitly cover nested segments the way a file-based route like `app/dashboard/page.jsx` covering everything "under" it might suggest. You need an explicit wildcard, `/dashboard/:path*`, to match the whole subtree; forgetting this silently leaves nested routes completely unprotected, with no error or warning to flag the gap.

**Q: If middleware needs to run on nearly every route except a few static-asset paths, what pattern do you reach for?**
A: A single negative-lookahead matcher excluding `_next/static`, `_next/image`, `favicon.ico`, and common static file extensions — e.g. `'/((?!_next/static|_next/image|favicon.ico).*)'`. This is the standard baseline for global concerns like security headers or locale detection where "run on effectively every navigable page" is the actual requirement, rather than listing every protected route explicitly.
