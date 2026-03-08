---
name: update-phase
description: End-of-session docs update. Updates AGENT-START.md, roadmap.md, and MEMORY.md with work done this session.
disable-model-invocation: true
---

Update all SIFT project documentation to reflect work done this session. Follow these steps exactly:

## 1. Gather Context

- Review the conversation to identify what was built, fixed, or changed this session.
- Note any new files created, files modified, decisions made, or gotchas discovered.
- Identify which roadmap phase/tasks were worked on.

## 2. Update docs/AGENT-START.md

Read `docs/AGENT-START.md` and update:

- **Current Status table**: Update phase, production URL, data counts if changed.
- **What Works**: Add any newly working features.
- **What Doesn't Work**: Remove items that were fixed. Add any new gaps discovered.
- **Key File Paths**: Add entries for any new directories or important files created.

Keep it under 100 lines. Be concise. This file is the single entry point for the next agent.

## 3. Update docs/roadmap.md

Read `docs/roadmap.md` and update:

- Mark completed tasks/phases as **(DONE)** with a one-line summary of what was delivered.
- If a task was partially completed, add a note about what remains.
- Do NOT remove task descriptions - just mark status. Future agents need the context.

## 4. Update MEMORY.md

Read the auto-memory file at the path shown in the system context and update:

- **Current State**: Update to reflect new reality (tool counts, feature status, etc.).
- **Critical Gaps**: Remove resolved gaps, add any new ones discovered.
- Add any new patterns, gotchas, or conventions discovered during the session.
- Keep it concise. Don't duplicate what's already in AGENT-START.md.

## 5. Update docs/ben.md

Read `docs/ben.md` and update:

- **Add** any new manual action items discovered this session (env vars to set, accounts to create, DNS changes, dashboard configs, etc.) under the appropriate phase section.
- **Check off** (`[x]`) any items that are now confirmed done (only if you have evidence from the session).
- **Archive** completed sections: if every item in a section is done, move the section to the bottom under an `## Archived (Done)` heading so the active list stays focused.
- Keep the file organized by roadmap phase. Create new phase sections as needed.

## 6. Archive Session Bloat (if needed)

Check if any docs files have grown excessively (>150 lines) or contain session-specific details that don't belong in permanent docs. If so:

- Extract the bloat to `docs/archive/` with a descriptive filename.
- Keep the main doc concise with a link to the archive.

## 7. Verify

- Confirm `docs/AGENT-START.md` is under 100 lines.
- Confirm all docs are internally consistent (no contradictions between AGENT-START, roadmap, ben.md, and MEMORY).
- Report a summary of what was updated.

Do NOT commit. Just update the files and report what changed.
