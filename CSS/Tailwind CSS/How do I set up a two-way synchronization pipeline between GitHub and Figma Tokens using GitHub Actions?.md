A two-way synchronization pipeline ensures that when designers update tokens in Figma, changes push automatically to a GitHub repository, and when developers update tokens in code, a GitHub Actions workflow compiles the tokens and keeps Figma and your application in sync.

---

### Pipeline Architecture

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FIGMA (Tokens Studio)                           │
│  Designers update tokens ──(Git Sync Provider)──> Commits to `tokens`  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Pull Request / Push)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    GITHUB REPOSITORY (`tokens` branch)                 │
│  Source of Truth: `tokens/**/*.json` (DTCG format)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ (Triggers GitHub Actions)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                      GITHUB ACTIONS WORKFLOW                           │
│  1. Validate DTCG token schemas                                        │
│  2. Style Dictionary transforms JSON ──> Tailwind CSS / CSS variables  │
│  3. Auto-commits compiled styles & creates PR to `main`                │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION APPLICATION (main branch)                │
│  `globals.css` with `@theme` updated automatically                     │
└────────────────────────────────────────────────────────────────────────┘

```

---

### Step 1: Configure Tokens Studio in Figma (Figma $\to$ GitHub)

1. Open your design file in Figma and open the **Tokens Studio** plugin.
2. Navigate to **Settings** $\to$ **Sync Providers** $\to$ **Add New**.
3. Select **GitHub** as the provider and configure:

* **Personal Access Token (PAT):** Create a GitHub Fine-Grained PAT with `Contents: Read and Write` and `Pull Requests: Read and Write`.
* **Repository:** `username/your-design-system`
* **Default Branch:** `tokens` (Use a dedicated working branch, not `main`).
* **File Path:** `tokens/tokens.json` (or `$themes.json` for multi-file setups).

1. Click **Save** and perform an initial sync. This will commit your DTCG token JSON directly into your GitHub repository.

---

### Step 2: Set Up Style Dictionary for Token Compilation

Install `style-dictionary` to transform the DTCG JSON tokens into Tailwind CSS variables and TypeScript definitions:

```bash
npm install -D style-dictionary

```

Create `build-tokens.mjs` in your project root:

```javascript
// build-tokens.mjs
import StyleDictionary from "style-dictionary";

const sd = new StyleDictionary({
  source: ["tokens/**/*.json"],
  platforms: {
    css: {
      transformGroup: "css",
      buildPath: "src/styles/",
      files: [
        {
          destination: "variables.css",
          format: "css/variables",
          options: {
            outputReferences: true,
          },
        },
      ],
    },
    ts: {
      transformGroup: "js",
      buildPath: "src/tokens/",
      files: [
        {
          destination: "tokens.ts",
          format: "javascript/es6",
        },
      ],
    },
  },
});

await sd.buildAllPlatforms();
console.log(" Tokens successfully built!");

```

Add the build script to `package.json`:

```json
{
  "scripts": {
    "build:tokens": "node build-tokens.mjs"
  }
}

```

---

### Step 3: Wire Up the GitHub Actions Workflow (GitHub $\to$ Codebase)

Create `.github/workflows/tokens-sync.yml`. This workflow runs when Tokens Studio pushes commits to the `tokens` branch, compiles the design tokens into CSS/TypeScript, and generates a Pull Request into `main`.

```yaml
name: Token Pipeline - Build & Sync

on:
  push:
    branches:
      - tokens
    paths:
      - "tokens/**"

permissions:
  contents: write
  pull-requests: write

