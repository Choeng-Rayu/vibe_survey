# Implementation Plan: Survey Creator Frontend

## Overview

This implementation plan covers the development of the Survey Creator Frontend, an AI-enhanced React application built with Next.js, TypeScript, and Tailwind CSS. The application provides advertisers with a comprehensive interface for creating survey campaigns with integrated AI assistance, managing budgets, targeting audiences, and analyzing response data.

The implementation follows an incremental approach, building core infrastructure first, then adding features progressively with AI integration throughout. Each task includes specific requirements references for traceability.

## Tasks

### Phase 1: Project Setup and Core Infrastructure

- [ ] 1. Set up Next.js project structure with TypeScript and core dependencies
  - Initialize Next.js 16.2.4 with React 19.2.4 and TypeScript 5+
  - Configure Tailwind CSS v4 and shadcn/ui component library
  - Set up ESLint, Prettier (single quotes, trailing commas)
  - Configure path aliases (@/ for src directory)
  - Create base folder structure: app/, components/, lib/, hooks/, services/, types/
  - _Requirements: 16.1, 16.2, 16.3_

- [ ] 2. Implement authentication system and route protection
  - Create authentication service with JWT token management
  - Implement login and registration pages
  - Create protected route wrapper component
  - Implement session timeout (30 minutes) and auto-logout
  - Add password complexity validation
  - Create password reset flow with email verification
  - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.6_

- [ ] 2.1 Write unit tests for authentication service
  - Test token validation and refresh logic
  - Test session timeout behavior
  - Test password validation rules
  - _Requirements: 14.1, 14.2, 14.4_

- [ ] 3. Set up API client with TanStack Query integration
  - Create base API client with axios
  - Configure TanStack Query with default options
  - Implement request/response interceptors for auth tokens
  - Add retry logic with exponential backoff
  - Create error handling utilities
  - Implement request queuing for offline scenarios
  - _Requirements: 15.1, 15.5, 15.7, 15.9_

- [ ] 3.1 Write unit tests for API client
  - Test retry logic and exponential backoff
  - Test request queuing behavior
  - Test error handling for different response codes
  - _Requirements: 15.5, 15.9_

- [ ] 4. Implement Zustand state management stores
  - Create auth store for user session state
  - Create UI store for global UI state (theme, notifications)
  - Create AI conversation context store
  - Create campaign draft store with auto-save
  - Implement local storage persistence for critical state
  - _Requirements: 15.8, 16.10, 24.1, 24.2_

- [ ] 5. Create base layout components and navigation
  - Implement root layout with header, sidebar, and main content area
  - Create responsive navigation menu
  - Add user profile dropdown with logout
  - Implement breadcrumb navigation
  - Add notification badge for unread notifications
  - Ensure WCAG 2.1 Level AA compliance
  - _Requirements: 16.4, 16.7, 16.8, 17.8_

### Phase 2: Advertiser Registration and Verification

- [ ] 6. Implement advertiser registration form
  - Create multi-field registration form (name, email, phone, address)
  - Add email format and domain validation
  - Implement file upload for verification documents
  - Add form validation with Zod schemas
  - Display pending verification message after submission
  - _Requirements: 1.1, 1.2, 1.3, 1.7_

- [ ] 6.1 Write property test for registration form submission
  - **Property 1: Registration Form Submission Creates Pending Account**
  - **Validates: Requirements 1.1**
  - Test that any valid registration data creates pending account with correct data storage

- [ ] 6.2 Write property test for document upload
  - **Property 2: Document Upload Triggers Admin Review**
  - **Validates: Requirements 1.2**
  - Test that any valid document upload stores successfully and flags for review

- [ ] 7. Create verification status display and notifications
  - Display pending verification banner for unapproved accounts
  - Show approval/rejection notifications via email integration
  - Implement notification history panel
  - Block campaign creation for pending accounts
  - _Requirements: 1.4, 1.5, 1.6, 1.8_

