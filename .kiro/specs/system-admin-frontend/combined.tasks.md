# System Admin Frontend — Combined Specification Task File

> **Generated from**: requirements.md + design.md + tasks.md  
> **Pattern**: Three-file workflow — Tasks → Requirements → Design → Combined Implementation

---

## Phase 1: Project Setup & Core Infrastructure

---

### Task: 1.1 — Create Next.js 16 Project with TypeScript and App Router

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create Next.js 16 project with TypeScript and App Router
- **Requirements**: 29, 30

#### 2. From requirements.md
- **Requirement 29.1**: THE Admin_Dashboard SHALL require authentication before granting access to any administrative function
- **Requirement 30.1**: THE Admin_Dashboard SHALL render correctly on desktop, tablet, and mobile devices
- **Requirement 30.4**: THE Admin_Dashboard SHALL load within 3 seconds on standard broadband connections

#### 3. From design.md
- **Pattern**: Next.js 16 with App Router and TypeScript; role-based route protection via `AuthGuards` and `RoleGuards`
- **Files**:
  - `app/layout.tsx` — root layout with Auth/RBAC providers
  - `app/(admin)/layout.tsx` — admin shell layout
  - `next.config.ts` — Next.js configuration
  - `tsconfig.json` — TypeScript strict mode
- **Interface**:
```typescript
// Technology Stack: Next.js 16 App Router, TypeScript strict mode
// Authentication guards wrap all admin routes
```

#### 4. Implementation
- Bootstrap Next.js 16 project: `npx create-next-app@latest --typescript --app`
- Enable strict mode in `tsconfig.json`
- Configure App Router directory structure under `app/`
- Wrap root layout with `AuthProvider` and `RBACProvider` (Req 29.1)
- Set up `next.config.ts` with image optimization and performance settings (Req 30.4)

#### 5. Verification
- [ ] Next.js 16 project created with TypeScript
- [ ] App Router structure in place
- [ ] `tsconfig.json` has `"strict": true`
- [ ] Root layout wraps auth/RBAC providers

---

### Task: 1.2 — Configure Tailwind CSS v4 with "Soft Luxury" Design System Theme ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Configure Tailwind CSS v4 with "Soft Luxury" design system theme
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.1**: THE Admin_Dashboard SHALL render correctly on desktop, tablet, and mobile devices
- **Requirement 30.2**: THE Admin_Dashboard SHALL adapt layout and navigation for different screen sizes

#### 3. From design.md
- **Pattern**: Tailwind CSS with custom admin theme; shadcn/ui component library
- **Files**:
  - `tailwind.config.ts` — custom theme tokens
  - `app/globals.css` — CSS variables for design system
- **Interface**: Custom admin theme with design system colors extending Tailwind base

#### 4. Implementation
- Install Tailwind CSS v4 and configure `tailwind.config.ts`
- Define "Soft Luxury" design tokens: color palette, typography scale, spacing
- Set up CSS custom properties (`--color-primary`, `--color-surface`, etc.)
- Configure responsive breakpoints: `sm` (tablet), `lg` (desktop)

#### 5. Verification
- [x] Tailwind CSS v4 installed and configured
- [x] "Soft Luxury" theme tokens defined
- [x] Responsive breakpoints configured

---

### Task: 1.3 — Set Up ESLint, Prettier, and TypeScript Strict Mode ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Set up ESLint, Prettier, and TypeScript strict mode
- **Requirements**: 29, 30

#### 2. From requirements.md
- **Requirement 30.5**: THE Admin_Dashboard SHALL provide keyboard navigation support for accessibility

#### 3. From design.md
- **Pattern**: CI/CD pipeline includes `Lint → TypeCheck → Test → Security → Coverage → Deploy`
- **Files**:
  - `.eslintrc.json`
  - `.prettierrc`
  - `tsconfig.json`

#### 4. Implementation
- Configure ESLint with `eslint-config-next`, accessibility plugin (`jsx-a11y`)
- Configure Prettier for consistent formatting
- Set `"strict": true`, `"noImplicitAny": true` in tsconfig

#### 5. Verification
- [x] ESLint configured with accessibility rules
- [x] Prettier configured
- [x] TypeScript strict mode enabled

---

### Task: 1.4 — Configure Path Aliases (@/* Mapping)

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Configure path aliases (`@/*` mapping)
- **Requirements**: N/A (infrastructure)

#### 3. From design.md
- **Pattern**: Modular domain-driven component organization
- **Files**:
  - `tsconfig.json` — `paths` configuration
  - `next.config.ts` — webpack alias support

