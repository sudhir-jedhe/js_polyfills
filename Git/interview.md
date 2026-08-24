A categorized, deep-dive compendium of **105 essential Git interview questions and answers**, spanning fundamental operations, internal architecture, branching models, history manipulation, debugging tools, and enterprise workflows.

---

### Section 1: Git Fundamentals & Architecture (1–15)

**1. What is Git and how does it differ from Centralized Version Control Systems (CVCS like SVN)?**

* Git is a **Distributed Version Control System (DVCS)**. Every developer clones a full-fledged repository with complete history, branch references, and commits on their local disk.
* CVCS requires a network connection to a central server to inspect history, create branches, or commit changes. If the central server fails in CVCS, version control halts.

**2. What are the three primary states/areas in Git?**

* **Working Directory:** The local filesystem containing modified, unstaged files.
* **Staging Area (Index):** A binary file (`.git/index`) acting as a preview cache of what will go into the next commit.
* **Git Repository (History):** The immutable database of committed objects inside the `.git` directory.

**3. What is the Git Stash area and how does it fit into the architecture?**

* A temporary shelf stored in `.git/refs/stash` that preserves dirty working directory changes and index state without creating a formal commit in the branch history.

**4. What are the four core internal object types in Git?**

* **Blob:** Stores pure raw file contents (unnamed, no permissions).
* **Tree:** Represents a directory; maps filenames, file modes/permissions, and pointers to blobs or child trees.
* **Commit:** Contains a pointer to a root tree object, parent commit hash(es), author/committer metadata, timestamps, and the commit message.
* **Annotated Tag:** A permanent pointer to a specific commit object containing tagger metadata, GPG signatures, and a message.

**5. How does Git track content integrity (SHA-1 / SHA-256)?**

* Git computes a cryptographic hash of the object header and content. The resulting 40-character hexadecimal string acts as the object’s unique identifier (Content-Addressable Storage).

**6. What is `HEAD` in Git?**

* A symbolic reference pointing to the currently checked-out branch pointer (or directly to a commit in a detached HEAD state). It resides at `.git/HEAD`.

**7. What is a "Detached HEAD" state?**

* Occurs when `HEAD` points directly to an arbitrary commit hash, tag, or remote branch instead of a local branch reference. Commits made here are orphaned once you switch branches unless anchored to a new branch.

**8. What does `git init` do internally?**

* Creates the `.git` directory structure containing `objects/`, `refs/heads/`, `refs/tags/`, `HEAD`, `config`, and `hooks/`.

**9. What is the difference between `git init` and `git init --bare`?**

* `git init`: Creates a repository with an active working directory for everyday development.
* `git init --bare`: Creates a repository containing only the Git metadata (no working tree). Used exclusively on remote servers (e.g., GitHub, GitLab) to accept pushes.

**10. What is `.git/index`?**

* A binary file serving as the staging area. It tracks file paths, timestamps, file modes, and SHA-1 hashes of staged blobs.

**11. What is the `.gitignore` file and what can it NOT do?**

* Specifies intentionally untracked files to ignore. It **cannot** ignore files that are already tracked and committed in Git history until they are unstaged via `git rm --cached`.

**12. What is `.gitkeep`?**

* A community convention (not an official Git feature). Git does not track empty directories; creating an empty `.gitkeep` file inside a directory forces Git to track the folder.

**13. What is the global configuration file location?**

* `~/.gitconfig` or `~/.config/git/config`. Local repository configs reside in `.git/config`.

**14. What are the three configuration levels in Git and their precedence?**

* **Local** (`.git/config` via `--local`) $\to$ overrides **Global** (`~/.gitconfig` via `--global`) $\to$ overrides **System** (`/etc/gitconfig` via `--system`).

**15. What is the `.gitattributes` file?**

* Defines path-specific settings such as line-ending normalizations (`LF` vs `CRLF`), binary file diffing rules, and merge driver strategies.

---

### Section 2: Everyday Staging, Commits & History (16–30)

**16. What is the difference between `git add .` and `git add -A` (or `git add --all`)?**

* In modern Git (v2.0+), both stage all new, modified, and deleted files across the entire repository tree. In legacy Git, `git add .` only staged files within the current subdirectory.

**17. What does `git add -p` (patch mode) do?**

