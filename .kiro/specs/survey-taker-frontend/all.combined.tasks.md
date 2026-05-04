# Survey Taker Frontend — Combined Task Document

> **Generated from**: tasks.md + requirements.md + design.md
> **Purpose**: Single-source implementation reference combining all spec artifacts

---

## Task: 1 — Project Setup and Core Infrastructure

### 1. From tasks.md
- **Sub-steps**: Set up Next.js 16 project with TypeScript and App Router; Configure Tailwind CSS for mobile-first responsive design; Set up ESLint, Prettier, and TypeScript strict mode; Configure environment variables and build scripts; Set up folder structure following component architecture
- **Requirements**: 21.1, 27.2, 29.1

### 2. From requirements.md
- **Requirement 21.1**: THE Survey_Taker_Frontend SHALL implement a mobile-first responsive design using Tailwind CSS
- **Requirement 27.2**: THE Survey_Taker_Frontend SHALL implement code splitting to load only necessary JavaScript for each route
- **Requirement 29.1**: THE Survey_Taker_Frontend SHALL implement Content Security Policy headers to prevent XSS attacks

### 3. From design.md
- **Pattern**: Next.js 16 App Router with TypeScript strict mode; layered component architecture (Page → Feature → UI → Layout)
- **Files**: `/app/`, `/components/`, `/lib/`, `/hooks/`, `/stores/`, `/types/`, `/public/`
- **Interface**: Tailwind breakpoints `{ sm: '640px', md: '768px', lg: '1024px', xl: '1280px', '2xl': '1536px' }`; security headers config via `next.config.js`

### 4. Implementation Summary
- Bootstrap Next.js 16 with `--typescript --app` flags
- Configure `tailwind.config.ts` with custom breakpoints and 44px minimum tap targets
- Add `next.config.js` with CSP headers array (`Content-Security-Policy`, `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`)
- Set `.eslintrc`, `prettier.config.js`, `tsconfig.json` with `strict: true`
- Create folder scaffold: `app/`, `components/ui/`, `components/features/`, `lib/api/`, `hooks/`, `stores/`, `types/`
- Add `.env.example` with `NEXT_PUBLIC_API_URL`

### 5. Verification
- [ ] Tailwind mobile-first classes render correctly at 320px–2560px (Req 21.1)
- [ ] Next.js route-based code splitting active (Req 27.2)
- [ ] CSP header present in HTTP response (Req 29.1)
- [ ] `tsc --noEmit` passes with zero errors
- [ ] `eslint .` passes with zero errors

---

## Task: 2 — Authentication System Foundation

### 1. From tasks.md
- **Sub-steps**:
  - 2.1 Implement JWT token management with httpOnly cookies
  - 2.2* Write property test for device fingerprint generation *(optional)*
  - 2.3 Create authentication context and providers
  - 2.4* Write unit tests for authentication utilities *(optional)*
- **Requirements**: 3.3, 3.6, 4.1, 25.1, 3.1, 3.8, 25.2

### 2. From requirements.md
- **Requirement 3.3**: WHEN authentication is successful, THE Survey_Taker_Frontend SHALL store the JWT token securely in httpOnly cookies
- **Requirement 3.6**: THE Survey_Taker_Frontend SHALL automatically refresh JWT tokens before expiration using TanStack Query
- **Requirement 3.8**: THE Survey_Taker_Frontend SHALL redirect authenticated users away from login/registration pages to the dashboard
- **Requirement 4.1**: WHEN a user accesses the registration or login page, THE Survey_Taker_Frontend SHALL generate a Device_Fingerprint using browser and device characteristics
- **Requirement 25.1**: THE Survey_Taker_Frontend SHALL automatically refresh authentication tokens before expiration
- **Requirement 25.2**: WHEN a token refresh fails, THE Survey_Taker_Frontend SHALL redirect to login and preserve the current page URL for post-login redirect

### 3. From design.md
- **Pattern**: Axios interceptors for request auth and 401 response token refresh; `AuthContextType` interface with `user`, `login`, `logout`, `register`, `verifyPhone`, `isAuthenticated`, `isLoading`
- **Files**: `lib/api/client.ts`, `lib/auth/tokenManager.ts`, `lib/auth/fingerprint.ts`, `contexts/AuthContext.tsx`, `hooks/useAuth.ts`, `components/layout/ProtectedRoute.tsx`
- **Interface**:
```typescript
interface AuthContextType {
  user: User | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  register: (data: RegistrationData) => Promise<void>;
  verifyPhone: (otp: string) => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### 4. Implementation Summary
- `lib/auth/tokenManager.ts`: read/write JWT from httpOnly cookie; expose `getAuthToken()`, `clearToken()`
- `lib/auth/fingerprint.ts`: collect `navigator.userAgent`, `navigator.language`, `screen.width/height`, `timezoneOffset`, canvas fingerprint → `btoa(joined)` → `generateDeviceFingerprint()`
- `lib/api/client.ts`: axios instance with `withCredentials: true`; request interceptor injects Bearer token; response interceptor catches 401, calls `refreshToken()`, retries original request
- `contexts/AuthContext.tsx`: wraps app with `AuthContextType`; TanStack Query background token refresh before expiry
- `components/layout/ProtectedRoute.tsx`: redirects unauthenticated users; redirects authenticated users away from `/login` and `/register`
- **Property 5**: `generateDeviceFingerprint()` returns identical value for identical browser/device inputs

### 5. Verification
- [ ] JWT stored in httpOnly cookie (Req 3.3)
- [ ] Token auto-refreshes before expiry (Req 3.6, 25.1)
- [ ] Authenticated users redirected from auth pages to dashboard (Req 3.8)
- [ ] Device fingerprint included in all auth requests (Req 4.1)
- [ ] Token refresh failure redirects to login with `?redirect=` param (Req 25.2)
- [ ] Property 5 test passes (100 runs, fast-check)

---

## Task: 3 — Registration and Login Forms

### 1. From tasks.md
- **Sub-steps**:
  - 3.1 Create registration form with validation
  - 3.2* Write property tests for form validation *(optional)*
  - 3.3 Implement login form with OAuth integration
  - 3.4* Write property test for authentication error handling *(optional)*
- **Requirements**: 1.1, 1.2, 1.3, 1.4, 1.7, 3.1, 3.2, 3.4, 4.1, 4.2

### 2. From requirements.md
- **Requirement 1.1**: THE Survey_Taker_Frontend SHALL provide registration options for email, phone number, and OAuth providers (Google, Facebook)
- **Requirement 1.2**: WHEN a user submits a registration form, THE Survey_Taker_Frontend SHALL validate all required fields using Zod schemas before submission
- **Requirement 1.3**: WHEN email registration is used, THE Survey_Taker_Frontend SHALL require password with minimum 8 characters including uppercase, lowercase, and number
- **Requirement 1.4**: WHEN phone registration is used, THE Survey_Taker_Frontend SHALL format phone numbers according to Cambodian standards (+855)
- **Requirement 1.7**: THE Survey_Taker_Frontend SHALL display registration forms in both Khmer and English based on user language preference
- **Requirement 3.1**: THE Survey_Taker_Frontend SHALL provide login options for email/password, phone/password, and OAuth
- **Requirement 3.2**: WHEN a user submits login credentials, THE Survey_Taker_Frontend SHALL call the Authentication_Service via the NestJS backend
- **Requirement 3.4**: WHEN authentication fails, THE Survey_Taker_Frontend SHALL display an error message without revealing whether email or password was incorrect
- **Requirement 4.2**: THE Survey_Taker_Frontend SHALL include the Device_Fingerprint in all authentication requests to the backend

### 3. From design.md
- **Pattern**: React Hook Form + Zod schemas; field-level error display; i18n via `next-intl`; device fingerprint attached to auth payloads
- **Files**: `app/(auth)/register/page.tsx`, `app/(auth)/login/page.tsx`, `components/features/auth/RegisterForm.tsx`, `components/features/auth/LoginForm.tsx`, `lib/validation/authSchemas.ts`
- **Interface**:
```typescript
// Zod schema example
const passwordSchema = z.string()
  .min(8)
  .regex(/[A-Z]/, 'uppercase required')
  .regex(/[a-z]/, 'lowercase required')
  .regex(/[0-9]/, 'number required');

const phoneSchema = z.string()
  .regex(/^\+855\d{8,9}$/, 'Must be +855 format');
