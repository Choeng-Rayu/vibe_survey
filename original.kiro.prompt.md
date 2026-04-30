** Act As the senior full stack Developer focus on scalable code, maintainable code and clean **
 
Location: ".kiro/specs/"


# AI Agent Task Execution Guide

## The Three-File System


Every spec has three files that work together:


```
requirements.md  →  design.md  →  tasks.md  →  CODE
   (WHAT)           (HOW)         (DO)
```


### File Roles


| File | Role | When to Read | What to Extract |
|------|------|--------------|-----------------|
| **tasks.md** | Your TODO list | **READ FIRST** | Task ID, title, sub-steps, requirement IDs |
| **requirements.md** | Success criteria | **READ SECOND** | Acceptance criteria for referenced requirement IDs |
| **design.md** | Implementation blueprint | **READ THIRD** | Interfaces, schemas, patterns, code examples |


---


## Execution Workflow


### Step 1: Read tasks.md
**When**: At the start of every task 
**Find**: Your assigned task block


**Extract**:
- Task ID (e.g., `2.1`)
- Task title (e.g., "Set up Prisma with MySQL")
- Sub-steps (bullet points under the task)
- Requirement IDs (e.g., `_Requirements: 0.3, 0.7_`)


**Example**:
```markdown
- [ ] 2.1 Set up Prisma with MySQL
 - Install Prisma and Prisma Client
 - Initialize Prisma with MySQL provider
 - Configure database connection URL from environment
 - Create Prisma module and service in NestJS
 - _Requirements: 0.3, 0.7_
```


---


### Step 2: Read requirements.md
**When**: After identifying requirement IDs from tasks.md 
**Find**: Each requirement section by ID


**Extract**:
- Requirement title
- All acceptance criteria (WHEN...SHALL/SHOULD statements)
- These are your **success criteria** - your code must satisfy ALL of them


**Example**:
```markdown
Requirement 0.3: Technology Stack
THE Database SHALL use MySQL version 8.0 or higher


Requirement 0.7: Technology Stack
THE API_Server SHALL use TypeORM or Prisma for database ORM
```


**Why**: These tell you WHAT the code must do to be correct.


---


### Step 3: Read design.md
**When**: After understanding requirements 
**Find**: Sections related to your task (search by keywords from task title)


**Extract**:
- TypeScript interfaces and types
- Database schemas
- File structure and module organization
- Code patterns and examples
- Configuration approaches


**Example**:
```typescript
// Find this in design.md
interface IPrismaService extends PrismaClient {
 onModuleInit(): Promise<void>;
 onModuleDestroy(): Promise<void>;
}


// File structure
src/prisma/
 ├── prisma.module.ts
 └── prisma.service.ts
```


**Why**: This tells you HOW to implement the code correctly.


---


### Step 4: Implement
**When**: After reading all three files 
**Do**: Write code following the design patterns


**Rules**:
- ✅ Follow design.md patterns exactly
- ✅ Satisfy all acceptance criteria from requirements.md
- ✅ Only implement what's in the current task
- ✅ Add comments referencing requirement IDs


**Example**:
```typescript
// src/prisma/prisma.service.ts
// Satisfies Requirements 0.3, 0.7


import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';


@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
 async onModuleInit() {
   await this.$connect();
 }
}
```


---


### Step 5: Verify
**When**: After implementation 
**Do**: Check acceptance criteria and run validation commands


**Checklist**:
- [ ] All acceptance criteria from requirements.md satisfied
- [ ] Code follows patterns from design.md
- [ ] Lint passes: `npm run lint`
- [ ] Tests pass: `npm run test`
- [ ] Build succeeds: `npm run build`


---


### Step 6: Update Status
**When**: After verification passes 
**Do**: Update tasks.md checkbox


**Change**:
```diff
- - [ ] 2.1 Set up Prisma with MySQL
+ - [x] 2.1 Set up Prisma with MySQL
```


**Also update sub-tasks**:
```diff
- - [ ] Install Prisma and Prisma Client
+ - [x] Install Prisma and Prisma Client
```


---


## How the Files Work Together


### Example Flow for Task 2.1


```
1. tasks.md says:
  "Set up Prisma with MySQL"
  "Requirements: 0.3, 0.7"
 
  ↓


2. requirements.md says:
  Requirement 0.3: "Use MySQL 8.0+"
  Requirement 0.7: "Use Prisma for ORM"
 
  ↓


3. design.md shows:
  - PrismaService interface
  - File structure: src/prisma/
  - Connection pattern: DATABASE_URL from env
 
  ↓


4. You implement:
  - Install: npm install prisma @prisma/client
  - Init: npx prisma init
  - Create: src/prisma/prisma.service.ts
  - Create: src/prisma/prisma.module.ts
 
  ↓


5. You verify:
  ✅ MySQL configured (Requirement 0.3)
  ✅ Prisma installed (Requirement 0.7)
  ✅ Follows design.md structure
 
  ↓


6. You update:
  tasks.md: [x] 2.1 Set up Prisma with MySQL
```


---


## Quick Reference


### When to Read Each File


| Situation | Read This | Why |
|-----------|-----------|-----|
| Starting a task | tasks.md | Get task details and requirement IDs |
| Need success criteria | requirements.md | Understand what "done" means |
| Need implementation details | design.md | See how to code it |
| Finishing a task | tasks.md | Update status to [x] |


### Reading Order (Always)


```
tasks.md → requirements.md → design.md → CODE → tasks.md
  ↓            ↓                ↓          ↓         ↓
 WHAT       WHY/CRITERIA      HOW      IMPLEMENT  UPDATE
```


---


## Common Mistakes


| Mistake | Problem | Solution |
|---------|---------|----------|
| Skip requirements.md | Don't know success criteria | Always read requirement IDs |
| Skip design.md | Reinvent patterns | Always follow design patterns |
| Don't update tasks.md | Progress unclear | Always update checkbox to [x] |
| Add extra features | Scope creep | Only implement current task |


---


## Task Execution Template


Copy and fill this for any task:


```markdown
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
  {CODE}


5. Verification:
  - [x] Criteria satisfied
  - [x] Commands pass


6. Status Update:
  - [x] Task {TASK_ID} complete
```


---


## Summary


**Three files, three roles**:
- **tasks.md** = Your assignment (DO)
- **requirements.md** = Your success criteria (WHAT)
- **design.md** = Your implementation guide (HOW)


**Always**:
1. Read tasks.md first (get task + requirement IDs)
2. Read requirements.md second (get success criteria)
3. Read design.md third (get implementation patterns)
4. Implement code (follow patterns, satisfy criteria)
5. Verify (check criteria, run commands)
6. Update tasks.md (mark [x] complete)


**Never**:
- Skip reading any file
- Deviate from design patterns
- Add features not in task
- Forget to update status