#### 4. Implementation
```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/services/*": ["./src/services/*"],
      "@/stores/*": ["./src/stores/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

#### 5. Verification
- [ ] `@/*` aliases resolve correctly
- [ ] IDE auto-complete works with aliases

---

### Task: 1.5 — Install Core Dependencies

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Install core dependencies: TanStack Query, Zustand, React Hook Form, Zod
- **Requirements**: 29, 30

#### 3. From design.md
- **Pattern**:
  - Zustand for client-side UI state and role context
  - TanStack Query for server state and caching
  - React Hook Form + Zod for validation
- **Interface**:
```typescript
// State Management
import { create } from 'zustand'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
```

#### 4. Implementation
```bash
npm install @tanstack/react-query zustand react-hook-form zod
npm install @tanstack/react-query-devtools # dev dependency
```

#### 5. Verification
- [ ] All packages install without peer dependency conflicts
- [ ] TanStack Query DevTools accessible in development

---

### Task: 1.6 — Set Up Environment Variables and Validation

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Set up environment variables and validation
- **Requirements**: 29

#### 3. From design.md
- **Pattern**: Backend integration with NestJS; JWT with httpOnly cookies
- **Files**:
  - `.env.local`
  - `src/lib/env.ts` — validated env schema with Zod

#### 4. Implementation
```typescript
// src/lib/env.ts
import { z } from 'zod'
const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SSE_URL: z.string().url(),
  SESSION_SECRET: z.string().min(32),
})
export const env = envSchema.parse(process.env)
```

#### 5. Verification
- [ ] Environment schema validated at startup
- [ ] Missing required env vars throw descriptive errors

---

## Phase 1 — Task 2: Implement Authentication System

---

### Task: 2.1 — Create JWT Authentication Service with httpOnly Cookies ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create JWT authentication service with httpOnly cookies
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.1**: THE Admin_Dashboard SHALL require authentication before granting access
- **Requirement 29.5**: THE Admin_Dashboard SHALL record all login attempts in the Audit_Log

#### 3. From design.md
- **Pattern**: JWT with httpOnly cookies and refresh token rotation; Authentication Layer feeds into RBAC
- **Interface**:
```typescript
interface AdminAuthContext {
  user: AdminUser | null;
  role: AdminRole;
  permissions: Permission[];
  login: (credentials: AdminCredentials) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
}
```
- **Files**:
  - `src/services/auth.service.ts`
  - `src/lib/cookies.ts`

#### 4. Implementation
```typescript
// src/services/auth.service.ts — Req 29.1, 29.5
export class AuthService {
  async login(credentials: AdminCredentials): Promise<AdminUser> {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST', credentials: 'include', body: JSON.stringify(credentials)
    })
    // JWT stored as httpOnly cookie by server
    // Audit log recorded server-side (Req 29.5)
    return res.json()
  }
  async refreshToken(): Promise<void> { /* refresh rotation */ }
  async logout(): Promise<void> { /* clear session */ }
}
```

#### 5. Verification
- [x] JWT stored in httpOnly cookie (not localStorage)
- [x] Login/logout recorded in audit log

---

### Task: 2.2 — Implement Login Page with Email/Password and MFA Support ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement login page with email/password and MFA support
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.1**: Require authentication before granting access
- **Requirement 29.2**: THE Authentication_System SHALL support multi-factor authentication for admin accounts
- **Requirement 29.4**: THE Admin_Dashboard SHALL display the current user identity and role in the interface header

#### 3. From design.md
- **Pattern**: MFA support in Authentication Layer; React Hook Form + Zod for forms
- **Files**:
  - `app/(auth)/login/page.tsx`
  - `src/components/auth/LoginForm.tsx`
  - `src/components/auth/MFAForm.tsx`

#### 4. Implementation
```typescript
// app/(auth)/login/page.tsx — Req 29.1, 29.2
// Step 1: email/password → Step 2: MFA code (if enabled)
// Uses React Hook Form + Zod validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})
const mfaSchema = z.object({ code: z.string().length(6) })
```

#### 5. Verification
- [x] Two-step login: credentials then MFA
- [x] Form validated with Zod
- [x] Redirects to admin dashboard on success

---

### Task: 2.3 — Create Authentication Context and Hooks (useAuth) ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create authentication context and hooks (useAuth)
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.4**: Display current user identity and role in interface header

#### 3. From design.md
- **Interface**:
```typescript
interface AdminAuthContext {
  user: AdminUser | null;
  role: AdminRole;
  permissions: Permission[];
  isAuthenticated: boolean;
  sessionExpiry: Date | null;
}
interface AdminUser {
  id: string; email: string; name: string;
  role: AdminRole; permissions: Permission[];
  lastLogin: Date; mfaEnabled: boolean;
}
type AdminRole = 'campaign_reviewer' | 'platform_moderator' | 'data_controller' | 'compliance_officer' | 'system_manager';
```
- **Files**:
  - `src/contexts/AuthContext.tsx`
  - `src/hooks/useAuth.ts`

#### 4. Implementation
```typescript
// src/contexts/AuthContext.tsx
export const AuthContext = createContext<AdminAuthContext | null>(null)
export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<AdminUser | null>(null)
  // hydrate from session on mount
  return <AuthContext.Provider value={{ user, role: user?.role, ... }}>
    {children}
  </AuthContext.Provider>
}
// src/hooks/useAuth.ts
export const useAuth = () => useContext(AuthContext)
```

#### 5. Verification
- [x] `useAuth()` returns current user and role
- [x] Context persists across route navigation

---

### Task: 2.4 — Implement Token Refresh Mechanism with Automatic Retry ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement token refresh mechanism with automatic retry
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.3**: WHEN inactive for configurable timeout, auto-logout

#### 3. From design.md
- **Pattern**: Token Expiration → Automatic refresh with fallback to login redirect
- **Error Handling**: API Communication Errors → Rate Limiting → Retry with exponential backoff

#### 4. Implementation
```typescript
// src/lib/apiClient.ts — intercept 401 → refresh → retry
async function refreshAndRetry(failedRequest: Request) {
  try {
    await authService.refreshToken()
    return fetch(failedRequest) // retry original
  } catch {
    authService.logout() // redirect to login
  }
}
```

#### 5. Verification
- [x] 401 response triggers token refresh
- [x] Failed refresh redirects to login
- [x] Exponential backoff on retry

---

### Task: 2.5 — Create Authentication Guards for Protected Routes ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create authentication guards for protected routes
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.1**: Require authentication before granting access to ANY administrative function

#### 3. From design.md
- **Pattern**: `AuthGuards → RoleGuards → AuditLogger` in Security Layer
- **Files**:
  - `src/components/guards/AuthGuard.tsx`
  - `app/(admin)/layout.tsx` — wraps all admin pages

#### 4. Implementation
```typescript
// src/components/guards/AuthGuard.tsx — Req 29.1
export function AuthGuard({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  useEffect(() => {
    if (!isAuthenticated) router.replace('/login')
  }, [isAuthenticated])
  if (!isAuthenticated) return <LoadingSpinner />
  return <>{children}</>
}
```

#### 5. Verification
- [x] All admin routes redirect unauthenticated users to login
- [x] Guard shows loading state during auth check

---

### Task: 2.6 — Implement Session Timeout with Auto-Logout

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement session timeout with auto-logout
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.3**: WHEN an admin user is inactive for a configurable timeout period, THE Admin_Dashboard SHALL automatically log out the user

#### 3. From design.md
- **Pattern**: Session Timeout → Graceful logout with session preservation for recovery
- **Interface**: `sessionExpiry: Date | null` in `AdminAuthContext`

#### 4. Implementation
```typescript
// src/hooks/useSessionTimeout.ts — Req 29.3
export function useSessionTimeout(timeoutMs: number) {
  const { logout } = useAuth()
  useEffect(() => {
    let timer = setTimeout(logout, timeoutMs)
    const reset = () => { clearTimeout(timer); timer = setTimeout(logout, timeoutMs) }
    window.addEventListener('mousemove', reset)
    window.addEventListener('keydown', reset)
    return () => { clearTimeout(timer); window.removeEventListener('mousemove', reset) }
  }, [timeoutMs, logout])
}
```

#### 5. Verification
- [ ] Auto-logout fires after configurable inactivity period
- [ ] Activity (mouse/keyboard) resets the timer
- [ ] User sees warning modal before logout

---

### Task: 2.7 — Add Audit Logging for All Authentication Events

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add audit logging for all authentication events
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.5**: THE Admin_Dashboard SHALL record all login attempts in the Audit_Log including successful and failed attempts

#### 3. From design.md
- **Interface**:
```typescript
interface AuditLogEntry {
  id: string; userId: string; action: string;
  resource: string; resourceId?: string;
  details: Record<string, any>; timestamp: Date;
  ipAddress: string; userAgent: string; sessionId: string;
}
```
- **Pattern**: `AuditLogger` in Security Layer records all actions

#### 4. Implementation
```typescript
// src/services/auditLogger.service.ts — Req 29.5
export async function logAuthEvent(event: 'login_success' | 'login_failure' | 'logout', userId?: string) {
  await fetch('/api/v1/admin/audit-logs', {
    method: 'POST',
    body: JSON.stringify({ action: event, resource: 'auth', userId, timestamp: new Date() })
  })
}
```

#### 5. Verification
- [ ] Successful login creates audit log entry
- [ ] Failed login creates audit log entry with failure reason
- [ ] Logout creates audit log entry

---

### Task: 2.8 — Integrate with `/api/v1/auth/*` Endpoints

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Integrate with `/api/v1/auth/*` endpoints
- **Requirements**: 29

#### 3. From design.md
- **Pattern**: API Client Layer wraps all backend calls; NestJS Backend integration
- **Files**: `src/services/auth.service.ts`

#### 4. Implementation
```typescript
// Endpoint mapping:
// POST /api/v1/auth/login        → login()
// POST /api/v1/auth/refresh      → refreshToken()
// POST /api/v1/auth/logout       → logout()
// POST /api/v1/auth/mfa/verify   → verifyMFA()
```

#### 5. Verification
- [ ] All auth endpoints integrated and tested with MSW mocks
- [ ] Error responses handled gracefully

---

## Phase 1 — Task 3: Implement Role-Based Access Control (RBAC)

---

### Task: 3.1 — Create RBAC Context and Permission Checking System ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create RBAC context and permission checking system
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.3**: THE RBAC_System SHALL support role assignment including Campaign_Reviewer, Platform_Moderator, Data_Controller, Compliance_Officer, and System_Manager
- **Requirement 21.4**: THE System_Manager SHALL be able to configure custom roles with granular permission settings

#### 3. From design.md
- **Interface**:
```typescript
interface Permission {
  id: string; name: string; resource: string; action: string;
  conditions?: PermissionCondition[];
}
interface PermissionCondition {
  field: string;
  operator: 'equals' | 'not_equals' | 'in' | 'not_in';
  value: any;
}
type AdminRole = 'campaign_reviewer' | 'platform_moderator' | 'data_controller' | 'compliance_officer' | 'system_manager';
```
- **Files**: `src/contexts/RBACContext.tsx`

#### 4. Implementation
```typescript
// src/contexts/RBACContext.tsx — Req 21.3, 21.4
interface RBACContextType {
  role: AdminRole;
  permissions: Permission[];
  hasPermission: (resource: string, action: string) => boolean;
}
export function RBACProvider({ children }: PropsWithChildren) {
  const { user } = useAuth()
  const hasPermission = (resource: string, action: string) =>
    user?.permissions.some(p => p.resource === resource && p.action === action) ?? false
  return <RBACContext.Provider value={{ role: user?.role, permissions: user?.permissions, hasPermission }}>
    {children}
  </RBACContext.Provider>
}
```

#### 5. Verification
- [x] All 5 admin roles defined in type system
- [x] `hasPermission()` checks resource + action

---

### Task: 3.2 — Implement Role-Based Route Guards ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement role-based route guards
- **Requirements**: 21, 29

#### 2. From requirements.md
- **Requirement 21.3**: RBAC supports all 5 admin roles
- **Requirement 29.1**: Require authentication before granting access

#### 3. From design.md
- **Pattern**: `AuthGuards → RoleGuards → AuditLogger`
- **Files**: `src/components/guards/RoleGuard.tsx`

#### 4. Implementation
```typescript
// src/components/guards/RoleGuard.tsx — Req 21.3, 29.1
interface RoleGuardProps { allowedRoles: AdminRole[]; children: ReactNode }
export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const { role } = useRBAC()
  if (!allowedRoles.includes(role)) return <AccessDeniedPage />
  return <>{children}</>
}
```

#### 5. Verification
- [x] Routes restricted to allowed roles
- [x] Unauthorized access shows friendly error

---

### Task: 3.3 — Create Permission Checking Hooks (hasPermission)

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create permission checking hooks (hasPermission)
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.4**: Configure custom roles with granular permission settings

#### 3. From design.md
- **Files**: `src/hooks/usePermission.ts`

#### 4. Implementation
```typescript
// src/hooks/usePermission.ts — Req 21.4
export function usePermission(resource: string, action: string): boolean {
  const { hasPermission } = useRBAC()
  return hasPermission(resource, action)
}
export function useHasRole(role: AdminRole): boolean {
  const { role: currentRole } = useRBAC()
  return currentRole === role
}
```

#### 5. Verification
- [ ] `usePermission()` returns correct boolean for resource/action
- [ ] Hooks update reactively when permissions change

---

### Task: 3.4 — Implement Role-Specific Navigation and UI Rendering

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement role-specific navigation and UI rendering
- **Requirements**: 21, 29

#### 2. From requirements.md
- **Requirement 21.3**: Support all 5 admin roles
- **Requirement 29.4**: Display current user identity and role in the header

#### 3. From design.md
- **Pattern**: Role-Based Architecture — specialized interfaces tailored to each role
- **Files**: `src/components/navigation/RoleNav.tsx`

#### 4. Implementation
```typescript
// Navigation items per role — Req 21.3, 29.4
const ROLE_NAV: Record<AdminRole, NavItem[]> = {
  campaign_reviewer: [{ label: 'Review Queue', href: '/review' }, ...],
  platform_moderator: [{ label: 'Moderation', href: '/moderation' }, ...],
  data_controller: [{ label: 'Data Control', href: '/data' }, ...],
  compliance_officer: [{ label: 'Compliance', href: '/compliance' }, ...],
  system_manager: [{ label: 'System', href: '/system' }, ...],
}
```

#### 5. Verification
- [ ] Each role sees only their relevant navigation items
- [ ] Current user name and role visible in header

---

### Task: 3.5 — Create Role Assignment and Management Utilities

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create role assignment and management utilities
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.2**: THE System_Manager SHALL be able to create, modify, or deactivate admin user accounts
- **Requirement 21.3**: RBAC supports role assignment for all 5 roles

#### 4. Implementation
```typescript
// src/services/rbac.service.ts — Req 21.2, 21.3
export async function assignRole(userId: string, role: AdminRole) {
  return fetch(`/api/v1/admin/users/administrators/${userId}/role`, {
    method: 'PATCH', body: JSON.stringify({ role })
  })
}
```

#### 5. Verification
- [ ] Role assignment persists to backend
- [ ] Changes reflect immediately in UI

---

### Task: 3.6 — Add Permission-Based Component Visibility Controls

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add permission-based component visibility controls
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.4**: Configure custom roles with granular permission settings

#### 3. From design.md
- **Pattern**: Role-Based Architecture with specialized UI rendering

#### 4. Implementation
```typescript
// src/components/guards/PermissionGate.tsx — Req 21.4
interface PermissionGateProps {
  resource: string; action: string; children: ReactNode; fallback?: ReactNode
}
export function PermissionGate({ resource, action, children, fallback = null }: PermissionGateProps) {
  const allowed = usePermission(resource, action)
  return allowed ? <>{children}</> : <>{fallback}</>
}
```

#### 5. Verification
- [ ] Components hidden when user lacks permission
- [ ] Fallback rendered for restricted content

---

## Phase 1 — Task 4: Set Up API Client Layer

---

### Task: 4.1 — Create Base API Client with Axios/Fetch Wrapper

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create base API client with axios/fetch wrapper
- **Requirements**: 29, 30

#### 3. From design.md
- **Pattern**: API Client Layer sits between State Management and NestJS Backend
- **Files**: `src/lib/apiClient.ts`

#### 4. Implementation
```typescript
// src/lib/apiClient.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL
export async function apiClient<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    ...options,
  })
  if (!res.ok) throw new ApiError(res.status, await res.json())
  return res.json()
}
```

#### 5. Verification
- [ ] All requests include `credentials: 'include'` for cookie auth
- [ ] Non-OK responses throw typed `ApiError`

---

### Task: 4.2 — Implement Request/Response Interceptors for Auth Tokens

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement request/response interceptors for auth tokens
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.1**: Require valid authentication for all functions

#### 3. From design.md
- **Pattern**: Token Expiration → Automatic refresh with fallback to login redirect

#### 4. Implementation
```typescript
// Interceptor pattern — Req 29.1
async function withAuth<T>(request: () => Promise<T>): Promise<T> {
  try {
    return await request()
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      await authService.refreshToken()
      return request() // retry once
    }
    throw error
  }
}
```

#### 5. Verification
- [ ] 401 triggers token refresh and single retry
- [ ] Persistent 401 redirects to login

---

### Task: 4.3 — Add Error Handling and Retry Logic with Exponential Backoff

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add error handling and retry logic with exponential backoff
- **Requirements**: 30

#### 3. From design.md
- **Error Handling**: Server Errors (5xx) → user-friendly messages; Rate Limiting → display wait time and retry; Timeout Errors → retry with exponential backoff

#### 4. Implementation
```typescript
// src/lib/retry.ts
export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 3): Promise<T> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try { return await fn() }
    catch (error) {
      if (attempt === maxAttempts) throw error
      await delay(Math.pow(2, attempt) * 1000) // exponential backoff
    }
  }
}
```

#### 5. Verification
- [ ] Retries on 5xx and network errors
- [ ] Does not retry on 4xx (client errors)
- [ ] Exponential backoff: 2s, 4s, 8s

---

### Task: 4.4 — Create TanStack Query Configuration and Hooks

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create TanStack Query configuration and hooks
- **Requirements**: 14, 25

#### 3. From design.md
- **Pattern**: TanStack Query for server state management and caching; `ServerState` layer in Data Layer

#### 4. Implementation
```typescript
// src/lib/queryClient.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 2, refetchOnWindowFocus: false },
    mutations: { retry: 0 }
  }
})
// src/hooks/queries/useCampaigns.ts (example pattern)
export function useCampaignReviewQueue(filters: CampaignFilters) {
  return useQuery({
    queryKey: ['campaigns', 'review-queue', filters],
    queryFn: () => apiClient('/api/v1/admin/campaigns/review-queue', { params: filters })
  })
}
```

#### 5. Verification
- [ ] Query client configured with sensible defaults
- [ ] Queries cache data for 30 seconds

---

### Task: 4.5 — Implement API Response Type Definitions

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement API response type definitions
- **Requirements**: All

#### 3. From design.md
- **Files**: `src/types/api.types.ts`, `src/types/domain.types.ts`
- **Interfaces**: All domain models from design.md

#### 4. Implementation
- Extract and export all interfaces from design.md:
  - `AdminUser`, `AdminSession`, `AuditLogEntry`, `Permission`
  - `CampaignReviewItem`, `QualityScore`, `QualityIssue`
  - `ModerationItem`, `ModerationQueue`, `UserAccountInfo`
  - `DataAccessControl`, `DataExportJob`, `ExportConfig`
  - `ComplianceRegulation`, `DataRequest`
  - `SystemMetrics`, `HealthStatus`

#### 5. Verification
- [ ] All domain types exported from `src/types/`
- [ ] No `any` types in API integration code

---

### Task: 4.6 — Add Request/Response Logging for Debugging

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add request/response logging for debugging
- **Requirements**: 27, 28

#### 3. From design.md
- **Pattern**: Log Viewer displaying system, error, and access logs

#### 4. Implementation
```typescript
// Development-only request logging middleware
if (process.env.NODE_ENV === 'development') {
  console.debug(`[API] ${method} ${path}`, { status, duration: `${ms}ms` })
}
```

#### 5. Verification
- [ ] API calls logged in development only
- [ ] Production logging goes through structured logger

---

### Task: 4.7 — Configure Rate Limiting Handling

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Configure rate limiting handling
- **Requirements**: 29, 30

#### 3. From design.md
- **Error Handling**: Rate Limiting → Display wait time and automatic retry

#### 4. Implementation
```typescript
// Handle 429 Too Many Requests
if (error.status === 429) {
  const retryAfter = error.headers.get('Retry-After') ?? '60'
  showToast(`Rate limited. Retry in ${retryAfter}s`, 'warning')
  await delay(parseInt(retryAfter) * 1000)
  return retry(request)
}
```

#### 5. Verification
- [ ] 429 responses show wait time to user
- [ ] Automatic retry after wait period

---

## Phase 1 — Task 5: Create Shared UI Component Library

---

### Task: 5.1 — Set Up shadcn/ui Component Library ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Set up shadcn/ui component library
- **Requirements**: 30

#### 3. From design.md
- **Pattern**: shadcn/ui component library with custom admin theme
- **Files**: `src/components/ui/` — shadcn components

#### 4. Implementation
```bash
npx shadcn-ui@latest init
# Configure: TypeScript, Tailwind, app router, src/ directory
```

#### 5. Verification
- [x] shadcn/ui initialized
- [x] Component imports work from `@/components/ui/`

---

### Task: 5.2 — Create Custom Admin Theme with Design System Colors ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create custom admin theme with design system colors
- **Requirements**: 30

#### 3. From design.md
- **Pattern**: Tailwind CSS with custom admin theme; "Soft Luxury" design system

#### 4. Implementation
- Extend shadcn/ui CSS variables with "Soft Luxury" palette
- Define semantic color tokens for each admin role module

#### 5. Verification
- [x] Custom theme applied across all shadcn components
- [x] Design tokens consistent with Tailwind config

---

### Task: 5.3 — Implement Reusable Form Components

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement reusable form components (Input, Select, Checkbox, etc.)
- **Requirements**: 3, 7, 9, 11

#### 2. From requirements.md
- **Requirement 3.2**: Campaign Reviewer must provide comment for reject/revision
- **Requirement 9.3**: Suspension/ban requires reason input
- **Requirement 11.2**: Export interface with anonymization options

#### 3. From design.md
- **Pattern**: React Hook Form with Zod validation; Forms layer in Presentation Layer
- **Files**: `src/components/forms/`

#### 4. Implementation
```typescript
// src/components/forms/FormField.tsx — wraps shadcn Input with React Hook Form
// src/components/forms/FormSelect.tsx — wraps shadcn Select
// src/components/forms/FormTextarea.tsx — for comments/reasons (Req 3.2)
// src/components/forms/FormCheckbox.tsx — for anonymization options (Req 11.2)
// All use Controller from react-hook-form + Zod error display
```

#### 5. Verification
- [ ] Validation errors display at field level
- [ ] Required fields enforced via Zod schema

---

### Task: 5.4 — Create Data Table Component with Sorting, Filtering, Pagination

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create data table component with sorting, filtering, pagination
- **Requirements**: 1, 6, 9, 28

#### 2. From requirements.md
- **Requirement 1.3**: Filter by date range, advertiser, category, priority
- **Requirement 1.4**: Sort by submission date, priority score, review deadline
- **Requirement 6.2**: Moderation queue sorted by severity, report count, submission date
- **Requirement 28.2**: Audit log filtered by date range, user, action type, resource

#### 3. From design.md
- **Files**: `src/components/ui/DataTable.tsx`

#### 4. Implementation
```typescript
// src/components/ui/DataTable.tsx — Req 1.3, 1.4, 6.2, 28.2
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  filters?: FilterConfig[];
  sorting?: SortingConfig;
  pagination?: PaginationConfig;
  onRowSelect?: (rows: T[]) => void; // for bulk operations (Req 5.1)
}
```

#### 5. Verification
- [ ] Sorting works on all configured columns
- [ ] Filtering updates data reactively
- [ ] Pagination handles large datasets

---

### Task: 5.5 — Implement Modal/Dialog Components

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement modal/dialog components
- **Requirements**: 3, 5, 7, 9

#### 2. From requirements.md
- **Requirement 3.2**: Modal for rejection comment
- **Requirement 5.3**: Bulk action confirmation modal
- **Requirement 7.1**: Moderation action confirmation

#### 3. From design.md
- **Files**: `src/components/ui/ConfirmDialog.tsx`, `src/components/ui/ActionModal.tsx`

#### 4. Implementation
```typescript
// ConfirmDialog — Req 5.3: "requires confirmation before executing"
// ActionModal — Req 3.2: requires comment for reject/revision
// Uses shadcn Dialog component as base
```

#### 5. Verification
- [ ] Confirmation dialogs block destructive actions
- [ ] Comment/reason inputs validated before submission

---

### Task: 5.6 — Create Toast Notification System

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create toast notification system
- **Requirements**: 3, 7, 9, 35

#### 2. From requirements.md
- **Requirement 3.3**: Notify advertiser on approval
- **Requirement 9.5**: Display success/error notifications after account actions

#### 3. From design.md
- **Pattern**: Toast notifications with action buttons in Real-Time Notification System
- **Files**: `src/components/ui/Toast.tsx`, `src/hooks/useToast.ts`

#### 4. Implementation
```typescript
// src/hooks/useToast.ts — wraps shadcn toast
export function useToast() {
  return {
    success: (msg: string) => toast({ title: msg, variant: 'default' }),
    error: (msg: string) => toast({ title: msg, variant: 'destructive' }),
    warning: (msg: string, action?: ToastAction) => toast({ title: msg, action }),
  }
}
```

#### 5. Verification
- [ ] Success/error/warning variants styled distinctly
- [ ] Toasts auto-dismiss after timeout
- [ ] Action buttons functional in toasts

---

### Task: 5.7 — Build Loading States and Skeleton Components

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Build loading states and skeleton components
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.4**: Load within 3 seconds on standard broadband

#### 3. From design.md
- **Files**: `src/components/ui/Skeleton.tsx`, `src/components/ui/LoadingSpinner.tsx`

#### 4. Implementation
```typescript
// Skeleton for data tables, cards, dashboards
// Prevents layout shift while data loads
// Progressive loading improves perceived performance (Req 30.4)
```

#### 5. Verification
- [ ] Skeleton dimensions match loaded content
- [ ] Loading states visible for all async operations

---

### Task: 5.8 — Create Error Boundary Components

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create error boundary components
- **Requirements**: 29, 30

#### 3. From design.md
- **Error Handling**: Fallback UI for errors; Error boundary components in Presentation Layer

#### 4. Implementation
```typescript
// src/components/ErrorBoundary.tsx
class ErrorBoundary extends Component<PropsWithChildren<{ fallback: ReactNode }>> {
  state = { hasError: false, error: null }
  static getDerivedStateFromError(error: Error) { return { hasError: true, error } }
  render() { return this.state.hasError ? this.props.fallback : this.props.children }
}
```

#### 5. Verification
- [ ] Runtime errors caught and display friendly fallback
- [ ] Error details logged for debugging

---

## Phase 1 — Task 6: Implement Admin Layout and Navigation

---

### Task: 6.1 — Create Main Admin Layout with Header, Sidebar, Content Area ✅

**Status**: [x]

#### 1. From tasks.md
- **Sub-steps**:
  - Create main admin layout with header, sidebar, content area
- **Requirements**: 29, 30

#### 2. From requirements.md
- **Requirement 29.4**: Display current user identity and role in the interface header
- **Requirement 30.1**: Render correctly on desktop, tablet, and mobile

#### 3. From design.md
- **Pattern**: Admin Layout Components in Presentation Layer; role-based navigation
- **Files**: `app/(admin)/layout.tsx`, `src/components/layout/AdminShell.tsx`

#### 4. Implementation
```typescript
// app/(admin)/layout.tsx — Req 29.4, 30.1
// Three-panel layout: Header (user identity + role) | Sidebar (role nav) | Main content
// Responsive: sidebar collapses to drawer on mobile
```

#### 5. Verification
- [x] Three-panel layout renders on all screen sizes
- [x] User name and role displayed in header

---

### Task: 6.2 — Implement Role-Based Navigation Menu

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement role-based navigation menu
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.3**: Support all 5 admin roles in navigation

#### 3. From design.md
- **Pattern**: Role-Based Architecture — specialized interfaces per role

#### 4. Implementation
- Render navigation items filtered by current role (see Task 3.4)
- Highlight active route
- Group nav items by module (Review, Moderation, Data, Compliance, System)

#### 5. Verification
- [ ] Campaign Reviewer sees only review-related nav
- [ ] System Manager sees all system nav items
- [ ] Active route highlighted

---

### Task: 6.3 — Create Breadcrumb Navigation Component

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create breadcrumb navigation component
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.5**: Provide keyboard navigation support for accessibility

#### 3. From design.md
- **Files**: `src/components/layout/Breadcrumbs.tsx`

#### 4. Implementation
```typescript
// Auto-generates breadcrumbs from Next.js App Router segment paths
// Keyboard accessible with proper ARIA attributes (Req 30.5)
```

#### 5. Verification
- [ ] Breadcrumbs reflect current navigation path
- [ ] Each crumb is a navigable link

---

### Task: 6.4 — Add User Profile Dropdown with Logout

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add user profile dropdown with logout
- **Requirements**: 29

#### 2. From requirements.md
- **Requirement 29.4**: Display current user identity and role

#### 4. Implementation
```typescript
// Header user dropdown: avatar | name | role badge | Settings | Logout
// Logout calls authService.logout() and records audit log (Req 29.5)
```

#### 5. Verification
- [ ] User name and role visible in dropdown trigger
- [ ] Logout clears session and redirects to login

---

### Task: 6.5 — Implement Responsive Mobile Navigation

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement responsive mobile navigation
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.2**: Adapt layout and navigation for different screen sizes
- **Requirement 30.3**: Maintain functionality on touch-enabled devices

#### 4. Implementation
- Hamburger menu on mobile; sidebar becomes bottom sheet or drawer
- Touch gestures for swipe-open (Req 30.3)

#### 5. Verification
- [ ] Navigation accessible on 375px viewport
- [ ] Touch interactions work on mobile devices

---

### Task: 6.6 — Create Page Header Component with Actions

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create page header component with actions
- **Requirements**: 30

#### 3. From design.md
- **Files**: `src/components/layout/PageHeader.tsx`

#### 4. Implementation
```typescript
interface PageHeaderProps {
  title: string; description?: string;
  actions?: ReactNode; // bulk action buttons, export buttons, etc.
}
```

#### 5. Verification
- [ ] Page header consistent across all admin modules
- [ ] Actions slot used for role-specific CTAs

---

### Task: 6.7 — Add Keyboard Navigation Support

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add keyboard navigation support
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.5**: THE Admin_Dashboard SHALL provide keyboard navigation support for accessibility

#### 4. Implementation
- Focus trap in modals
- Skip-to-content link
- Keyboard shortcuts for common actions (Req 9.8: shortcuts for campaign review)
- ARIA roles on navigation landmarks

#### 5. Verification
- [ ] Tab order logical throughout all pages
- [ ] Modal focus trapped until dismissed
- [ ] Skip-to-content link present

---

## Phase 2: Campaign Review Module

---

### Task: 7.1 — Create Campaign Review Dashboard Page Layout

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create campaign review dashboard page layout
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.1**: Display Campaign_Review_Dashboard with campaigns grouped by Campaign_Status
- **Requirement 1.5**: Display SLA metrics including average review time and pending campaign count

#### 3. From design.md
- **Interface**:
```typescript
interface CampaignReviewDashboardProps {
  filters: CampaignFilters;
  onFilterChange: (filters: CampaignFilters) => void;
  onCampaignAction: (campaignId: string, action: ReviewAction) => void;
}
```
- **Files**: `app/(admin)/review/page.tsx`, `src/components/review/CampaignReviewDashboard.tsx`

#### 4. Implementation
```typescript
// app/(admin)/review/page.tsx — Req 1.1, 1.5
// Layout: SLA metrics bar | Filter controls | Tabbed status groups (Pending | Approved | Rejected | Revision_Requested)
```

#### 5. Verification
- [ ] Dashboard renders with status-grouped tabs
- [ ] SLA metrics bar visible at top

---

### Task: 7.2 — Implement Campaign Status Grouping

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement campaign status grouping (Pending, Approved, Rejected, Revision_Requested)
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.1**: Campaigns grouped by Campaign_Status (Pending, Approved, Rejected, Revision_Requested)

#### 3. From design.md
- **Property 1**: For any collection of campaigns, correctly group by status with each campaign in exactly one group
- **Interface**:
```typescript
type CampaignStatus = 'Pending' | 'Approved' | 'Rejected' | 'Revision_Requested'
```

#### 4. Implementation
```typescript
// src/utils/campaignGrouping.ts — Property 1 (Req 1.1)
export function groupCampaignsByStatus(campaigns: CampaignReviewItem[]) {
  return campaigns.reduce((groups, campaign) => {
    const status = campaign.status
    return { ...groups, [status]: [...(groups[status] ?? []), campaign] }
  }, {} as Record<CampaignStatus, CampaignReviewItem[]>)
}
// Property 1 guarantee: each campaign appears in exactly one group (its status)
```

#### 5. Verification
- [ ] Each campaign appears in exactly one status group (Property 1)
- [ ] All four status groups rendered even if empty

---

### Task: 7.3 — Display Campaign Metadata Cards

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Display campaign metadata cards (title, advertiser, submission date, priority)
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.2**: Display campaign metadata including title, advertiser, submission date, and priority score

#### 3. From design.md
- **Property 2**: Display all required metadata without omitting any fields
- **Interface**:
```typescript
interface CampaignReviewItem {
  id: string; campaignId: string; title: string;
  advertiser: AdvertiserInfo; status: CampaignStatus;
  submittedAt: Date; reviewDeadline: Date;
  priorityScore: number; qualityScore: QualityScore;
}
```

#### 4. Implementation
```typescript
// src/components/review/CampaignCard.tsx — Property 2 (Req 1.2)
// Must render: title, advertiser.name, submittedAt (formatted), priorityScore
// Deadline indicator with color coding (approaching deadline = amber, past = red)
```

#### 5. Verification
- [ ] All required metadata fields visible (Property 2)
- [ ] No metadata field omitted from any campaign card

---

### Task: 7.4 — Add Filtering Controls

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add filtering controls (date range, advertiser, category, priority)
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.3**: Filtering by date range, advertiser, category, and priority level

#### 3. From design.md
- **Interface**:
```typescript
interface CampaignFilters {
  status: CampaignStatus[];
  dateRange: DateRange;
  advertiser?: string;
  category?: string;
  priority?: PriorityLevel;
}
```

#### 4. Implementation
```typescript
// src/components/review/CampaignFilters.tsx — Req 1.3
// DateRangePicker | AdvertiserSearch | CategorySelect | PrioritySelect
// Filters passed up via onFilterChange callback
```

#### 5. Verification
- [ ] All four filter types functional
- [ ] Filters applied immediately (no submit button needed)

---

### Task: 7.5 — Implement Sorting Options

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Implement sorting options (submission date, priority score, review deadline)
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.4**: Sorting by submission date, priority score, and review deadline

#### 4. Implementation
```typescript
// Sort controls in DataTable header — Req 1.4
// Columns: submittedAt (asc/desc), priorityScore (desc default), reviewDeadline (asc default)
```

#### 5. Verification
- [ ] Three sort options available
- [ ] Default sort: priority score descending

---

### Task: 7.6 — Display SLA Metrics

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Display SLA metrics (average review time, pending count)
- **Requirements**: 1

#### 2. From requirements.md
- **Requirement 1.5**: Display SLA metrics including average review time and pending campaign count

#### 4. Implementation
```typescript
// src/components/review/SLAMetricsBar.tsx — Req 1.5
// Metrics: pendingCount | avgReviewTimeHours | overdueCount | reviewsToday
// Color-coded: green (on track), amber (approaching SLA), red (breached)
```

#### 5. Verification
- [ ] Pending count accurate
- [ ] Average review time calculated and displayed
- [ ] SLA breach indicator visible

---

### Task: 7.7 — Integrate with `/api/v1/admin/campaigns/review-queue`

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Integrate with `/api/v1/admin/campaigns/review-queue`
- **Requirements**: 1

#### 3. From design.md
- **Pattern**: TanStack Query for server state; API Client Layer

#### 4. Implementation
```typescript
// src/hooks/queries/useCampaignReviewQueue.ts
export function useCampaignReviewQueue(filters: CampaignFilters) {
  return useQuery({
    queryKey: ['campaigns', 'review-queue', filters],
    queryFn: () => apiClient<CampaignReviewItem[]>('/api/v1/admin/campaigns/review-queue', { params: filters })
  })
}
```

#### 5. Verification
- [ ] API called with current filter parameters
- [ ] Loading/error states handled

---

### Task: 7.8 — Add Real-Time Updates via SSE for Queue Changes

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Add real-time updates via SSE for queue changes
- **Requirements**: 1, 14

#### 3. From design.md
- **Pattern**: Server-Sent Events (SSE) for live notifications; Real-Time State layer
- **Files**: `src/hooks/useSSE.ts`

#### 4. Implementation
```typescript
// src/hooks/useSSE.ts — connects to /api/v1/sse/notifications
// On 'campaign:submitted' event → invalidate review queue query
// On 'campaign:status_changed' event → update specific campaign in cache
useSSEEvent('campaign:submitted', () => {
  queryClient.invalidateQueries({ queryKey: ['campaigns', 'review-queue'] })
})
```

#### 5. Verification
- [ ] New campaigns appear in queue without page refresh
- [ ] SSE reconnects automatically on connection loss

---

### Task: 8.1 — Create Campaign Preview Modal/Page

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**:
  - Create campaign preview modal/page
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.1**: Display full campaign preview including all questions, branching logic, and targeting criteria
- **Requirement 2.2**: Render the survey exactly as respondents would see it

#### 3. From design.md
- **Property 3**: Campaign preview displays all components with complete data preservation
- **Files**: `src/components/review/CampaignPreview.tsx`

#### 4. Implementation
```typescript
// src/components/review/CampaignPreview.tsx — Property 3, Req 2.1, 2.2
// Two-panel layout: survey render (left) | flow diagram + issues (right)
// Survey renders identically to respondent view (Req 2.2)
```

#### 5. Verification
- [ ] All questions rendered (Property 3)
- [ ] Survey appearance matches respondent view

---

### Task: 8.2 — Render Complete Survey Preview as Respondents See It

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.2**: THE Campaign_Preview SHALL render the survey exactly as respondents would see it

#### 4. Implementation
```typescript
// Uses same question renderers as respondent-facing survey app
// Read-only mode: no response submission possible
// Reuses: MultipleChoice, Scale, OpenText, Matrix question components
```

#### 5. Verification
- [ ] Question types render identically to respondent app
- [ ] No response input capability in preview mode

---

### Task: 8.3 — Display Visual Flow Diagram for Question Branching

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.3**: THE Campaign_Preview SHALL display a visual flow diagram showing question branching and logic paths

#### 3. From design.md
- **Pattern**: Recharts or custom SVG for flow visualization
- **Integration**: `/api/v1/campaigns/:id/flow-diagram`

#### 4. Implementation
```typescript
// src/components/review/FlowDiagram.tsx — Req 2.3
// Node graph: questions as nodes, logic paths as directed edges
// Highlight selected question node
// Color-code by question type
```

#### 5. Verification
- [ ] All branching paths visible in diagram
- [ ] Logic paths show conditions (e.g., "If Q1 = Yes → Q3")

---

### Task: 8.4 — Show Targeting Criteria and Audience Details

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.1**: Display targeting criteria

#### 4. Implementation
```typescript
// Targeting panel: demographic filters, geographic restrictions, sample size
// Displays as readable summary: "Ages 25-45, USA only, n=1000"
```

#### 5. Verification
- [ ] Targeting criteria fully displayed
- [ ] Geographic restrictions listed

---

### Task: 8.5 — Highlight Automated Validation Issues

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2, 4

#### 2. From requirements.md
- **Requirement 2.4**: Highlight potential issues detected by automated validation
- **Requirement 4.4**: Provide review checklist with automated validation results

#### 3. From design.md
- **Interface**:
```typescript
interface QualityIssue {
  type: 'bias' | 'clarity' | 'completeness' | 'logic_error';
  severity: 'low' | 'medium' | 'high';
  description: string; questionId?: string;
}
```

#### 4. Implementation
```typescript
// In-line highlighting: problematic questions bordered in amber/red based on severity
// Issues panel: list of QualityIssues with type, severity, description
// Click issue → scroll to affected question
```

#### 5. Verification
- [ ] Issues highlighted inline in survey preview
- [ ] Severity indicated by color (amber=medium, red=high)

---

### Task: 8.6 — Implement Version Comparison View for Campaign History

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.5**: WHERE version history exists, provide a version comparison view showing changes between versions

#### 4. Implementation
```typescript
// Side-by-side diff view: current version vs selected previous version
// Highlight added/removed/changed questions
// Version selector dropdown in preview header
```

#### 5. Verification
- [ ] Version comparison only shown when history exists (Req 2.5)
- [ ] Changes clearly highlighted in diff view

---

### Task: 8.7 — Add Navigation Between Questions in Preview

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 2. From requirements.md
- **Requirement 2.2**: Render survey as respondents see it

#### 4. Implementation
```typescript
// Question navigator: prev/next buttons + question index indicator
// Jump-to-question via flow diagram click
// Keyboard: ArrowLeft/ArrowRight for previous/next (Req 30.5)
```

#### 5. Verification
- [ ] All questions navigable via prev/next
- [ ] Keyboard navigation works

---

### Task: 8.8 — Integrate with `/api/v1/campaigns/:id` and `/api/v1/campaigns/:id/flow-diagram`

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 2

#### 3. From design.md
- **Pattern**: TanStack Query; API Client Layer

#### 4. Implementation
```typescript
export function useCampaignPreview(campaignId: string) {
  const campaign = useQuery({ queryKey: ['campaigns', campaignId], queryFn: () => apiClient(`/api/v1/campaigns/${campaignId}`) })
  const flowDiagram = useQuery({ queryKey: ['campaigns', campaignId, 'flow'], queryFn: () => apiClient(`/api/v1/campaigns/${campaignId}/flow-diagram`) })
  return { campaign, flowDiagram }
}
```

#### 5. Verification
- [ ] Campaign and flow data fetched in parallel
- [ ] Preview renders when both queries succeed

---

### Task: 9.1 — Implement Approve/Reject/Request Revision Action Buttons

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 2. From requirements.md
- **Requirement 3.1**: Campaign_Reviewer SHALL be able to select Approve, Reject, or Request_Revision actions

#### 3. From design.md
- **Interface**:
```typescript
interface ReviewAction {
  type: 'approve' | 'reject' | 'request_revision';
  comment?: string; reviewerId: string;
}
```

#### 4. Implementation
```typescript
// Action toolbar at bottom of campaign preview — Req 3.1
// Approve (green), Request Revision (amber), Reject (red)
// Keyboard shortcuts: A=Approve, R=Reject, V=Revision (Req 9.8)
```

#### 5. Verification
- [ ] Three action types available
- [ ] Buttons clearly labeled with status impact

---

### Task: 9.2 — Create Comment/Reason Input Modal for Reject and Revision Requests

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 2. From requirements.md
- **Requirement 3.2**: WHEN Reject or Request_Revision is selected, REQUIRE a comment explaining the decision

#### 4. Implementation
```typescript
// ActionCommentModal — opens on Reject or Request_Revision click (Req 3.2)
// Required textarea (min 20 chars), cannot submit empty
// Pre-populated common rejection reasons as quick-select chips
```

#### 5. Verification
- [ ] Comment required before reject/revision can be submitted
- [ ] Approve action does not require comment

---

### Task: 9.3 — Add Confirmation Dialogs for Approval Actions

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 2. From requirements.md
- **Requirement 3.3**: Update Campaign_Status to Approved and notify advertiser

#### 4. Implementation
```typescript
// ConfirmApprovalDialog: "Approve campaign X? This will notify the advertiser."
// One-click confirm or cancel
```

#### 5. Verification
- [ ] Confirmation dialog prevents accidental approvals
- [ ] Cancel returns to review without changes

---

### Task: 9.4 — Implement Action Submission with Audit Logging

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 2. From requirements.md
- **Requirement 3.5**: THE Admin_Dashboard SHALL record all review actions in the Audit_Log with timestamp and reviewer identity

#### 3. From design.md
- **Property 4**: Audit log entry contains timestamp, reviewer identity, and action details with no missing fields
- **Interface**:
```typescript
interface AuditLogEntry {
  userId: string; action: string; resource: string;
  resourceId?: string; details: Record<string, any>;
  timestamp: Date; ipAddress: string; sessionId: string;
}
```

#### 4. Implementation
```typescript
// src/hooks/mutations/useCampaignReviewAction.ts — Property 4, Req 3.5
export function useCampaignReviewAction() {
  return useMutation({
    mutationFn: ({ campaignId, action }: { campaignId: string; action: ReviewAction }) =>
      apiClient(`/api/v1/admin/campaigns/${campaignId}/${action.type}`, { method: 'POST', body: JSON.stringify(action) })
    // Audit log created server-side with timestamp + reviewer identity
  })
}
```

#### 5. Verification
- [ ] Audit log entry created for every action (Property 4)
- [ ] Entry includes reviewer ID, timestamp, action type, campaign ID

---

### Task: 9.5 — Display Success/Error Notifications

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 2. From requirements.md
- **Requirement 3.3**: Notify on successful approval
- **Requirement 3.4**: Send rejection reason to advertiser

#### 4. Implementation
```typescript
// On approve success: toast("Campaign approved and advertiser notified", "success")
// On reject success: toast("Campaign rejected. Reason sent to advertiser", "success")
// On error: toast("Action failed. Please try again.", "error")
```

#### 5. Verification
- [ ] Success toast shown after every successful action
- [ ] Error toast shown on API failure

---

### Task: 9.6 — Update Campaign Status in UI After Action

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 3. From design.md
- **Pattern**: TanStack Query cache invalidation after mutations

#### 4. Implementation
```typescript
// After successful action: invalidate review queue query
// Campaign moves to new status group immediately (optimistic update)
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['campaigns', 'review-queue'] })
}
```

#### 5. Verification
- [ ] Campaign moves to correct status group after action
- [ ] No page refresh required

---

### Task: 9.7 — Integrate with Approval/Rejection API Endpoints

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3

#### 3. From design.md
- **Endpoints**: `/api/v1/admin/campaigns/:id/approve`, `/reject`, `/request-revision`

#### 4. Implementation
```typescript
// POST /api/v1/admin/campaigns/:id/approve   → { reviewerId }
// POST /api/v1/admin/campaigns/:id/reject    → { reviewerId, comment }
// POST /api/v1/admin/campaigns/:id/request-revision → { reviewerId, comment }
```

#### 5. Verification
- [ ] All three endpoints integrated
- [ ] Request payloads match backend schema

---

### Task: 9.8 — Add Keyboard Shortcuts for Common Actions

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 3, 30

#### 2. From requirements.md
- **Requirement 30.5**: Provide keyboard navigation support

#### 4. Implementation
```typescript
// useKeyboardShortcuts(['a', () => handleApprove()], ['r', () => handleReject()], ['v', () => handleRevision()])
// Tooltip overlay showing shortcuts on '?' keypress
```

#### 5. Verification
- [ ] A/R/V shortcuts trigger corresponding actions
- [ ] Shortcuts disabled when modal is open

---

### Task: 10.1 — Display Overall Quality Score with Visual Indicator

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 2. From requirements.md
- **Requirement 4.1**: Display quality score based on clarity, completeness, and bias detection
- **Requirement 4.3**: Flag campaigns below configurable threshold as high-risk

#### 3. From design.md
- **Interface**:
```typescript
interface QualityScore {
  overall: number; clarity: number; completeness: number;
  biasDetection: number; flaggedIssues: QualityIssue[];
}
```

#### 4. Implementation
```typescript
// QualityScoreBadge: circular progress indicator + numeric score (0-100)
// Color: green (>70), amber (40-70), red (<40) — high-risk threshold configurable (Req 4.3)
// HIGH RISK badge overlaid on campaign card when below threshold
```

#### 5. Verification
- [ ] Score displayed on all campaign cards
- [ ] HIGH RISK badge visible for below-threshold campaigns

---

### Task: 10.2 — Show Quality Score Breakdown

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 2. From requirements.md
- **Requirement 4.2**: Display breakdown: question clarity score, logic complexity score, bias detection score

#### 4. Implementation
```typescript
// Expandable score breakdown panel:
// Clarity: 85/100 | Completeness: 70/100 | Bias Detection: 92/100
// Mini bar chart for visual comparison
```

#### 5. Verification
- [ ] All three component scores displayed
- [ ] Breakdown matches overall score calculation

---

### Task: 10.3 — Implement High-Risk Campaign Flagging

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 2. From requirements.md
- **Requirement 4.3**: WHEN quality score falls below configurable threshold, flag as high-risk

#### 4. Implementation
```typescript
// Threshold configurable by System Manager (Req 22.2)
// High-risk campaigns: pinned to top of Pending queue
// Visual: red border on campaign card + "HIGH RISK" badge
```

#### 5. Verification
- [ ] Threshold configurable (not hardcoded)
- [ ] High-risk campaigns surface above normal-risk ones

---

### Task: 10.4 — Create Review Checklist with Automated Validation Results

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 2. From requirements.md
- **Requirement 4.4**: Provide review checklist with automated validation results and manual review items

#### 4. Implementation
```typescript
// ReviewChecklist component: automated items (checked/failed) + manual items (checkbox)
// Automated: grammar check, bias scan, logic validation, PII detection
// Manual: "Is the question purpose clear?", "Are response options appropriate?"
// Reviewer must check all manual items before approving
```

#### 5. Verification
- [ ] Automated results shown as pass/fail
- [ ] Manual items must be checked to enable approval

---

### Task: 10.5 — Display Bias Detection Warnings with Highlighted Text

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 2. From requirements.md
- **Requirement 4.5**: THE Quality_Scoring_System SHALL detect potential bias in question wording and flag problematic language

#### 4. Implementation
```typescript
// Highlighted text in question: problematic phrases marked in amber
// Tooltip explains why it's flagged: "Leading question - suggests preferred answer"
// Suggestion: alternative neutral wording
```

#### 5. Verification
- [ ] Biased phrases highlighted inline
- [ ] Each flag has explanation and suggestion

---

### Task: 10.6 — Add Quality Score Trend Visualization

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 3. From design.md
- **Pattern**: Recharts for data visualization

#### 4. Implementation
```typescript
// Line chart: quality score trend over campaign versions
// Shows improvement/degradation across revision cycles
```

#### 5. Verification
- [ ] Trend chart shows multiple data points if version history exists

---

### Task: 10.7 — Integrate with `/api/v1/admin/campaigns/:id/quality-score`

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 4

#### 4. Implementation
```typescript
export function useCampaignQualityScore(campaignId: string) {
  return useQuery({
    queryKey: ['campaigns', campaignId, 'quality-score'],
    queryFn: () => apiClient<QualityScore>(`/api/v1/admin/campaigns/${campaignId}/quality-score`)
  })
}
```

#### 5. Verification
- [ ] Quality score fetched per campaign
- [ ] Score updates after campaign revision

---

### Task: 11.1 — Add Multi-Select Functionality to Campaign List

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.1**: THE Campaign_Review_Dashboard SHALL provide multi-select functionality

#### 4. Implementation
```typescript
// Checkbox on each campaign card (appears on hover)
// "Select all in group" checkbox in status group header
// Selected count shown in floating action bar
```

#### 5. Verification
- [ ] Individual and select-all checkboxes work
- [ ] Selection state persists across filter changes

---

### Task: 11.2 — Create Bulk Action Toolbar

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.2**: WHEN multiple campaigns selected, enable bulk Approve and bulk Reject actions

#### 4. Implementation
```typescript
// FloatingBulkBar (visible when ≥2 campaigns selected): 
// "X campaigns selected | [Bulk Approve] [Bulk Reject] [Clear Selection]"
```

#### 5. Verification
- [ ] Bulk toolbar appears when 2+ campaigns selected
- [ ] Toolbar disappears when selection cleared

---

### Task: 11.3 — Implement Bulk Confirmation Modal

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.3**: Require confirmation before executing bulk actions

#### 4. Implementation
```typescript
// BulkConfirmModal: lists selected campaign titles
// "You are about to [approve/reject] N campaigns. This action cannot be undone."
// [Confirm] [Cancel]
```

#### 5. Verification
- [ ] Confirmation required for all bulk actions
- [ ] Campaign list shown in confirmation

---

### Task: 11.4 — Add Bulk Comment Input for Rejections

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.4**: Allow a single comment to be applied to all rejected campaigns

#### 4. Implementation
```typescript
// In BulkConfirmModal for reject: shared comment textarea
// Comment applied to all campaigns in batch
```

#### 5. Verification
- [ ] Single comment applied to all bulk-rejected campaigns
- [ ] Comment required for bulk rejection

---

### Task: 11.5 — Display Progress Indicator During Bulk Operations

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.5**: Display progress indicator during bulk operations and report success/failure for each campaign

#### 4. Implementation
```typescript
// ProgressModal: "Processing 15/20 campaigns..."
// Progress bar with percentage
// After completion: summary table (Campaign | Result | Error if failed)
```

#### 5. Verification
- [ ] Progress updated in real-time
- [ ] Success/failure reported per campaign

---

### Task: 11.6 — Show Success/Failure Report for Each Campaign

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 2. From requirements.md
- **Requirement 5.5**: Report success or failure for each campaign

#### 4. Implementation
```typescript
// BulkResultsTable: Campaign Title | Status (✓ Approved / ✗ Failed) | Error Message
// Downloadable as CSV
```

#### 5. Verification
- [ ] Every campaign in batch has result entry
- [ ] Failed campaigns show error reason

---

### Task: 11.7 — Integrate with Bulk Approve/Reject Endpoints

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 3. From design.md
- **Endpoints**: `/api/v1/admin/campaigns/bulk-approve`, `/bulk-reject`

#### 4. Implementation
```typescript
// POST /api/v1/admin/campaigns/bulk-approve → { campaignIds: string[] }
// POST /api/v1/admin/campaigns/bulk-reject  → { campaignIds: string[], comment: string }
// Response: { results: Array<{ campaignId, success, error? }> }
```

#### 5. Verification
- [ ] Bulk endpoints called with correct payload
- [ ] Results array processed for progress display

---

### Task: 11.8 — Add Bulk Operation Status Polling

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 5

#### 4. Implementation
```typescript
// If bulk operation is async: poll /api/v1/admin/campaigns/bulk-status/:jobId every 1s
// Update progress bar based on polling response
```

#### 5. Verification
- [ ] Polling stops on completion or error
- [ ] No memory leak from polling cleanup

---

## Phase 3: Platform Moderation Module

---

### Task: 12.1–12.8 — Content Moderation Dashboard

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 12.1–12.8
- **Requirements**: 6

#### 2. From requirements.md
- **Requirement 6.1**: Display Moderation_Queue with flagged campaigns, reported content, suspicious activity
- **Requirement 6.2**: Sort by severity, report count, submission date
- **Requirement 6.3**: Display flagged content, reporter info, reason for flagging
- **Requirement 6.4**: Filter by content type, severity level, report source
- **Requirement 6.5**: Display moderation metrics (queue size, average resolution time, action distribution)

#### 3. From design.md
- **Interface**:
```typescript
interface ModerationItem {
  id: string; type: 'campaign' | 'user_report' | 'suspicious_activity';
  content: any; severity: 'low' | 'medium' | 'high' | 'critical';
  aiConfidence?: number; reportCount: number; submittedAt: Date;
}
interface ModerationQueue {
  items: ModerationItem[]; totalCount: number;
  priorityDistribution: Record<string, number>; averageResolutionTime: number;
}
```
- **Endpoint**: `/api/v1/admin/moderation/queue`
- **Files**: `app/(admin)/moderation/page.tsx`, `src/components/moderation/`

#### 4. Implementation
```typescript
// ModerationDashboard: metrics bar | filter controls | sorted queue list
// Severity badges: critical (red), high (orange), medium (amber), low (blue)
// Item detail slide-over panel: flagged content + reporter info + AI suggestion
// Real-time SSE for new queue items
```

#### 5. Verification
- [ ] Queue displays all item types
- [ ] Severity sorting works correctly
- [ ] Filter by type/severity/source functional
- [ ] Metrics accurate

---

### Task: 13.1–13.8 — Content Moderation Actions

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 13.1–13.8
- **Requirements**: 7

#### 2. From requirements.md
- **Requirement 7.1**: Approve, Remove, Warn_User, or Escalate actions
- **Requirement 7.2**: Update campaign status and notify advertiser on removal
- **Requirement 7.3**: Send warning notification with policy violation details
- **Requirement 7.4**: Record all actions in Audit_Log with timestamp, moderator identity, action reason
- **Requirement 7.5**: Display AI confidence scores and suggested actions

#### 3. From design.md
- **Interface**:
```typescript
interface ModerationAction {
  type: 'approve' | 'remove' | 'warn_user' | 'suspend_user' | 'escalate';
  reason: string; duration?: number;
}
```
- **Endpoint**: `/api/v1/admin/moderation/:id/action`

#### 4. Implementation
```typescript
// Action panel: Approve | Remove | Warn User | Escalate
// AI suggestion shown with confidence percentage (Req 7.5)
// Reason input required for Remove/Warn/Escalate (Req 7.4 audit trail)
// Audit log: { action, moderatorId, timestamp, itemId, reason }
```

#### 5. Verification
- [ ] All four action types functional
- [ ] AI confidence score displayed when available
- [ ] Audit log entry created for every action

---

### Task: 14.1–14.8 — Spam and Duplicate Detection Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 14.1–14.8
- **Requirements**: 8

#### 2. From requirements.md
- **Requirement 8.1**: Display campaigns flagged as potential spam or duplicates
- **Requirement 8.2**: Flag campaigns with suspicious patterns
- **Requirement 8.3**: Display similar campaigns for duplicate comparison
- **Requirement 8.4**: Mark as spam and auto-reject future submissions from same advertiser
- **Requirement 8.5**: Keyword blacklist management interface

#### 3. From design.md
- **Endpoints**: `/api/v1/admin/moderation/spam-detection`, `/keyword-blacklist`

#### 4. Implementation
```typescript
// SpamDashboard: spam flags list | duplicate pairs | pattern statistics
// DuplicateCompare: side-by-side campaign diff view (Req 8.3)
// KeywordBlacklist: searchable list with add/remove functionality (Req 8.5)
// Spam-mark action: auto-reject toggle for advertiser (Req 8.4)
```

#### 5. Verification
- [ ] Duplicate campaigns shown side-by-side
- [ ] Blacklist CRUD operations work
- [ ] Auto-reject flag configurable per advertiser

---

### Task: 15.1–15.8 — User Account Management

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 15.1–15.8
- **Requirements**: 9

#### 2. From requirements.md
- **Requirement 9.1**: Search by username, email, or account ID
- **Requirement 9.2**: Display account history (campaigns, violations, warnings)
- **Requirement 9.3**: Suspend for duration or permanently ban
- **Requirement 9.4**: Require reason and notify user on suspension/ban
- **Requirement 9.5**: Record all account actions in Audit_Log

#### 3. From design.md
- **Interface**:
```typescript
interface UserAccountInfo {
  id: string; email: string; registrationDate: Date;
  campaignCount: number; violationHistory: Violation[];
  trustScore: number; status: 'active' | 'warned' | 'suspended' | 'banned';
}
interface Violation {
  id: string; type: string; description: string;
  severity: 'minor' | 'major' | 'severe'; date: Date; action: string;
}
```
- **Endpoints**: `/api/v1/admin/users/:id/suspend`, `/ban`

#### 4. Implementation
```typescript
// UserSearch: debounced search across username/email/ID
// UserProfile: account details + violation timeline + trust score
// SuspendModal: duration selector (1d/7d/30d/permanent) + reason textarea (Req 9.4)
// Audit log entry on every account action (Req 9.5)
```

#### 5. Verification
- [ ] Search returns results within 500ms
- [ ] Violation history shown chronologically
- [ ] Reason required before suspension/ban
- [ ] Audit log entry created

---

## Phase 4: Data Control Module

---

### Task: 16.1–16.8 — Data Access Control Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 16.1–16.8
- **Requirements**: 10

#### 2. From requirements.md
- **Requirement 10.1**: Show which users have access to which datasets
- **Requirement 10.2**: Grant or revoke data access permissions
- **Requirement 10.3**: Enforce access control rules on view/export attempts
- **Requirement 10.4**: Display data access requests requiring approval
- **Requirement 10.5**: Record all access grants/revocations in Audit_Log

#### 3. From design.md
- **Property 5**: Display all current access relationships without duplicates or omissions
- **Interface**:
```typescript
interface DataAccessControl {
  userId: string; datasetId: string; permissions: DataPermission[];
  grantedBy: string; grantedAt: Date; expiresAt?: Date;
}
interface DataPermission {
  action: 'read' | 'export' | 'analyze'; conditions?: DataCondition[];
}
```
- **Endpoints**: `/api/v1/admin/data/access-permissions`, `/access-requests`

#### 4. Implementation
```typescript
// AccessMatrix: users (rows) × datasets (cols) with permission icons (Property 5)
// GrantPermissionModal: user search + dataset select + permission type + expiry
// AccessRequestQueue: approve/deny with justification (Req 10.4)
// Audit log on every grant/revoke (Req 10.5)
```

#### 5. Verification
- [ ] Access matrix shows all relationships without duplicates (Property 5)
- [ ] Grant/revoke actions reflected immediately
- [ ] Audit log entry created for every permission change

---

### Task: 17.1–17.8 — Data Export and Anonymization

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 17.1–17.8
- **Requirements**: 11

#### 2. From requirements.md
- **Requirement 11.1**: Support CSV, Excel, and JSON export formats
- **Requirement 11.2**: Anonymization options: remove PII, aggregate responses, mask identifiers
- **Requirement 11.3**: Remove/mask PII fields when anonymization enabled
- **Requirement 11.4**: Filter by date range, demographics, or campaign
- **Requirement 11.5**: Record all exports in Audit_Log

#### 3. From design.md
- **Property 6**: Anonymization removes/masks all PII fields while preserving non-PII data
- **Interface**:
```typescript
interface ExportConfig {
  datasetId: string; format: 'csv' | 'excel' | 'json';
  anonymization: AnonymizationOptions; filters: DataFilters;
}
interface AnonymizationOptions {
  removePII: boolean; aggregateResponses: boolean;
  maskIdentifiers: boolean; customRules: AnonymizationRule[];
}
interface DataExportJob {
  id: string; requesterId: string; config: ExportConfig;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; createdAt: Date; downloadUrl?: string;
}
```
- **Endpoint**: `/api/v1/admin/data/export`

#### 4. Implementation
```typescript
// ExportWizard: 3-step flow: Configure → Anonymize → Review & Export
// PII field preview: before/after anonymization (Property 6 compliance)
// Job status polling: progress bar → download link on completion
// Audit log: { exportedFields, anonymizationSettings, recipient } (Req 11.5)
```

#### 5. Verification
- [ ] All three formats downloadable
- [ ] PII removed/masked when anonymization enabled (Property 6)
- [ ] Audit log records export details

---

### Task: 18.1–18.8 — Data Quality Validation Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 18.1–18.8
- **Requirements**: 12

#### 2. From requirements.md
- **Requirement 12.1**: Display quality metrics (completion rate, invalid count, duplicate count)
- **Requirement 12.2**: Flag responses with suspicious patterns (too-fast, straight-lining, inconsistent)
- **Requirement 12.3**: Mark responses as invalid and exclude from datasets
- **Requirement 12.4**: Bulk validation tools for removing multiple invalid responses
- **Requirement 12.5**: Display data quality report

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/data/quality`

#### 4. Implementation
```typescript
// QualityDashboard: metrics bar | suspicious response list | bulk action controls
// SuspiciousResponse card: completion time | pattern type | confidence score
// Bulk invalidate: select multiple → "Mark as Invalid" with confirmation
// QualityReport: validation results table downloadable as PDF
```

#### 5. Verification
- [ ] All three suspicious pattern types detected and displayed
- [ ] Bulk invalidation works with confirmation
- [ ] Quality report downloadable

---

### Task: 19.1–19.8 — Data Retention and Deletion

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 19.1–19.8
- **Requirements**: 13

#### 2. From requirements.md
- **Requirement 13.1**: Retention policy configuration by data type
- **Requirement 13.2**: Auto-flag data exceeding retention period
- **Requirement 13.3**: Manual delete or scheduled automatic deletion
- **Requirement 13.4**: Require confirmation and record deletion in Audit_Log
- **Requirement 13.5**: Data deletion report

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/data/retention`

#### 4. Implementation
```typescript
// RetentionPolicyConfig: data type → retention period (days) configuration
// ExpiredDataList: flagged datasets with age indicator
// DeleteConfirmModal: "Permanently delete X records from campaign Y? This cannot be undone."
// ScheduleDeleteModal: date/time picker for future deletion
// DeletionReport: what was deleted, when, by whom (Req 13.5)
```

#### 5. Verification
- [ ] Retention periods configurable per data type
- [ ] Confirmation required before any deletion
- [ ] Deletion recorded in audit log

---

### Task: 20.1–20.8 — Real-Time Response Monitoring

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 20.1–20.8
- **Requirements**: 14

#### 2. From requirements.md
- **Requirement 14.1**: Real-time monitoring showing incoming responses by campaign
- **Requirement 14.2**: Display response rate, completion rate, average completion time
- **Requirement 14.3**: Alert on suspicious patterns
- **Requirement 14.4**: Filter by campaign, time range, demographics
- **Requirement 14.5**: Response distribution visualizations (geographic, demographic)

#### 3. From design.md
- **Pattern**: SSE for real-time updates; Recharts for visualizations
- **Endpoints**: `/api/v1/admin/monitoring/responses` + SSE

#### 4. Implementation
```typescript
// ResponseMonitor: live counter | rate chart | alert banner
// Recharts AreaChart for response rate over time
// Recharts PieChart for demographic breakdown (Req 14.5)
// Alert: "Response rate anomaly detected on Campaign X"
// SSE stream: new response events update counters in real-time
```

#### 5. Verification
- [ ] Response counts update without page refresh
- [ ] Geographic and demographic charts render
- [ ] Anomaly alerts appear within 30 seconds

---

## Phase 5: Compliance Module

---

### Task: 21.1–21.8 — Privacy Compliance Settings Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 21.1–21.8
- **Requirements**: 15

#### 2. From requirements.md
- **Requirement 15.1**: Privacy compliance configuration for GDPR, CCPA, and regional regulations
- **Requirement 15.2**: Enable/disable compliance features (consent tracking, data portability, right to deletion)
- **Requirement 15.3**: Display current compliance status per regulation
- **Requirement 15.4**: Record compliance setting changes in Audit_Log
- **Requirement 15.5**: Compliance documentation templates

#### 3. From design.md
- **Interface**:
```typescript
interface ComplianceRegulation {
  id: string; name: 'GDPR' | 'CCPA' | 'PIPEDA' | 'LGPD';
  enabled: boolean; settings: RegulationSettings; lastUpdated: Date;
}
```
- **Endpoint**: `/api/v1/admin/compliance/settings`

#### 4. Implementation
```typescript
// ComplianceDashboard: regulation cards with status indicator + feature toggles
// Each regulation card: enabled toggle | feature switches | status badge
// Status: Compliant (green) / Partial (amber) / Non-Compliant (red)
// DocumentationTemplates: downloadable privacy policy templates (Req 15.5)
// Audit log on every settings change (Req 15.4)
```

#### 5. Verification
- [ ] All regulations (GDPR, CCPA, PIPEDA, LGPD) configurable
- [ ] Compliance status reflects current settings
- [ ] Setting changes recorded in audit log

---

### Task: 22.1–22.8 — Consent Management Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 22.1–22.8
- **Requirements**: 16

#### 2. From requirements.md
- **Requirement 16.1**: Display consent status for all users
- **Requirement 16.2**: Show consent type, date, and version
- **Requirement 16.3**: View consent history (grants and withdrawals)
- **Requirement 16.4**: Flag users without required consent
- **Requirement 16.5**: Consent audit report

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/compliance/consent`

#### 4. Implementation
```typescript
// ConsentDashboard: summary metrics | user consent table
// ConsentTable columns: user | consent type | date | version | status
// Missing consent filter: highlight users needing consent action (Req 16.4)
// ConsentHistory modal: timeline of grant/withdrawal events (Req 16.3)
// ConsentAuditReport: exportable compliance coverage report (Req 16.5)
```

#### 5. Verification
- [ ] Users without consent flagged distinctly
- [ ] Consent history shows full timeline per user
- [ ] Audit report exportable

---

### Task: 23.1–23.8 — PII Detection System

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 23.1–23.8
- **Requirements**: 17

#### 2. From requirements.md
- **Requirement 17.1**: Scan campaigns for PII-requesting questions
- **Requirement 17.2**: Identify email, phone, SSN, credit card patterns
- **Requirement 17.3**: Alert Compliance Officer and suggest anonymization on detection
- **Requirement 17.4**: Scan response data free-text for unexpected PII
- **Requirement 17.5**: PII detection report

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/compliance/pii-scan`

#### 4. Implementation
```typescript
// PIIScanner: campaign scan tab | response scan tab
// Detection results: PII type | location (question ID / field) | confidence
// Alert banner: "PII detected in Campaign X - review required" (Req 17.3)
// Anonymization suggestion inline with each finding (Req 17.3)
// PIIReport: all findings exportable (Req 17.5)
```

#### 5. Verification
- [ ] All four PII types detected
- [ ] Alert triggered on detection
- [ ] Report covers both campaign and response PII

---

### Task: 24.1–24.8 — Survey Compliance Checker

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 24.1–24.8
- **Requirements**: 18

#### 2. From requirements.md
- **Requirement 18.1**: Validate campaigns against configured Compliance_Rules
- **Requirement 18.2**: Validate question wording, consent requirements, data collection, regional restrictions
- **Requirement 18.3**: Display violations with explanation and remediation suggestion
- **Requirement 18.4**: Override compliance warnings with justification
- **Requirement 18.5**: Prevent approval if critical violations detected

#### 3. From design.md
- **Endpoints**: `/api/v1/admin/compliance/check`, `/rules`

#### 4. Implementation
```typescript
// ComplianceChecker: runs automatically when campaign enters review
// ViolationList: severity (critical/warning) | rule | explanation | remediation
// OverrideModal: justification textarea required (Req 18.4)
// Critical violations: approval button disabled with explanation (Req 18.5)
// RuleManagement: CRUD for compliance rules
```

#### 5. Verification
- [ ] Critical violations prevent campaign approval
- [ ] Overrides require written justification
- [ ] All four validation areas checked

---

### Task: 25.1–25.8 — Regional Restriction Management

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 25.1–25.8
- **Requirements**: 19

#### 2. From requirements.md
- **Requirement 19.1**: Define allowed and blocked regions by campaign or category
- **Requirement 19.2**: Specify by country, state, or custom geographic boundary
- **Requirement 19.3**: Validate campaigns against regional restrictions before approval
- **Requirement 19.4**: Prevent campaigns from reaching respondents in restricted regions
- **Requirement 19.5**: Record restriction configurations in Audit_Log

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/compliance/regional-restrictions`

#### 4. Implementation
```typescript
// RegionalRestrictionConfig: interactive world map + country/state list
// AllowList / BlockList toggle per campaign or global category
// Restriction validation runs during campaign review (Req 19.3)
// Audit log on every restriction change (Req 19.5)
```

#### 5. Verification
- [ ] Country and state granularity supported
- [ ] Restriction applied before campaign goes live
- [ ] Changes recorded in audit log

---

### Task: 26.1–26.8 — Data Request Handling

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 26.1–26.8
- **Requirements**: 20

#### 2. From requirements.md
- **Requirement 20.1**: Display data request queue (export, deletion, correction)
- **Requirement 20.2**: Display request type, user identity, requested data scope
- **Requirement 20.3**: Approve or deny with justification
- **Requirement 20.4**: Generate data package for export requests
- **Requirement 20.5**: Permanently delete user data on approved deletion request and record in Audit_Log

#### 3. From design.md
- **Interface**:
```typescript
interface DataRequest {
  id: string; userId: string; type: 'export' | 'deletion' | 'correction';
  status: 'pending' | 'processing' | 'completed' | 'denied';
  requestedAt: Date; deadline: Date;
}
```
- **Endpoint**: `/api/v1/admin/compliance/requests`

#### 4. Implementation
```typescript
// DataRequestQueue: type filter | deadline indicator | approve/deny actions
// Deadline badge: overdue (red), due soon (amber), on track (green)
// ExportPackageModal: progress bar → secure download link (Req 20.4)
// DeletionConfirmModal: "Permanently delete ALL data for user X?" (Req 20.5)
// Audit log: deletion recorded with scope and timestamp (Req 20.5)
```

#### 5. Verification
- [ ] All three request types handled
- [ ] Data package generated for export requests
- [ ] Deletion confirmed with user and audit logged

---

## Phase 6: System Management Module

---

### Task: 27.1–27.8 — User and Role Management Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 27.1–27.8
- **Requirements**: 21

#### 2. From requirements.md
- **Requirement 21.1**: Display all admin users with assigned roles
- **Requirement 21.2**: Create, modify, or deactivate admin user accounts
- **Requirement 21.3**: RBAC supports all 5 roles
- **Requirement 21.4**: Configure custom roles with granular permissions
- **Requirement 21.5**: Record all user/role changes in Audit_Log

#### 3. From design.md
- **Property 7**: Any valid user operation completes successfully and reflects in UI
- **Interface**:
```typescript
interface UserAction {
  type: 'create' | 'update' | 'deactivate' | 'reset_password';
  data: Partial<AdminUser>;
}
```
- **Endpoints**: `/api/v1/admin/users/administrators`, `/roles`

#### 4. Implementation
```typescript
// AdminUserTable: columns: name | email | role | status | last login | actions
// CreateUserModal: React Hook Form with Zod (Req 21.2, Property 7)
// RoleMatrix: permission grid showing resource × action (Req 21.4)
// CustomRoleBuilder: drag-and-drop permission assignment
// Audit log on every user/role change (Req 21.5)
```

#### 5. Verification
- [ ] CRUD operations work for all user accounts (Property 7)
- [ ] Custom roles persist permissions correctly
- [ ] All changes recorded in audit log

---

### Task: 28.1–28.8 — Platform Configuration Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 28.1–28.8
- **Requirements**: 22

#### 2. From requirements.md
- **Requirement 22.1**: Platform configuration interface for system-wide settings
- **Requirement 22.2**: Configure campaign limits, quotas, review SLA targets, notification preferences
- **Requirement 22.3**: Validate configuration changes before applying
- **Requirement 22.4**: Notify affected users when configuration changes applied
- **Requirement 22.5**: Record configuration changes with previous and new values

#### 3. From design.md
- **Interface**:
```typescript
interface SystemConfig { /* campaign limits, SLA targets, notification settings */ }
```
- **Endpoint**: `/api/v1/admin/config/platform`

#### 4. Implementation
```typescript
// PlatformConfigForm: tabbed by category (Campaigns | SLAs | Notifications)
// Validation: Zod schema for all config values (Req 22.3)
// ChangePreviewModal: "Previous: X → New: Y" before saving (Req 22.5)
// Notification: alert affected users after config change (Req 22.4)
// Audit log: { field, previousValue, newValue } (Req 22.5)
```

#### 5. Verification
- [ ] Invalid configurations rejected with explanation
- [ ] Previous and new values both recorded in audit log
- [ ] Affected users notified of changes

---

### Task: 29.1–29.8 — Template and Question Bank Management

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 29.1–29.8
- **Requirements**: 23

#### 2. From requirements.md
- **Requirement 23.1**: Create, edit, and delete survey templates
- **Requirement 23.2**: Create question banks organized by category
- **Requirement 23.3**: Template versioning and change tracking
- **Requirement 23.4**: Mark templates/questions as recommended or featured
- **Requirement 23.5**: Display usage statistics

#### 3. From design.md
- **Endpoints**: `/api/v1/templates`, `/question-bank`

#### 4. Implementation
```typescript
// TemplateManager: list | create/edit modal | version history (Req 23.3)
// QuestionBank: category tree | question list | add/edit/delete
// FeaturedToggle: star icon to mark recommended (Req 23.4)
// UsageStats: usage count | average rating chart (Req 23.5)
// TemplatePreview: renders template as respondent would see
```

#### 5. Verification
- [ ] Template versioning tracks changes
- [ ] Usage statistics displayed per template
- [ ] Featured marking persists

---

### Task: 30.1–30.8 — Notification System Management

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 30.1–30.8
- **Requirements**: 24

#### 2. From requirements.md
- **Requirement 24.1**: Configure notification triggers and delivery methods
- **Requirement 24.2**: Configure templates for campaign approval, rejection, warnings
- **Requirement 24.3**: Support email, in-app, and webhook delivery
- **Requirement 24.4**: Enable/disable specific notification types
- **Requirement 24.5**: Display notification delivery metrics

#### 3. From design.md
- **Endpoint**: `/api/v1/notifications/templates`

#### 4. Implementation
```typescript
// NotificationConfig: event type table with delivery method toggles
// TemplateEditor: rich text editor for email templates with variable insertion
// WebhookConfig: URL input + secret + test button (Req 24.3)
// DeliveryMetrics: delivery rate | failure count | per-channel breakdown (Req 24.5)
// TestNotification: send test notification for any event type
```

#### 5. Verification
- [ ] All three delivery methods configurable
- [ ] Template variables rendered in preview
- [ ] Delivery metrics accurate

---

### Task: 31.1–31.8 — System Performance Dashboard

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 31.1–31.8
- **Requirements**: 25

#### 2. From requirements.md
- **Requirement 25.1**: Display response time, error rate, active user count
- **Requirement 25.2**: Real-time metrics updated at least every 30 seconds
- **Requirement 25.3**: Historical performance data with configurable time ranges
- **Requirement 25.4**: Alert when metrics exceed thresholds
- **Requirement 25.5**: Display backend API health and database connection status

#### 3. From design.md
- **Interface**:
```typescript
interface SystemMetrics {
  activeUsers: number; responseTime: number; errorRate: number;
  queueSizes: QueueMetrics; systemHealth: HealthStatus;
}
```
- **Endpoints**: `/api/v1/admin/system/health`, `/metrics`

#### 4. Implementation
```typescript
// PerformanceDashboard: KPI cards | time-series charts | health indicators
// Auto-refresh every 30s (Req 25.2) with last-updated timestamp
// TimeRangePicker: 1h | 6h | 24h | 7d | 30d (Req 25.3)
// AlertBanner: "Response time threshold exceeded: 850ms (threshold: 500ms)"
// HealthGrid: API endpoints × DB connections status (green/red dots) (Req 25.5)
```

#### 5. Verification
- [ ] Metrics refresh every 30 seconds or less
- [ ] Threshold alerts appear correctly
- [ ] Database and API health status visible

---

### Task: 32.1–32.8 — Feature Toggle Management

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 32.1–32.8
- **Requirements**: 26

#### 2. From requirements.md
- **Requirement 26.1**: List all configurable features
- **Requirement 26.2**: Enable/disable for all users or specific segments
- **Requirement 26.3**: Apply immediately without system restart
- **Requirement 26.4**: Display feature usage statistics
- **Requirement 26.5**: Record toggle changes in Audit_Log

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/config/features`