### Phase 3: Campaign Creation Wizard Foundation

- [ ] 8. Build campaign wizard shell with step navigation
  - Create wizard container with progress indicator
  - Implement step navigation (forward/backward)
  - Add draft auto-save functionality every 30 seconds
  - Implement wizard state persistence in Zustand
  - Add exit confirmation dialog for unsaved changes
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6_

- [ ] 8.1 Write property test for wizard step completion
  - **Property 3: Wizard Step Completion Enables Navigation**
  - **Validates: Requirements 2.2**
  - Test that completing any valid step saves data and enables next step navigation

- [ ] 9. Implement campaign objective selection step
  - Create objective selection UI with templates
  - Provide objective options: brand awareness, product feedback, market research, customer satisfaction
  - Display objective descriptions and use cases
  - Validate objective selection before progression
  - _Requirements: 2.7, 2.8_

- [ ] 10. Build audience targeting engine interface
  - Create demographic filters UI (age, gender, location, income, education, employment)
  - Implement interest-based filters with categories
  - Add behavioral filters (device type, platform usage, past participation)
  - Implement AND/OR logic operators for combining criteria
  - Add custom screener question builder
  - _Requirements: 3.1, 3.2, 3.3, 3.9_

- [ ] 11. Implement audience size estimator
  - Create real-time audience size calculation
  - Display min, max, and median estimated reach
  - Update estimates within 2 seconds of criteria changes
  - Show warning for audience size below minimum threshold
  - Add lookalike audience creation from CSV upload
  - _Requirements: 3.4, 3.5, 3.6, 3.7, 3.8_

### Phase 4: AI Agent Panel and Core AI Integration

- [ ] 12. Create AI Agent Panel component
  - Build chat interface with message input and history display
  - Implement mode selector for AI Agent Modes (Generate, Enhance, Normalize, Translate, Analyze, Modify)
  - Add conversation context display
  - Create message bubbles for user and AI responses
  - Implement auto-scroll to latest message
  - Add typing indicators during AI processing
  - _Requirements: 18.1, 18.2, 18.4, 18.5_

- [ ] 13. Implement AI service layer and API integration
  - Create AI service with request/response handling
  - Implement conversation context management
  - Add AI request queuing and retry logic
  - Create AI error handler with specific error types
  - Implement rate limiting tracking
  - Add request cancellation support
  - _Requirements: 15.2, 15.11, 22.4, 22.5, 22.6, 22.9_

- [ ] 14. Build Security Guard for prompt injection prevention
  - Implement client-side prompt validation
  - Detect malicious patterns ("ignore previous instructions", "you are now")
  - Add input sanitization
  - Display security warnings for blocked prompts
  - Log blocked prompts for monitoring
  - _Requirements: 23.1, 23.2, 23.3, 23.4, 23.8_

- [ ] 15. Create Rate Limit Display component
  - Display current AI request usage and remaining quota
  - Show rate limit reset time
  - Add warning indicators when approaching limits
  - Implement client-side rate limiting enforcement
  - Update display in real-time as requests are consumed
  - _Requirements: 23.5, 23.6, 23.7, 27.4_

- [ ] 16. Implement AI Processing State indicators
  - Create loading spinners for AI operations
  - Add progress bars for long-running operations
  - Display estimated completion time
  - Implement operation cancellation UI
  - Show real-time progress updates
  - _Requirements: 22.1, 22.2, 22.3, 22.9, 27.1, 27.7_

### Phase 5: Survey Builder with AI Integration

- [ ] 17. Build core Survey Builder component
  - Create drag-and-drop question list with reordering
  - Implement question type selector with all supported types
  - Add question editor panel with title, description, required toggle
  - Create answer options editor for choice-based questions
  - Implement question duplication functionality
  - Display estimated completion time calculator
  - _Requirements: 4.1, 4.2, 4.3, 4.5, 4.6, 4.7, 4.11, 4.12_

