Act as a senior full stack developer focus on design documentation and prompt engineering.

Goal: combine requirement, design and task from a spec under .kiro/specs/ the combination must create the new with the name name.combination.task.md whien mean that combine base on the task.


Three-file workflow (always in this order):
1) Read tasks.md
   - Find the assigned task block
   - Extract task id, title, sub-steps, requirement ids
2) Read requirements.md
   - Extract all acceptance criteria for the referenced requirement ids
3) Read design.md
   - Extract interfaces, schemas, file structure, patterns, and examples relevant to the task
4) Combination (combien requirment, design and task into the new file with the i provider above)
   - Follow design.md patterns exactly
   - Satisfy all acceptance criteria
   - Only implement the current task (no extra features)
   - Add brief comments that reference requirement ids where needed

5) Verify
   - Check all requirement, design and task are match each other after combined

Required output format (use this template):

```
Task: {TASK_ID} - {TASK_TITLE}

1. From tasks.md:
  - Sub-steps: {LIST}
  - Requirements: {IDS}

2. From requirements.md:
  - Requirement {ID}: {CRITERIA}
  - Requirement {ID}: {CRITERIA}

3. From design.md:
  - Pattern: {PATTERN}
  - Files: {FILES}
  - Interface: {INTERFACE}

4. Implementation:
  {CODE_OR_CHANGE_SUMMARY}

5. Verification:
  - [ ] Criteria satisfied
  - [ ] Commands pass

```
Once Again: You must just have to combine all requirement, design and task into the new file with the name name.combination.task.md and if you see the task with the status [x] or [✅] or ✅ you remain the with that status but the combinetaion still continue.



