# Survey Builder UI - Quick Reference

## What's Built

### ✅ Drag-Drop Form Creation
A complete drag-and-drop survey builder UI following the Soft Luxury design system with:

**Core Features:**
- 15+ question types (single choice, multiple choice, rating scales, NPS, text, etc.)
- Drag-and-drop reordering of questions
- Add, delete, duplicate questions
- Mark questions as required/optional
- Question-specific editor panel

**Layout:**
```
┌─────────────────────────────────────────────────┬──────────────────┐
│  Survey Builder (Main Area)                     │  Question Editor │
├─────────────────────────────────────────────────┤  (Right Panel)   │
│                                                 │                  │
│  Survey Title                                   │  ┌────────────┐ │
│  Survey Description                             │  │ General    │ │
│                                                 │  │ Options    │ │
│  [Add Question Toolbar]                         │  │ Text Setup │ │
│    ├─ Basic                                     │  │ Scales     │ │
│    ├─ Rating                                    │  └────────────┘ │
│    └─ Advanced                                  │                  │
│                                                 │                  │
│  [Question Cards - Draggable]                   │                  │
│  ┌──────────────────────────────────────────┐   │                  │
│  │ ≡ Q1: How satisfied are you?             │   │                  │
│  │      [Rating (1-5)]  Required            │   │                  │
│  │  [Duplicate] [Delete]                    │   │                  │
│  └──────────────────────────────────────────┘   │                  │
│                                                 │                  │
│  ┌──────────────────────────────────────────┐   │                  │
│  │ ≡ Q2: Which features do you use?         │   │                  │
│  │      [Multiple Choice]  Optional         │   │                  │
│  │      • 3 options                         │   │                  │
│  │  [Duplicate] [Delete]                    │   │                  │
│  └──────────────────────────────────────────┘   │                  │
│                                                 │                  │
└─────────────────────────────────────────────────┴──────────────────┘
```

## File Structure

```
survey_creator_frontend/
├── app/
│   ├── feature/
│   │   └── creeate_survey/
│   │       ├── components/
│   │       │   ├── SurveyBuilder.tsx         # Main container
│   │       │   ├── QuestionList.tsx          # Questions list with D&D
│   │       │   ├── QuestionCard.tsx          # Individual question display
│   │       │   ├── QuestionEditor.tsx        # Right panel editor
│   │       │   ├── BuilderToolbar.tsx        # Type selector toolbar
│   │       │   └── index.ts                  # Exports
│   │       └── types/
│   │           ├── question.ts               # Question interfaces
│   │           └── survey.ts                 # Survey interfaces
│   ├── utils/
│   │   └── id-generator.ts                   # ID generation utility
│   ├── builder/
│   │   └── page.tsx                          # Demo page (/builder)
│   └── globals.css                           # Tailwind setup
├── SURVEY_BUILDER_GUIDE.md                   # Complete documentation
└── package.json
```

## Design System Applied

### Colors Used
```css
--bg: #FAF7F2;          /* Cream background */
--surface: #F2EDE5;     /* Warm gray surfaces */
--primary: #7C9E8A;     /* Sage green actions */
--primary-h: #6A8C78;   /* Sage hover */
--text: #1C1C1A;        /* Near-black text */
--muted: #6B6860;       /* Muted gray */
--accent: #C4956A;      /* Gold (required) */
--error: #D85555;       /* Red errors */
```

### Typography
- **Headlines:** Cormorant Garamond, -0.02em spacing
- **Body:** DM Sans (inherited from layout)
- **Sizes:** Hierarchical (h3 for titles, p/text-xs for labels)

### Spacing & Radius
- Card radius: 16px
- Pill buttons: 999px
- Vertical spacing: 120px+ between sections
- Padding: 6px, 16px, 24px (consistent scale)

## Question Types Supported

**15+ Types in 3 Categories:**

### Basic (6)
- ✓ Single Choice
- ✓ Multiple Choice
- ✓ Checkbox
- ✓ Yes/No
- ✓ Short Text
- ✓ Long Text

### Rating (4)
- ✓ Rating Scale (1-5)
- ✓ Rating Scale (1-10)
- ✓ NPS (0-10)
- ✓ Likert Scale

### Advanced (5)
- ✓ Image Choice
- ✓ Matrix/Grid
- ✓ Ranking
- ✓ Slider
- ✓ Date/Time

## Component Props & API

### SurveyBuilder
```tsx
<SurveyBuilder
  survey={Survey}
  onSurveyChange={(survey) => void}
/>
```

### QuestionEditor
```tsx
<QuestionEditor
  question={Question}
  onUpdateQuestion={(question) => void}
/>
```

### QuestionList
```tsx
<QuestionList
  questions={Question[]}
  selectedQuestionId={string | null}
  draggedQuestionId={string | null}
  onSelectQuestion={(id) => void}
  onDeleteQuestion={(id) => void}
  onDuplicateQuestion={(id) => void}
  onDragStart={(id) => void}
  onDragEnd={() => void}
  onDrop={(targetIndex) => void}
/>
```

### BuilderToolbar
```tsx
<BuilderToolbar
  onAddQuestion={(type) => void}
/>
```

## How Drag-Drop Works

1. **Drag Start**: Click and hold on question card's drag handle (≡)
2. **Drag Over**: Question becomes semi-transparent, move over drop zones
3. **Drop Zone**: Appear as thin lines between questions or at end
4. **Drop**: Release to reorder - questions automatically re-indexed

## State Management

Using React hooks with callback pattern:
- `survey`: Main survey state
- `selectedQuestionId`: Active question for editing
- `draggedQuestionId`: Currently dragged question

## Styles: Inline vs Tailwind

**Tailwind classes** for:
- Layout (grid, flex, container)
- Typography (text-sm, font-semibold)
- Sizing (w-full, h-1, px-3)
- Responsive (lg:col-span-3)

**Inline styles** for:
- Dynamic colors (design system tokens)
- Calculated values
- State-based styling (hover, selected, drag)

Example:
```tsx
className="rounded-2xl border p-6 cursor-grab"
style={{
  backgroundColor: isSelected ? "#F2EDE5" : "#FFFFFF",
  borderColor: isSelected ? "#7C9E8A" : "#E8DFD5",
}}
```

## Running the Demo

```bash
cd survey_creator_frontend

npm install
npm run dev
```

Navigate to: `http://localhost:3000/builder`

## Next Integration Points

1. **API Integration** - Connect to backend `/api/v1/surveys/*`
2. **AI Panel** - Add chat interface for AI modifications
3. **Diff Viewer** - Show AI changes before apply
4. **Logic Editor** - Visual conditional flow builder
5. **Screener** - Qualification questions
6. **Preview** - Desktop/mobile survey preview
7. **Version History** - Track all changes
8. **State Persistence** - Save to database

## Performance Notes

- ✅ Efficient drag-and-drop (no unnecessary re-renders)
- ✅ Memoized callbacks for event handlers
- ✅ Lightweight animations (CSS transitions)
- ✅ Sticky sidebar (top: 8)
- ✅ Lazy component sections (collapsible)

---

**Status**: ✅ Complete - Drag-drop form creation UI ready for use  
**Ready for**: API integration, AI agent panel, Logic flow editor  
**Deployment**: Production-ready for Next.js 16 + Tailwind v4
