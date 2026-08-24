Updating a Helm chart's `version` (chart package version) and `appVersion` (application/image version) during a Semantic Release workflow ensures your Kubernetes deployment artifacts stay aligned with Git tags and published Docker images.

The most reliable approach is using **`@semantic-release/exec`** with a YAML editor tool like **`yq`** (or `sed`) to mutate `Chart.yaml`, followed by **`@semantic-release/git`** to commit the modified file back to Git.

---

### Step-by-Step Configuration

1. **Install Required Semantic Release Plugins:**
Install `@semantic-release/exec` and `@semantic-release/git` as dev dependencies:

```bash
npm install --save-dev @semantic-release/exec @semantic-release/git

```

1. **Configure .releaserc.json with yq/Helm hooks:**
Use the `prepareCmd` hook to update `Chart.yaml` fields before the Git plugin commits the changed files.

2. **Update CI/CD Workflow:**
Ensure `yq` and `helm` are installed in the GitHub Actions runner before executing `semantic-release`.

---

### 1. Configuration: `.releaserc.json`

In `.releaserc.json`, update `Chart.yaml` during the `prepareCmd` lifecycle step, update dependencies via `helm dependency update` (if you use subcharts), and add `charts/**/Chart.yaml` to the Git assets array:

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/changelog",
      {
        "changelogFile": "CHANGELOG.md"
      }
    ],
    [
      "@semantic-release/exec",
      {
        "prepareCmd": "yq eval '.version = \"${nextRelease.version}\" | .appVersion = \"${nextRelease.version}\"' -i charts/my-chart/Chart.yaml && helm dependency update charts/my-chart"
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": [
          "CHANGELOG.md",
          "package.json",
          "charts/my-chart/Chart.yaml",
          "charts/my-chart/Chart.lock"
        ],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}

```

> **Note on `version` vs `appVersion`:**
>
> * If your Helm chart version moves in lockstep with the app: set both `.version` and `.appVersion` to `${nextRelease.version}`.
> * If only the application updates while the chart template remains decoupled: update `.appVersion = "${nextRelease.version}"` and manage `.version` separately.
>
>

---

### 2. GitHub Actions Workflow (`.github/workflows/release-helm.yml`)

The workflow installs `yq` (via `mikefarah/yq` or `pip/snap`) and Helm CLI to validate and package the chart:

```yaml
name: Release & Helm Update

on:
  push:
    branches:
      - main

permissions:
  contents: write
  packages: write
  issues: write
  pull-requests: write

jobs:
  release:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Source Code
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'npm'

      - name: Install Helm
        uses: azure/setup-helm@v4

      - name: Install yq
        uses: chrisdickinson/setup-yq@v1.0.1
        with:
          yq-version: 'v4.44.1'

      - name: Install Dependencies
        run: npm ci

      - name: Lint Helm Chart
        run: helm lint charts/my-chart

      - name: Run Semantic Release (Updates Chart.yaml & commits to Git)
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release

```

---

### 3. Target File: `Chart.yaml` Before & After

#### Before Release

```yaml
apiVersion: v2
name: my-chart
description: A Helm chart for Kubernetes
type: application
version: 1.2.0
appVersion: "1.2.0"

```

#### After Semantic Release runs `fix:` / `feat:` commit on `main`

```yaml
apiVersion: v2
name: my-chart
description: A Helm chart for Kubernetes
type: application
version: 1.3.0
appVersion: "1.3.0"

```

---

### 4. Optional: Packaging & Publishing to OCI Registry / GitHub Pages

If you also publish packaged Helm charts (`.tgz`) to GitHub Container Registry (GHCR) as an OCI artifact, extend `prepareCmd` or `publishCmd` in `.releaserc.json`:

```json
[
  "@semantic-release/exec",
  {
    "prepareCmd": "yq eval '.version = \"${nextRelease.version}\" | .appVersion = \"${nextRelease.version}\"' -i charts/my-chart/Chart.yaml",
    "publishCmd": "helm package charts/my-chart -d .dist && helm push .dist/my-chart-${nextRelease.version}.tgz oci://ghcr.io/${process.env.GITHUB_REPOSITORY}/charts"
  }
]

```