* Interactively reviews and stages modifications chunk-by-chunk (hunk-by-hunk), allowing precise commits of partial file changes.

**18. What is the difference between `git status` and `git status -s`?**

* `git status`: Full descriptive output.
* `git status -s`: Short format showing a two-character status code per file (e.g., `M` for staged modification, `M` for unstaged modification, `??` for untracked).

**19. What is `git commit --amend`?**

* Modifies the most recent commit by combining staged changes and/or updating the commit message. It replaces the previous commit with a completely new SHA-1 hash.

**20. When should you NEVER use `git commit --amend`?**

* When the commit has already been pushed to a shared remote branch, as amending alters commit history and requires a forced push.

**21. What does `git commit -m` vs `git commit -am` do?**

* `-m`: Attaches a message to staged changes.
* `-am`: Automatically stages all **tracked, modified** files and commits them with the message in a single step (does not stage untracked new files).

**22. How do you view a commit graph in the terminal?**

* `git log --graph --oneline --decorate --all`

**23. What does `git log -p` display?**

* Shows the commit history along with the full inline patch/diff introduced by each commit.

**24. What does `git log --stat` show?**

* Displays the standard commit log accompanied by binary/line insertion and deletion statistics per modified file.

**25. How do you limit `git log` by date or author?**

* `git log --author="Jane" --since="2026-01-01" --until="2026-06-01"`

**26. How do you search for commits that changed a specific string across history?**

* `git log -S "SEARCH_STRING"` (the "pickaxe" search).

**27. What is `git show <commit-hash>`?**

* Displays complete metadata and the diff for a specified commit, tag, or tree object.

**28. How do you view changes between working directory and the staging area?**

* `git diff`

**29. How do you view changes between the staging area and the last commit?**

* `git diff --staged` (or `git diff --cached`).

**30. How do you view differences between two branches?**

* `git diff branchA..branchB`

---

### Section 3: Branching, Switching & Merging (31–45)

**31. What is a Git branch under the hood?**

* A lightweight, movable 41-byte text pointer inside `.git/refs/heads/<branch-name>` containing the 40-character SHA-1 of its latest commit.

**32. What is the difference between `git branch -d` and `git branch -D`?**

* `-d` (`--delete`): Safe deletion; prevents deleting a branch if it contains unmerged changes.
* `-D` (`--delete --force`): Forcefully deletes the branch regardless of its merge status.

**33. What is the difference between `git checkout <branch>` and `git switch <branch>`?**

* `git checkout` is an overloaded legacy command (handles branches, commits, and file restorations).
* `git switch` (introduced in Git 2.23) is dedicated exclusively to switching and creating branches (`git switch -c <branch>`).

**34. What is the difference between `git checkout <file>` and `git restore <file>`?**

* `git checkout -- <file>` discards working directory changes (overloaded).
* `git restore <file>` (Git 2.23+) specifically un-modifies or discards unstaged changes in the working directory.

**35. What is a Fast-Forward merge?**

* Occurs when the target branch has no divergent commits compared to the source branch. Git simply moves the target branch pointer forward to the head commit of the source branch without creating a merge commit.

**36. What is a 3-Way Merge (True Merge)?**

* Occurs when branches have diverged. Git uses three snapshots (Branch A tip, Branch B tip, and their Common Ancestor) to construct a new merge commit with two parent commit hashes.

**37. How do you force a merge commit even if a Fast-Forward is possible?**

* `git merge --no-ff <branch-name>` (useful in GitFlow to preserve explicit feature branch history).

**38. What is a Merge Conflict and why does it happen?**

* Occurs when two branches modify the same line(s) of a file differently or when one branch deletes a file that another modified. Git cannot resolve the divergence automatically.

**39. How do you abort an in-progress merge during conflict resolution?**

* `git merge --abort`

**40. What are conflict markers in Git?**

* `<<<<<<< HEAD` (current branch changes), `=======` (separator), and `>>>>>>> branch-name` (incoming branch changes).

**41. What is `git merge --squash <branch>`?**

* Takes all commits from the source branch, combines their net diff into the staging area of the current branch, and allows creating a single unified commit without merge parents.

**42. What is the difference between `git branch -r` and `git branch -a`?**

* `-r`: Lists remote-tracking branches.
* `-a`: Lists all local and remote branches.

**43. How do you rename a local Git branch?**

