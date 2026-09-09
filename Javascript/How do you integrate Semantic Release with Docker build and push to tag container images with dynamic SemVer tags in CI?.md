***  How do you integrate Semantic Release with Docker build and push to tag container images with dynamic SemVer tags in CI?.md ***

Integrating **Semantic Release** with **Docker** in CI/CD allows you to extract the calculated dynamic SemVer version (e.g., `v2.4.1`, `v2.4`, `v2`, `latest`) during the release step and build/push multi-tagged container images automatically to a registry like GitHub Container Registry (GHCR) or Docker Hub.

There are two primary integration patterns:

1. **The `@semantic-release/exec` plugin pattern (Single Job)** — Semantic Release calculates the version and invokes Docker commands directly via plugin hooks.
2. **The Output Variable pattern (Two-Stage Job)** — Semantic Release exports the determined version to GitHub Actions job outputs, and standard Docker actions (`docker/build-push-action`) handle building and pushing.

---

### Method 1: Single Job via `@semantic-release/exec` (Recommended)

This approach uses `@semantic-release/exec` to execute shell commands during the release lifecycle. If no release is necessary (e.g., only `docs:` or `chore:` commits), Docker build/push is skipped automatically.

1. **Install @semantic-release/exec:**
Install the exec plugin as a dev dependency:

```bash
npm install --save-dev @semantic-release/exec

```

1. **Configure .releaserc.json:**
Add `@semantic-release/exec` into `.releaserc.json` within the `publishCmd` lifecycle hook.

2. **Configure GitHub Actions Workflow:**
Set up Docker Buildx, authenticate with your container registry, and run Semantic Release.

#### 1. Configuration (`.releaserc.json`)

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
        "publishCmd": "docker buildx build --platform linux/amd64,linux/arm64 -t ghcr.io/${process.env.IMAGE_NAME}:${nextRelease.version} -t ghcr.io/${process.env.IMAGE_NAME}:latest --push ."
      }
    ],
    [
      "@semantic-release/git",
      {
        "assets": ["CHANGELOG.md", "package.json"],
        "message": "chore(release): ${nextRelease.version} [skip ci]\n\n${nextRelease.notes}"
      }
    ],
    "@semantic-release/github"
  ]
}

```

#### 2. Workflow (`.github/workflows/release-docker.yml`)

```yaml
name: Release & Docker Publish

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
    env:
      IMAGE_NAME: ${{ github.repository }}
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

      - name: Set up QEMU (for multi-arch)
        uses: docker/setup-qemu-action@v3

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Install Dependencies
        run: npm ci

      - name: Run Tests
        run: npm test

      - name: Run Semantic Release (Triggers Docker Build & Push on Release)
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release

```

---

### Method 2: Two-Stage Job with `docker/metadata-action`

If you prefer using official Docker GitHub Actions (`docker/build-push-action` and `docker/metadata-action`) to generate full SemVer flavor tags (`2.4.1`, `2.4`, `2`, `latest`), you can have `@semantic-release/exec` write the new version to `$GITHUB_OUTPUT`.

#### 1. Configuration (`.releaserc.json`)

```json
{
  "branches": ["main"],
  "plugins": [
    "@semantic-release/commit-analyzer",
    "@semantic-release/release-notes-generator",
    [
      "@semantic-release/exec",
      {
        "verifyReleaseCmd": "echo \"new_version=${nextRelease.version}\" >> $GITHUB_OUTPUT && echo \"has_release=true\" >> $GITHUB_OUTPUT"
      }
    ],
    "@semantic-release/github"
  ]
}

```

#### 2. Workflow (`.github/workflows/release-docker.yml`)

```yaml
name: Release & Docker Build

on:
  push:
    branches:
      - main

permissions:
  contents: write
  packages: write

jobs:
  release:
    runs-on: ubuntu-latest
    outputs:
      new_version: ${{ steps.semantic.outputs.new_version }}
      has_release: ${{ steps.semantic.outputs.has_release }}
    steps:
      - name: Checkout
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22

      - name: Install dependencies
        run: npm ci

      - name: Run Semantic Release
        id: semantic
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        run: npx semantic-release

  docker:
    needs: release
    if: needs.release.outputs.has_release == 'true'
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract Docker metadata (Tags & Labels)
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=raw,value=${{ needs.release.outputs.new_version }}
            type=raw,value=latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

```

---

### Tag Mapping Reference

| Calculated Version (`${nextRelease.version}`) | Generated Docker Image Tags |
| --------------------------------------------- | --------------------------- |
| **`1.2.3`**                                   | `ghcr.io/org/app:1.2.3`<br> |

<br>`ghcr.io/org/app:1.2`<br>

<br>`ghcr.io/org/app:1`<br>

<br>`ghcr.io/org/app:latest` |
| **`2.0.0-beta.1`** (Pre-release) | `ghcr.io/org/app:2.0.0-beta.1`<br>

<br>`ghcr.io/org/app:beta` |

---

### Key Best Practices

* **Always use Buildx Cache (`type=gha`):** Caching intermediate Docker layers inside GitHub Actions cuts down build and push duration significantly.
* **Multi-Arch Builds:** When pushing to public registries or cloud infrastructure (AWS Graviton, Apple Silicon, x86 servers), use `--platform linux/amd64,linux/arm64`.
* **Guard against No-Op Runs:** Ensure Docker steps only trigger when `nextRelease` is defined; otherwise, non-code commits (`docs: ...`) would needlessly republish existing images.