- [ ] 18. Implement all question type components
  - Single choice, multiple choice, checkbox components
  - Short text, long text with character limits
  - Rating scale (1-5, 1-10), NPS (0-10), Likert scale
  - Image choice with image upload
  - Matrix/grid, yes/no, ranking, slider
  - Date/time picker
  - _Requirements: 4.3, 4.7_

- [ ] 19. Add question and answer randomization controls
  - Implement question randomization toggle
  - Add answer randomization for multiple choice questions
  - Display randomization indicators in UI
  - _Requirements: 4.9, 4.10_

- [ ] 20. Integrate AI Agent Panel with Survey Builder
  - Connect AI Agent Panel to Survey Builder state
  - Implement natural language prompt submission
  - Handle AI-generated survey modifications
  - Maintain conversation context during survey editing
  - Display current AI Agent Mode in Survey Builder
  - _Requirements: 4.1, 4.4, 4.13, 4.14_

- [ ] 20.1 Write property test for AI prompt processing
  - **Property 4: AI Prompt Processing Pipeline**
  - **Validates: Requirements 4.4**
  - Test that any valid natural language prompt generates modifications and displays in Diff Viewer

### Phase 6: Diff Viewer Component

- [ ] 21. Build Diff Viewer component
  - Create side-by-side comparison layout
  - Implement color-coded highlighting (additions, deletions, modifications)
  - Display changes at question, option, and logic rule levels
  - Show AI Action details for each modification
  - Add change summary statistics (additions, modifications, deletions)
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.8_

- [ ] 22. Implement change acceptance/rejection controls
  - Add accept/reject buttons for individual changes
  - Implement accept all / reject all functionality
  - Apply accepted changes to Survey Builder state
  - Update conversation context after change application
  - Add keyboard navigation support
  - _Requirements: 18.7, 19.5, 19.6, 19.7, 19.9_

- [ ] 22.1 Write property test for change management
  - **Property 9: Change Management Operations**
  - **Validates: Requirements 19.5**
  - Test that accepting/rejecting individual changes correctly applies or ignores modifications

### Phase 7: Logic Flow Editor with AI Enhancement

- [ ] 23. Create visual Logic Flow Editor
  - Build visual flow diagram showing questions and conditional paths
  - Implement node-based question representation
  - Display logic rules as connecting edges
  - Add zoom and pan controls for large surveys
  - Create logic rules summary panel
  - _Requirements: 5.1, 5.9_

- [ ] 24. Implement logic rule creation and editing
  - Create skip logic rule builder (IF answer equals X, THEN skip to question N)
  - Implement branching logic builder (IF answer equals Y, THEN show sub-question Y1)
  - Add quota-based branching rules
  - Validate target question existence
  - Detect and warn about circular logic paths
  - Allow editing and deleting existing rules
  - _Requirements: 5.3, 5.4, 5.5, 5.7, 5.8, 5.10, 5.11_

- [ ] 24.1 Write property test for logic rule validation
  - **Property 6: Logic Rule Target Validation**
  - **Validates: Requirements 5.7**
  - Test that rules with existing questions are accepted and rules with non-existent questions are rejected

- [ ] 24.2 Write property test for circular logic detection
  - **Property 7: Circular Logic Detection**
  - **Validates: Requirements 5.8**
  - Test that any set of rules creating circular dependencies is detected and warned

- [ ] 25. Integrate AI with Logic Flow Editor
  - Connect AI Agent Panel to Logic Flow Editor
  - Implement natural language logic rule generation
  - Display AI-generated logic rules in Diff Viewer
  - Provide AI logic improvement suggestions in Enhance mode
  - _Requirements: 5.2, 5.6, 5.12_

- [ ] 25.1 Write property test for natural language logic generation
  - **Property 5: Natural Language Logic Rule Generation**
  - **Validates: Requirements 5.6**
  - Test that any valid natural language logic description generates appropriate logic rules

### Phase 8: Screener and Quality Controls