* Current branch: `git branch -m <new-name>`
* Specific branch: `git branch -m <old-name> <new-name>`

**44. How do you rename a remote branch?**

* Rename locally (`git branch -m new-name`), push new branch (`git push origin -u new-name`), and delete old remote branch (`git push origin --delete old-name`).

**45. What is an orphaned branch?**

* A branch created with zero history/parents using `git checkout --orphan <name>`. Used to create clean branches like `gh-pages`.

---

### Section 4: Rebasing vs. Merging (46–55)

**46. What is `git rebase` and how does it work under the hood?**

* Replays commits from the current branch on top of another base tip. Git finds the common ancestor, stores current branch commits as temporary patches (`.git/rebase-apply`), resets the branch to the target base, and applies each patch sequentially.

**47. What is the main difference between `git merge` and `git rebase`?**

* `git merge`: Preserves true chronological history and creates a merge commit; non-destructive.
* `git rebase`: Rewrites commit history into a clean, linear timeline; changes commit hashes.

**48. What is the "Golden Rule of Rebasing"?**

* **Never rebase a public/shared branch.** Rewriting history on branches others rely on forces divergence and complex reconciliation.

**49. What is Interactive Rebasing (`git rebase -i`)?**

* Opens an editor allowing you to rewrite, reorder, combine, or drop historical commits.

**50. What do these interactive rebase commands do?**

* `pick`: Keeps the commit as is.
* `reword`: Keeps the commit but changes its message.
* `edit`: Pauses the rebase to alter commit contents or stage new files.
* `squash`: Melds the commit into the previous commit and concatenates messages.
* `fixup`: Melds the commit into the previous commit and discards this commit's message.
* `drop`: Deletes the commit entirely.

**51. How do you resolve a conflict during a rebase?**

1. Resolve conflict markers manually.
2. Stage fixed files: `git add <file>`.
3. Continue: `git rebase --continue` (do not run `git commit`).

**52. How do you abort an ongoing rebase?**

* `git rebase --abort`

**53. What is `git pull --rebase` and why is it used?**

* Fetches remote commits and rebases your local unpushed commits on top of the updated remote branch, avoiding unnecessary "Merge branch..." noise commits.

**54. What is `git rebase --onto`?**

* Allows transplanting a range of commits from one upstream branch onto another completely different branch without merging intermediate commits.

**55. What is the `rerere` feature in Git?**

* **Reuse Recorded Resolution** (`git config --global rerere.enabled true`). Automatically remembers how you resolved a merge conflict hunk and auto-applies the exact resolution if the same conflict recurs during rebasing.

---

### Section 5: Remote Repositories & Collaboration (56–70)

**56. What is `origin` in Git?**

* The default shorthand alias for the remote repository URL from which the current repository was cloned.

**57. What does `git remote -v` do?**

* Displays the list of configured remote repository names alongside their fetch and push URLs.

**58. How do you add a new remote repository?**

* `git remote add upstream [https://github.com/original-owner/repo.git](https://github.com/original-owner/repo.git)`

**59. What is the difference between `git fetch` and `git pull`?**

* `git fetch`: Downloads new commits, files, and refs from the remote repository into remote-tracking branches (`origin/main`) without modifying your working tree.
* `git pull`: Combines `git fetch` followed immediately by `git merge FETCH_HEAD` (or `git rebase`).

**60. What is an upstream tracking branch?**

* A local configuration linking a local branch to a specific remote branch (e.g., `main` tracks `origin/main`), enabling parameterless `git push` and `git pull`.

**61. How do you set an upstream tracking branch on push?**

* `git push -u origin feature-branch` (or `--set-upstream`).

**62. What does `git push --force` do and why is it dangerous?**

* Overwrites the remote ref with your local ref unconditionally, deleting any commits pushed by other collaborators in the interim.

**63. What is `git push --force-with-lease`?**

* A safer alternative to `--force`. It only permits overwriting the remote branch if your local remote-tracking branch (`origin/feature`) matches the actual tip on the remote server, preventing you from overwriting teammates' un-fetched work.

**64. How do you delete a remote branch?**

* `git push origin --delete <branch-name>` (or `git push origin :<branch-name>`).

**65. How do you delete a remote tag?**

* `git push origin --delete tag <tag-name>`

**66. What is `git remote prune origin`?**