jobs:
  build-and-sync:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Compile Tokens to CSS and TS
        run: npm run build:tokens

      - name: Commit Compiled Assets to tokens branch
        run: |
          git config --global user.name "github-actions[bot]"
          git config --global user.email "github-actions[bot]@users.noreply.github.com"
          git add src/styles/ src/tokens/
          if git diff --staged --quiet; then
            echo "No compiled token changes to commit."
          else
            git commit -m "chore(tokens): compile design tokens to CSS & TS [skip ci]"
            git push origin tokens
          fi

      - name: Create Pull Request to Main
        uses: peter-evans/create-pull-request@v6
        with:
          token: ${{ secrets.GITHUB_TOKEN }}
          branch: tokens
          base: main
          title: "🎨 Design Tokens Update"
          body: |
            ### Automated Design Tokens Sync
            This PR was automatically created from Figma Tokens Studio updates.
            
            - **Source:** `tokens/**`
            - **Generated Artifacts:** `src/styles/variables.css`, `src/tokens/tokens.ts`
            
            Please review the visual and structural diff before merging into `main`.
          labels: |
            design-tokens
            automated-pr

```

---

### Step 4: Native Figma Variables Sync via REST API (Code $\to$ Figma)

If developers make changes in GitHub that need to be reflected in native Figma Variables (outside the Tokens Studio plugin), create a script using the **Figma REST API**.

```bash
npm install -D dotenv

```

Create `scripts/sync-to-figma.ts`:

```typescript
// scripts/sync-to-figma.ts
import * as fs from "node:fs";

const FIGMA_ACCESS_TOKEN = process.env.FIGMA_ACCESS_TOKEN!;
const FIGMA_FILE_KEY = process.env.FIGMA_FILE_KEY!;

interface VariablePostPayload {
  variableCollections?: any[];
  variableModes?: any[];
  variables?: any[];
  variableModeValues?: any[];
}

async function syncTokensToFigmaVariables() {
  const rawTokens = JSON.parse(fs.readFileSync("tokens/tokens.json", "utf-8"));
  
  // Prepare payload for Figma /v1/files/{file_key}/variables endpoint
  const payload: VariablePostPayload = {
    variables: [
      {
        action: "UPDATE",
        id: "VariableID:primaryColor",
        name: "color/primary",
        valuesByMode: {
          "ModeID:Light": { r: 0.388, g: 0.4, b: 0.945, a: 1 },
        },
      },
    ],
  };

  const response = await fetch(`https://api.figma.com/v1/files/${FIGMA_FILE_KEY}/variables`, {
    method: "POST",
    headers: {
      "X-Figma-Token": FIGMA_ACCESS_TOKEN,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Figma API sync failed: ${errorText}`);
  }

  console.log(" Successfully updated Figma native variables!");
}

syncTokensToFigmaVariables().catch(console.error);

```

Add a step to your CI/CD workflow whenever `tokens/**/*.json` is merged into `main`:

```yaml
      - name: Push to Figma Variables API
        if: github.ref == 'refs/heads/main'
        env:
          FIGMA_ACCESS_TOKEN: ${{ secrets.FIGMA_ACCESS_TOKEN }}
          FIGMA_FILE_KEY: ${{ secrets.FIGMA_FILE_KEY }}
        run: npx tsx scripts/sync-to-figma.ts

```

---

### Step 5: Connecting the Output to Tailwind CSS v4

Import the compiled `variables.css` directly into your Tailwind `globals.css`:

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "./variables.css";

@theme {
  --color-primary: var(--color-primary-default);
  --color-primary-hover: var(--color-primary-hover);
  --color-primary-foreground: var(--color-primary-foreground);
  --radius-lg: var(--border-radius-lg);
}

```

---

### Best Practices & Guardrails

* **Branch Isolation (`tokens` vs `main`):** Never configure Tokens Studio to write directly to `main`. Always target a `tokens` branch and let GitHub Actions create a PR so engineers can run visual regression and linting checks before merging.
* **Add `[skip ci]` to Automatic Commits:** Prevent recursive workflow execution when the bot commits compiled CSS files back to the repository.
* **Strict Semantic Versioning:** Tag token releases (e.g., using `changesets` or semantic release) so breaking changes (like renamed token keys) don't silently break consumer applications.