```

### 4. Implementation Summary
- `lib/validation/authSchemas.ts`: Zod schemas for `RegistrationEmailSchema`, `RegistrationPhoneSchema`, `LoginSchema`
- `RegisterForm.tsx`: multi-step form; step 1 = method selection (email/phone/OAuth); step 2 = credentials with Zod validation; phone field auto-prefixes `+855`; inline field-level errors
- `LoginForm.tsx`: email/phone toggle + OAuth buttons; on 401 response display generic message "Invalid credentials" (never specify which field failed)
- Both forms attach `deviceFingerprint` from `generateDeviceFingerprint()` to request payload
- **Property 1**: Any valid field set passes schema; any invalid set is rejected
- **Property 2**: Passwords < 8 chars or missing uppercase/lowercase/number are always rejected; compliant passwords always accepted
- **Property 4**: All auth failure responses produce identical UI error text regardless of failure cause

### 5. Verification
- [ ] Registration offers email, phone, Google, Facebook (Req 1.1)
- [ ] Zod validates all fields before submit (Req 1.2)
- [ ] Password rule enforced (Req 1.3)
- [ ] Phone auto-formats to +855 (Req 1.4)
- [ ] Forms display in Khmer and English (Req 1.7)
- [ ] Auth error never reveals email vs password mismatch (Req 3.4)
- [ ] Device fingerprint in all auth requests (Req 4.2)
- [ ] Property 1, 2, 4 tests pass (100 runs each)

---

## Task: 4 — Phone Verification System

### 1. From tasks.md
- **Sub-steps**:
  - 4.1 Create OTP verification component
  - 4.2* Write property test for OTP auto-submission *(optional)*
  - 4.3 Integrate phone verification with registration flow
- **Requirements**: 2.1, 2.3, 2.4, 2.5, 2.6, 2.2, 2.7, 2.8

### 2. From requirements.md
- **Requirement 2.1**: WHEN a user completes registration, THE Survey_Taker_Frontend SHALL prompt for phone number verification
- **Requirement 2.2**: WHEN a user requests OTP, THE Survey_Taker_Frontend SHALL call the Authentication_Service to send the OTP via SMS
- **Requirement 2.3**: THE Survey_Taker_Frontend SHALL display a 6-digit OTP input field with auto-focus
- **Requirement 2.4**: WHEN a user enters a 6-digit OTP, THE Survey_Taker_Frontend SHALL automatically submit it for verification
- **Requirement 2.5**: IF OTP verification fails, THEN THE Survey_Taker_Frontend SHALL display an error message and allow retry
- **Requirement 2.6**: THE Survey_Taker_Frontend SHALL allow OTP resend after 60 seconds cooldown
- **Requirement 2.7**: WHEN OTP is verified successfully, THE Survey_Taker_Frontend SHALL mark the account as verified and redirect to profile completion
- **Requirement 2.8**: THE Survey_Taker_Frontend SHALL prevent access to surveys until phone verification is complete

### 3. From design.md
- **Pattern**: Controlled 6-input OTP component with auto-advance; cooldown timer with `useEffect`; `verifyPhone()` from `AuthContextType`
- **Files**: `app/(auth)/verify-phone/page.tsx`, `components/features/auth/OtpInput.tsx`, `hooks/useOtpTimer.ts`
- **Interface**:
```typescript
interface OtpInputProps {
  onComplete: (otp: string) => void;
  isLoading: boolean;
  error?: string;
}
```

### 4. Implementation Summary
- `OtpInput.tsx`: 6 individual `<input type="tel" maxLength={1}>` elements; auto-focus first on mount; auto-advance on digit entry; on 6th digit, call `onComplete(otp)` automatically
- `useOtpTimer.ts`: 60-second countdown; exposes `canResend: boolean`, `secondsLeft: number`, `resetTimer()`
- `verify-phone/page.tsx`: calls `Authentication_Service` for OTP send on mount; shows resend button (disabled when `!canResend`); on error shows inline message + clears inputs; on success calls `authContext.verifyPhone()` then redirects to `/profile/complete`
- `ProtectedRoute` checks `user.isVerified`; unverified users accessing `/surveys` are redirected to `/verify-phone`
- **Property 3**: Entering exactly 6 digits always triggers `onComplete`; fewer than 6 never triggers

### 5. Verification
- [ ] Verification prompt shown after registration (Req 2.1)
- [ ] OTP sent via Authentication_Service (Req 2.2)
- [ ] 6-digit input with auto-focus (Req 2.3)
- [ ] Auto-submits on 6th digit (Req 2.4)
- [ ] Error + retry on failure (Req 2.5)
- [ ] Resend enabled only after 60s (Req 2.6)
- [ ] Redirects to profile completion on success (Req 2.7)
- [ ] Survey access blocked for unverified users (Req 2.8)
- [ ] Property 3 test passes (100 runs)

---

## Task: 5 — Checkpoint — Authentication System Complete

### 1. From tasks.md
- **Sub-steps**: Ensure all authentication tests pass, ask the user if questions arise
- **Requirements**: All requirements from Tasks 2–4

### 2. From requirements.md
- Covers all acceptance criteria from Requirements 1, 2, 3, 4 (registration, verification, authentication, device fingerprinting)

### 3. From design.md
- **Pattern**: Full auth flow verified end-to-end: registration → OTP → profile redirect; protected routes guard all survey pages

### 4. Implementation Summary
- Run full auth test suite: unit tests for token management, property tests for fingerprint/OTP/validation, integration tests for OAuth flows
- Confirm redirect logic covers all edge cases (unverified, unauthenticated, authenticated-on-auth-page)
- Confirm device fingerprint present in every auth-related API call

### 5. Verification
- [ ] All unit tests in `lib/auth/` pass
- [ ] All property tests (Properties 1, 2, 3, 4, 5) pass with ≥100 runs
- [ ] Manual smoke test: register → verify phone → land on profile page
- [ ] Manual smoke test: access `/surveys` while unverified → redirected to `/verify-phone`

---

## Task: 6 — User Profile Management

### 1. From tasks.md
- **Sub-steps**:
  - 6.1 Create profile form components
  - 6.2* Write property test for profile completeness calculation *(optional)*
  - 6.3 Implement profile editing and consent management
  - 6.4* Write unit tests for profile validation *(optional)*
- **Requirements**: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 6.1, 6.2, 6.3

### 2. From requirements.md
- **Requirement 5.1**: THE Survey_Taker_Frontend SHALL provide a profile form with fields for age, gender, location, education, employment, income range, and interests
- **Requirement 5.2**: WHEN a user updates profile data, THE Survey_Taker_Frontend SHALL validate all fields using Zod schemas before submission
- **Requirement 5.3**: THE Survey_Taker_Frontend SHALL display Profile_Completeness as a percentage with visual progress indicator
- **Requirement 5.4**: WHEN profile data is saved successfully, THE Survey_Taker_Frontend SHALL update the Profile_Completeness indicator
- **Requirement 5.5**: THE Survey_Taker_Frontend SHALL allow users to edit profile data at any time from the settings page
- **Requirement 5.6**: THE Survey_Taker_Frontend SHALL display which profile fields unlock additional survey opportunities
- **Requirement 5.7**: WHERE profile fields are optional, THE Survey_Taker_Frontend SHALL clearly indicate which fields are required versus optional
- **Requirement 5.8**: THE Survey_Taker_Frontend SHALL support multi-select for interests with minimum 3 and maximum 10 selections
- **Requirement 6.1**: WHEN a user first registers, THE Survey_Taker_Frontend SHALL display a consent screen explaining data collection practices
- **Requirement 6.2**: THE Survey_Taker_Frontend SHALL require explicit consent for profile data usage in survey matching
- **Requirement 6.3**: THE Survey_Taker_Frontend SHALL provide a consent management page where users can view and update their consent preferences

### 3. From design.md
- **Pattern**: Zod-validated React Hook Form; `UserProfile` interface with `completeness: number (0-100%)`; consent gate before profile save
- **Files**: `app/profile/page.tsx`, `app/profile/complete/page.tsx`, `app/settings/consent/page.tsx`, `components/features/profile/ProfileForm.tsx`, `components/features/profile/CompletenessBar.tsx`, `components/features/profile/InterestsSelector.tsx`, `lib/validation/profileSchemas.ts`
- **Interface**:
```typescript
interface UserProfile {
  firstName: string;
  lastName: string;
  age: number;
  gender: Gender;
  location: Location;
  education: EducationLevel;
  employment: EmploymentStatus;
  incomeRange: IncomeRange;
  interests: Interest[]; // min 3, max 10
  completeness: number; // 0-100%
}
```

### 4. Implementation Summary
- `ProfileForm.tsx`: fields for all demographics; required fields marked with `*`; optional fields labeled "(optional)"; tooltip on optional fields showing which surveys they unlock
- `InterestsSelector.tsx`: chip-based multi-select; disables selection at 10; shows warning below 3 on submit
- `CompletenessBar.tsx`: progress bar driven by `profile.completeness`; updates optimistically after save
- `lib/profile/completeness.ts`: `calculateCompleteness(profile: Partial<UserProfile>): number` — counts completed required fields / total required fields × 100
- First-time users see consent modal before profile save; returning users can manage via `/settings/consent`
- **Property 6**: `calculateCompleteness` always returns value 0–100 proportional to completed fields

### 5. Verification
- [ ] All demographic fields present (Req 5.1)
- [ ] Zod validates profile before save (Req 5.2)
- [ ] Completeness % shown with progress bar (Req 5.3)
- [ ] Completeness updates after save (Req 5.4)
- [ ] Profile editable from settings (Req 5.5)
- [ ] Tooltip shows survey unlock benefits (Req 5.6)
- [ ] Required vs optional clearly labeled (Req 5.7)
- [ ] Interests: min 3, max 10 enforced (Req 5.8)
- [ ] Consent screen shown on first registration (Req 6.1)
- [ ] Explicit consent required to save profile data (Req 6.2)
- [ ] Consent management page accessible (Req 6.3)
- [ ] Property 6 test passes (100 runs)

---

## Task: 7 — Internationalization Setup

### 1. From tasks.md
- **Sub-steps**:
  - 7.1 Configure next-intl for bilingual support
  - 7.2 Create translation files and language utilities
- **Requirements**: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 1.7

### 2. From requirements.md
- **Requirement 20.1**: THE Survey_Taker_Frontend SHALL provide a language selector in the header with Khmer and English options
- **Requirement 20.2**: WHEN a user selects a language, THE Survey_Taker_Frontend SHALL update all UI text immediately without page reload
- **Requirement 20.3**: THE Survey_Taker_Frontend SHALL persist language preference in local storage
- **Requirement 20.4**: THE Survey_Taker_Frontend SHALL load the user's preferred language on subsequent visits
- **Requirement 20.5**: THE Survey_Taker_Frontend SHALL display all static content, form labels, error messages, and navigation in the selected language
- **Requirement 20.6**: WHERE survey content is available in multiple languages, THE Survey_Taker_Frontend SHALL display surveys in the user's preferred language
- **Requirement 1.7**: THE Survey_Taker_Frontend SHALL display registration forms in both Khmer and English based on user language preference

### 3. From design.md
- **Pattern**: `next-intl` with locale routing; language switcher in header; `localStorage` for persistence; dynamic locale loading without full page reload
- **Files**: `messages/en.json`, `messages/km.json`, `i18n.ts`, `middleware.ts`, `components/ui/LanguageSwitcher.tsx`, `hooks/useLocale.ts`
- **Interface**: `next-intl` `useTranslations('namespace')` hook throughout components

### 4. Implementation Summary
- `messages/en.json` and `messages/km.json`: keys for all static text — nav, forms, errors, survey UI, wallet, notifications
- `middleware.ts`: `next-intl` locale detection from `localStorage` → `Accept-Language` header → default `en`
- `LanguageSwitcher.tsx`: dropdown in header; on select, writes to `localStorage`, calls `router.replace()` with new locale
- `useLocale.ts`: reads from `localStorage` on init, exposes `locale`, `setLocale()`
- Survey content API requests include `Accept-Language` header to receive locale-specific content

### 5. Verification
- [ ] Language selector in header with KM/EN (Req 20.1)
- [ ] Language change updates UI without page reload (Req 20.2)
- [ ] Language preference persisted to localStorage (Req 20.3)
- [ ] Preferred language loaded on return visit (Req 20.4)
- [ ] All labels, errors, nav translated (Req 20.5)
- [ ] Survey content served in preferred language (Req 20.6)
- [ ] Registration forms obey language preference (Req 1.7)

---

## Task: 8 — Survey Feed and Discovery

### 1. From tasks.md
- **Sub-steps**:
  - 8.1 Create survey feed component with infinite scroll
  - 8.2* Write property test for survey feed sorting *(optional)*
  - 8.3 Implement survey filtering and search
  - 8.4* Write integration tests for survey feed *(optional)*
- **Requirements**: 7.1, 7.2, 7.3, 7.6, 7.7, 7.4, 7.5, 7.8, 30.1, 30.2, 30.3, 30.4

### 2. From requirements.md
- **Requirement 7.1**: THE Survey_Taker_Frontend SHALL display a Survey_Feed showing available surveys sorted by Match_Score descending
- **Requirement 7.2**: WHEN the Survey_Feed loads, THE Survey_Taker_Frontend SHALL fetch survey data from the backend using TanStack Query
- **Requirement 7.3**: FOR EACH survey in the feed, THE Survey_Taker_Frontend SHALL display title, estimated time, reward amount, and Match_Score
- **Requirement 7.4**: THE Survey_Taker_Frontend SHALL provide filter options for reward range, time duration, and category
- **Requirement 7.5**: WHEN a user applies filters, THE Survey_Taker_Frontend SHALL update the Survey_Feed without full page reload
- **Requirement 7.6**: THE Survey_Taker_Frontend SHALL implement infinite scroll for loading additional surveys
- **Requirement 7.7**: THE Survey_Taker_Frontend SHALL display a badge indicating "High Match" for surveys with Match_Score above 80%
- **Requirement 7.8**: WHERE a survey has age restrictions, THE Survey_Taker_Frontend SHALL only display it to eligible users based on profile age
- **Requirement 30.1**: WHERE a survey has age restrictions, THE Survey_Taker_Frontend SHALL verify user age from profile before allowing access
- **Requirement 30.2**: IF user age is below the survey requirement, THEN THE Survey_Taker_Frontend SHALL hide the survey from the Survey_Feed
- **Requirement 30.4**: THE Survey_Taker_Frontend SHALL prevent URL manipulation to bypass age restrictions by validating on survey load

### 3. From design.md
- **Pattern**: `useInfiniteQuery` with `getNextPageParam`; `SurveyFilters` type passed as query key; `staleTime: 5 * 60 * 1000`; `Survey` interface with `matchScore`, `ageRestriction`, `rewardPoints`, `estimatedTime`
- **Files**: `app/surveys/page.tsx`, `components/features/surveys/SurveyFeed.tsx`, `components/features/surveys/SurveyCard.tsx`, `components/features/surveys/SurveyFilters.tsx`, `hooks/useSurveyFeed.ts`
- **Interface**:
```typescript
interface Survey {
  id: string;
  title: string;
  estimatedTime: number;
  rewardPoints: number;
  matchScore: number; // 0-100%
  category: SurveyCategory;
  ageRestriction?: number;
}