* Deletes stale local references to remote-tracking branches (`origin/*`) that have already been deleted on the remote server.

**67. What is `git fetch --prune`?**

* Fetches the latest remote commits and simultaneously prunes dead remote-tracking branches in one step.

**68. What is the difference between an SSH key and Personal Access Token (PAT) for Git auth?**

* SSH uses asymmetric public/private key pairs for continuous terminal authentication.
* PATs are scoped, revocable HTTPS tokens replacing raw passwords for OAuth and fine-grained API permissions.

**69. How do you change the URL of an existing remote?**

* `git remote set-url origin [https://github.com/new-user/repo.git](https://github.com/new-user/repo.git)`

**70. What is a Git Fork vs a Git Clone?**

* **Fork:** A server-side copy of a repository hosted under your own remote account (e.g., GitHub/GitLab UI operation).
* **Clone:** A local filesystem copy of a remote repository pulled down via the Git CLI.

---

### Section 6: Undo, Reset, Revert & Recovery (71–85)

**71. What are the three modes of `git reset`?**

* **`--soft`:** Moves `HEAD` pointer to the target commit; leaves the Staging Area and Working Directory untouched.
* **`--mixed` (Default):** Moves `HEAD` and resets the Staging Area to match; leaves the Working Directory untouched.
* **`--hard`:** Moves `HEAD`, resets the Staging Area, and completely overwrites the Working Directory to match the target commit (destroys uncommitted changes).

**72. What is the difference between `git reset` and `git revert`?**

* `git reset`: Rewrites history by moving the branch pointer backward, discarding commits.
* `git revert`: Forward-moving undo. Creates a brand-new commit that applies the exact inverse diff of target commit(s), preserving original history.

**73. When should you use `git revert` over `git reset`?**

* Always use `git revert` when undoing changes on shared/public branches to prevent history rewriting issues for teammates.

**74. How do you revert a merge commit?**

* You must specify the parent mainline number using `-m`:

```bash
git revert -m 1 <merge-commit-hash>

```

**75. What is `git reflog`?**

* **Reference Log:** A local safety-net tracking every movement of `HEAD` and branch tips (commits, checkouts, resets, rebases, merges). Entries exist locally for typically 90 days before garbage collection.

**76. How do you recover a deleted commit or branch using `reflog`?**

1. Run `git reflog` and find the commit SHA before the deletion/reset.
2. Recover via: `git checkout -b recovered-branch <commit-sha>`.

**77. How do you unstage a file without losing modifications?**

* `git restore --staged <file>` (or legacy `git reset HEAD <file>`).

**78. How do you discard all local unstaged modifications in the working tree?**

* `git restore .` (or legacy `git checkout -- .`).

**79. How do you clean untracked files and directories from your working directory?**

* `git clean -fd` (`-f` = force, `-d` = directories). Run `git clean -nd` first for a dry run.

**80. What is `git stash pop` vs `git stash apply`?**

* `git stash pop`: Applies the most recent stash entry and drops it from the stash list.
* `git stash apply`: Applies the stash changes but keeps the stash preserved in the stash list.

**81. How do you view all existing stashes?**

* `git stash list`

**82. How do you stash untracked or ignored files?**

* Untracked: `git stash -u` (or `--include-untracked`)
* All (including ignored): `git stash -a` (or `--all`)

**83. How do you inspect what is inside a stash without applying it?**

* `git stash show -p stash@{0}`

**84. What is `git cherry-pick <commit-hash>`?**

* Applies the exact diff introduced by a specific commit from another branch onto your current branch, creating a new commit.

**85. How do you cherry-pick a range of commits?**

* `git cherry-pick A..B` (picks commits after A up to B) or `git cherry-pick A^..B` (includes A).

---

### Section 7: Advanced Tools, Debugging & Plumbing (86–95)

**86. What is `git bisect` and how does it work?**

* A binary-search debugging tool to find the exact commit that introduced a bug.
* Workflow:

1. `git bisect start`
2. `git bisect bad` (current version has the bug)
3. `git bisect good <known-good-commit>`
4. Git checks out intermediate commits; you test and mark `git bisect good` or `git bisect bad` until it isolates the offending commit.
5. `git bisect reset` to return to original state.

**87. What is `git blame <file>`?**

* Displays author metadata, commit hash, and timestamp for every individual line of a file.

