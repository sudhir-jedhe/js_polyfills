# Top Git Interview Questions (Senior React / Frontend Developer)

Git branching, pull requests, merge conflicts, and branching strategies are repeatedly emphasised in internal engineering and configuration-management guidance. Feature branches, pull requests, protected branches, code reviews, and merge workflows are commonly expected topics. [\[Configurat...Guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Configuration%20Management%20Guidelines.pdf?web=1), [\[Guidelines...t Pipeline \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Guidelines%20for%20Deployment%20Pipeline.pdf?web=1), [\[Git_branch...g_strategy \| Word\]](https://persistentsystems.sharepoint.com/sites/CrawfordAWSADOImplementation/_layouts/15/Doc.aspx?sourcedoc=%7B922AE042-5017-45FA-B904-E832118F5C55%7D&file=Git_branching_strategy.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# 1. What is Git?

### Answer

Git is a distributed version control system used to:

```text
✅ Track changes
✅ Collaborate with teams
✅ Manage branches
✅ Maintain history
✅ Rollback changes
```

***

# 2. Difference Between Git and GitHub

| Git                  | GitHub                 |
| -------------------- | ---------------------- |
| Version control tool | Cloud hosting platform |
| Local machine        | Remote repository      |
| Tracks history       | Collaboration platform |

***

# 3. What is the Git Workflow?

```text
Working Directory
       ↓
Staging Area
       ↓
Local Repository
       ↓
Remote Repository
```

Commands:

```bash
git add .
git commit -m "message"
git push
```

***

# 4. Difference Between git fetch and git pull

### git fetch

```bash
git fetch
```

Downloads changes.

```text
Does NOT merge
```

***

### git pull

```bash
git pull
```

Downloads and merges.

```text
fetch + merge
```

***

# 5. Difference Between Merge and Rebase

### Merge

```bash
git merge feature
```

Creates a merge commit.

```text
History Preserved
```

Example:

```text
A---B---C (main)
     \
      D---E (feature)

After merge

A---B---C------M
     \        /
      D---E---
```

***

### Rebase

```bash
git rebase main
```

Moves commits on top of latest branch.

```text
Cleaner History
```

***

### Interview Answer

```text
Merge preserves history.

Rebase rewrites history.
```

***

# 6. What is a Branch?

A branch is an independent line of development.

Internal engineering guidance recommends feature branches, release branches, and hotfix branches to isolate work and reduce risks. [\[Guidelines...t Pipeline \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Guidelines%20for%20Deployment%20Pipeline.pdf?web=1), [\[Git_branch...g_strategy \| Word\]](https://persistentsystems.sharepoint.com/sites/CrawfordAWSADOImplementation/_layouts/15/Doc.aspx?sourcedoc=%7B922AE042-5017-45FA-B904-E832118F5C55%7D&file=Git_branching_strategy.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

Examples:

```text
main
develop
feature/login
hotfix/payment
release/v1.0
```

***

# 7. Common Branching Strategy

GitFlow is explicitly referenced in internal guidance. [\[BFSI-Git-B...ategy_v0.1 \| Word\]](https://persistentsystems.sharepoint.com/sites/EnterpriseApplications/SmartQMS/_layouts/15/Doc.aspx?sourcedoc=%7B81819CB0-4AE6-4549-A5F3-8302D78486BF%7D&file=BFSI-Git-Branching-Strategy_v0.1.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Engineering Playbook \| SharePoint\]](https://persistentsystemsnam.sharepoint.com/sites/KnowledgeCenter/SitePages/Engineering-Playbook.aspx?web=1)

```text
main
develop
feature/*
release/*
hotfix/*
```

***

# 8. How Do You Resolve Merge Conflicts?

### Steps

```bash
git pull origin main

# resolve conflicts

git add .

git commit
```

### Interview Answer

> Pull latest changes, review conflicting code, manually resolve the conflict, run tests, and commit the resolved version. Similar conflict-resolution practices are described in interview evaluation examples. [\[Mounika Re...ache camel \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Mounika%20Reddy__AI_Inteview_Evaluation_Integration%20others,%20Apache%20camel.pdf?web=1)

***

# 9. What is a Pull Request (PR)?

A Pull Request is a code review request before merging code.

Internal standards emphasise code reviews and pull-request-based merges rather than direct merges to important branches. [\[Git_branch...g_strategy \| Word\]](https://persistentsystems.sharepoint.com/sites/CrawfordAWSADOImplementation/_layouts/15/Doc.aspx?sourcedoc=%7B922AE042-5017-45FA-B904-E832118F5C55%7D&file=Git_branching_strategy.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[dotnet-C#-...guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/dotnet-C#-coding-guidelines.pdf?web=1), [\[Engineerin...Guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Engineering%20Excellence%20Quality%20Standards%20and%20Guidelines.pdf?web=1)

Flow:

```text
Feature Branch
      ↓
Pull Request
      ↓
Code Review
      ↓
Merge
```

***

# 10. What is HEAD?

HEAD points to:

```text
Current Branch
Current Commit
```

Example:

```bash
HEAD -> main
```

***

# 11. Difference Between git reset and git revert

### Reset

```bash
git reset --hard HEAD~1
```

Removes commit history locally.

***

### Revert

```bash
git revert commit-id
```

Creates a new commit that undoes changes.

***

### Interview Answer

```text
Reset rewrites history.

Revert preserves history.
```

***

# 12. What is Stash?

Temporarily saves uncommitted changes.

```bash
git stash
```

Restore:

```bash
git stash pop
```

***

# 13. Difference Between Local and Remote Branch

### Local

```bash
git branch
```

***

### Remote

```bash
git branch -r
```

***

# 14. Useful Daily Commands

```bash
git status
git log
git add .
git commit -m "message"
git push
git pull
git fetch
git merge
git rebase
```

Several of these basic commands are documented in [Git.docx](https://persistentsystems.sharepoint.com/sites/VivaDev/_layouts/15/Doc.aspx?sourcedoc=%7B1488DAF7-9371-4331-A470-62C49F60D921%7D\&file=Git.docx\&action=default\&mobileredirect=true\&DefaultItemOpen=1\&EntityRepresentationId=17c960a4-e349-4def-84b1-d759c8d8b314). [\[Git \| Word\]](https://persistentsystems.sharepoint.com/sites/VivaDev/_layouts/15/Doc.aspx?sourcedoc=%7B1488DAF7-9371-4331-A470-62C49F60D921%7D&file=Git.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

# 15. How Do You Undo Last Commit?

Keep changes:

```bash
git reset --soft HEAD~1
```

Remove completely:

```bash
git reset --hard HEAD~1
```

***

# 16. What Happens in git clone?

```bash
git clone repo-url
```

Downloads:

```text
Repository
History
Branches
Commits
```

***

# 17. What Is Cherry Pick?

Copy a specific commit.

```bash
git cherry-pick commit-id
```

Used when:

```text
Need one commit only
```

***

# 18. What Is Squash?

Combine multiple commits into one.

```text
10 commits
↓
1 clean commit
```

Improves history readability.

***

# Real-World Scenario Questions

### Q: Two developers changed the same file. What happens?

```text
Merge Conflict
```

Resolve manually.

***

### Q: Production bug found. What branch?

```text
Hotfix Branch
```

Hotfix branches are part of common branching strategies. [\[BFSI-Git-B...ategy_v0.1 \| Word\]](https://persistentsystems.sharepoint.com/sites/EnterpriseApplications/SmartQMS/_layouts/15/Doc.aspx?sourcedoc=%7B81819CB0-4AE6-4549-A5F3-8302D78486BF%7D&file=BFSI-Git-Branching-Strategy_v0.1.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Git_branch...g_strategy \| Word\]](https://persistentsystems.sharepoint.com/sites/CrawfordAWSADOImplementation/_layouts/15/Doc.aspx?sourcedoc=%7B922AE042-5017-45FA-B904-E832118F5C55%7D&file=Git_branching_strategy.docx&action=default&mobileredirect=true&DefaultItemOpen=1)

***

### Q: How do you prevent merge conflicts?

```text
✅ Pull frequently
✅ Small commits
✅ Small pull requests
✅ Feature branches
✅ Regular sync with main
```

Practices such as frequent integration and feature isolation are also mentioned in internal configuration-management guidance. [\[Configurat...Guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Configuration%20Management%20Guidelines.pdf?web=1), [\[Guidelines...t Pipeline \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Guidelines%20for%20Deployment%20Pipeline.pdf?web=1)

***

# Senior React Interview Questions (Frequently Asked)

```text
✅ Merge vs Rebase

✅ Fetch vs Pull

✅ Reset vs Revert

✅ Git Flow

✅ Branching Strategy

✅ Merge Conflict Resolution

✅ Pull Request Process

✅ Stash

✅ Cherry Pick

✅ Squash

✅ Protected Branches

✅ Code Review Workflow
```

# 30-Second Interview Answer

> We typically follow a feature-branch workflow. Developers create feature branches, regularly sync with the main/develop branch, raise pull requests, undergo peer review, and merge only after CI validation. I am comfortable with merge, rebase, stash, cherry-pick, squash, conflict resolution, GitFlow-style branching, hotfix branches, and protected branch workflows. This aligns with common engineering guidance that recommends feature isolation, pull requests, reviews, and branch protection. [\[Configurat...Guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Configuration%20Management%20Guidelines.pdf?web=1), [\[Guidelines...t Pipeline \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Guidelines%20for%20Deployment%20Pipeline.pdf?web=1), [\[Git_branch...g_strategy \| Word\]](https://persistentsystems.sharepoint.com/sites/CrawfordAWSADOImplementation/_layouts/15/Doc.aspx?sourcedoc=%7B922AE042-5017-45FA-B904-E832118F5C55%7D&file=Git_branching_strategy.docx&action=default&mobileredirect=true&DefaultItemOpen=1), [\[Engineerin...Guidelines \| PDF\]](https://persistentsystems.sharepoint.com/sites/intranet/D&OE/ProcessDocumentsRepository/Engineering%20Excellence%20Quality%20Standards%20and%20Guidelines.pdf?web=1)


# 1. Git Merge Conflict Resolution Steps

A merge conflict happens when two developers modify the same lines of code and Git cannot automatically decide which changes to keep. Internal guidance emphasises frequent integration, feature branches, pull requests, and manual conflict resolution when needed. [\[Mounika Re...ache camel \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Mounika%20Reddy__AI_Inteview_Evaluation_Integration%20others,%20Apache%20camel.pdf?web=1), [\[GitOps \| SharePoint\]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/GitOps%281%29.aspx?web=1)

## Example

### Main Branch

```javascript
function getData() {
  return "API V1";
}
```

### Feature Branch

```javascript
function getData() {
  return "API V2";
}
```

When merging:

```bash
git merge feature-branch
```

Git reports:

```text
CONFLICT (content)
```

***

## Step-by-Step Resolution

### 1. Pull Latest Changes

```bash
git pull origin main
```

***

### 2. Attempt Merge

```bash
git merge feature-branch
```

***

### 3. Open Conflicted File

Git adds markers:

```javascript
<<<<<<< HEAD

return "API V1";

=======

return "API V2";

>>>>>>> feature-branch
```

***

### 4. Decide Final Version

```javascript
function getData() {
  return "API V2";
}
```

***

### 5. Mark Conflict Resolved

```bash
git add src/api.js
```

***

### 6. Complete Merge

```bash
git commit -m "Resolved merge conflict"
```

***

### 7. Run Tests

```bash
npm test
npm run build
```

Always verify:

```text
✅ Application Works
✅ Unit Tests Pass
✅ Build Passes
```

***

## Interview Answer

> My approach is to pull the latest changes, understand both developers' intentions, resolve conflicts manually, test thoroughly, and then commit the resolved code. I prefer small PRs and frequent integration to reduce conflicts.

***

# 2. Common Git Commands for Daily Use

### Repository

```bash
git clone <repo-url>
```

Clone repository.

***

### Check Status

```bash
git status
```

Shows:

```text
Current branch
Modified files
Staged files
```

***

### Add Changes

```bash
git add .
```

or

```bash
git add filename.js
```

***

### Commit

```bash
git commit -m "Added login page"
```

***

### Push

```bash
git push origin feature/login
```

***

### Pull

```bash
git pull origin main
```

***

### Fetch

```bash
git fetch
```

Downloads latest changes without merging.

***

### Branch Commands

```bash
git branch
```

See local branches.

```bash
git branch -a
```

See all branches.

```bash
git checkout -b feature/login
```

Create branch.

```bash
git checkout feature/login
```

Switch branch.

***

### Merge

```bash
git merge feature/login
```

***

### Rebase

```bash
git rebase main
```

***

### Stash

```bash
git stash
```

```bash
git stash pop
```

Save temporary work.

***

### Reset

```bash
git reset --soft HEAD~1
```

Undo commit but keep changes.

***

### Revert

```bash
git revert commit-id
```

Safely undo changes via a new commit.

***

# 3. Git Branching Strategies

Internal engineering guidance discusses several branching approaches including GitFlow, GitHub Flow, feature branches, release branches, hotfix branches, and trunk-based development.

***

## A. Feature Branch Strategy (Most Common)

```text
main
 │
 ├── feature/login
 ├── feature/cart
 └── feature/payment
```

Workflow:

```text
Create feature branch
↓
Develop
↓
PR Review
↓
Merge to main
```

Benefits:

```text
✅ Isolated development
✅ Easy code review
✅ Reduced risk
```

 [\[Mounika Re...ache camel \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Mounika%20Reddy__AI_Inteview_Evaluation_Integration%20others,%20Apache%20camel.pdf?web=1), [\[GitOps \| SharePoint\]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/GitOps%281%29.aspx?web=1)

***

## B. GitFlow

```text
main
 │
 develop
 │
 ├── feature/*
 ├── release/*
 └── hotfix/*
```

Used in:

```text
Large teams
Enterprise applications
Multiple release cycles
```



***

## C. GitHub Flow

```text
main
 │
 feature/*
 │
 Pull Request
 │
 Merge
```

Simple and popular.

```text
Ideal for CI/CD
```



***

## D. Trunk-Based Development

```text
main
 │
 Short-lived branches
 │
 Frequent merges
```

Benefits:

```text
✅ Faster releases
✅ Smaller conflicts
✅ Continuous delivery
```



***

## E. Hotfix Strategy

```text
main
 │
 hotfix/payment-bug
 │
 merge
```

Used for:

```text
Production Issues
Critical Bugs
```

***

# Senior React Interview Answer

> In enterprise React projects, I typically follow a feature-branch workflow. Every feature or bug fix is developed in an isolated branch, reviewed through a pull request, validated by CI checks, and then merged into the main branch. For larger releases, GitFlow-style branching with feature, release, and hotfix branches can be used. I regularly sync with the parent branch, resolve conflicts early, and keep pull requests small to minimise merge issues. [\[Mounika Re...ache camel \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Mounika%20Reddy__AI_Inteview_Evaluation_Integration%20others,%20Apache%20camel.pdf?web=1), [\[GitOps \| SharePoint\]](https://persistentsystems.sharepoint.com/sites/intranet/SitePages/GitOps%281%29.aspx?web=1)


# Advanced Git Commands for Team Collaboration

For **Senior React / Project Lead interviews**, these Git commands are frequently discussed beyond basic `add`, `commit`, and `push`.

***

# 1. git fetch

Downloads remote updates without merging.

```bash
git fetch origin
```

Use when:

```text
✅ Check latest changes
✅ Review before merge
✅ Avoid accidental merge
```

***

# 2. git rebase

Replay your commits on top of another branch.

```bash
git checkout feature/login

git rebase main
```

### Before

```text
main
A---B---C

feature
     D---E
```

### After

```text
A---B---C---D---E
```

### Interview Question

**Merge vs Rebase**

```text
Merge -> Preserves history
Rebase -> Cleaner history
```

***

# 3. git cherry-pick

Copy only one specific commit.

```bash
git cherry-pick 7e4a3c2
```

Use case:

```text
Need one bug fix from another branch
Don't want full branch merge
```

***

# 4. git stash

Temporarily save work.

```bash
git stash
```

View stashes:

```bash
git stash list
```

Restore:

```bash
git stash pop
```

Scenario:

```text
Working on Feature A
Production issue arrives

Stash work
Switch branch
Fix bug
Return to work
```

***

# 5. git reflog

Shows complete HEAD history.

```bash
git reflog
```

Useful when:

```text
Accidentally deleted commit
Wrong reset
Recover lost work
```

Example:

```bash
git reset --hard HEAD@{2}
```

Recover previous state.

***

# 6. git blame

Shows who changed each line.

```bash
git blame App.js
```

Output:

```text
Author
Commit
Line Number
```

Useful during:

```text
Bug investigation
Code reviews
Knowledge transfer
```

***

# 7. git bisect

Finds which commit introduced a bug.

```bash
git bisect start

git bisect bad

git bisect good <old-commit>
```

Git performs binary search.

```text
100 commits
↓
~7 checks
```

Very powerful debugging tool.

***

# 8. Interactive Rebase

Clean commit history before PR.

```bash
git rebase -i HEAD~5
```

Actions:

```text
pick
squash
drop
reword
edit
```

Example:

```text
10 commits
↓
1 clean commit
```

***

# 9. Squash Commits

```bash
git rebase -i HEAD~3
```

Change:

```text
pick abc
pick xyz
pick pqr
```

To:

```text
pick abc
squash xyz
squash pqr
```

Result:

```text
Single clean commit
```

***

# 10. git diff

Compare changes.

Current changes:

```bash
git diff
```

Compare branches:

```bash
git diff main feature/login
```

Compare commits:

```bash
git diff commit1 commit2
```

***

# 11. git log

Advanced history view.

```bash
git log --oneline --graph --all
```

Output:

```text
* commit1
|\
| * feature
|
* main
```

Very useful during interviews.

***

# 12. Reset Types

### Soft Reset

```bash
git reset --soft HEAD~1
```

Removes commit.

Keeps changes staged.

***

### Mixed Reset

```bash
git reset HEAD~1
```

Keeps changes locally.

Unstaged.

***

### Hard Reset

```bash
git reset --hard HEAD~1
```

Deletes everything.

Use carefully.

***

# 13. Revert Commit

Safe way to undo.

```bash
git revert commit-id
```

Creates:

```text
New commit
```

instead of rewriting history.

Preferred in:

```text
Shared Branches
Production Branches
```

***

# 14. Tagging Releases

```bash
git tag v1.0

git push origin v1.0
```

Used for:

```text
Release Management
Production Versions
```

***

# 15. Tracking Remote Branches

```bash
git branch -vv
```

Shows:

```text
Current branch
Remote branch
Tracking info
```

***

# 16. Resolve Merge Conflicts Faster

Accept current version:

```bash
git checkout --ours App.js
```

Accept incoming version:

```bash
git checkout --theirs App.js
```

Then:

```bash
git add App.js

git commit
```

***

# 17. Useful Collaboration Workflow

```bash
git checkout main

git pull origin main

git checkout -b feature/login

# work

git add .

git commit -m "Added login"

git push origin feature/login

# Create Pull Request

# Code Review

# Merge
```

***

# Most Asked Advanced Git Interview Questions

### Explain Rebase vs Merge

### What is Cherry Pick?

### What is Stash?

### What is Reflog?

### How do you recover deleted commits?

```bash
git reflog
```

### How do you find the commit that introduced a bug?

```bash
git bisect
```

### Difference Between Reset and Revert?

```text
Reset  -> Rewrite history
Revert -> Create undo commit
```

### How do you keep commit history clean?

```text
Interactive Rebase
Squash Commits
Small PRs
Meaningful Commit Messages
```

# Senior React Developer Interview Answer

> In collaborative projects, I regularly use `rebase` to keep branches up to date, `stash` to temporarily save work, `cherry-pick` for selective fixes, `reflog` for recovery, `bisect` for debugging regressions, and interactive rebase with squash to maintain a clean commit history. I prefer a feature-branch workflow with pull requests, code reviews, protected main branches, and CI validation before merges.



# Scenario-Based Git Interview Questions (Senior React / Project Lead)

These are the types of **real-world Git scenarios** commonly asked in interviews instead of command definitions. Internal engineering guidance and Git workflow documents emphasise feature branches, pull requests, merge conflict resolution, code reviews, and branching strategies.

***

# Scenario 1: Merge Conflict During PR

### Question

> You raise a PR and Git shows merge conflicts. What would you do?

### Answer

```text
1. Pull latest changes from main
2. Merge/rebase main into feature branch
3. Review conflict markers
4. Resolve manually
5. Run tests
6. Commit resolved code
7. Push updated branch
```

Commands:

```bash
git checkout feature/login

git pull origin main

git merge main
```

or

```bash
git rebase main
```

***

# Scenario 2: Accidentally Committed to Main Branch

### Question

> You accidentally committed code directly to main.

### Answer

If not pushed:

```bash
git reset --soft HEAD~1
```

Create feature branch:

```bash
git checkout -b feature/login
```

Commit again.

If already pushed:

```bash
git revert commit-id
```

Avoid rewriting shared history.

***

# Scenario 3: Need One Commit from Another Branch

### Question

> You only need one bug-fix commit from another branch.

### Answer

Use:

```bash
git cherry-pick commit-id
```

Example:

```text
Feature branch has 20 commits.

Need only 1 bug fix.

Use cherry-pick.
```

***

# Scenario 4: Production Bug Found

### Question

> Production application is down. What Git strategy would you follow?

### Answer

```text
1. Create hotfix branch
2. Fix issue
3. Test
4. Raise PR
5. Merge into main
6. Deploy
7. Merge back into develop
```

```bash
git checkout -b hotfix/payment-bug
```

***

# Scenario 5: Wrong Branch Development

### Question

> Worked 4 hours on the wrong branch.

### Answer

Save work:

```bash
git stash
```

Create correct branch:

```bash
git checkout -b feature/cart
```

Restore:

```bash
git stash pop
```

***

# Scenario 6: Recover Deleted Commit

### Question

> You accidentally deleted commits using hard reset.

### Answer

Use:

```bash
git reflog
```

Example:

```bash
git reflog
```

Output:

```text
HEAD@{0}
HEAD@{1}
HEAD@{2}
```

Recover:

```bash
git reset --hard HEAD@{2}
```

***

# Scenario 7: Two Developers Changed Same File

### Question

> Another developer modified the same component. Merge conflict occurs.

### Answer

```text
Review both changes

Understand intent

Merge logic carefully

Run tests

Push resolved code
```

Never blindly choose:

```text
Current Change
or
Incoming Change
```

without understanding impact.

***

# Scenario 8: Feature Branch Behind Main

### Question

> Your feature branch is two weeks old.

### Answer

Synchronise frequently.

```bash
git fetch

git rebase main
```

or

```bash
git merge main
```

Benefits:

```text
Smaller conflicts
Easier integration
```

***

# Scenario 9: PR Has 50 Small Commits

### Question

> Before merge, how do you clean commit history?

### Answer

Interactive rebase:

```bash
git rebase -i HEAD~10
```

Use:

```text
squash
reword
drop
```

Result:

```text
Clean commit history
```

***

# Scenario 10: Find Bug Introduction Commit

### Question

> Application worked yesterday but fails today. How do you find the bad commit?

### Answer

Use:

```bash
git bisect
```

```bash
git bisect start

git bisect bad

git bisect good commit-id
```

Git performs binary search through commits.

***

# Scenario 11: CI Build Failing After Merge

### Question

> Code merged successfully but build fails.

### Answer

```text
Check pipeline logs

Check recent commits

Revert if needed

Fix issue

Create new PR
```

Possible command:

```bash
git revert commit-id
```

***

# Scenario 12: Multiple Developers on Same Feature

### Question

> Five developers are working on the same feature.

### Answer

Recommended:

```text
main
  |
feature/payment
  |
sub-feature/*
```

or separate feature branches with pull requests.

Avoid direct commits to main.

***

# Scenario 13: Keep Branch Updated

### Question

> How do you avoid large merge conflicts?

### Answer

```text
Pull frequently

Small PRs

Feature branches

Frequent integration

Code reviews
```

This aligns with internal guidance recommending feature isolation and regular integration from the parent branch.

***

# Scenario 14: PR Review Comment Requests Changes

### Question

> Reviewer asks for changes after PR creation.

### Answer

```text
Update feature branch
Commit changes
Push again
PR automatically updates
```

```bash
git add .
git commit -m "Review fixes"
git push
```

***

# Most Asked Git Scenario Questions

```text
✅ Merge Conflict Resolution

✅ Rebase vs Merge

✅ Recover Deleted Commit

✅ Production Hotfix

✅ Cherry Pick

✅ Stash

✅ Large PR Cleanup

✅ Team Collaboration Workflow

✅ CI/CD Failure

✅ Branching Strategy

✅ Pull Request Workflow

✅ GitFlow vs Trunk-Based Development
```

# Project Lead Interview Answer

> "In my projects, we follow a feature-branch workflow. Developers create feature branches, regularly sync with the main branch, raise pull requests, undergo code review, and merge only after CI validation. For conflicts, I resolve them locally, verify functionality through testing, and keep PRs small to minimise integration risk. For production issues, I use hotfix branches and controlled releases."



For a **Senior React / Project Lead interview**, interviewers often go deep into JWT with **real production scenarios**, not just theory.

The enterprise interview materials frequently discuss:

* Short-lived access tokens
* Refresh token strategy
* Role-based authorization
* Token rotation
* Key rotation
* JWT validation in microservices
* Replay attack prevention
* API gateway validation [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1), [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1), [\[Bhaskar Gu...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Bhaskar%20Guttakinda_Azure,%20TS,%20Spring,%20Microservices_00002897_AI_Inteview_Evaluation.pdf?web=1)

***

# Scenario 1: User Logged Out But JWT Still Works

## Interview Question

> JWT is stateless. A user logs out, but their token is still valid for another 15 minutes. How would you prevent reuse?

***

## Problem

```text
Login
 ↓
Access Token Generated
 ↓
Logout
 ↓
Token still valid
```

Attacker can continue using it.

***

## Bad Solution

```text
Do nothing
Wait for expiry
```

***

## Production Solution

### 1. Short-Lived Access Token

```text
Access Token = 5-15 mins
```

### 2. Refresh Token

```text
Refresh Token = 7 days
```

### 3. Invalidate Refresh Token

```text
Database
Redis
Blacklist Store
```

Logout Process:

```text
Delete Refresh Token
↓
Future Refresh Fails
↓
User Must Login Again
```

Interview Answer:

> JWT itself cannot be revoked easily because it is stateless. I use short-lived access tokens combined with refresh-token revocation and token blacklisting for critical applications. [\[Pranjali S...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/27-Feb/Pranjali%20Shrivastava_Java_00002599_AI_Inteview_Evaluation.pdf?web=1), [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1)

***

# Scenario 2: Access Token Expires While User Works

## Question

> User is filling a form for 30 minutes. Access token expires after 15 minutes. What happens?

***

## Flow

```text
Access Token Expired
        ↓
API Request
        ↓
401 Unauthorized
        ↓
Refresh Token Sent
        ↓
New Access Token
        ↓
Retry Original Request
```

***

## React Example

```javascript
axios.interceptors.response.use(
  response => response,
  async error => {

    if (
      error.response.status === 401
    ) {

      const token =
        await refreshToken();

      error.config.headers.Authorization =
        `Bearer ${token}`;

      return axios(error.config);
    }

    return Promise.reject(error);
  }
);
```

This refresh-token pattern is repeatedly referenced in interview evaluations. [\[Pranjali S...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/27-Feb/Pranjali%20Shrivastava_Java_00002599_AI_Inteview_Evaluation.pdf?web=1), [\[Tejashree...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/.Net/Tejashree%20Gunjal_00002621_AI_Inteview_Evaluation.pdf?web=1), [\[Priyanka V...ation_Java \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/27-Feb/Priyanka%20V_AI_Inteview_Evaluation_Java.pdf?web=1)

***

# Scenario 3: Token Stolen Through XSS

## Question

> Attacker steals JWT from browser. How do you protect against it?

***

## Bad Practice

```javascript
localStorage.setItem(
  "token",
  jwt
);
```

Problem:

```text
XSS can read localStorage
```

***

## Better Approach

```text
HttpOnly Cookie
Secure Cookie
SameSite Cookie
```

JavaScript cannot access:

```text
document.cookie
```

for HttpOnly cookies.

Interview Answer:

> For enterprise applications I prefer HttpOnly Secure Cookies instead of localStorage because it significantly reduces token theft through XSS attacks.

***

# Scenario 4: JWT in Microservices

## Question

> How would JWT work across 20 microservices?

***

## Architecture

```text
React App
     ↓
API Gateway
     ↓
Order Service

Payment Service

Notification Service
```

***

## Flow

```text
Login
 ↓
Identity Provider
 ↓
JWT Issued
 ↓
Gateway Validates JWT
 ↓
Services Read Claims
```

Claims:

```json
{
  "id": "123",
  "role": "ADMIN",
  "permissions": [
    "CREATE_ORDER"
  ]
}
```

This API-gateway + JWT validation model appears in several interview examples. [\[Bibhu Pras...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/Java/Bibhu%20Prasad%20Mishra_00002602_AI_Inteview_Evaluation.pdf?web=1), [\[Corporate-...-ForReview \| PowerPoint\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/_layouts/15/Doc.aspx?sourcedoc=%7B6FB97909-9C2E-4C11-8DD1-93F2F8C15B28%7D&file=Corporate-Learning-system-New-Presentation-15June-ForReview.pptx&action=edit&mobileredirect=true&DefaultItemOpen=1)

***

# Scenario 5: Replay Attack

## Question

> Attacker intercepts token and repeatedly sends requests.

***

## Solution

### HTTPS

```text
Encrypt Traffic
```

### Short Expiration

```text
5 Minutes
```

### Token Rotation

```text
Refresh token changes every refresh
```

### jti Claim

```json
{
  "jti": "abc123"
}
```

Store:

```text
Used Tokens
```

Reject duplicates.

Replay-risk mitigation using short-lived tokens and token identifiers is discussed in interview content. [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1), [\[Kumar Sake...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Kumar%20Saket_00002154_AI_Inteview_Evaluation.pdf?web=1)

***

# Scenario 6: Secret Key Leaked

## Question

> Production JWT secret leaked. What will you do?

***

## Immediate Actions

```text
Rotate Keys
```

```text
Invalidate Refresh Tokens
```

```text
Force Re-login
```

```text
Audit Logs
```

***

## Enterprise Solution

Use:

```text
AWS Secrets Manager
Azure Key Vault
HashiCorp Vault
```

Key rotation and secure secret storage are specifically mentioned in interview evaluations. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1), [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1)

***

# Scenario 7: Multiple Devices Login

## Question

> User logged in on Laptop and Mobile. Wants logout only from Mobile.

***

## Solution

Store sessions:

```text
UserId
DeviceId
RefreshToken
```

Database:

```text
User
Device
Token
Expiry
```

Deactivate:

```text
Only Mobile Refresh Token
```

Laptop remains active.

***

# Scenario 8: Admin vs User Access

## Question

> How do you prevent normal users from accessing admin APIs?

***

## JWT

```json
{
  "role": "ADMIN"
}
```

Backend:

```java
@PreAuthorize(
  "hasRole('ADMIN')"
)
```

Flow:

```text
JWT Received
 ↓
Role Checked
 ↓
Allow / Reject
```

Role-based authorization using JWT claims is a common interview topic. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1), [\[Bibhu Pras...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/Java/Bibhu%20Prasad%20Mishra_00002602_AI_Inteview_Evaluation.pdf?web=1), [\[Karan Kalb...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/BFSI-SLF%20AI-interview%20reports/Karan%20Kalband_00002564_AI_Inteview_Evaluation.pdf?web=1)

***

# Scenario 9: Refresh Token Reuse Attack

## Question

> Attacker stole refresh token. How do you detect misuse?

***

## Refresh Token Rotation

Current:

```text
RefreshToken1
```

After refresh:

```text
RefreshToken2
```

If:

```text
RefreshToken1 used again
```

Then:

```text
Possible Token Theft
```

Action:

```text
Invalidate all tokens
Force Logout
```

***

# Scenario 10: JWT Validation Checklist

## Interview Question

> What validations should happen before accepting JWT?

### Answer

```text
1. Signature Validation

2. Expiry Validation

3. Issuer Validation

4. Audience Validation

5. Subject Validation

6. Role Validation

7. jti Validation (optional)

8. Algorithm Validation
```

JWT validation using issuer, audience, signature, expiration, claims and roles is repeatedly mentioned in enterprise interview material. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1), [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1), [\[Jitendra K...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/Masterclass%203/Java/Jitendra%20Kumar%20Singh_Java_AI_Inteview_Evaluation.pdf?web=1)

***

# Senior-Level JWT Interview Answer

> In production systems I use short-lived JWT access tokens (5–15 minutes) combined with refresh-token rotation. Tokens are stored in HttpOnly Secure Cookies and validated based on signature, issuer, audience, claims, and expiry. For microservices, authentication is typically performed at the API gateway, while downstream services validate claims and roles. To handle logout, replay attacks, and token theft, I rely on refresh-token revocation, key rotation, HTTPS, short token lifetimes, and role-based authorization. This provides a scalable and secure stateless authentication model suitable for enterprise applications. [\[Siddhi Ahi...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HiTech-SLF%20AI-interview%20reports/Siddhi%20Ahire_00002425_AI_Inteview_Evaluation.pdf?web=1), [\[Diksha Sha...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-Feb/Diksha%20Shaw_00002450_AI_Inteview_Evaluation.pdf?web=1), [\[Bhaskar Gu...Evaluation \| PDF\]](https://persistentsystems.sharepoint.com/sites/PersistentLearningandDevelopment/ResponsiveAssets/SLF/SLF%20AI-interview%20reports/HLS-SLF%20AI-interview%20reports/11-mar/Bhaskar%20Guttakinda_Azure,%20TS,%20Spring,%20Microservices_00002897_AI_Inteview_Evaluation.pdf?web=1)
