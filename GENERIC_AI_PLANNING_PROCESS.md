# Generic AI-Assisted Software Planning & Development Process

This document outlines a methodical, repeatable, and technology-agnostic process for planning, developing, and tracking software with the help of AI agents or assistants. Following these steps ensures high context retention, clear traceability, and seamless collaboration between human developers and AI tools.

---

## Step 1: Define the Idea in Natural Language (High Level)

Describe the core concept of the project or milestone in plain, clear language. Do not focus on technical details, libraries, or architecture. Instead, focus on the functional outcome.

### Key Rules:

- **Focus on the immediate milestone:** Do not plan the entire application lifecycle yet. Define a small, deliverable slice.
- **Keep it human-readable:** Use plain language and avoid unnecessary technical jargon.
- **Focus on _what_, not _how_:** Describe what the program should do, not how it should be implemented.

> [!NOTE]
> **Example Idea:**
> _"I want a simple task manager application that stores data locally, allows users to categorize tasks with tags, and lets them filter tasks by those tags."_

---

## Step 2: Translate to Features and Scenarios (Gherkin Format)

Provide the high-level idea to your AI assistant and ask it to generate structured **features** and **scenarios** using the **Gherkin syntax** (Given-When-Then format).

### Why Gherkin?

- **Universal Standard:** Clearly defines application behavior in a structured format.
- **BDD/TDD Friendly:** Directly maps functional requirements to automated tests (Behavior-Driven/Test-Driven Development).
- **Shared Vocabulary:** Acts as a bridge of understanding between developers, business stakeholders, and AI agents.

> [!TIP]
> **Example Prompt:**
> _"From this product idea, generate features and scenarios in Gherkin format that cover the core functionality of the first milestone."_

**Expected Output Example:**

```gherkin
Feature: Task Tagging
  As a user
  I want to add tags to my tasks
  So that I can organize them by categories

  Scenario: Successfully adding a tag to a task
    Given a task with the title "Buy groceries"
    When I add the tag "personal" to this task
    Then the task should list "personal" in its tags list

  Scenario: Preventing duplicate tags on the same task
    Given a task with the title "Buy groceries" and the tag "personal" already added
    When I attempt to add the tag "personal" again
    Then the task should still have only one instance of the tag "personal"
```

---

## Step 3: Persist and Sync Features (The Context Anchor)

To ensure that the development context is never lost, features must be saved locally and synchronized with your project management/issue tracking system.

### 3.1. Persist Locally

Store each feature in a dedicated features directory (e.g., `docs/features/` or `features/`). This acts as the persistent single source of truth for the codebase, preventing context loss if the AI chat session is reset.

```text
project-root/
└── docs/
    └── features/
        ├── task_tagging.feature
        ├── task_filtering.feature
        └── ...
```

### 3.2. Synchronize with the Issue Tracker (Mandatory)

Every feature file should correspond to a trackable issue/ticket in your issue tracking system (e.g., GitHub Issues, Jira, GitLab Issues, Trello).

1. **Create the Ticket:** Import or copy the Gherkin feature definition into a new issue.
2. **Link to Milestone:** Assign the issue to the current release target or sprint (e.g., `v1.0.0-beta`).
3. **Update Status:** Place the issue on your project board in the "To Do" or "Backlog" column.

---

## Step 4: Implement a Progress Tracker (`PROGRESS.md`)

Create a `PROGRESS.md` file at the root of the project. This file acts as a lightweight status board showing exactly what has been completed, what is in progress, and what remains.

### Recommended Structure:

```markdown
# Project Progress Tracker

## Feature: Task Tagging (#102)

- [x] Scenario: Successfully adding a tag to a task
- [ ] Scenario: Preventing duplicate tags on the same task

## Feature: Task Filtering (#103)

- [ ] Scenario: Filter tasks by a single tag
- [ ] Scenario: Filter tasks by multiple tags
```

> [!IMPORTANT]
> Always link the specific ticket or issue number (e.g., `#102`) next to the feature title to maintain absolute traceability.

---

## Step 5: Scenario-by-Scenario Development Loop

Develop the codebase incrementally, one Gherkin scenario at a time. The AI assistant should follow this loop strictly:

### The Development Loop:

1. **Identify the Target:** Read `PROGRESS.md` to identify the next pending scenario.
2. **Gather Context:** Read the corresponding `.feature` file to understand the inputs, actions, and expected results.
3. **Implement:** Write the minimal code necessary to make the scenario pass.
4. **Verify:** Run compile checks, linters, and the test suite. If doing BDD, write and execute a test matching the scenario.
5. **Commit:** Commit the code changes atomically. Use a commit message that references the scenario and the issue number (e.g., `feat: prevent duplicate tags [task_tagging.feature:Scenario 2] #102`).
6. **Update Progress:** Mark the scenario as completed (`[x]`) in `PROGRESS.md`.
7. **Sync and Deliver:** Once all scenarios for a feature are completed, push the code and open a Pull Request (PR) linked to the feature issue for review and merge.

---

## Summary of the Process

| Step  | Action             | Artifact Created/Updated                 | Tracked In                             |
| :---- | :----------------- | :--------------------------------------- | :------------------------------------- |
| **1** | Define the Idea    | High-level natural language description  | Project documentation / initial prompt |
| **2** | Generate Scenarios | Gherkin features & scenarios             | Chat context / clipboard               |
| **3** | Persist & Sync     | `.feature` files under `docs/features/`  | Issue Tracker (GitHub, Jira, etc.)     |
| **4** | Create Tracker     | `PROGRESS.md` file in root directory     | Project Board / Project Workspace      |
| **5** | Develop Scenarios  | Code, test suite, and atomic git commits | Pull Request / Branch merges           |

---

## Benefits of this Methodical Approach

- **Atomic Commits:** Each git commit corresponds to a single verified scenario, making rollback and review simple.
- **Traceability:** Easy to trace which piece of code implements which Gherkin scenario and which high-level issue.
- **Context Resiliency:** If the AI assistant's context window resets, the assistant can immediately resume work by reading `PROGRESS.md` and the `.feature` files.
- **High Review Quality:** Small, incremental changes are easier for human developers to review, compile, test, and merge safely.