#### 4. Implementation
```typescript
// FeatureToggleTable: feature name | description | scope | enabled toggle | usage %
// ScopeSelect: All Users | User Segment (select segment from dropdown)
// Immediate apply: mutation → optimistic update → SSE broadcast (Req 26.3)
// UsageChart: adoption rate over time per feature (Req 26.4)
// Audit log: { feature, previousState, newState, scope } (Req 26.5)
```

#### 5. Verification
- [ ] Toggles apply immediately (no restart required)
- [ ] Segment-specific toggles work
- [ ] All changes audit logged

---

### Task: 33.1–33.8 — System Logs and Monitoring Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 33.1–33.8
- **Requirements**: 27

#### 2. From requirements.md
- **Requirement 27.1**: Display system logs, error logs, access logs
- **Requirement 27.2**: Filter by log level, timestamp, user, log source
- **Requirement 27.3**: Full-text search across log messages
- **Requirement 27.4**: Export logs for external analysis
- **Requirement 27.5**: Display error frequency reports

#### 3. From design.md
- **Endpoint**: `/api/v1/admin/logs/application`

#### 4. Implementation
```typescript
// LogViewer: virtualized list (react-virtual) for performance with large log datasets
// FilterBar: level (DEBUG/INFO/WARN/ERROR) | source | user | date range (Req 27.2)
// SearchBox: debounced full-text search (Req 27.3)
// ExportButton: downloads filtered logs as JSON/CSV (Req 27.4)
// ErrorFrequencyChart: top errors by count with trend line (Req 27.5)
```