export const useSurveyFeed = (filters: SurveyFilters) => {
  return useInfiniteQuery({
    queryKey: ['surveys', filters],
    queryFn: ({ pageParam = 0 }) => fetchSurveys({ ...filters, page: pageParam }),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    staleTime: 5 * 60 * 1000,
  });
};
```

### 4. Implementation Summary
- `useSurveyFeed.ts`: infinite query; backend receives `user.age` header for server-side age filtering; client also filters `survey.ageRestriction > user.profile.age`
- `SurveyCard.tsx`: displays title, time, reward, match score; shows "High Match" badge when `matchScore > 80`
- `SurveyFilters.tsx`: controlled filter panel (reward range slider, time duration select, category chips); filter changes invalidate query without page reload
- Intersection Observer triggers `fetchNextPage` on scroll sentinel element
- On survey load (`/surveys/[id]`), re-validates age server-side to prevent URL bypass
- **Property 7**: Given any array of surveys with mixed match scores, rendered order is always strictly descending by `matchScore`

### 5. Verification
- [ ] Feed sorted by Match_Score descending (Req 7.1)
- [ ] TanStack Query fetches data (Req 7.2)
- [ ] Each card shows title, time, reward, score (Req 7.3)
- [ ] Filter controls present (Req 7.4)
- [ ] Filters update feed without page reload (Req 7.5)
- [ ] Infinite scroll loads more surveys (Req 7.6)
- [ ] "High Match" badge at >80% (Req 7.7)
- [ ] Age-restricted surveys hidden from ineligible users (Req 7.8, 30.1, 30.2)
- [ ] URL bypass blocked by server-side age re-validation on load (Req 30.4)
- [ ] Property 7 test passes (100 runs)

---

## Task: 9 — Survey Engine Core

### 1. From tasks.md
- **Sub-steps**:
  - 9.1 Create survey engine foundation
  - 9.2* Write property tests for survey answer handling *(optional)*
  - 9.3 Implement branching logic and screener flow
  - 9.4* Write unit tests for question rendering *(optional)*
- **Requirements**: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7, 9.8, 8.1, 8.2, 8.3, 8.4, 8.5, 8.6, 8.7

### 2. From requirements.md
- **Requirement 9.1**: THE Survey_Engine SHALL render question types including multiple choice, single choice, text input, numeric input, rating scales, matrix questions, and ranking
- **Requirement 9.2**: WHEN a survey loads, THE Survey_Engine SHALL display a progress indicator showing completion percentage
- **Requirement 9.3**: THE Survey_Engine SHALL validate each answer before allowing navigation to the next question
- **Requirement 9.4**: THE Survey_Engine SHALL provide "Previous" and "Next" navigation buttons with appropriate enable/disable states
- **Requirement 9.5**: WHEN a user navigates backward, THE Survey_Engine SHALL preserve previously entered answers
- **Requirement 9.6**: THE Survey_Engine SHALL implement Branching_Logic by showing or hiding questions based on previous answers
- **Requirement 9.7**: THE Survey_Engine SHALL display questions one at a time in a mobile-optimized layout
- **Requirement 9.8**: WHERE a question includes images or media, THE Survey_Engine SHALL load and display them with appropriate fallbacks
- **Requirement 8.1**: WHEN a user selects a survey, THE Survey_Taker_Frontend SHALL check if a Screener is required
- **Requirement 8.2**: WHERE a Screener is required, THE Survey_Taker_Frontend SHALL display the screener questions before the main survey
- **Requirement 8.5**: IF the user qualifies, THEN THE Survey_Taker_Frontend SHALL proceed to the main survey
- **Requirement 8.6**: IF the user does not qualify, THEN THE Survey_Taker_Frontend SHALL display a polite disqualification message and return to the Survey_Feed
- **Requirement 8.7**: THE Survey_Taker_Frontend SHALL not award points for screener completion regardless of qualification result

### 3. From design.md
- **Pattern**: `SurveyEngineProps` with `surveyId`, `onComplete`, `onProgress`; `Question` interface with `type`, `isAttentionCheck`, `isHoneypot`, `branchingLogic`; one question per screen mobile layout
- **Files**: `components/features/survey-engine/SurveyEngine.tsx`, `components/features/survey-engine/questions/`, `components/features/survey-engine/ProgressBar.tsx`, `components/features/survey-engine/Navigation.tsx`, `lib/survey/branchingEngine.ts`
- **Interface**:
```typescript
interface SurveyEngineProps {
  surveyId: string;
  onComplete: (responses: SurveyResponse[]) => void;
  onProgress: (progress: SurveyProgress) => void;
}

interface Question {
  id: string;
  type: QuestionType; // multiple_choice | single_choice | text | numeric | rating | matrix | ranking
  text: string;
  options?: Option[];
  validation: ValidationRule[];
  isRequired: boolean;
  isAttentionCheck: boolean;
  isHoneypot: boolean;
}

interface BranchingRule {
  questionId: string;
  condition: Condition;
  targetQuestionId: string;
  action: 'show' | 'hide' | 'skip';
}
```

### 4. Implementation Summary
- `SurveyEngine.tsx`: manages `currentQuestionIndex`, `responses: Map<questionId, answer>`, `visibleQuestions` (post-branching)
- Question components in `questions/`: `MultipleChoice.tsx`, `SingleChoice.tsx`, `TextInput.tsx`, `NumericInput.tsx`, `RatingScale.tsx`, `MatrixQuestion.tsx`, `RankingQuestion.tsx`
- `ProgressBar.tsx`: `(answeredCount / totalVisible) * 100`
- `Navigation.tsx`: "Previous" disabled on first question; "Next" disabled when current answer fails validation; "Submit" on last question
- `branchingEngine.ts`: evaluates `BranchingRule[]` against current responses, returns `visibleQuestionIds[]`
- Answers stored in `Map` — preserved across back/forward navigation
- Screener phase: `survey.screener` questions rendered first; on completion, POST to backend; `qualified: false` → disqualification screen → back to feed; no points emitted
- Images use `next/image` with `onError` fallback to placeholder
- **Property 8**: Any answer + question type combination is validated correctly before allowing Next
- **Property 9**: For any sequence of answers and backward navigation, all previously stored answers are restored

### 5. Verification
- [ ] All 7 question types render (Req 9.1)
- [ ] Progress bar shows completion % (Req 9.2)
- [ ] Validation blocks Next on invalid answer (Req 9.3)
- [ ] Previous/Next enabled/disabled correctly (Req 9.4)
- [ ] Backward navigation restores answers (Req 9.5)
- [ ] Branching logic shows/hides questions dynamically (Req 9.6)
- [ ] One question per screen on mobile (Req 9.7)
- [ ] Images load with fallback (Req 9.8)
- [ ] Screener shown before main survey when required (Req 8.1, 8.2)
- [ ] Disqualification returns to feed, no points (Req 8.6, 8.7)
- [ ] Property 8, 9 tests pass (100 runs each)

---

## Task: 10 — Auto-Save and Progress Management

### 1. From tasks.md
- **Sub-steps**:
  - 10.1 Implement survey auto-save system
  - 10.2* Write property test for auto-save triggers *(optional)*
  - 10.3 Add auto-save UI indicators and error handling
- **Requirements**: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 24.3, 24.4

### 2. From requirements.md
- **Requirement 10.1**: WHILE a user is taking a survey, THE Survey_Engine SHALL automatically save progress after each answer is submitted
- **Requirement 10.2**: THE Survey_Engine SHALL save progress to the backend every 30 seconds or after each question completion, whichever comes first
- **Requirement 10.3**: WHEN a user returns to an incomplete survey, THE Survey_Engine SHALL restore their progress and resume from the last answered question
- **Requirement 10.4**: IF auto-save fails due to network error, THEN THE Survey_Engine SHALL cache responses locally and retry when connection is restored
- **Requirement 10.5**: THE Survey_Engine SHALL display a visual indicator when auto-save is in progress and when it completes successfully
- **Requirement 10.6**: THE Survey_Engine SHALL expire incomplete surveys after 7 days and remove saved progress
- **Requirement 24.3**: WHILE offline, THE Survey_Taker_Frontend SHALL queue survey responses locally for submission when connection is restored
- **Requirement 24.4**: WHEN connection is restored, THE Survey_Taker_Frontend SHALL automatically sync queued data and dismiss the offline banner

### 3. From design.md
- **Pattern**: `AutoSaveManager` class with `saveQueue: Map<string, SurveyResponse>` and `setInterval(30000)`; IDB for offline cache; `OfflineManager.syncWhenOnline()`
- **Files**: `lib/survey/autoSaveManager.ts`, `lib/offline/offlineManager.ts`, `components/features/survey-engine/SaveIndicator.tsx`
- **Interface**:
```typescript
class AutoSaveManager {
  private saveQueue: Map<string, SurveyResponse>;
  private saveInterval: NodeJS.Timeout | null;
  startAutoSave(): void;
  queueResponse(questionId: string, response: SurveyResponse): void;
  private async processSaveQueue(): Promise<void>;
}
```

### 4. Implementation Summary
- `autoSaveManager.ts`: queues response on every answer; 30s interval flushes queue to backend; on network failure, delegates to `offlineManager.storeOfflineResponse()`; sets expiry timestamp 7 days from creation
- `offlineManager.ts`: IndexedDB store `survey_responses`; `syncWhenOnline()` called on `navigator.onLine` event; removes successfully synced entries
- `SaveIndicator.tsx`: three states — `idle`, `saving` (spinner), `saved` (checkmark fades after 2s), `error` (red X with retry)
- On survey resume: fetch `/api/surveys/{id}/progress` → restore `currentQuestionIndex` and `responses` map
- **Property 10**: For any sequence of answer submissions, `saveQueue` contains each answer after submission (trigger guaranteed)

### 5. Verification
- [ ] Progress saved after each answer (Req 10.1)
- [ ] 30-second interval save fires (Req 10.2)
- [ ] Resume restores from last answered question (Req 10.3)
- [ ] Network failure caches to IDB, retries on reconnect (Req 10.4, 24.3, 24.4)
- [ ] Save indicator shows saving/saved states (Req 10.5)
- [ ] Entries older than 7 days purged (Req 10.6)
- [ ] Property 10 test passes (100 runs)

---

## Task: 11 — Behavioral Tracking System

### 1. From tasks.md
- **Sub-steps**:
  - 11.1 Create behavior tracker foundation
  - 11.2* Write property tests for behavioral data *(optional)*
  - 11.3 Implement advanced behavioral signals
  - 11.4* Write unit tests for behavioral tracking *(optional)*
- **Requirements**: 31.1–31.10, 32.1–32.6, 33.1–33.6, 35.1–35.7

### 2. From requirements.md
- **Requirement 31.1**: WHEN a user starts a survey, THE Behavior_Tracker SHALL record the survey start timestamp
- **Requirement 31.2**: WHEN a user views a question, THE Behavior_Tracker SHALL record the question view timestamp
- **Requirement 31.3**: WHEN a user submits an answer, THE Behavior_Tracker SHALL record the answer submission timestamp and calculate Response_Time
- **Requirement 31.4**: WHILE a user is taking a survey, THE Behavior_Tracker SHALL record mouse movement events with coordinates and timestamps
- **Requirement 31.5**: WHILE a user is taking a survey, THE Behavior_Tracker SHALL record scroll events with scroll position and timestamps
- **Requirement 31.6**: WHILE a user is taking a survey, THE Behavior_Tracker SHALL record focus and blur events for the survey window
- **Requirement 31.7**: WHEN a user clicks on answer options, THE Behavior_Tracker SHALL record click timestamps to detect Click_Pattern
- **Requirement 31.8**: WHEN a user completes a survey, THE Behavior_Tracker SHALL record the survey end timestamp and calculate total completion time
- **Requirement 31.9**: THE Behavior_Tracker SHALL collect behavioral data without impacting survey performance or user experience
- **Requirement 31.10**: THE Behavior_Tracker SHALL store behavioral data in a structured format for submission with survey responses
- **Requirement 32.1**: FOR EACH question answered, THE Behavior_Tracker SHALL calculate Response_Time as the duration between question display and answer submission
- **Requirement 32.4**: THE Behavior_Tracker SHALL flag questions answered in less than 500ms as below Human_Threshold
- **Requirement 33.3**: THE Behavior_Tracker SHALL detect uniform click intervals by calculating standard deviation of inter-click times
- **Requirement 33.4**: THE Behavior_Tracker SHALL flag Click_Pattern as suspicious when standard deviation is below 50ms across 5 or more consecutive clicks
- **Requirement 33.5**: THE Behavior_Tracker SHALL detect rapid sequential clicks when average inter-click time is below 200ms
- **Requirement 35.1**: WHILE a user is taking a survey, THE Behavior_Tracker SHALL track total mouse movement distance in pixels
- **Requirement 35.4**: THE Behavior_Tracker SHALL flag surveys with zero mouse movement as having low Interaction_Depth
- **Requirement 35.6**: THE Behavior_Tracker SHALL detect window focus loss events and record total time spent with survey window out of focus

### 3. From design.md
- **Pattern**: `BehaviorTracker` component with event listeners attached to survey container; `BehavioralSignals` interface; `ResponseTimeTracker` and `ClickPatternAnalyzer` classes; passive event listeners for performance
- **Files**: `lib/fraud/behaviorTracker.ts`, `lib/fraud/responseTimeTracker.ts`, `lib/fraud/clickPatternAnalyzer.ts`, `lib/fraud/interactionDepth.ts`
- **Interface**:
```typescript
interface BehavioralSignals {
  responseTime: number;
  mouseMovements: MouseEvent[];
  scrollEvents: ScrollEvent[];
  clickPatterns: ClickEvent[];
  focusEvents: FocusEvent[];
  interactionDepth: InteractionMetrics;
}