- [ ] 26. Build screener section in Survey Builder
  - Create separate screener question section
  - Implement screener question builder with disqualifying answer marking
  - Add automatic qualification detection display
  - Show screener quota limits configuration
  - _Requirements: 6.1, 6.6, 6.7_

- [ ] 27. Implement attention check system
  - Display attention check insertion indicators
  - Show notice about platform-inserted attention checks
  - Prevent removal of attention check placeholders
  - Integrate with qualification detection system
  - _Requirements: 6.3, 6.4, 6.5_

- [ ] 28. Create qualification detection system UI
  - Display qualification criteria summary
  - Show real-time qualification rate during campaign
  - Integrate screener answers with qualification logic
  - _Requirements: 6.2, 6.7_

### Phase 9: Survey Preview and Collaboration

- [ ] 29. Build survey preview component
  - Create desktop and mobile preview views
  - Render all question types as respondents will see them
  - Implement logic flow execution in preview
  - Show randomization effects in preview
  - Allow test submissions without counting toward quotas
  - _Requirements: 7.1, 7.2, 7.3_

- [ ] 30. Implement version history panel
  - Display chronological list of survey versions
  - Show AI vs manual edit indicators
  - Display AI Agent Mode and AI Action details for AI changes
  - Show change summaries for each version
  - Implement diff comparison for selected versions
  - Add rollback functionality to previous versions
  - Support branching from previous versions
  - _Requirements: 7.4, 7.5, 7.6, 26.1, 26.2, 26.3, 26.4, 26.5, 26.6, 26.8_

- [ ] 31. Add real-time collaboration features
  - Display active editors indicator
  - Implement conflict prevention for simultaneous edits
  - Show live cursor positions for collaborators
  - Add presence indicators
  - _Requirements: 7.7_

- [ ] 32. Create template gallery with AI integration
  - Display pre-built survey templates by category
  - Implement AI-powered template suggestions based on objectives
  - Add template preview with question counts and completion times
  - Implement template search by keywords and categories
  - Allow loading templates into Survey Builder
  - Enable AI modification of loaded templates
  - Support saving custom templates from existing surveys
  - _Requirements: 7.8, 25.1, 25.2, 25.3, 25.4, 25.5, 25.6, 25.7, 25.8_

- [ ] 33. Implement AI survey analysis in Analyze mode
  - Add "Analyze Survey" button in Survey Builder
  - Display AI quality feedback and suggestions
  - Show improvement recommendations for question clarity
  - Provide logic flow optimization suggestions
  - _Requirements: 7.10, 7.11_

### Phase 10: Budget and Quota Management

- [ ] 34. Build budget configuration interface
  - Create total budget input with validation
  - Implement minimum budget requirement enforcement
  - Add daily spending cap configuration
  - Display budget summary and projections
  - _Requirements: 8.1, 8.2, 8.3_

- [ ] 35. Implement real-time budget tracking
  - Create spending tracker widget
  - Display spent amount, remaining budget, projected completion date
  - Calculate and display cost per qualified response (CPR)
  - Update metrics in real-time
  - _Requirements: 8.4, 8.10_

- [ ] 36. Add budget alert system
  - Implement 80% budget warning notification
  - Add 100% budget auto-pause functionality
  - Create budget alert notification UI
  - Allow budget top-up for active campaigns
  - _Requirements: 8.5, 8.6, 8.9_

- [ ] 37. Create segment quota management
  - Build segment quota configuration UI
  - Implement quota limits for demographic groups
  - Add auto-pause for filled segment quotas
  - Display quota fill status in real-time
  - _Requirements: 8.7, 8.8_

### Phase 11: Campaign Lifecycle Management

- [ ] 38. Implement campaign status management
  - Create campaign status display component
  - Implement status transitions (draft → pending review → approved → active → paused → completed → archived)
  - Add campaign submission workflow
  - Implement campaign activation controls
  - Add pause/resume functionality
  - Create archive functionality for completed campaigns
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.8_