#### 5. Verification
- [ ] Virtualized list handles 10k+ log entries
- [ ] Full-text search works across message field
- [ ] Export downloads all filtered results

---

## Phase 7: Shared Infrastructure & Features

---

### Task: 34.1–34.8 — Audit Log Viewer

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 34.1–34.8
- **Requirements**: 28

#### 2. From requirements.md
- **Requirement 28.1**: Display all admin actions with timestamp, user, action type, affected resources
- **Requirement 28.2**: Filter by date range, user, action type, resource
- **Requirement 28.3**: Full-text search across audit log entries
- **Requirement 28.4**: Detailed info per entry including before/after values
- **Requirement 28.5**: Export audit logs for compliance reporting

#### 3. From design.md
- **Property 8**: Filtering returns only entries matching ALL specified criteria
- **Interface**:
```typescript
interface AuditLogEntry {
  id: string; userId: string; action: string; resource: string;
  resourceId?: string; details: Record<string, any>;
  timestamp: Date; ipAddress: string; userAgent: string; sessionId: string;
}
```
- **Endpoint**: `/api/v1/admin/audit-logs`

#### 4. Implementation
```typescript
// AuditLogViewer: filterable table with virtualization
// FilterPanel: dateRange | userId | actionType | resource (Property 8)
// DetailDrawer: full entry with before/after JSON diff (Req 28.4)
// SearchBar: full-text across action/resource/details fields (Req 28.3)
// ExportModal: date range → CSV/JSON download (Req 28.5)
// Real-time streaming: new entries append to top via SSE
```

