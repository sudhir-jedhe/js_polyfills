# Why Code Splitting Matters

By default, a bundler like webpack or Vite ships one big JavaScript file containing every component in your app. Users on a slow connection pay the download and parse cost for admin panels, settings pages, and modals they'll never open just to see your landing page.

Code splitting breaks the bundle into chunks that load on demand, so the initial page load only ships what's needed to render what the user actually sees first. This directly improves metrics like Time to Interactive and First Contentful Paint.

React's native mechanism for this is `React.lazy` paired with `Suspense`, which the rest of this topic covers in depth.

## Key point for interviews

Code splitting doesn't reduce the *total* amount of code a user might eventually download over a full session — it changes *when* that code is downloaded. The win is a smaller, faster initial load; code for features a user never visits may never be downloaded at all.
