## What happens when you deploy this?

```js
// middleware.js
import fs from 'fs';
import path from 'path';

export function middleware(request) {
  const config = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'feature-flags.json'), 'utf-8')
  );

  if (config.maintenanceMode) {
    return new Response('Down for maintenance', { status: 503 });
  }
}
```

**Answer:** The build fails (or, in some setups, fails at deploy/runtime with a module-resolution error) because `fs` and `path` are Node.js modules with no equivalent in the Edge Runtime that middleware executes on. This isn't a warning — it's a hard failure; the app won't build or the middleware bundle won't run.

**Why:** Middleware runs on the Edge Runtime by default, a deliberately Node-API-free environment designed to run at edge locations. `fs.readFileSync` requires actual filesystem access to the deployment machine, which the Edge Runtime doesn't provide (and conceptually can't, since edge functions are often ephemeral/distributed). The fix: fetch the feature flags over HTTP (`fetch` is a Web API and works fine in middleware), inline small config as an environment variable, or move this specific check into a Route Handler / Server Component running on the Node.js runtime if filesystem access is truly required.