interface InteractionMetrics {
  totalMouseDistance: number;
  uniqueMousePositions: number;
  scrollDistance: number;
  focusLossCount: number;
  focusLossDuration: number;
}
```

### 4. Implementation Summary
- `behaviorTracker.ts`: orchestrates all sub-trackers; attaches `{ passive: true }` event listeners; exposes `start()`, `recordQuestion(id)`, `recordAnswer(id, answer)`, `end()`, `getSignals(): BehavioralSignals`
- `responseTimeTracker.ts`: `performance.now()` on question display; diff on answer submit; flags `< 500ms` as below Human_Threshold
- `clickPatternAnalyzer.ts`: stores click timestamps; computes inter-click intervals; calculates standard deviation; flags `stdDev < 50ms` over 5+ clicks; flags avg interval `< 200ms`
- `interactionDepth.ts`: Euclidean distance accumulation for mouse movements; unique position set; scroll delta sum; `visibilitychange` + `blur/focus` event timing
- All listeners throttled with `requestAnimationFrame` or 100ms debounce to prevent performance impact
- Serialized to `JSON.stringify` / parsed back without data loss
- **Property 14**: Serialize → deserialize `BehavioralSignals` produces identical object
- **Property 15**: `responseTime = answerTimestamp - questionTimestamp` always accurate
- **Property 16**: Standard deviation of inter-click times is mathematically correct

### 5. Verification
- [ ] Survey start timestamp recorded (Req 31.1)
- [ ] Per-question view timestamps recorded (Req 31.2)
- [ ] Response times calculated per question (Req 31.3, 32.1)
- [ ] Mouse movements recorded with coordinates (Req 31.4)
- [ ] Scroll events recorded (Req 31.5)
- [ ] Focus/blur events recorded (Req 31.6)
- [ ] Click timestamps recorded (Req 31.7)
- [ ] Survey end timestamp and total time recorded (Req 31.8)
- [ ] No perceptible performance impact during survey (Req 31.9)
- [ ] Data stored in structured format (Req 31.10)
- [ ] `< 500ms` responses flagged (Req 32.4)
- [ ] Uniform clicks flagged when stdDev < 50ms (Req 33.4)
- [ ] Rapid clicks flagged when avg < 200ms (Req 33.5)
- [ ] Zero mouse movement flagged (Req 35.4)
- [ ] Focus loss time tracked (Req 35.6)
- [ ] Properties 14, 15, 16 pass (100 runs each)

---

## Task: 12 — Fraud Detection Integration

### 1. From tasks.md
- **Sub-steps**:
  - 12.1 Implement fraud score calculation
  - 12.2* Write property tests for fraud detection *(optional)*
  - 12.3 Add attention checks and honeypot questions
  - 12.4* Write integration tests for fraud detection *(optional)*
- **Requirements**: 36.1–36.9, 37.1–37.5, 11.1–11.4, 40.1–40.5, 39.1–39.5, 41.1–41.5

### 2. From requirements.md
- **Requirement 36.2**: THE Fraud_Score_Calculator SHALL compute a weighted score based on Response_Time analysis with weight of 25%
- **Requirement 36.3**: THE Fraud_Score_Calculator SHALL compute a weighted score based on Click_Pattern analysis with weight of 20%
- **Requirement 36.4**: THE Fraud_Score_Calculator SHALL compute a weighted score based on answer pattern analysis with weight of 20%
- **Requirement 36.5**: THE Fraud_Score_Calculator SHALL compute a weighted score based on Interaction_Depth metrics with weight of 20%
- **Requirement 36.6**: THE Fraud_Score_Calculator SHALL compute a weighted score based on Attention_Check results with weight of 15%
- **Requirement 36.7**: THE Fraud_Score_Calculator SHALL normalize the combined weighted score to a Fraud_Confidence_Score between 0 and 100
- **Requirement 36.9**: FOR ALL valid survey responses, THE Fraud_Score_Calculator SHALL produce a Fraud_Confidence_Score within the range 0 to 100
- **Requirement 37.2**: THE Fraud_Score_Calculator SHALL assign Quality_Label "High Quality" for Fraud_Confidence_Score between 0 and 30
- **Requirement 37.3**: THE Fraud_Score_Calculator SHALL assign Quality_Label "Suspicious" for Fraud_Confidence_Score between 31 and 60
- **Requirement 37.4**: THE Fraud_Score_Calculator SHALL assign Quality_Label "Likely Fraud" for Fraud_Confidence_Score between 61 and 100
- **Requirement 40.1**: WHERE a survey includes Honeypot_Question elements, THE Survey_Engine SHALL render them with CSS display:none or visibility:hidden
- **Requirement 40.4**: THE Fraud_Score_Calculator SHALL increase Fraud_Confidence_Score by 30 points if any Honeypot_Question is answered
- **Requirement 41.2**: THE Fraud_Score_Calculator SHALL adjust Human_Threshold based on question complexity and length
- **Requirement 41.3**: THE Fraud_Score_Calculator SHALL reduce Response_Time weight for surveys with fewer than 5 questions
- **Requirement 39.2**: WHEN a survey response has Fraud_Confidence_Score between 61 and 80, THE Survey_Taker_Frontend SHALL display a warning that the response is under extended review
- **Requirement 39.3**: WHEN a survey response has Fraud_Confidence_Score above 80, THE Survey_Taker_Frontend SHALL display a message that the response was flagged for quality review

### 3. From design.md
- **Pattern**: `FraudScoreCalculator` class with `weights` object; `assignQualityLabel(score)` function; `FraudAnalysis` interface; honeypots rendered as `display: none` DOM elements
- **Files**: `lib/fraud/fraudScoreCalculator.ts`, `lib/fraud/answerPatternAnalyzer.ts`, `lib/fraud/adaptiveThresholds.ts`, `components/features/survey-engine/questions/HoneypotField.tsx`
- **Interface**:
```typescript
class FraudScoreCalculator {
  private weights = {
    responseTime: 0.25, clickPattern: 0.20,
    answerPattern: 0.20, interactionDepth: 0.20, attentionCheck: 0.15
  };
  calculateScore(signals: BehavioralSignals): FraudAnalysis;
}

