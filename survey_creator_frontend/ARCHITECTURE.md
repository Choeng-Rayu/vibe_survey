# Survey Builder - Architecture & Data Flow

## Component Hierarchy

```
SurveyBuilder (Main Container)
│
├── Survey Header (Title & Description)
│   ├── input[title]
│   └── textarea[description]
│
├── BuilderToolbar (Add Questions Panel)
│   ├── Collapsible Categories
│   │   ├── Basic
│   │   ├── Rating
│   │   └── Advanced
│   └── Question Type Buttons
│       └── onAddQuestion → callback
│
├── QuestionList (Main Questions Area)
│   └── Maps Question[] to QuestionCard
│       ├── QuestionCard[0]
│       │   ├── Drag Handle (≡)
│       │   ├── Question Preview
│       │   ├── Type Badge
│       │   ├── Metadata
│       │   └── Actions [Duplicate] [Delete]
│       │
│       ├── QuestionCard[1]
│       │   └── ...
│       │
│       └── QuestionCard[N]
│
└── QuestionEditor (Right Sidebar)
    ├── General Section
    │   ├── Question Text
    │   ├── Description
    │   └── Required Toggle
    │
    ├── Options Section (conditional)
    │   ├── Option Input[] (maps options)
    │   ├── + Add Option Button
    │   └── Randomize Toggle
    │
    ├── Text Settings (conditional)
    │   └── Character Limit Input
    │
    └── Scale Settings (conditional)
        ├── Min Label Input
        └── Max Label Input
```

## Data Flow

### 1. Adding a Question

```
User clicks question type button
         ↓
BuilderToolbar.onAddQuestion(type)
         ↓
SurveyBuilder.handleAddQuestion(type)
         ↓
Create new Question object:
  {
    id: generateId(),
    order: questions.length,
    questionType: type,
    required: false,
    options: [...] // if applicable
  }
         ↓
onSurveyChange({
  ...survey,
  questions: [...survey.questions, newQuestion]
})
         ↓
Parent component updates state
         ↓
SurveyBuilder re-renders
         ↓
QuestionCard appears in QuestionList
         ↓
setSelectedQuestionId(newQuestion.id)
         ↓
QuestionEditor displays new question
```

### 2. Selecting a Question

```
User clicks QuestionCard
         ↓
QuestionCard.onClick
         ↓
onSelectQuestion(question.id)
         ↓
setSelectedQuestionId(question.id)
         ↓
selectedQuestion = questions.find(q => q.id === selectedQuestionId)
         ↓
QuestionEditor re-renders with selected question
         ↓
QuestionCard highlights with blue border
         ↓
User can now edit in right sidebar
```

### 3. Editing a Question (from sidebar)

```
User modifies question text (example)
         ↓
QuestionEditor.handleUpdateField("questionText", value)
         ↓
onUpdateQuestion({
  ...question,
  questionText: value
})
         ↓
SurveyBuilder.handleUpdateQuestion(updatedQuestion)
         ↓
Find and replace question in array:
  updatedQuestions = questions.map(q =>
    q.id === updatedQuestion.id ? updatedQuestion : q
  )
         ↓
onSurveyChange({
  ...survey,
  questions: updatedQuestions
})
         ↓
Parent component updates state
         ↓
SurveyBuilder re-renders
         ↓
QuestionCard text updates immediately
         ↓
QuestionEditor state updates (controlled)
```

### 4. Drag and Drop Reordering

```
User begins drag on QuestionCard
         ↓
onDragStart(question.id)
         ↓
setDraggedQuestionId(question.id)
         ↓
QuestionCard opacity changes to 0.5
         ↓
User drags over drop zones
         ↓
onDragOver(e)
         ↓
Drop zone background highlights
         ↓
User releases over target zone
         ↓
onDrop(targetIndex)
         ↓
handleDropQuestion(targetIndex):
  1. Get draggedQuestion from questions array
  2. Filter out draggedQuestion
  3. Insert at targetIndex
  4. Re-index all order properties
         ↓
handleReorderQuestions(newOrder)
         ↓
onSurveyChange({ ...survey, questions: newOrder })
         ↓
Parent updates state
         ↓
All questions re-render with new order
         ↓
onDragEnd()
         ↓
setDraggedQuestionId(null)
         ↓
Visual feedback clears
```