#### 5. Verification
- [ ] Filtering returns only matching entries (Property 8)
- [ ] Before/after values shown in detail view
- [ ] Export includes all filtered entries

---

### Task: 35.1–35.8 — Real-Time Notification System

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 35.1–35.8
- **Requirements**: 3, 7, 9, 24

#### 2. From requirements.md
- **Requirement 3.3**: Notify advertiser on campaign approval
- **Requirement 7.3**: Send warning notification to user
- **Requirement 24.3**: Support email, in-app, and webhook notifications

#### 3. From design.md
- **Pattern**: Server-Sent Events (SSE) for live notifications; role-based notification filtering
- **Endpoint**: `/api/v1/sse/notifications`

#### 4. Implementation
```typescript
// src/hooks/useSSE.ts — persistent EventSource connection
// Auto-reconnect on disconnect with exponential backoff
// NotificationBell: unread count badge in header
// NotificationPanel: slide-over with notification history
// Role-based filtering: SSE events filtered server-side by role
// ToastNotification: appears for high-priority events with action button
```

#### 5. Verification
- [ ] SSE reconnects automatically on failure
- [ ] Notifications filtered by current user's role
- [ ] Notification history persists across page navigation

---

### Task: 36.1–36.8 — Data Visualization Components

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 36.1–36.8
- **Requirements**: 1, 6, 14, 25