enum QualityLabel {
  HIGH_QUALITY = 'High Quality',   // 0–30
  SUSPICIOUS = 'Suspicious',        // 31–60
  LIKELY_FRAUD = 'Likely Fraud'     // 61–100
}
```

### 4. Implementation Summary
- `fraudScoreCalculator.ts`: computes five sub-scores → weighted sum → `Math.max(0, Math.min(100, Math.round(weightedSum)))`; adds 30 if any honeypot answered (capped at 100)
- `answerPatternAnalyzer.ts`: detects straight-line responses (>80% same answer position); calculates answer variance
- `adaptiveThresholds.ts`: adjusts `Human_Threshold` by question text length; reduces `responseTime` weight to 0.15 for surveys with < 5 questions; applies lenient multiplier for MC-only surveys
- `HoneypotField.tsx`: renders `<input style={{ display: 'none' }} tabIndex={-1} aria-hidden="true">` in natural DOM position; included in submission payload
- Attention check responses validated; failed checks increase attention sub-score
- On submission: score displayed as `Quality_Label`; score 61–80 shows "under extended review" banner; score > 80 shows "flagged for quality review" banner
- **Property 17**: `normalizeFraudScore(x)` always returns value in `[0, 100]` for any float input
- **Property 18**: `assignQualityLabel(score)` follows threshold rules for all integers 0–100
- **Property 19**: `adaptiveThresholds(survey)` returns consistent thresholds for identical survey parameters

### 5. Verification
- [ ] Five weighted signals computed with correct weights (Req 36.2–36.6)
- [ ] Score normalized to 0–100 (Req 36.7, 36.9)
- [ ] Quality labels assigned per thresholds (Req 37.2–37.4)
- [ ] Honeypots rendered as hidden DOM elements (Req 40.1)
- [ ] Honeypot answer adds 30 to score (Req 40.4)
- [ ] Adaptive thresholds applied for < 5 question surveys (Req 41.3)
- [ ] Extended review banner at score 61–80 (Req 39.2)
- [ ] Flagged banner at score > 80 (Req 39.3)
- [ ] Properties 17, 18, 19 pass (100 runs each)

---

## Task: 13 — Survey Submission and Completion

### 1. From tasks.md
- **Sub-steps**:
  - 13.1 Create survey submission flow
  - 13.2* Write property test for duplicate submission prevention *(optional)*
  - 13.3 Integrate behavioral data with submissions
- **Requirements**: 12.1–12.7, 31.10, 38.1–38.5, 39.1–39.2

### 2. From requirements.md
- **Requirement 12.1**: WHEN a user answers the final question, THE Survey_Engine SHALL display a review screen showing completion
- **Requirement 12.2**: THE Survey_Engine SHALL provide a "Submit Survey" button on the review screen
- **Requirement 12.3**: WHEN a user clicks submit, THE Survey_Engine SHALL send all responses to the backend in a single request
- **Requirement 12.4**: WHEN submission is successful, THE Survey_Engine SHALL display a confirmation screen showing Pending_Points earned
- **Requirement 12.5**: IF submission fails, THEN THE Survey_Engine SHALL display an error message and allow retry without losing responses
- **Requirement 12.6**: THE Survey_Engine SHALL prevent duplicate submissions by disabling the submit button after first click
- **Requirement 12.7**: WHEN submission is confirmed, THE Survey_Engine SHALL redirect to the Survey_Feed after 3 seconds
- **Requirement 38.1**: WHEN a user views their survey history, THE Survey_Taker_Frontend SHALL display the Quality_Label for each completed survey
- **Requirement 38.3**: WHERE a response is marked "Suspicious" or "Likely Fraud", THE Survey_Taker_Frontend SHALL display tips for improving response quality
- **Requirement 38.5**: THE Survey_Taker_Frontend SHALL not display the raw Fraud_Confidence_Score to users to prevent gaming the system

### 3. From design.md
- **Pattern**: `useSubmitSurvey` mutation; `onSuccess` invalidates `['surveys']` and `['wallet']`; behavioral metadata merged into submission payload; `isSubmitting` state disables button
- **Files**: `components/features/survey-engine/ReviewScreen.tsx`, `components/features/survey-engine/ConfirmationScreen.tsx`, `hooks/useSubmitSurvey.ts`
- **Interface**:
```typescript
export const useSubmitSurvey = () => {
  return useMutation({
    mutationFn: submitSurveyResponse,
    onSuccess: () => {
      queryClient.invalidateQueries(['surveys']);
      queryClient.invalidateQueries(['wallet']);
    },
  });
};
```

### 4. Implementation Summary
- `ReviewScreen.tsx`: summary of all answers; "Submit Survey" button; on click sets `isSubmitting = true` (disables button immediately)
- `useSubmitSurvey.ts`: merges `surveyResponses` + `behavioralSignals` + `deviceFingerprint` into single POST
- `ConfirmationScreen.tsx`: shows `Pending_Points` earned; shows `Quality_Label` (not raw score); auto-redirect to `/surveys` after 3000ms using `useRouter`
- On mutation error: restore button enabled state; show inline error with retry option; all responses preserved in store
- Quality label in survey history: "Suspicious"/"Likely Fraud" labels show expandable tips panel
- **Property 11**: Rapid repeated clicks on submit produce exactly 1 API call

### 5. Verification
- [ ] Review screen shown after final question (Req 12.1)
- [ ] Submit button present on review (Req 12.2)
- [ ] All responses sent in single request (Req 12.3)
- [ ] Confirmation shows Pending_Points (Req 12.4)
- [ ] Error allows retry without data loss (Req 12.5)
- [ ] Submit disabled after first click (Req 12.6)
- [ ] Redirect to feed after 3 seconds (Req 12.7)
- [ ] Quality label shown in history (Req 38.1)
- [ ] Tips shown for Suspicious/Likely Fraud (Req 38.3)
- [ ] Raw fraud score never exposed (Req 38.5)
- [ ] Behavioral data included in submission (Req 31.10)
- [ ] Property 11 test passes (100 runs)

---

## Task: 14 — Checkpoint — Survey System Complete

### 1. From tasks.md
- **Sub-steps**: Ensure all survey engine tests pass, ask the user if questions arise
- **Requirements**: All requirements from Tasks 8–13

### 2. From requirements.md
- Covers Requirements 7, 8, 9, 10, 11, 12, 31–41

### 3. From design.md
- **Pattern**: Full survey flow verified: feed → screener → survey → behavioral tracking → submission → confirmation → history

### 4. Implementation Summary
- Run full survey test suite: unit, property, integration tests
- Confirm behavioral tracking adds no perceptible latency
- Confirm fraud score calculation correct for edge cases (0-question survey, all honeypots answered)

### 5. Verification
- [ ] All property tests (Properties 7–19) pass with ≥100 runs
- [ ] End-to-end: select survey → complete → see confirmation
- [ ] End-to-end: disqualified screener → back to feed, no points
- [ ] Behavioral data present in every survey submission payload

---

## Task: 15 — Rewards Wallet System

### 1. From tasks.md
- **Sub-steps**:
  - 15.1 Create wallet display components
  - 15.2* Write property tests for currency conversion *(optional)*
  - 15.3 Add wallet filtering and transaction management
  - 15.4* Write unit tests for wallet calculations *(optional)*
- **Requirements**: 13.1–13.8

### 2. From requirements.md
- **Requirement 13.1**: THE Rewards_Wallet SHALL display total Approved_Points, Pending_Points, and lifetime earnings
- **Requirement 13.2**: THE Rewards_Wallet SHALL display a transaction history list showing date, description, amount, and status for each transaction
- **Requirement 13.3**: THE Rewards_Wallet SHALL fetch wallet data from the backend using TanStack Query with automatic refresh
- **Requirement 13.4**: THE Rewards_Wallet SHALL implement pagination for transaction history with 20 transactions per page
- **Requirement 13.5**: THE Rewards_Wallet SHALL provide filter options for transaction type (earned, withdrawn, bonus, penalty)
- **Requirement 13.6**: THE Rewards_Wallet SHALL display the Minimum_Withdrawal_Threshold and indicate when it is met
- **Requirement 13.7**: THE Rewards_Wallet SHALL show estimated approval time for Pending_Points based on Trust_Tier
- **Requirement 13.8**: THE Rewards_Wallet SHALL convert points to local currency (KHR and USD) using current exchange rates

### 3. From design.md
- **Pattern**: TanStack Query for wallet data; `WalletData` interface; paginated `Transaction[]`; currency conversion utility
- **Files**: `app/wallet/page.tsx`, `components/features/wallet/WalletBalance.tsx`, `components/features/wallet/TransactionHistory.tsx`, `components/features/wallet/TransactionFilters.tsx`, `lib/currency/converter.ts`
- **Interface**:
```typescript
interface WalletData {
  approvedPoints: number;
  pendingPoints: number;
  lifetimeEarnings: number;
  transactions: Transaction[];
  withdrawalThreshold: number;
}
```

### 4. Implementation Summary
- `WalletBalance.tsx`: three stat cards — Approved, Pending, Lifetime; green badge on threshold met
- `TransactionHistory.tsx`: paginated list (20/page); each row: date, description, ±amount, status pill
- `TransactionFilters.tsx`: tab-style filter for `earned | withdrawn | bonus | penalty`
- `converter.ts`: `pointsToKHR(points, rate)` and `pointsToUSD(points, rate)`; exchange rates fetched from backend
- Trust-tier-based approval time displayed below Pending_Points balance
- **Property 12**: `pointsToKHR(p, r)` and `pointsToUSD(p, r)` always produce mathematically correct results

### 5. Verification
- [ ] Approved, Pending, Lifetime balances displayed (Req 13.1)
- [ ] Transaction list with date, description, amount, status (Req 13.2)
- [ ] TanStack Query with auto-refresh (Req 13.3)
- [ ] Pagination at 20 per page (Req 13.4)
- [ ] Transaction type filters work (Req 13.5)
- [ ] Threshold indicator shown (Req 13.6)
- [ ] Approval time estimate by Trust_Tier (Req 13.7)
- [ ] KHR and USD conversion displayed (Req 13.8)
- [ ] Property 12 test passes (100 runs)

---

## Task: 16 — Withdrawal and Payout System

### 1. From tasks.md
- **Sub-steps**:
  - 16.1 Create withdrawal request form
  - 16.2* Write property test for mobile wallet validation *(optional)*
  - 16.3 Implement payout history and status tracking
  - 16.4* Write integration tests for withdrawal flow *(optional)*
- **Requirements**: 14.1–14.8, 15.1–15.5

### 2. From requirements.md
- **Requirement 14.1**: WHEN Approved_Points meet or exceed the Minimum_Withdrawal_Threshold, THE Rewards_Wallet SHALL enable the withdrawal button
- **Requirement 14.2**: WHEN a user initiates withdrawal, THE Survey_Taker_Frontend SHALL display a withdrawal form with Mobile_Wallet options (ABA Pay, WING, TrueMoney, Bank Transfer)
- **Requirement 14.3**: THE Survey_Taker_Frontend SHALL validate Mobile_Wallet account numbers according to each provider's format requirements
- **Requirement 14.4**: THE Survey_Taker_Frontend SHALL display withdrawal fees and final amount to be received before confirmation
- **Requirement 14.5**: WHEN a user confirms withdrawal, THE Survey_Taker_Frontend SHALL submit the request to the Payout_Service
- **Requirement 14.6**: WHEN withdrawal request is successful, THE Survey_Taker_Frontend SHALL display confirmation with estimated processing time
- **Requirement 14.7**: IF withdrawal request fails, THEN THE Survey_Taker_Frontend SHALL display specific error messages and allow retry
- **Requirement 14.8**: THE Survey_Taker_Frontend SHALL prevent multiple simultaneous withdrawal requests by disabling the button while one is pending
- **Requirement 15.2**: FOR EACH payout request, THE Rewards_Wallet SHALL display date, amount, Mobile_Wallet provider, account number (masked), and status
- **Requirement 15.3**: THE Rewards_Wallet SHALL display payout statuses including Pending, Processing, Completed, and Failed
- **Requirement 15.4**: WHERE a payout has failed, THE Rewards_Wallet SHALL display the failure reason
- **Requirement 15.5**: THE Rewards_Wallet SHALL allow users to retry failed payouts from the history view

### 3. From design.md
- **Pattern**: `WithdrawalRequest` interface; Zod validation per provider format; fee calculation before confirmation step
- **Files**: `components/features/wallet/WithdrawalForm.tsx`, `components/features/wallet/PayoutHistory.tsx`, `lib/validation/walletSchemas.ts`
- **Interface**:
```typescript
interface WithdrawalRequest {
  amount: number;
  provider: PaymentProvider; // ABA_PAY | WING | TRUE_MONEY | BANK_TRANSFER
  accountNumber: string;
  fees: number;
}
```

### 4. Implementation Summary
- `WithdrawalForm.tsx`: provider selector → account number input → fee/net display → confirm button; withdrawal button disabled when points < threshold or pending request in flight
- `walletSchemas.ts`: per-provider Zod regex — ABA (9-digit), WING (9-digit), TrueMoney (10-digit), Bank (16-digit IBAN-style)
- Two-step flow: entry → confirmation screen showing `amount`, `fees`, `net`; on confirm POST to Payout_Service
- `PayoutHistory.tsx`: list with masked account `****1234`; status pills (Pending/Processing/Completed/Failed); failed rows show reason + "Retry" button
- **Property 13**: Each provider's validator accepts all valid formats and rejects all invalid ones

### 5. Verification
- [ ] Withdrawal button enabled only at threshold (Req 14.1)
- [ ] Four provider options in form (Req 14.2)
- [ ] Account number validated per provider (Req 14.3)
- [ ] Fees and net amount shown before confirm (Req 14.4)
- [ ] Request submitted to Payout_Service (Req 14.5)
- [ ] Success confirmation with processing time (Req 14.6)
- [ ] Specific error messages on failure + retry (Req 14.7)
- [ ] Button disabled while request pending (Req 14.8)
- [ ] Payout history shows masked account and status (Req 15.2, 15.3)
- [ ] Failure reason displayed (Req 15.4)
- [ ] Retry button on failed payouts (Req 15.5)
- [ ] Property 13 test passes (100 runs)

---

## Task: 17 — Trust Tier and Reputation System

### 1. From tasks.md
- **Sub-steps**:
  - 17.1 Create trust tier display components
  - 17.2 Add achievement and streak tracking
- **Requirements**: 16.1–16.6

### 2. From requirements.md
- **Requirement 16.1**: THE Survey_Taker_Frontend SHALL display the user's current Trust_Tier with visual badge
- **Requirement 16.2**: THE Survey_Taker_Frontend SHALL display Trust_Tier benefits including payout speed and survey access level
- **Requirement 16.3**: THE Survey_Taker_Frontend SHALL show progress toward the next Trust_Tier with specific requirements
- **Requirement 16.4**: THE Survey_Taker_Frontend SHALL display reputation metrics including surveys completed, accuracy score, and account age
- **Requirement 16.5**: WHERE a user has earned badges, THE Survey_Taker_Frontend SHALL display them in the profile section
- **Requirement 16.6**: THE Survey_Taker_Frontend SHALL display streak information for consecutive days with survey completions

### 3. From design.md
- **Pattern**: `TrustTier` interface with `level`, `benefits`, `requirements`, `progress`; badge components per tier
- **Files**: `components/features/reputation/TrustTierBadge.tsx`, `components/features/reputation/TierProgress.tsx`, `components/features/reputation/BadgeDisplay.tsx`, `components/features/reputation/StreakCounter.tsx`
- **Interface**:
```typescript
interface TrustTier {
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  benefits: TierBenefits;
  requirements: TierRequirements;
  progress: number; // 0-100%
}
```

### 4. Implementation Summary
- `TrustTierBadge.tsx`: colored badge (Bronze/Silver/Gold/Platinum) with tier name
- `TierProgress.tsx`: progress bar to next tier; lists specific requirements (e.g., "Complete 50 more surveys")
- `BadgeDisplay.tsx`: grid of earned badge icons in profile section
- `StreakCounter.tsx`: flame icon with consecutive days count; resets on missed day

### 5. Verification
- [ ] Tier badge with current level displayed (Req 16.1)
- [ ] Benefits (payout speed, access level) shown (Req 16.2)
- [ ] Progress to next tier with requirements (Req 16.3)
- [ ] Surveys completed, accuracy, account age shown (Req 16.4)
- [ ] Earned badges displayed in profile (Req 16.5)
- [ ] Streak counter for consecutive completion days (Req 16.6)

---

## Task: 18 — Survey History and Analytics

### 1. From tasks.md
- **Sub-steps**:
  - 18.1 Create survey history interface
  - 18.2 Add quality metrics and feedback
- **Requirements**: 17.1–17.6, 38.4, 38.5, 45.1–45.3

### 2. From requirements.md
- **Requirement 17.1**: THE Survey_Taker_Frontend SHALL provide a survey history page showing all completed surveys
- **Requirement 17.2**: FOR EACH completed survey, THE Survey_Taker_Frontend SHALL display title, completion date, time spent, points earned, and status
- **Requirement 17.3**: THE Survey_Taker_Frontend SHALL display survey statuses including Completed, Under Review, Approved, and Rejected
- **Requirement 17.4**: WHERE a survey was rejected, THE Survey_Taker_Frontend SHALL display the rejection reason
- **Requirement 17.5**: THE Survey_Taker_Frontend SHALL implement pagination for survey history with 20 surveys per page
- **Requirement 17.6**: THE Survey_Taker_Frontend SHALL provide filter options for date range and status
- **Requirement 38.4**: THE Survey_Taker_Frontend SHALL display aggregate quality metrics including average quality score and percentage of high-quality responses
- **Requirement 45.1**: WHERE a survey response is rejected due to high Fraud_Confidence_Score, THE Survey_Taker_Frontend SHALL display an "Appeal" button
- **Requirement 45.2**: WHEN a user clicks "Appeal", THE Survey_Taker_Frontend SHALL display a form allowing the user to explain their case
- **Requirement 45.3**: THE Survey_Taker_Frontend SHALL submit the appeal to the manual review queue with high priority

### 3. From design.md
- **Pattern**: Paginated list with TanStack Query; `QualityLabel` displayed per row; appeal form modal
- **Files**: `app/history/page.tsx`, `components/features/history/SurveyHistoryList.tsx`, `components/features/history/HistoryFilters.tsx`, `components/features/history/QualityMetricsSummary.tsx`, `components/features/history/AppealForm.tsx`

### 4. Implementation Summary
- `SurveyHistoryList.tsx`: 20/page pagination; each row: title, date, duration, points, status pill, Quality_Label chip; rejected rows expand to show reason + Appeal button
- `HistoryFilters.tsx`: date-range picker + status multi-select
- `QualityMetricsSummary.tsx`: aggregate card showing avg quality label distribution and % high-quality
- `AppealForm.tsx`: modal triggered by Appeal button; text area for explanation; on submit POST to `/api/appeals` with `priority: high`; appeal status shown in history row

### 5. Verification
- [ ] History page with all completed surveys (Req 17.1)
- [ ] Each row shows title, date, time, points, status (Req 17.2)
- [ ] Four status types rendered (Req 17.3)
- [ ] Rejection reason displayed (Req 17.4)
- [ ] Pagination at 20/page (Req 17.5)
- [ ] Date range and status filters (Req 17.6)
- [ ] Aggregate quality metrics shown (Req 38.4)
- [ ] Appeal button on rejected responses (Req 45.1)
- [ ] Appeal form with explanation field (Req 45.2)
- [ ] Appeal submitted with high priority (Req 45.3)

---

## Task: 19 — Notification System

### 1. From tasks.md
- **Sub-steps**:
  - 19.1 Create notification center
  - 19.2 Implement push notification support
  - 19.3* Write integration tests for notifications *(optional)*
- **Requirements**: 18.1–18.7, 19.1–19.5

### 2. From requirements.md
- **Requirement 18.1**: THE Survey_Taker_Frontend SHALL display a notification bell icon with unread count badge in the header
- **Requirement 18.3**: THE Survey_Taker_Frontend SHALL fetch notifications from the backend using TanStack Query with polling every 60 seconds
- **Requirement 18.5**: WHEN a user clicks a notification, THE Survey_Taker_Frontend SHALL mark it as read and navigate to the relevant page
- **Requirement 18.6**: THE Survey_Taker_Frontend SHALL provide a "Mark all as read" action in the notification dropdown
- **Requirement 19.1**: THE Survey_Taker_Frontend SHALL prompt users to enable push notifications after first login
- **Requirement 19.3**: THE Survey_Taker_Frontend SHALL allow users to manage push notification preferences in settings
- **Requirement 19.4**: THE Survey_Taker_Frontend SHALL provide granular controls for notification types (new surveys, rewards, payouts, promotions)
- **Requirement 19.5**: WHEN push notification permission is denied, THE Survey_Taker_Frontend SHALL not repeatedly prompt but show a settings link

### 3. From design.md
- **Pattern**: TanStack Query polling `refetchInterval: 60000`; `Notification` interface; `NotificationType` enum; SSE-ready architecture
- **Files**: `components/layout/NotificationBell.tsx`, `components/features/notifications/NotificationDropdown.tsx`, `app/settings/notifications/page.tsx`, `hooks/useNotifications.ts`
- **Interface**:
```typescript
interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: Date;
  isRead: boolean;
  actionUrl?: string;
}
```

### 4. Implementation Summary
- `NotificationBell.tsx`: bell icon in header; red badge with unread count (hidden at 0)
- `NotificationDropdown.tsx`: click to open; list of recent notifications; "Mark all as read" button; click navigates to `actionUrl` and POSTs read status
- `useNotifications.ts`: `useQuery` with `refetchInterval: 60000`
- Push permission prompt shown once after first login (stored in localStorage to prevent re-prompting); on deny, shows link to `/settings/notifications`
- `/settings/notifications`: toggle switches per `NotificationType`

### 5. Verification
- [ ] Bell with unread badge in header (Req 18.1)
- [ ] Dropdown shows recent notifications (Req 18.2)
- [ ] 60-second polling (Req 18.3)
- [ ] Click marks read + navigates (Req 18.5)
- [ ] "Mark all as read" action works (Req 18.6)
- [ ] Push permission prompt after first login (Req 19.1)
- [ ] No repeated prompts on deny; settings link shown (Req 19.5)
- [ ] Granular notification type controls (Req 19.4)

---

## Task: 20 — Real-time Features and SSE

### 1. From tasks.md
- **Sub-steps**:
  - 20.1 Implement Server-Sent Events connection
  - 20.2 Add real-time wallet updates
- **Requirements**: 18.3, 25.1, 13.3

### 2. From requirements.md
- **Requirement 18.3**: THE Survey_Taker_Frontend SHALL fetch notifications from the backend using TanStack Query with polling every 60 seconds
- **Requirement 13.3**: THE Rewards_Wallet SHALL fetch wallet data from the backend using TanStack Query with automatic refresh

### 3. From design.md
- **Pattern**: `NotificationService` class with `EventSource`; exponential backoff reconnection; `notificationStore.addNotification()`; browser Notification API
- **Files**: `lib/realtime/notificationService.ts`, `hooks/useSSE.ts`
- **Interface**:
```typescript
class NotificationService {
  private eventSource: EventSource | null;
  connect(): void;
  private handleNotification(notification: Notification): void;
  private getBackoffDelay(): number;
}
```

### 4. Implementation Summary
- `notificationService.ts`: `new EventSource('/api/notifications/stream')`; `onmessage` dispatches to Zustand notification store; `onerror` triggers exponential backoff reconnect (1s, 2s, 4s… max 30s)
- Browser push notification fires if `Notification.permission === 'granted'`
- Wallet query uses `refetchOnWindowFocus: true` + `staleTime: 30000` for near-real-time balance updates
- SSE events for `points_approved` and `payout_completed` also invalidate wallet query

### 5. Verification
- [ ] SSE connection established on app load
- [ ] Notifications appear in real-time via SSE
- [ ] Exponential backoff on SSE disconnect
- [ ] Wallet balance refreshes on window focus (Req 13.3)
- [ ] Browser notification fires when permission granted

---

## Task: 21 — Offline Capabilities

### 1. From tasks.md
- **Sub-steps**:
  - 21.1 Implement service worker for offline support
  - 21.2 Add offline data synchronization
- **Requirements**: 24.1–24.5, 10.4

### 2. From requirements.md
- **Requirement 24.1**: WHEN network connection is lost, THE Survey_Taker_Frontend SHALL display an offline indicator banner
- **Requirement 24.2**: WHILE offline, THE Survey_Taker_Frontend SHALL allow viewing of previously loaded content from cache
- **Requirement 24.3**: WHILE offline, THE Survey_Taker_Frontend SHALL queue survey responses locally for submission when connection is restored
- **Requirement 24.4**: WHEN connection is restored, THE Survey_Taker_Frontend SHALL automatically sync queued data and dismiss the offline banner
- **Requirement 24.5**: THE Survey_Taker_Frontend SHALL prevent starting new surveys while offline

### 3. From design.md
- **Pattern**: Service Worker with cache-first for static; network-first for API; `background-sync` tag `survey-response`; `IDBDatabase` for offline queue
- **Files**: `public/sw.js`, `lib/offline/offlineManager.ts`, `components/ui/OfflineBanner.tsx`

### 4. Implementation Summary
- `sw.js`: cache-first for `/api/surveys/` (serve cached data while offline); background sync on `sync` event tag `survey-response`
- `OfflineBanner.tsx`: sticky top banner triggered by `navigator.onLine` event; auto-dismisses on reconnect
- `offlineManager.ts`: IDB write on save failure; `syncWhenOnline()` on `online` event; removes synced entries
- `"Start Survey"` button checks `navigator.onLine`; shows tooltip "No internet connection" when offline

### 5. Verification
- [ ] Offline banner shown on disconnect (Req 24.1)
- [ ] Cached survey data viewable offline (Req 24.2)
- [ ] Responses queued to IDB offline (Req 24.3)
- [ ] Auto-sync and banner dismiss on reconnect (Req 24.4)
- [ ] New survey start blocked offline (Req 24.5)

---

## Task: 22 — Error Handling and Loading States

### 1. From tasks.md
- **Sub-steps**:
  - 22.1 Implement comprehensive error boundaries
  - 22.2 Add loading states and skeleton screens
  - 22.3* Write unit tests for error handling *(optional)*
- **Requirements**: 23.1–23.6, 22.1–22.5

### 2. From requirements.md
- **Requirement 22.1**: WHEN data is being fetched, THE Survey_Taker_Frontend SHALL display loading skeletons matching the expected content layout
- **Requirement 22.2**: THE Survey_Taker_Frontend SHALL display a loading spinner for actions that take longer than 300ms
- **Requirement 22.3**: THE Survey_Taker_Frontend SHALL disable interactive elements during loading to prevent duplicate submissions
- **Requirement 23.1**: WHEN an API request fails, THE Survey_Taker_Frontend SHALL display user-friendly error messages in the selected language
- **Requirement 23.2**: THE Survey_Taker_Frontend SHALL distinguish between network errors, validation errors, and server errors
- **Requirement 23.3**: WHERE an error is recoverable, THE Survey_Taker_Frontend SHALL provide a retry action
- **Requirement 23.5**: WHEN a critical error occurs, THE Survey_Taker_Frontend SHALL display an error boundary with option to reload or return home
- **Requirement 23.6**: THE Survey_Taker_Frontend SHALL display field-level validation errors inline below the relevant input

### 3. From design.md
- **Pattern**: `SurveyErrorBoundary` class component; `ApiErrorHandler.handle()` mapping status codes to user messages; skeleton components per content type
- **Files**: `components/ui/ErrorBoundary.tsx`, `components/ui/ErrorFallback.tsx`, `components/ui/skeletons/`, `lib/api/errorHandler.ts`
- **Interface**:
```typescript
class ApiErrorHandler {
  static handle(error: AxiosError): UserFriendlyError {
    // 422 → validation | 429 → rate_limit | no response → network | else → server
  }
}
```

### 4. Implementation Summary
- `ErrorBoundary.tsx`: wraps page sections; `componentDidCatch` logs to monitoring; renders `ErrorFallback` with "Reload" and "Go Home" buttons
- `errorHandler.ts`: maps 422 → validation (field errors), 429 → rate limit (retry-after), no response → network, else → server
- Skeleton components: `SurveyFeedSkeleton`, `WalletSkeleton`, `ProfileSkeleton` — match exact layout of real content
- Spinner shown for mutations taking > 300ms via `useTransition` or manual timer
- All interactive elements receive `disabled={isLoading}`

### 5. Verification
- [ ] Skeletons match content layout (Req 22.1)
- [ ] Spinner for actions > 300ms (Req 22.2)
- [ ] Elements disabled during loading (Req 22.3)
- [ ] Localized error messages (Req 23.1)
- [ ] Network/validation/server errors distinguished (Req 23.2)
- [ ] Retry action on recoverable errors (Req 23.3)
- [ ] Error boundary with reload/home options (Req 23.5)
- [ ] Field-level validation errors inline (Req 23.6)

---

## Task: 23 — Session Management and Security

### 1. From tasks.md
- **Sub-steps**:
  - 23.1 Implement session timeout handling
  - 23.2 Add security headers and input sanitization
- **Requirements**: 25.1–25.5, 29.1–29.5

### 2. From requirements.md
- **Requirement 25.3**: THE Survey_Taker_Frontend SHALL implement a session timeout warning 2 minutes before expiration
- **Requirement 25.4**: WHEN session timeout warning appears, THE Survey_Taker_Frontend SHALL provide an option to extend the session
- **Requirement 25.5**: THE Survey_Taker_Frontend SHALL log out the user and clear all stored data when session expires
- **Requirement 29.2**: THE Survey_Taker_Frontend SHALL use httpOnly and secure flags for all cookies
- **Requirement 29.3**: THE Survey_Taker_Frontend SHALL implement CSRF protection for all state-changing requests
- **Requirement 29.4**: THE Survey_Taker_Frontend SHALL sanitize all user-generated content before rendering
- **Requirement 29.5**: THE Survey_Taker_Frontend SHALL not expose sensitive data in URLs or browser history

### 3. From design.md
- **Pattern**: `InputSanitizer` with DOMPurify; security headers array in `next.config.js`; JWT expiry check with 2-minute warning modal
- **Files**: `lib/security/sanitizer.ts`, `components/ui/SessionWarningModal.tsx`, `lib/auth/sessionManager.ts`

### 4. Implementation Summary
- `sessionManager.ts`: decode JWT expiry; set `setTimeout` for `(expiry - 2min)` to show warning modal; second timer at expiry calls `logout()` + clears all cookies/localStorage
- `SessionWarningModal.tsx`: countdown display; "Extend Session" button triggers token refresh
- `sanitizer.ts`: `DOMPurify.sanitize()` with allowlist `['b', 'i', 'em', 'strong']` for any user HTML; `sanitizeText()` strips `<>` and trims
- CSRF: double-submit cookie pattern; `X-CSRF-Token` header on all mutations
- Sensitive data (tokens, account numbers) never appear in URL params; `history.replaceState` cleans confirmation URLs

### 5. Verification
- [ ] Warning modal 2 minutes before expiry (Req 25.3)
- [ ] Session extension option in warning (Req 25.4)
- [ ] Auto-logout and data clear on expiry (Req 25.5)
- [ ] All cookies have httpOnly + secure flags (Req 29.2)
- [ ] CSRF token on all state-changing requests (Req 29.3)
- [ ] User content sanitized with DOMPurify (Req 29.4)
- [ ] No sensitive data in URLs (Req 29.5)

---

## Task: 24 — Accessibility Implementation

### 1. From tasks.md
- **Sub-steps**:
  - 24.1 Add comprehensive accessibility features
  - 24.2 Create accessible form and survey components
  - 24.3* Write accessibility tests *(optional)*
- **Requirements**: 26.1–26.6

### 2. From requirements.md
- **Requirement 26.1**: THE Survey_Taker_Frontend SHALL implement ARIA labels and roles for all interactive elements
- **Requirement 26.2**: THE Survey_Taker_Frontend SHALL support full keyboard navigation with visible focus indicators
- **Requirement 26.3**: THE Survey_Taker_Frontend SHALL maintain color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text
- **Requirement 26.4**: THE Survey_Taker_Frontend SHALL provide text alternatives for all images and icons
- **Requirement 26.5**: THE Survey_Taker_Frontend SHALL announce dynamic content changes to screen readers using ARIA live regions
- **Requirement 26.6**: THE Survey_Taker_Frontend SHALL allow text resizing up to 200% without loss of functionality

### 3. From design.md
- **Pattern**: WCAG 2.1 AA; Tailwind focus-ring utilities; `aria-live="polite"` for dynamic regions; `rem`-based sizing
- **Files**: `styles/globals.css` (focus styles), accessible versions of all form and survey components

### 4. Implementation Summary
- All buttons: `aria-label` or visible text; all inputs: `aria-describedby` pointing to error messages
- Survey navigation: full keyboard support; `Tab` moves between questions; `Enter`/`Space` selects options
- Focus indicators: Tailwind `focus-visible:ring-2 focus-visible:ring-offset-2` on all interactive elements
- `aria-live="polite"` div updated on: survey save, notification arrival, wallet balance change, error messages
- All `<img>` and SVG icons have `alt` text or `aria-hidden="true"` where decorative
- Layout uses `rem` units; tested at 200% browser zoom without horizontal scroll or element overlap

### 5. Verification
- [ ] ARIA labels on all interactive elements (Req 26.1)
- [ ] Full keyboard navigation works (Req 26.2)
- [ ] Color contrast ≥ 4.5:1 for body text (Req 26.3)
- [ ] All images/icons have alt text (Req 26.4)
- [ ] Dynamic changes announced via aria-live (Req 26.5)
- [ ] Layout intact at 200% text size (Req 26.6)

---

## Task: 25 — Performance Optimization

### 1. From tasks.md
- **Sub-steps**:
  - 25.1 Implement code splitting and lazy loading
  - 25.2 Add caching and compression
  - 25.3* Write performance tests *(optional)*
- **Requirements**: 27.1–27.6, 21.7

### 2. From requirements.md
- **Requirement 27.1**: THE Survey_Taker_Frontend SHALL achieve a First Contentful Paint under 1.5 seconds on 3G connections
- **Requirement 27.2**: THE Survey_Taker_Frontend SHALL implement code splitting to load only necessary JavaScript for each route
- **Requirement 27.3**: THE Survey_Taker_Frontend SHALL lazy load images below the fold with placeholder loading states
- **Requirement 27.4**: THE Survey_Taker_Frontend SHALL cache static assets with appropriate cache headers
- **Requirement 27.5**: THE Survey_Taker_Frontend SHALL prefetch data for likely next pages using TanStack Query
- **Requirement 27.6**: THE Survey_Taker_Frontend SHALL compress images and use modern formats (WebP) with fallbacks
- **Requirement 21.7**: THE Survey_Taker_Frontend SHALL load images responsively based on device screen size and pixel density

### 3. From design.md
- **Pattern**: Next.js App Router automatic code splitting; `next/image` for WebP + responsive srcset; TanStack Query `prefetchQuery` on hover; `Cache-Control: public, max-age=31536000, immutable` for hashed assets

### 4. Implementation Summary
- App Router provides automatic per-route code splitting; large feature components wrapped in `dynamic(() => import(...), { loading: () => <Skeleton /> })`
- `next/image` for all images: `loading="lazy"` below fold; `sizes` prop for responsive srcset; automatic WebP with `<picture>` fallback
- `prefetchQuery` triggered on survey card hover for survey detail data
- Static assets served with immutable cache headers; `next/font` for self-hosted fonts
- Lighthouse CI run in PR pipeline to gate FCP < 1.5s on simulated 3G

### 5. Verification
- [ ] FCP < 1.5s on 3G (Lighthouse CI) (Req 27.1)
- [ ] Route-based code splitting active (Req 27.2)
- [ ] Images below fold lazy-loaded (Req 27.3)
- [ ] Static assets have immutable cache headers (Req 27.4)
- [ ] TanStack Query prefetches on hover (Req 27.5)
- [ ] WebP served with PNG/JPEG fallback (Req 27.6)
- [ ] Responsive srcset on all images (Req 21.7)

---

## Task: 26 — Analytics and Monitoring

### 1. From tasks.md
- **Sub-steps**:
  - 26.1 Implement user analytics tracking
  - 26.2 Add error monitoring and reporting
- **Requirements**: 28.1–28.5, 23.4

### 2. From requirements.md
- **Requirement 28.1**: THE Survey_Taker_Frontend SHALL track page views for all major routes
- **Requirement 28.2**: THE Survey_Taker_Frontend SHALL track user actions including survey starts, completions, and abandonments
- **Requirement 28.3**: THE Survey_Taker_Frontend SHALL track conversion funnel events from registration through first payout
- **Requirement 28.4**: THE Survey_Taker_Frontend SHALL send analytics events to the backend without blocking user interactions
- **Requirement 28.5**: THE Survey_Taker_Frontend SHALL respect user privacy preferences and not track users who opt out
- **Requirement 23.4**: THE Survey_Taker_Frontend SHALL log detailed error information to the console for debugging without exposing it to users

### 3. From design.md
- **Pattern**: Non-blocking `navigator.sendBeacon` for analytics; error monitoring service integration; consent check before tracking
- **Files**: `lib/analytics/tracker.ts`, `lib/monitoring/errorReporter.ts`

### 4. Implementation Summary
- `tracker.ts`: `track(event, properties)` checks consent store before firing; uses `navigator.sendBeacon` to POST to `/api/analytics` non-blocking; page views auto-tracked in root layout `useEffect`
- Funnel events: `registration_started`, `registration_completed`, `phone_verified`, `first_survey_started`, `first_survey_completed`, `first_payout_requested`, `first_payout_completed`
- `errorReporter.ts`: `captureException(error, context)` sends to monitoring service; console.error for dev; never surfaces stack traces in UI
- Consent check: reads from consent store; opted-out users skip all `tracker.track()` calls

### 5. Verification
- [ ] Page views tracked for all routes (Req 28.1)
- [ ] Survey start/complete/abandon events tracked (Req 28.2)
- [ ] Funnel events tracked registration → payout (Req 28.3)
- [ ] Analytics non-blocking (sendBeacon) (Req 28.4)
- [ ] Opted-out users not tracked (Req 28.5)
- [ ] Errors logged to console, never shown in UI (Req 23.4)

---

## Task: 27 — Admin and Review Interfaces

### 1. From tasks.md
- **Sub-steps**:
  - 27.1 Create fraud detection dashboard
  - 27.2 Add manual review and appeal system
- **Requirements**: 42.1–42.6, 43.1–43.6, 45.4–45.5

### 2. From requirements.md
- **Requirement 42.1**: THE Survey_Taker_Frontend SHALL provide an admin dashboard displaying fraud detection statistics
- **Requirement 42.2**: THE dashboard SHALL display distribution of Fraud_Confidence_Score across all responses
- **Requirement 42.3**: THE dashboard SHALL display trends over time for average Fraud_Confidence_Score and Quality_Label distribution
- **Requirement 42.5**: THE dashboard SHALL allow filtering by survey, date range, and user Trust_Tier
- **Requirement 43.1**: THE Survey_Taker_Frontend SHALL provide a manual review queue showing responses with Fraud_Confidence_Score above 60
- **Requirement 43.3**: THE review interface SHALL display visualizations of Response_Time, Click_Pattern, and Interaction_Depth metrics
- **Requirement 43.4**: THE review interface SHALL allow reviewers to mark responses as "Confirmed Fraud", "False Positive", or "Uncertain"
- **Requirement 43.5**: WHEN a reviewer marks a response as "False Positive", THE Survey_Taker_Frontend SHALL approve the Pending_Points and update the user's Trust_Tier positively
- **Requirement 44.2**: THE Survey_Taker_Frontend SHALL provide an export function for behavioral data and review outcomes in CSV or JSON format

### 3. From design.md
- **Pattern**: Admin-only routes under `/admin/`; fraud score distribution histogram; behavioral signal visualizations; role-based access control
- **Files**: `app/admin/fraud/page.tsx`, `app/admin/review/page.tsx`, `components/features/admin/FraudDashboard.tsx`, `components/features/admin/ReviewQueue.tsx`, `components/features/admin/BehavioralCharts.tsx`

### 4. Implementation Summary
- `/admin/fraud`: score distribution histogram (recharts); trend line chart over time; filter controls (survey, date range, trust tier); KPI cards: avg score, % high quality, false positive rate
- `/admin/review`: queue of responses with score > 60; each row expandable to show: full answers, behavioral timeline chart (response times per question), click interval scatter plot, interaction depth heatmap
- Reviewer actions: three-button decision (`Confirmed Fraud` / `False Positive` / `Uncertain`) + notes textarea; on `False Positive` — API call to approve points + positive trust tier adjustment
- Export button: CSV or JSON download of behavioral data + review outcomes for ML team
- A/B testing configuration panel for threshold experimentation

### 5. Verification
- [ ] Admin fraud dashboard with score distribution (Req 42.1, 42.2)
- [ ] Trend charts over time (Req 42.3)
- [ ] Filters for survey/date/tier (Req 42.5)
- [ ] Review queue for score > 60 (Req 43.1)
- [ ] Behavioral visualizations in review (Req 43.3)
- [ ] Three decision options for reviewer (Req 43.4)
- [ ] False Positive triggers points approval + tier update (Req 43.5)
- [ ] CSV/JSON export available (Req 44.2)

---

## Task: 28 — Testing Suite Setup

### 1. From tasks.md
- **Sub-steps**:
  - 28.1* Set up comprehensive testing framework *(optional)*
  - 28.2* Create property-based test suite *(optional)*
  - 28.3* Add integration and E2E test suites *(optional)*
- **Requirements**: All requirements (cross-cutting)

### 2. From requirements.md
- Validates all acceptance criteria via automated tests

### 3. From design.md
- **Pattern**: Vitest + React Testing Library + Playwright + fast-check; property tests minimum 100 runs; tagged with feature + property ID
- **Files**: `vitest.config.ts`, `playwright.config.ts`, `tests/unit/`, `tests/property/`, `tests/integration/`, `tests/e2e/`
- **Interface**:
```typescript
// Property test template
fc.assert(fc.property(
  fc.integer({ min: 0, max: 100 }),
  (fraudScore) => {
    const label = assignQualityLabel(fraudScore);
    if (fraudScore <= 30) return label === 'High Quality';
    if (fraudScore <= 60) return label === 'Suspicious';
    return label === 'Likely Fraud';
  }
), { numRuns: 100 });
```

### 4. Implementation Summary
- `vitest.config.ts`: jsdom environment; coverage threshold 80%; aliases mirror `tsconfig`
- `playwright.config.ts`: Chromium + Firefox + WebKit; base URL staging; screenshot on failure
- Property tests in `tests/property/` covering all 19 properties from design doc; each tagged with `// Feature: survey-taker-frontend, Property N`
- E2E critical paths: full registration flow, complete survey with behavioral tracking, withdrawal request
- `axe-core` integrated in React Testing Library setup for automated a11y checks

