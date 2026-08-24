# Interview Q&A: `<Link>` vs. Raw `<a>`

**Q: Why use `next/link` instead of a plain `<a href>` for internal navigation?**
A: `<Link>` performs a client-side transition instead of a full page reload — shared layouts stay mounted (and their state survives), only the changed route segment is fetched and swapped in, and in production it automatically prefetches the target route's data/RSC payload when the link enters the viewport, so the click often feels instant. A raw `<a>` triggers a full document reload every time, discarding all client state and re-downloading the entire JS/CSS bundle.

**Q: Does `<Link>` prefetch by default in every environment?**
A: No — prefetching is a production-only optimization; it's disabled in `next dev`. It also behaves differently by route type: statically rendered routes get their full payload prefetched, while dynamically rendered routes only get their shared layout shell prefetched (not the dynamic data itself, since that can't be safely precomputed).

**Q: How do you disable prefetching for a specific link, and when would you want to?**
A: Pass `prefetch={false}`. Useful for very long lists of links (e.g., an infinite-scroll feed or a large table) where prefetching every visible link would waste bandwidth and client-side cache space on routes the user is unlikely to visit.

**Q: If `<Link>` renders an `<a>` tag under the hood, does middle-click / open-in-new-tab still work?**
A: Yes — that's specifically why `<Link>` renders a real anchor rather than intercepting clicks on a `<div>` or `<button>`. Middle-click, `Ctrl`/`Cmd`+click, and right-click "open in new tab" all use the native `href`, bypassing the client-side router entirely, exactly as users expect from a link.