**88. What is the difference between Git Porcelain and Plumbing commands?**

* **Porcelain:** High-level, user-friendly CLI commands designed for daily developer interaction (`git add`, `git commit`, `git checkout`).
* **Plumbing:** Low-level internal commands designed for scripting and tooling (`git hash-object`, `git cat-file`, `git write-tree`, `git commit-tree`).

**89. What does `git cat-file -p <hash>` do?**

* Plumbing command that prints the formatted contents of any internal Git object (blob text, tree hierarchy, commit metadata).

**90. What does `git hash-object -w <file>` do?**

* Plumbing command that computes the SHA-1 hash of a file, creates a blob object, and writes (`-w`) it into `.git/objects/`.

**91. What is `git gc` (Garbage Collection)?**

* Optimizes the repository by packing loose objects into compressed packfiles (`.pack`), removing unreachable dangling objects, and pruning reflogs.

**92. What is `git fsck`?**

* **File System Consistency Check:** Verifies the structural integrity of the Git object database and identifies corrupt or unreachable dangling objects.

**93. What are Git Submodules vs Git Subtrees?**

* **Submodule:** A pointer commit SHA tracking a specific external Git repository embedded inside your repo. Requires `git submodule update --init`.
* **Subtree:** Merges the external repository's code directly into your repository tree as standard files and commits, requiring no special client configs.

**94. What is Git LFS (Large File Storage)?**

* Replaces large binary files (audio, video, datasets) in your Git repo with small text pointer files, while storing the actual large binaries on an external LFS server to prevent repository bloat.

**95. What are Git Worktrees?**

* `git worktree add <path> <branch>` allows checking out multiple branches of the same repository into separate local folders simultaneously without re-cloning.

---

### Section 8: Hooks, Workflows & Best Practices (96–105)

**96. What are Git Hooks and where are they located?**

* Custom client-side or server-side shell scripts triggered automatically by Git lifecycle events (e.g., `pre-commit`, `commit-msg`, `pre-push`). Stored in `.git/hooks/`.

**97. What is the difference between client-side and server-side hooks?**

* **Client-side:** Runs locally on developer machines (e.g., running linters or formatters via Husky on `pre-commit`). Can be bypassed with `--no-verify`.
* **Server-side:** Runs on remote Git servers (e.g., `pre-receive`, `update`) to enforce commit message policies, branch protection rules, and block rejected pushes. Cannot be bypassed by clients.

**98. What is the Conventional Commits specification?**

* A standardized commit message convention structured as:
`<type>[optional scope]: <description>` (e.g., `feat(auth): add OAuth2 login`, `fix(api): resolve timeout bug`, `chore: bump dependencies`). Enables automated changelog generation and SemVer releases.

**99. What is GitFlow Workflow?**

* A branching model utilizing long-lived branches (`main`, `develop`) and short-lived branches (`feature/*`, `release/*`, `hotfix/*`).

**100. What is Trunk-Based Development?**

* A modern DevOps branching strategy where developers merge small, frequent updates directly into a single shared branch (`main` / `trunk`) multiple times a day, relying on automated CI tests and feature flags instead of long-lived feature branches.

**101. What is GitHub Flow?**

* A lightweight workflow: create a feature branch off `main`, open a Pull Request, review/test, merge into `main`, and deploy immediately.

**102. What is a Git Tag and what are the two types?**

* A permanent bookmark pointing to a specific commit, typically used for releases (e.g., `v1.0.0`).
* **Lightweight Tag:** A simple pointer to a commit hash (`git tag v1.0.0`).
* **Annotated Tag:** A full Git object containing tagger name, email, date, GPG signature, and message (`git tag -a v1.0.0 -m "Release v1.0.0"`).

**103. How do you push local tags to a remote repository?**

* Specific tag: `git push origin v1.0.0`
* All tags: `git push origin --tags`

**104. What is GPG signing in Git and why is it used?**

* Cryptographically signs commits and tags using a private GPG key (`git commit -S -m "msg"`). Proves that commits genuinely originated from the claimed author and were not spoofed.

**105. How do you fix a commit pushed with the wrong author email?**

* For the latest commit: `git commit --amend --author="Name <email@example.com>" --no-edit` followed by `git push --force-with-lease`.
* For older commits across history: Use `git filter-repo` (or interactive rebase).