### 5. Verification
- [ ] Vitest runs with ≥80% coverage
- [ ] All 19 property tests pass with ≥100 runs each
- [ ] Playwright E2E passes on Chromium/Firefox/WebKit
- [ ] axe-core reports zero violations on all pages

---

## Task: 29 — Final Integration and Polish

### 1. From tasks.md
- **Sub-steps**:
  - 29.1 Complete mobile responsiveness testing
  - 29.2 Final security and performance audit
  - 29.3 Production deployment preparation
- **Requirements**: 21.1–21.7, 29.1, 27.1, 26.1

### 2. From requirements.md
- **Requirement 21.2**: THE Survey_Taker_Frontend SHALL display optimally on screen sizes from 320px to 2560px width
- **Requirement 21.3**: THE Survey_Taker_Frontend SHALL use touch-friendly UI elements with minimum 44px tap targets
- **Requirement 21.4**: THE Survey_Taker_Frontend SHALL optimize form inputs for mobile keyboards with appropriate input types
- **Requirement 21.5**: THE Survey_Taker_Frontend SHALL implement swipe gestures for survey navigation on touch devices
- **Requirement 21.6**: THE Survey_Taker_Frontend SHALL prevent zoom on form inputs while maintaining accessibility

### 3. From design.md
- **Pattern**: Playwright viewport testing at 320px, 768px, 1280px, 2560px; touch-action CSS for swipe; `inputmode` attributes on inputs; `touch-action: pan-y` for survey swipe

