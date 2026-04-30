# Survey Builder - Drag-Drop Form Creation UI

## Overview

The Survey Builder is a comprehensive drag-and-drop interface for creating surveys with AI integration capabilities. It provides a modern, premium experience following the "Soft Luxury" design system with a warm, minimal aesthetic.

## Components

### 1. **SurveyBuilder** (Main Container)
The main component that orchestrates the entire form creation experience.

**Features:**
- Survey title and description editing
- Questions list with drag-and-drop reordering
- Right panel for detailed question editing
- Question management (add, delete, duplicate)
- Estimated completion time calculation
- AI agent integration ready

**Usage:**
```tsx
import { SurveyBuilder } from "@/app/feature/creeate_survey/components";
import { Survey } from "@/app/feature/creeate_survey/types/survey";

const initialSurvey: Survey = {
  id: "survey-1",
  title: "My Survey",
  status: "draft",
  questions: [],
};

function Page() {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  
  return (
    <SurveyBuilder 
      survey={survey} 
      onSurveyChange={setSurvey} 
    />
  );
}
```

### 2. **QuestionCard** (Individual Question)
Displays a single question with drag handle, type badge, metadata, and quick actions.

**Features:**
- Drag handle for reordering
- Question preview with text truncation
- Question type badge (Single Choice, Rating Scale, etc.)
- Required/Optional indicator
- Option count display
- Duplicate action
- Delete action
- Selected state highlighting

**Drag-and-Drop:**
- Grab any question card to reorder
- Visual feedback on drag
- Drop zones between questions
- Smooth animations

### 3. **QuestionList** (Questions Container)
Container for all question cards with drag-and-drop orchestration.

**Features:**
- Manages drag state across multiple questions
- Drop zone highlighting
- Smooth reordering
- Maintains question order

### 4. **BuilderToolbar** (Question Type Selector)
Expandable toolbar to add new questions by type.

**Question Types Organized by Category:**

**Basic:**
- Single Choice
- Multiple Choice
- Checkbox
- Yes/No
- Short Text
- Long Text

**Rating:**
- Rating Scale (1-5)
- Rating Scale (1-10)
- NPS
- Likert Scale

**Advanced:**
- Image Choice
- Matrix/Grid
- Ranking
- Slider
- Date/Time

**Features:**
- Collapsible categories
- Icon-based identification
- Hover effects
- One-click question creation

### 5. **QuestionEditor** (Right Sidebar)
Detailed question editing panel with context-specific fields.

**Features:**
- Question text editor
- Description/help text
- Required/Optional toggle
- Question-type-specific settings
- Options management (add, edit, remove)
- Text character limits
- Scale labels (min/max)
- Randomization options
- Collapsible sections for organization

**Supported Settings by Question Type:**

| Type | Settings |
|------|----------|
| Single/Multiple/Checkbox | Options, Randomize |
| Text | Character limit |
| Rating/Slider | Min/Max labels |
| All | Required, Description |

## Type System

### Question Types
```typescript
type QuestionType =
  | "single-choice"
  | "multiple-choice"
  | "checkbox"
  | "short-text"
  | "long-text"
  | "rating-scale-5"
  | "rating-scale-10"
  | "nps"
  | "likert"
  | "image-choice"
  | "matrix"
  | "yes-no"
  | "ranking"
  | "slider"
  | "date-time";
```

### Question Structure
```typescript
interface Question {
  id: string;
  order: number;
  questionText: string;
  questionType: QuestionType;
  description?: string;
  required: boolean;
  options?: QuestionOption[];
  randomizeOptions?: boolean;
  charLimit?: number;
  minLabel?: string;
  maxLabel?: string;
  matrixRows?: string[];
  matrixColumns?: string[];
  mediaUrl?: string;
  logic?: LogicRule[];
}
```

### Survey Structure
```typescript
interface Survey {
  id: string;
  title: string;
  description?: string;
  status: SurveyStatus;
  questions: Question[];
  screener?: Screener;
  estimatedCompletionTime?: number;
  randomizeQuestionOrder?: boolean;
  attentionChecks?: boolean;
  versionHistory?: SurveyVersion[];
}
```