#### 3. From design.md
- **Pattern**: Recharts for analytics; real-time updating charts; responsive design
- **Files**: `src/components/charts/`

#### 4. Implementation
```typescript
// LineChart — response rate over time (Req 14.2), performance trends (Req 25.3)
// BarChart — moderation action distribution (Req 6.5), error frequency (Req 27.5)
// PieChart — demographic breakdown (Req 14.5)
// AreaChart — real-time response volume
// All charts: responsive container | loading skeleton | error fallback | export PNG
```

#### 5. Verification
- [ ] Charts update in real-time for live data
- [ ] Responsive on all screen sizes
- [ ] Export functionality works

---

### Task: 37.1–37.8 — Error Handling System

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 37.1–37.8
- **Requirements**: 29, 30

#### 3. From design.md
- **Error Categories**:
  - Auth errors → token refresh → login redirect
  - API errors → retry with backoff → offline mode → cached data
  - Validation errors → field highlights → guidance display
  - Real-time errors → reconnect → fallback polling

#### 4. Implementation
```typescript
// GlobalErrorBoundary wraps app root — catches unhandled component errors
// useApiError hook: maps HTTP status codes to user-friendly messages
// OfflineDetector: navigator.onLine watcher → OfflineBanner component
// FallbackPolling: replaces SSE with polling on EventSource failure
// ErrorLogger: sends errors to monitoring endpoint
```

