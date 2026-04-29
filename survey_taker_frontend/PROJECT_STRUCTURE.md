# Survey Taker Frontend - Project Structure Guide

## 📁 Simple & Clean Structure

```
src/
├── pages/          👈 All your page components here
├── components/     👈 Reusable UI components
├── hooks/          👈 Custom React hooks
├── services/       👈 API calls & mock data
├── context/        👈 Global state (if needed)
├── types/          👈 TypeScript type definitions
├── utils/          👈 Helper functions
```

## 🎯 Where to Put What

### `pages/` - Your Main Pages
- `surveys.tsx` - List all available surveys
- `survey/[id].tsx` - Take a single survey
- `wallet.tsx` - Wallet & balance page
- `profile.tsx` - User profile page
- `notifications.tsx` - Notifications page

**Example:**
```
pages/
├── surveys.tsx
├── survey/
│   └── [id].tsx
├── wallet.tsx
├── profile.tsx
└── notifications.tsx
```

### `components/` - Reusable Components
- `SurveyCard.tsx` - Card component for displaying surveys
- `QuestionForm.tsx` - Component for survey questions
- `Header.tsx` - Top navigation
- `Footer.tsx` - Bottom footer

**Example:**
```
components/
├── Header.tsx
├── Footer.tsx
├── SurveyCard.tsx
├── QuestionForm.tsx
├── WalletBalance.tsx
└── NotificationItem.tsx
```

### `hooks/` - Custom React Hooks
- `useSurveys.ts` - Fetch & manage surveys
- `useWallet.ts` - Manage wallet data
- `useUser.ts` - Manage user profile

**Example:**
```
hooks/
├── useSurveys.ts
├── useWallet.ts
└── useUser.ts
```

### `services/` - API & Mock Data
- `api.ts` - Real API calls (for later when backend is ready)
- `mockData.ts` - Mock data for development NOW

**Example:**
```
services/
├── api.ts
└── mockData.ts
```

### `types/` - Type Definitions
- `index.ts` - All your TypeScript types

**Example:**
```
types/
└── index.ts
```

### `context/` - Global State (Optional)
- `AppContext.tsx` - Current user info
- `SurveyContext.tsx` - Current survey data

**Example:**
```
context/
├── AppContext.tsx
├── SurveyContext.tsx
└── WalletContext.tsx
```

### `utils/` - Helper Functions
- `formatCurrency.ts` - Format money
- `validateEmail.ts` - Validate inputs
- `formatDate.ts` - Format dates

**Example:**
```
utils/
├── formatCurrency.ts
├── validateEmail.ts
└── formatDate.ts
```

## 🚀 Quick Start Guide

### Step 1: Create Types
1. Open `src/types/index.ts`
2. Define your TypeScript interfaces (Survey, User, Wallet, etc.)

### Step 2: Create Mock Data
1. Open `src/services/mockData.ts`
2. Create mock surveys, user, wallet data

### Step 3: Create Reusable Components
1. Start with `src/components/SurveyCard.tsx`
2. Add more components as needed

### Step 4: Create Pages
1. Create `src/pages/surveys.tsx` - List all surveys
2. Create `src/pages/survey/[id].tsx` - Take survey

### Step 5: Create Custom Hooks
1. Create `src/hooks/useSurveys.ts` - Fetch surveys
2. Create `src/hooks/useWallet.ts` - Fetch wallet

## 💡 Pro Tips

1. **Start Simple** - Don't overthink. Just create what you need.
2. **One Thing Per File** - Each component/hook should do one thing.
3. **Name Clearly** - Use descriptive names (e.g., `SurveyListPage` not `Page1`)
4. **Mock First** - Use mock data now, integrate real API later.
5. **Component Tree** - Think: Pages → Components → Hooks → Services

## 📝 Example Workflow

### Example: Building Survey List Page

1. **Create type** in `src/types/index.ts`:
```typescript
interface Survey {
  id: string;
  title: string;
  reward: number;
}
```

2. **Create mock data** in `src/services/mockData.ts`:
```typescript
const surveys = [
  { id: '1', title: 'Shopping Survey', reward: 2.50 }
]
```

3. **Create component** in `src/components/SurveyCard.tsx`:
```typescript
export function SurveyCard({ survey }) {
  return <div>{survey.title}</div>
}
```

4. **Create hook** in `src/hooks/useSurveys.ts`:
```typescript
export function useSurveys() {
  const [surveys, setSurveys] = useState([])
  return surveys
}
```

5. **Create page** in `src/pages/surveys.tsx`:
```typescript
export default function SurveysPage() {
  const surveys = useSurveys()
  return surveys.map(s => <SurveyCard key={s.id} survey={s} />)
}
```

That's it! 🎉

## Questions?

Ask yourself:
- "Where does this go?"
- "Is it a page?" → `pages/`
- "Is it a reusable component?" → `components/`
- "Is it a hook?" → `hooks/`
- "Is it data?" → `services/`
- "Is it a type?" → `types/`

Good luck! 💪