### 4. Implementation Summary
- Playwright visual regression tests at 4 breakpoints (320/768/1280/2560px)
- All tap targets verified ≥ 44px via automated Playwright measurements
- Phone inputs: `type="tel"`, OTP: `inputmode="numeric"`, email: `type="email"`, numbers: `inputmode="decimal"`
- Swipe gesture on survey: `HammerJS` or custom Pointer Events handler; left swipe = Next, right swipe = Previous
- `font-size: 16px` on all inputs prevents iOS zoom; `touch-action: manipulation` suppresses double-tap zoom
- CI/CD: GitHub Actions pipeline with lint → type-check → unit → property → E2E → Lighthouse → deploy
- `NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SENTRY_DSN`, etc. documented in `.env.production.example`

### 5. Verification
- [ ] Renders correctly at 320px–2560px (Req 21.2)
- [ ] All tap targets ≥ 44px (Req 21.3)
- [ ] Correct input types on all mobile inputs (Req 21.4)
- [ ] Swipe navigation works on touch devices (Req 21.5)
- [ ] No zoom on input focus on iOS (Req 21.6)
- [ ] Security headers present in production response (Req 29.1)
- [ ] Lighthouse FCP < 1.5s in CI (Req 27.1)
- [ ] axe-core zero violations (Req 26.1)
- [ ] All CI pipeline stages green