### 5. Deleting a Question

```
User clicks Delete button on QuestionCard
         ↓
onDeleteQuestion(question.id)
         ↓
SurveyBuilder.handleDeleteQuestion(question.id):
  1. Filter questions array: filter(q => q.id !== questionId)
  2. Re-index order: map((q, idx) => ({ ...q, order: idx }))
  3. Clear selection if deleted question was selected
         ↓
onSurveyChange({ ...survey, questions: updatedQuestions })
         ↓
Parent updates state
         ↓
QuestionCard for deleted question removed from DOM
         ↓
QuestionList re-renders without the question
         ↓
If selected: QuestionEditor shows empty state
```

## State Management

### SurveyBuilder State

```typescript
// Main survey state (from parent/props)
survey: Survey = {
  id, title, description, questions: Question[], ...
}

// Local UI state
selectedQuestionId: string | null
draggedQuestionId: string | null
```

### QuestionEditor State

```typescript
// Which section is open
expandedSection: string = "general" | "options" | "text" | "scale"
```

### BuilderToolbar State

```typescript
// Which category is expanded
openCategory: string | null = "Basic" | "Rating" | "Advanced"
```

## Event Flow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Parent Component                      │
│         (has survey state & onSurveyChange)              │
└──────────────────┬──────────────────────────────────────┘
                   │ passes survey & onSurveyChange
                   ↓
┌─────────────────────────────────────────────────────────┐
│              SurveyBuilder Container                     │
│  - manages selectedQuestionId, draggedQuestionId        │
│  - handles all question operations                      │
└──────────┬────────────────────┬────────────────────┬────┘
           │                    │                    │
      passes questions       passes survey       passes
     & handlers to:          & onSurveyChange    question &
           │                  callbacks to:      onUpdateQuestion
           ↓                   │                  to:
    ┌──────────────┐      ┌──────────────┐    ┌──────────────┐
    │ QuestionList │      │BuilderToolbar│    │QuestionEditor│
    │              │      │              │    │              │
    │ ┌──────────┐ │      │ Triggers:    │    │ Triggers:    │
    │ │Question  │ │      │              │    │              │
    │ │Card[0]   │ │      │onAddQuestion │    │onUpdateQuestion
    │ │          │ │      │   (type)     │    │   (field, val)
    │ │Triggers: │ │      └──────────────┘    └──────────────┘
    │ │          │ │
    │ │onSelect  │ │
    │ │onDelete  │ │
    │ │onDuplicate
    │ │onDragStart
    │ │onDragEnd │
    │ │onDrop    │
    │ └──────────┘ │
    └──────────────┘

All handlers propagate to:
         ↓
    onSurveyChange(updatedSurvey)
         ↓
    Parent component updates state
         ↓
    All children re-render with new props