#### 5. Verification
- [ ] Unhandled errors show friendly fallback UI
- [ ] Offline state clearly indicated
- [ ] All error types handled per design.md categories

---

### Task: 38.1–38.8 — Responsive Interface

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 38.1–38.8
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.1**: Render correctly on desktop, tablet, and mobile
- **Requirement 30.2**: Adapt layout and navigation for different screen sizes
- **Requirement 30.3**: Maintain functionality on touch-enabled devices
- **Requirement 30.4**: Load within 3 seconds on standard broadband
- **Requirement 30.5**: Keyboard navigation support

#### 4. Implementation
```typescript
// Responsive breakpoints: mobile (<640px) | tablet (640-1024px) | desktop (>1024px)
// Mobile: stacked layout, bottom navigation, full-width cards
// Tablet: collapsible sidebar, 2-column grids
// Desktop: full sidebar, multi-column layouts
// Touch: swipe gestures for sidebar, large tap targets (≥44px) (Req 30.3)
// Performance: code splitting per route, image optimization (Req 30.4)
// Accessibility: skip links, focus indicators, ARIA landmarks (Req 30.5)
```

#### 5. Verification
- [ ] All layouts tested at 375px, 768px, 1280px viewports
- [ ] Touch interactions work on iOS Safari and Android Chrome
- [ ] Lighthouse performance score ≥ 90
- [ ] Keyboard-only navigation tested for all workflows

---

## Phase 8: Testing & Quality Assurance

---

### Task: 39.1–39.8 — Unit Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 39.1–39.8
- **Requirements**: All

#### 3. From design.md
- **Pattern**: Jest + React Testing Library; 85% code coverage; 95% for security-critical paths