- [ ] 39. Add campaign editing restrictions
  - Require pause before editing active campaigns
  - Display edit restriction messages
  - Implement auto-approval for verified advertisers
  - _Requirements: 9.6, 9.10_

- [ ] 40. Implement automatic campaign controls
  - Add auto-completion when budget exhausted or end date reached
  - Implement fraud rate monitoring (auto-pause at 30%)
  - Create fraud alert notifications
  - _Requirements: 9.7, 9.9_

### Phase 12: Import/Export Functionality

- [ ] 41. Build AI-enhanced Import Wizard
  - Create Excel file upload interface
  - Implement file parsing for questions, types, options, logic
  - Display parsed question preview
  - Trigger AI normalization for inconsistent formatting
  - Show normalization changes in Diff Viewer
  - Add import progress indicators
  - Implement error handling with retry options
  - Validate imported data against survey schema
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8, 20.9, 20.10_

- [ ] 42. Create multi-format Export Panel
  - Build format selection UI (Excel, PDF, JSON)
  - Implement format-specific configuration options
  - Create Excel export with questions, types, options, logic
  - Implement PDF export with formatted survey display
  - Add JSON export with canonical schema format
  - Display export progress indicators
  - Provide download links when ready
  - Add error handling with retry options
  - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5, 21.6, 21.7, 21.8, 21.9_

### Phase 13: Analytics Dashboard - Response Metrics

- [ ] 43. Build analytics dashboard layout
  - Create dashboard grid layout with metric cards
  - Implement date range selector
  - Add real-time update mechanism (30-second refresh)
  - Create filter panel for demographic segments
  - _Requirements: 10.8, 11.4_

- [ ] 44. Implement response metrics display
  - Display total response counts (submitted, qualified, rejected, in-progress)
  - Calculate and show completion rate
  - Display drop-off rate for each question
  - Show average completion time
  - Display fraud score distribution
  - Show average response quality score
  - Display CPR with target comparison
  - Add statistical confidence level indicator
  - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7, 10.9_

- [ ] 44.1 Write property test for completion rate calculation
  - **Property 8: Completion Rate Calculation Accuracy**
  - **Validates: Requirements 10.2**
  - Test that any set of response data produces accurate completion rate percentage

### Phase 14: Analytics Dashboard - Demographic Analysis

- [ ] 45. Create demographic breakdown visualizations
  - Implement age distribution chart
  - Add gender breakdown chart
  - Create location distribution map/chart
  - Display device type breakdown
  - Ensure all data is anonymized (no PII)
  - _Requirements: 11.1, 11.9_

- [ ] 46. Build answer distribution visualizations
  - Create bar charts for single choice questions
  - Implement pie charts for categorical data
  - Add word clouds for text responses
  - Display NPS summary with score calculation and benchmarks
  - Show Likert scale summaries with mean, median, distribution
  - _Requirements: 11.2, 11.6, 11.7_

- [ ] 47. Implement cross-tabulation filtering
  - Create demographic filter controls
  - Update all charts when filters applied
  - Display screener funnel visualization
  - Implement AI-powered sentiment analysis clusters for text responses
  - _Requirements: 11.3, 11.4, 11.5, 11.8_

### Phase 15: Export and Reporting

- [ ] 48. Build data export functionality
  - Implement CSV export for response data
  - Add XLSX export for response data
  - Create PDF executive summary report generation
  - Ensure all exports are anonymized (no PII)
  - Add metadata to exports (campaign name, date range, totals, completion rate)
  - _Requirements: 12.1, 12.2, 12.6, 12.8_

- [ ] 49. Implement AI-powered insight reports
  - Generate AI insight reports highlighting key findings
  - Display trend analysis and patterns
  - Create automated report scheduling (daily, weekly, monthly)
  - Implement email delivery for scheduled reports
  - _Requirements: 12.3, 12.4_