```

## Props Flow

### SurveyBuilder Props
```typescript
interface SurveyBuilderProps {
  survey: Survey              // Full survey object
  onSurveyChange: (survey: Survey) => void  // Update callback
}
```

### QuestionList Props
```typescript
interface QuestionListProps {
  questions: Question[]
  selectedQuestionId: string | null
  draggedQuestionId: string | null
  onSelectQuestion: (id: string) => void
  onDeleteQuestion: (id: string) => void
  onDuplicateQuestion: (id: string) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
  onDrop: (targetIndex: number) => void
}
```

### QuestionCard Props
```typescript
interface QuestionCardProps {
  question: Question
  isSelected: boolean
  isDragged: boolean
  onSelect: (id: string) => void
  onDelete: (id: string) => void
  onDuplicate: (id: string) => void
  onDragStart: (id: string) => void
  onDragEnd: () => void
}
```

### QuestionEditor Props
```typescript
interface QuestionEditorProps {
  question: Question
  onUpdateQuestion: (question: Question) => void
}
```

### BuilderToolbar Props
```typescript
interface BuilderToolbarProps {
  onAddQuestion: (questionType: string) => void
}
```

## Drag-and-Drop Technical Details

### Drag Events Used
```typescript
onDragStart   // Initiate drag, set draggedQuestionId
onDragEnd     // Clean up, clear draggedQuestionId
onDragOver    // Allow drop, e.preventDefault()
onDrop        // Handle drop, reorder questions
```

### Drop Zone Detection
```
Between each question:
┌─────────────┐
│ Question A  │
└─────────────┘
  [Drop zone 1]  <- 1px tall, highlight on drag-over
┌─────────────┐
│ Question B  │
└─────────────┘
  [Drop zone 2]
...
```

### Visual Feedback
```
Dragging:
  - Source: opacity: 0.5
  - Drop zone: backgroundColor: "#7C9E8A" (sage green)

Hover (non-dragging):
  - Card: borderColor: "#7C9E8A"
  - backgroundColor: "#F2EDE5" (selected state)

Selected (non-dragging):
  - borderColor: "#7C9E8A" (2px)
  - backgroundColor: "#F2EDE5" (selected highlight)
```

## State Update Patterns

### Pattern 1: Field Update (Immutable)
```typescript
// Update a question field
handleUpdateField = (field: string, value: any) => {
  onUpdateQuestion({
    ...question,           // Spread existing properties
    [field]: value         // Override specific field
  });
}
```

### Pattern 2: Array Item Update (Immutable)
```typescript
// Update item in array
const updatedQuestions = questions.map(q =>
  q.id === targetId ? { ...q, ...updates } : q
);
```

### Pattern 3: Array Item Remove (Immutable)
```typescript
// Remove item from array
const updatedQuestions = questions.filter(
  q => q.id !== targetId
);
```

### Pattern 4: Array Reorder (Immutable)
```typescript
// Reorder and re-index
const reordered = newArray.map((item, idx) => ({
  ...item,
  order: idx  // Update order property
}));
```

## Performance Optimizations

### useCallback Hooks
- All event handlers wrapped in `useCallback`
- Dependencies: `[survey, onSurveyChange, selectedQuestionId, etc]`
- Prevents unnecessary child re-renders

### Memoization Candidates
```typescript
// Could be wrapped with useMemo:
const selectedQuestion = survey.questions.find(...)

// Could be wrapped with React.memo:
QuestionCard (pure presentation component)
QuestionList (passes new callbacks on parent update)
```

### Re-render Triggers
```
Parent state update → SurveyBuilder props change
    ↓
    SurveyBuilder re-renders
    ├→ QuestionList re-renders (new questions or handlers)
    │  └→ Each QuestionCard re-renders (question prop changes)
    ├→ BuilderToolbar re-renders (no prop changes, same component)
    └→ QuestionEditor re-renders (new selectedQuestion)
```

## Type Safety & Validation

### TypeScript Checks
- ✅ All props fully typed
- ✅ All state variables typed
- ✅ All event handlers typed
- ✅ No `any` types (except for legacy opt parameteers)
- ✅ Strict null checks enabled

### Runtime Validation (Ready)
```typescript
// Zod schema (to implement):
const QuestionSchema = z.object({
  id: z.string(),
  order: z.number(),
  questionText: z.string().min(1),
  questionType: z.enum([...QuestionTypes]),
  required: z.boolean(),
  options: z.array(QuestionOptionSchema).optional(),
});

// Validate before sending to API:
const validated = QuestionSchema.parse(question);
```

---

**Architecture Version:** 1.0  
**Last Updated:** April 29, 2026  
**Status:** Production-Ready