---

## Task: 30 — Final Checkpoint — Complete System Verification

### 1. From tasks.md
- **Sub-steps**: Ensure all tests pass, verify all requirements are met, ask the user if questions arise
- **Requirements**: All 45 requirements, 260+ acceptance criteria

### 2. From requirements.md
- Full coverage verification across all 45 requirements

### 3. From design.md
- **Pattern**: End-to-end traceability from each requirement ID → acceptance criteria → design pattern → implementation → test assertion

### 4. Implementation Summary
- Run complete test matrix: 19 property tests × 100 runs + all unit tests + all integration tests + all E2E tests
- Manually verify all requirement IDs have at least one automated test assertion
- Confirm bilingual support works for all user-facing text in Khmer and English
- Confirm fraud detection pipeline: collect → calculate → label → display → appeal complete
- Confirm payment flows: wallet display → withdrawal → payout history → retry all working
- Generate coverage report and confirm ≥80% across all modules

### 5. Verification
- [ ] All 19 property tests pass (100 runs each)
- [ ] Full unit test suite passes
- [ ] All integration tests pass
- [ ] All E2E tests pass across 3 browsers
- [ ] Coverage ≥ 80%
- [ ] All 45 requirements traceable to passing tests
- [ ] Khmer and English fully functional
- [ ] Production build compiles with zero TypeScript errors
- [ ] Lighthouse scores: FCP < 1.5s, Accessibility ≥ 90, Best Practices ≥ 90