- [ ] 50. Add export filtering and API access
  - Implement date range filtering for exports
  - Add demographic segment filtering
  - Create response quality filtering
  - Provide API access documentation for programmatic retrieval
  - Add asynchronous export generation with notifications
  - _Requirements: 12.5, 12.7, 12.9_

### Phase 16: Billing and Invoicing

- [ ] 51. Create billing dashboard
  - Display prepaid credit wallet balance
  - Show spending trends and forecasts
  - Create invoice history list with download capability
  - Display active campaign budget allocations
  - _Requirements: 13.3, 13.7, 13.10_

- [ ] 52. Implement prepaid credit wallet management
  - Create add funds interface
  - Support multiple payment methods (credit card, bank transfer, wire transfer)
  - Update balance immediately after funding
  - Display low balance alerts (below 20% of average monthly spending)
  - _Requirements: 13.1, 13.3, 13.6, 13.8_

- [ ] 53. Build invoicing system integration
  - Display generated invoices with campaign details
  - Show response counts, CPR, and total charges
  - Implement invoice download functionality
  - Send email notifications for new invoices
  - Track post-pay billing accumulation
  - _Requirements: 13.2, 13.4, 13.5, 13.9_

### Phase 17: Notifications and Real-Time Updates

- [ ] 54. Implement notification system
  - Create in-app notification display component
  - Add notification badge with unread count
  - Build notification history panel
  - Implement notification preferences configuration
  - Support notification types: account approval, campaign approval/rejection, budget warnings, completion, fraud alerts, AI operation failures
  - _Requirements: 17.1, 17.2, 17.5, 17.7, 17.8, 17.9_

- [ ] 55. Add email notification integration
  - Integrate with backend email service
  - Configure notification templates
  - Implement notification delivery tracking
  - _Requirements: 17.1_

- [ ] 56. Implement real-time updates
  - Set up WebSocket connection for live updates
  - Implement polling fallback for WebSocket failures
  - Update analytics dashboard every 30 seconds
  - Provide real-time AI processing updates
  - Update Rate Limit Display in real-time
  - _Requirements: 17.3, 17.4, 17.6, 27.1, 27.2, 27.3, 27.4, 27.5, 27.6, 27.7, 27.8_

### Phase 18: Conversation Context Management

- [ ] 57. Implement conversation context persistence
  - Create conversation context data model
  - Implement local storage for context caching
  - Add backend sync for context persistence
  - Build context recovery on session restore
  - _Requirements: 24.1, 24.2, 24.3, 24.8_

- [ ] 58. Add conversation context features
  - Display conversation history in AI Agent Panel
  - Implement context-aware follow-up requests
  - Support referencing previous changes
  - Add clear conversation history functionality
  - Preserve AI conversation context with version history
  - _Requirements: 24.4, 24.5, 24.6, 24.7, 26.7_

### Phase 19: Response Parser and Validator

- [ ] 59. Build response parser and validator
  - Create Response type definitions
  - Implement JSON response parser
  - Add response field validation (response_id, campaign_id, timestamp, answers, demographic_data, fraud_score, quality_score)
  - Handle invalid/missing data with error logging
  - Support all question types and answer formats
  - Handle legacy response formats gracefully
  - _Requirements: 28.1, 28.2, 28.3, 28.6, 28.7_

- [ ] 60. Implement response pretty printer
  - Create Response to JSON formatter
  - Ensure proper formatting for export functionality
  - _Requirements: 28.4_

- [ ] 60.1 Write property test for response round-trip integrity
  - **Property 10: Response Data Round-Trip Integrity**
  - **Validates: Requirements 28.5**
  - Test that parsing then printing then parsing produces equivalent Response object

### Phase 20: Accessibility and Polish