## Design System

All components follow the **Soft Luxury** design system:

### Colors
- **Background:** `#FAF7F2` (cream)
- **Surface:** `#F2EDE5` (warm gray)
- **Primary:** `#7C9E8A` (sage green)
- **Primary Hover:** `#6A8C78` (darker sage)
- **Text:** `#1C1C1A` (near-black)
- **Muted:** `#6B6860` (warm gray text)
- **Accent:** `#C4956A` (gold, used sparingly)
- **Error:** `#FFE8E8` / `#D85555` (soft red)

### Typography
- **Headlines:** Cormorant Garamond, `-0.02em` letter-spacing
- **Body:** DM Sans
- **Sizes:** Hierarchical and spacious

### Layout
- **Card Radius:** `16px`
- **Pill Buttons:** `999px`
- **Spacing:** Generous, minimum `120px` between sections
- **Borders:** Subtle, `1px` slightly darker than background
- **Shadows:** Minimal, warm tones

## Features Implemented

✅ **Drag-and-Drop Reordering**
- Grab questions to reorder
- Visual feedback during drag
- Smooth drop zones

✅ **15+ Question Types**
- Comprehensive question type support
- Category-based organization
- Type-specific settings in editor

✅ **Question Management**
- Add questions from toolbar
- Edit individual questions
- Duplicate questions
- Delete questions
- Mark as required/optional

✅ **Options Management**
- Add/remove options for choice questions
- Edit option text
- Randomize option order
- Option count display

✅ **Advanced Settings**
- Character limits for text
- Scale labels (min/max)
- Matrix configuration
- Randomization controls
- Logic rules structure (ready for implementation)

✅ **Premium UI/UX**
- Soft luxury design system
- Smooth animations
- Responsive layout
- Accessible interactions
- Clear visual hierarchy

## Usage Example

### Demo Page
Navigate to `/builder` to see the Survey Builder in action.

### Integration
```tsx
"use client";

import { useState } from "react";
import { SurveyBuilder } from "@/app/feature/creeate_survey/components";
import { Survey } from "@/app/feature/creeate_survey/types/survey";

export default function CreateSurveyPage() {
  const [survey, setSurvey] = useState<Survey>({
    id: "new-survey",
    title: "Create a New Survey",
    status: "draft",
    questions: [],
  });

  const handleSaveSurvey = async () => {
    // Call your API to save the survey
    const response = await fetch("/api/surveys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(survey),
    });
    // Handle response
  };

  return (
    <div>
      <SurveyBuilder survey={survey} onSurveyChange={setSurvey} />
      <button onClick={handleSaveSurvey}>Save Survey</button>
    </div>
  );
}
```

## Next Steps

### To Implement
1. **Logic Flow Editor** - Visual conditional logic (skip/branch)
2. **AI Agent Panel** - Chat interface for natural language modifications
3. **Diff Viewer** - Side-by-side comparison of AI-generated changes
4. **Survey Preview** - Desktop/mobile preview with test submissions
5. **Version History** - Track all changes with rollback capability
6. **Screener Builder** - Separate qualification logic
7. **Attention Checks** - Auto-insertion and configuration
8. **Backend Integration** - Connect with NestJS API

### API Integration Points
```typescript
// POST /api/v1/surveys - Create survey
// PUT /api/v1/surveys/:id - Update survey
// GET /api/v1/surveys/:id - Fetch survey
// POST /api/v1/surveys/:id/questions - Add question
// DELETE /api/v1/surveys/:id/questions/:questionId - Delete question
// POST /api/v1/surveys/ai/* - AI modifications
```

## Accessibility

- Semantic HTML structure
- Clear color contrast ratios
- Keyboard navigation support
- ARIA labels on interactive elements
- Focus indicators on all buttons

## Performance

- Efficient drag-and-drop handling
- Memoized components for optimization
- Minimal re-renders
- Lightweight animations
- No unnecessary state updates

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

---

**Created:** April 2026  
**Framework:** Next.js 16, React 19  
**Design System:** Soft Luxury  
**Status:** Core UI Complete, Ready for AI & Backend Integration