#### 4. Implementation
```typescript
// jest.config.ts: coverage thresholds { lines: 85, branches: 80, functions: 85 }
// Security paths (auth, RBAC): coverage threshold 95%
// Test files: *.test.tsx co-located with components
// Key test areas:
// - useAuth: login/logout/refresh flows
// - RBAC: permission checking for all 5 roles
// - groupCampaignsByStatus: property under test (Property 1)
// - Form validation: all Zod schemas
// - API client: interceptors, retry logic
```

#### 5. Verification
- [ ] 85% line coverage achieved
- [ ] 95% coverage for auth and RBAC modules
- [ ] All Zod validation schemas have passing tests

---

### Task: 40.1–40.10 — Property-Based Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 40.1–40.10
- **Requirements**: Per property

#### 3. From design.md
- **Pattern**: fast-check library; minimum 100 iterations per property; tagged with feature+property reference

#### 4. Implementation
```typescript
// Feature: system-admin-frontend
// Property 1 (Req 1.1): groupCampaignsByStatus — each campaign in exactly one group
// Property 2 (Req 1.2): CampaignCard — renders all required metadata fields
// Property 3 (Req 2.1): CampaignPreview — displays all questions and logic
// Property 4 (Req 3.5): auditLogger — every action produces complete log entry
// Property 5 (Req 10.1): AccessMatrix — no duplicates or omissions in display
// Property 6 (Req 11.3): anonymizeData — all PII fields removed when enabled
// Property 7 (Req 21.2): userOperations — valid ops complete and reflect in UI
// Property 8 (Req 28.2): auditLogFilter — returns only fully matching entries
// Property 9 (Req 29.1): authGuard — rejects all unauthenticated access attempts

fc.assert(fc.property(arbitrary, predicate), { numRuns: 100 })
```

#### 5. Verification
- [ ] All 9 properties implemented
- [ ] Each property runs 100 iterations
- [ ] Property tests tagged with feature name and property number

---

### Task: 41.1–41.8 — Integration Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 41.1–41.8
- **Requirements**: All

#### 3. From design.md
- **Pattern**: Mock Service Worker (MSW) for API mocking; test complete workflows

#### 4. Implementation
```typescript
// src/mocks/handlers.ts: MSW request handlers for all /api/v1/* endpoints
// Integration test workflows:
// - Campaign review: login → view queue → preview → approve → audit log
// - Moderation: flag item → review → remove → notify user
// - Data export: configure → anonymize → download
// - Compliance check: submit campaign → detect violation → override
// - Real-time: SSE mock → event received → UI updated
```

#### 5. Verification
- [ ] All key workflows covered by integration tests
- [ ] MSW handlers cover all endpoints
- [ ] SSE mock works in test environment

---

### Task: 42.1–42.8 — Security Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 42.1–42.8
- **Requirements**: 29

#### 3. From design.md
- **Pattern**: Authentication Testing, RBAC Testing, Input Sanitization, Audit Testing

#### 4. Implementation
```typescript
// Auth tests: expired token → refresh, invalid token → login redirect
// RBAC tests: campaign_reviewer cannot access /system routes
// XSS tests: rendered user-generated content escaped properly
// CSRF: SameSite cookie attribute verified
// Audit completeness: every action type has corresponding audit log entry
// Session timeout: inactive session auto-logout verified
```

#### 5. Verification
- [ ] No XSS vulnerabilities in user-generated content rendering
- [ ] RBAC prevents cross-role access
- [ ] All security paths have 95%+ coverage

---

### Task: 43.1–43.8 — Accessibility Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 43.1–43.8
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.5**: Keyboard navigation support

#### 3. From design.md
- **Pattern**: axe-core for WCAG 2.1 AA; keyboard navigation; screen reader compatibility

#### 4. Implementation
```typescript
// jest-axe: axe(container) in every component test
// Keyboard nav test: tab through full campaign review workflow
// ARIA: role="navigation", role="main", aria-label on interactive elements
// Color contrast: verified in Tailwind theme config (4.5:1 minimum)
// Focus management: modal open/close focus trapping tested
```

#### 5. Verification
- [ ] Zero axe-core violations in component tests
- [ ] Keyboard-only workflow completion verified
- [ ] WCAG 2.1 AA compliance confirmed

---

### Task: 44.1–44.8 — End-to-End Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 44.1–44.8
- **Requirements**: All

#### 3. From design.md
- **Pattern**: Playwright for E2E testing; complete admin workflows per role

#### 4. Implementation
```typescript
// playwright.config.ts: test against local dev server or staging
// E2E flows:
// - Campaign review: login as campaign_reviewer → review queue → approve
// - Moderation: login as platform_moderator → queue → remove content
// - Data export: login as data_controller → configure → download
// - Compliance: login as compliance_officer → check campaign
// - User management: login as system_manager → create admin user
// - Cross-role: reviewer action appears in system_manager audit log
// - Error: API down → error boundary → retry
```

#### 5. Verification
- [ ] All 5 role-specific workflows pass E2E tests
- [ ] Cross-role interactions tested
- [ ] Error recovery scenarios tested

---

### Task: 45.1–45.8 — Performance Tests

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 45.1–45.8
- **Requirements**: 30

#### 2. From requirements.md
- **Requirement 30.4**: Load within 3 seconds on standard broadband

#### 3. From design.md
- **Benchmarks**:
  - Initial page load < 2 seconds
  - Real-time updates < 500ms latency
  - Large dataset operations < 5 seconds

#### 4. Implementation
```typescript
// Lighthouse CI: performance budget in CI pipeline
// Bundle analysis: next-bundle-analyzer for size monitoring
// Load test: k6 script simulating 50 concurrent admin users
// Large dataset: test DataTable with 10k audit log entries
// Memory leak: Playwright session running for 30 minutes
// Code splitting: dynamic imports for each role module
```

#### 5. Verification
- [ ] Lighthouse performance score ≥ 90
- [ ] Initial load < 2 seconds on throttled connection
- [ ] No memory leaks in 30-minute sessions
- [ ] Real-time update latency < 500ms

---

## Phase 9: Documentation & Deployment

---

### Task: 46.1–46.8 — Create Documentation

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 46.1–46.8
- **Requirements**: All

#### 4. Implementation
- `README.md`: project overview, quick start, architecture diagram
- `docs/auth.md`: JWT flow, MFA setup, session management
- `docs/components.md`: component storybook or JSDoc examples
- `docs/api-integration.md`: endpoint mapping, error handling patterns
- `docs/deployment.md`: environment setup, build commands
- `docs/env-variables.md`: all required env vars with descriptions
- `docs/roles/`: one guide per admin role

#### 5. Verification
- [ ] README enables new developer setup in < 30 minutes
- [ ] All env variables documented
- [ ] Per-role user guides complete

---

### Task: 47.1–47.8 — Set Up CI/CD Pipeline

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 47.1–47.8
- **Requirements**: All

#### 3. From design.md
- **Pattern**: `Lint → TypeCheck → Test → Security → Coverage → Deploy`

#### 4. Implementation
```yaml
# .github/workflows/ci.yml
# Steps: checkout → setup-node → install → lint → typecheck → test → security-scan → coverage-report → build → deploy
# Coverage upload to Codecov
# Security: npm audit + Snyk scan
# Deploy: Vercel or Docker to staging
```

#### 5. Verification
- [ ] CI runs on every PR
- [ ] Coverage report generated and uploaded
- [ ] Security scan blocks on high severity findings

---

### Task: 48.1–48.8 — Production Deployment

**Status**: [ ]

#### 1. From tasks.md
- **Sub-steps**: 48.1–48.8
- **Requirements**: 29, 30

#### 4. Implementation
- Configure production env vars in deployment platform
- CDN for static assets (Next.js output: `/_next/static/`)
- SSL/TLS via platform (Vercel) or Let's Encrypt
- Error tracking: Sentry with source maps
- Logging: structured JSON logs to CloudWatch/Datadog
- Backup: database snapshots (backend responsibility)
- Security audit: OWASP ZAP scan against staging before prod deploy

#### 5. Verification
- [ ] HTTPS enforced on all routes
- [ ] Error tracking captures and alerts on production errors
- [ ] Security audit passes before go-live

---

## Phase 10: Post-Launch & Optimization

---

### Task: 49.1–49.8 — Monitor and Optimize Performance

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: 30, 25

#### 4. Implementation
- Core Web Vitals monitoring via Vercel Analytics or custom RUM
- Bundle size budget: set in `next.config.ts` `experimental.bundlePagesExternals`
- Route-level code splitting: `dynamic(() => import('@/components/review/...'))` per role module
- TanStack Query stale-while-revalidate caching strategy
- Image optimization: `next/image` with appropriate sizes

#### 5. Verification
- [ ] LCP < 2.5s, CLS < 0.1, FID < 100ms
- [ ] Bundle size alerts configured
- [ ] Performance regressions caught in CI

---

### Task: 50.1–50.8 — Gather Feedback and Iterate

**Status**: [ ]

#### 1. From tasks.md
- **Requirements**: All

#### 4. Implementation
- In-app feedback widget (thumbs up/down per page)
- Error rate monitoring dashboard (Req 25.1 reuse)
- Usage analytics: page views per role, feature adoption rates
- Quarterly admin review sessions per role
- Accessibility re-audit after major updates

#### 5. Verification
- [ ] Feedback collection active on all admin pages
- [ ] Error rate baseline established
- [ ] Iterative improvement process documented

---

## Appendix: Quick Reference

### All API Endpoints

| Module | Endpoint |
|--------|----------|
| Auth | `POST /api/v1/auth/login`, `/refresh`, `/logout`, `/mfa/verify` |
| Campaign Review | `GET /api/v1/admin/campaigns/review-queue` |
| Campaign Actions | `POST /api/v1/admin/campaigns/:id/approve`, `/reject`, `/request-revision` |
| Quality Score | `GET /api/v1/admin/campaigns/:id/quality-score` |
| Bulk Actions | `POST /api/v1/admin/campaigns/bulk-approve`, `/bulk-reject` |
| Moderation | `GET /api/v1/admin/moderation/queue`, `POST /api/v1/admin/moderation/:id/action` |
| Spam Detection | `GET /api/v1/admin/moderation/spam-detection`, `/keyword-blacklist` |
| User Management | `POST/PATCH /api/v1/admin/users/:id/suspend`, `/ban` |
| Data Access | `GET/POST /api/v1/admin/data/access-permissions`, `/access-requests` |
| Data Export | `POST /api/v1/admin/data/export` |
| Data Quality | `GET /api/v1/admin/data/quality` |
| Data Retention | `GET/POST /api/v1/admin/data/retention` |
| Response Monitor | `GET /api/v1/admin/monitoring/responses` (+ SSE) |
| Compliance | `GET/PUT /api/v1/admin/compliance/settings` |
| Consent | `GET /api/v1/admin/compliance/consent` |
| PII Scan | `POST /api/v1/admin/compliance/pii-scan` |
| Compliance Check | `POST /api/v1/admin/compliance/check`, `GET /rules` |
| Regional | `GET/PUT /api/v1/admin/compliance/regional-restrictions` |
| Data Requests | `GET /api/v1/admin/compliance/requests` |
| Admin Users | `GET/POST/PATCH /api/v1/admin/users/administrators`, `/roles` |
| Platform Config | `GET/PUT /api/v1/admin/config/platform` |
| Templates | `GET/POST/PUT/DELETE /api/v1/templates`, `/question-bank` |
| Notifications | `GET/PUT /api/v1/notifications/templates` |
| System Health | `GET /api/v1/admin/system/health`, `/metrics` |
| Feature Toggles | `GET/PUT /api/v1/admin/config/features` |
| App Logs | `GET /api/v1/admin/logs/application` |
| Audit Logs | `GET /api/v1/admin/audit-logs` |
| SSE | `GET /api/v1/sse/notifications` |
| Campaigns | `GET /api/v1/campaigns/:id`, `/flow-diagram` |

### Property-Based Test Summary

| Property | Requirement | Description |
|----------|-------------|-------------|
| 1 | 1.1 | Campaign status grouping — each campaign in exactly one group |
| 2 | 1.2 | Campaign metadata display — all required fields present |
| 3 | 2.1 | Campaign preview — all components preserved |
| 4 | 3.5 | Audit log — every action creates complete entry |
| 5 | 10.1 | Data access control — no duplicates or omissions |
| 6 | 11.3 | PII anonymization — all PII removed when enabled |
| 7 | 21.2 | User account operations — valid ops complete and reflect |
| 8 | 28.2 | Audit log filtering — returns only fully matching entries |
| 9 | 29.1 | Authentication — all unauthenticated access rejected |

### Admin Role Navigation Map

| Role | Primary Routes |
|------|---------------|
| `campaign_reviewer` | `/review`, `/review/:id`, `/review/bulk` |
| `platform_moderator` | `/moderation`, `/moderation/spam`, `/moderation/users` |
| `data_controller` | `/data/access`, `/data/export`, `/data/quality`, `/data/retention`, `/data/monitor` |
| `compliance_officer` | `/compliance/settings`, `/compliance/consent`, `/compliance/pii`, `/compliance/checker`, `/compliance/regions`, `/compliance/requests` |
| `system_manager` | `/system/users`, `/system/config`, `/system/templates`, `/system/notifications`, `/system/performance`, `/system/features`, `/system/logs` |
| All roles | `/audit-logs`, `/profile` |