- [ ] 61. Implement comprehensive accessibility features
  - Add ARIA labels to all interactive elements
  - Implement keyboard navigation for all components
  - Add focus indicators and skip links
  - Create screen reader announcements for dynamic content
  - Test with screen readers (NVDA, JAWS, VoiceOver)
  - Ensure color contrast meets WCAG 2.1 Level AA
  - _Requirements: 16.7, 16.8_

- [ ] 61.1 Run automated accessibility tests
  - Use axe-core for automated WCAG 2.1 Level AA testing
  - Test all major pages and components
  - _Requirements: 16.8_

- [ ] 62. Add contextual help and tooltips
  - Create help tooltips for complex features
  - Add AI capability explanations
  - Implement guided tours for first-time users
  - Create help documentation links
  - _Requirements: 16.9_

- [ ] 63. Implement user preferences persistence
  - Save theme preference (light/dark mode)
  - Persist dashboard layout customizations
  - Store AI interaction preferences
  - Save notification preferences
  - _Requirements: 16.10_

- [ ] 64. Add loading states and optimistic updates
  - Implement skeleton loaders for all async operations
  - Add optimistic UI updates for user actions
  - Create smooth transitions between states
  - Display AI processing indicators
  - _Requirements: 16.5, 16.6_

- [ ] 65. Implement error boundaries and fallback UI
  - Create error boundary components
  - Add fallback UI for component errors
  - Implement error reporting to monitoring service
  - Create user-friendly error messages
  - _Requirements: 15.4_

### Phase 21: Testing and Quality Assurance

- [ ] 66. Checkpoint - Comprehensive testing review
  - Ensure all property-based tests pass
  - Verify all unit tests pass
  - Run integration tests for critical workflows
  - Test AI integration end-to-end
  - Verify accessibility compliance
  - Test responsive design on multiple devices
  - Perform cross-browser testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 66.1 Write integration tests for campaign creation workflow
  - Test complete campaign creation from start to finish
  - Test AI-assisted survey creation workflow
  - Test draft save and resume functionality
  - _Requirements: 2.1, 2.2, 2.5, 2.6_

- [ ] 66.2 Write integration tests for analytics dashboard
  - Test data fetching and display
  - Test filtering and cross-tabulation
  - Test export functionality
  - _Requirements: 10.1, 11.3, 12.1_

- [ ] 66.3 Write end-to-end tests for critical user journeys
  - Test advertiser registration and verification flow
  - Test complete campaign creation with AI assistance
  - Test campaign activation and monitoring
  - Test analytics viewing and export
  - _Requirements: 1.1, 2.1, 9.4, 10.1_

### Phase 22: Performance Optimization and Deployment Preparation

- [ ] 67. Optimize application performance
  - Implement code splitting for route-based lazy loading
  - Optimize bundle size with tree shaking
  - Add image optimization with Next.js Image component
  - Implement virtual scrolling for long lists
  - Optimize TanStack Query cache configuration
  - Add service worker for offline support
  - _Requirements: 15.9, 16.4_

- [ ] 68. Implement monitoring and analytics
  - Add error tracking integration (Sentry or similar)
  - Implement performance monitoring
  - Add user analytics tracking
  - Create logging for AI operations
  - Monitor API request patterns
  - _Requirements: 23.8_

- [ ] 69. Create deployment configuration
  - Configure production environment variables
  - Set up CI/CD pipeline configuration
  - Create Docker configuration for containerization
  - Add health check endpoints
  - Configure CDN for static assets
  - _Requirements: 16.2_

- [ ] 70. Final checkpoint - Production readiness review
  - Verify all features are complete and tested
  - Ensure all security measures are in place
  - Confirm accessibility compliance
  - Review performance metrics
  - Validate error handling and monitoring
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional testing tasks and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at major milestones
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- Integration and E2E tests validate complete workflows
- The implementation uses Next.js 16.2.4, React 19.2.4, TypeScript 5+, and Tailwind CSS v4
- All AI integration follows the diff-based preview pattern for user control
- Real-time updates use WebSocket connections with polling fallback
- The application communicates exclusively with the NestJS backend API
