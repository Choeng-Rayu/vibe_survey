# Requirements Document: Survey Taker Frontend

## Introduction

The Survey Taker Frontend is the user-facing web application for a Survey-as-Ads platform, enabling customers to discover, complete surveys, and earn monetary rewards. This application serves as the primary interface for the user side of a three-sided marketplace (users, advertisers, platform). The system must provide a mobile-first, bilingual (Khmer/English) experience with robust fraud prevention, profile-based survey matching, and seamless reward management with local payment integrations.

## Glossary

- **User**: An individual who registers to take surveys and earn rewards
- **Survey_Taker_Frontend**: The React-based web application providing the user interface
- **Authentication_Service**: The backend service handling user registration, login, and verification
- **Profile_Manager**: The component managing user demographic and targeting data
- **Survey_Feed**: The interface displaying available surveys matched to the user
- **Screener**: A qualification questionnaire determining survey eligibility
- **Survey_Engine**: The component rendering survey questions and managing response flow
- **Rewards_Wallet**: The interface displaying points balance and transaction history
- **Payout_Service**: The backend service processing withdrawal requests
- **Trust_Tier**: A user reputation level affecting survey access and payout speed
- **Fraud_Detector**: The system analyzing response patterns for fraudulent behavior
- **Device_Fingerprint**: A unique identifier for the user's device
- **OTP**: One-Time Password sent via SMS for verification
- **Points**: The virtual currency earned by completing surveys
- **Pending_Points**: Points awaiting fraud check and advertiser confirmation
- **Approved_Points**: Points available for withdrawal
- **Minimum_Withdrawal_Threshold**: The minimum points required to request a payout
- **Mobile_Wallet**: Payment services including ABA Pay, WING, and TrueMoney
- **Profile_Completeness**: A percentage indicating how much profile data the user has provided
- **Attention_Check**: A survey question designed to detect inattentive respondents
- **Branching_Logic**: Survey flow that changes based on previous answers
- **Match_Score**: A calculated value indicating survey relevance to the user

## Requirements

### Requirement 1: User Registration

**User Story:** As a new user, I want to register for an account using email, phone, or OAuth, so that I can access the platform and start taking surveys.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL provide registration options for email, phone number, and OAuth providers (Google, Facebook)
2. WHEN a user submits a registration form, THE Survey_Taker_Frontend SHALL validate all required fields using Zod schemas before submission
3. WHEN email registration is used, THE Survey_Taker_Frontend SHALL require password with minimum 8 characters including uppercase, lowercase, and number
4. WHEN phone registration is used, THE Survey_Taker_Frontend SHALL format phone numbers according to Cambodian standards (+855)
5. WHEN registration is successful, THE Survey_Taker_Frontend SHALL redirect the user to the phone verification flow
6. IF registration fails, THEN THE Survey_Taker_Frontend SHALL display specific error messages for each field
7. THE Survey_Taker_Frontend SHALL display registration forms in both Khmer and English based on user language preference

### Requirement 2: Phone Verification

**User Story:** As a platform operator, I want all users to verify their phone numbers via OTP, so that I can prevent duplicate accounts and ensure user authenticity.

#### Acceptance Criteria

1. WHEN a user completes registration, THE Survey_Taker_Frontend SHALL prompt for phone number verification
2. WHEN a user requests OTP, THE Survey_Taker_Frontend SHALL call the Authentication_Service to send the OTP via SMS
3. THE Survey_Taker_Frontend SHALL display a 6-digit OTP input field with auto-focus
4. WHEN a user enters a 6-digit OTP, THE Survey_Taker_Frontend SHALL automatically submit it for verification
5. IF OTP verification fails, THEN THE Survey_Taker_Frontend SHALL display an error message and allow retry
6. THE Survey_Taker_Frontend SHALL allow OTP resend after 60 seconds cooldown
7. WHEN OTP is verified successfully, THE Survey_Taker_Frontend SHALL mark the account as verified and redirect to profile completion
8. THE Survey_Taker_Frontend SHALL prevent access to surveys until phone verification is complete

### Requirement 3: User Authentication

**User Story:** As a registered user, I want to log in securely to my account, so that I can access my profile, surveys, and rewards.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL provide login options for email/password, phone/password, and OAuth
2. WHEN a user submits login credentials, THE Survey_Taker_Frontend SHALL call the Authentication_Service via the NestJS backend
3. WHEN authentication is successful, THE Survey_Taker_Frontend SHALL store the JWT token securely in httpOnly cookies
4. WHEN authentication fails, THE Survey_Taker_Frontend SHALL display an error message without revealing whether email or password was incorrect
5. THE Survey_Taker_Frontend SHALL provide a "Forgot Password" flow with email-based reset
6. THE Survey_Taker_Frontend SHALL automatically refresh JWT tokens before expiration using TanStack Query
7. WHEN a user logs out, THE Survey_Taker_Frontend SHALL clear all authentication tokens and redirect to the login page
8. THE Survey_Taker_Frontend SHALL redirect authenticated users away from login/registration pages to the dashboard

### Requirement 4: Device Fingerprinting

**User Story:** As a platform operator, I want to collect device fingerprints during registration and login, so that I can detect fraudulent multi-account behavior.

#### Acceptance Criteria

1. WHEN a user accesses the registration or login page, THE Survey_Taker_Frontend SHALL generate a Device_Fingerprint using browser and device characteristics
2. THE Survey_Taker_Frontend SHALL include the Device_Fingerprint in all authentication requests to the backend
3. THE Survey_Taker_Frontend SHALL collect fingerprint data including browser type, screen resolution, timezone, language, and canvas fingerprint
4. THE Survey_Taker_Frontend SHALL handle fingerprint generation failures gracefully without blocking authentication

### Requirement 5: User Profile Management

**User Story:** As a user, I want to create and update my profile with demographic and interest data, so that I can receive more relevant survey matches.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL provide a profile form with fields for age, gender, location, education, employment, income range, and interests
2. WHEN a user updates profile data, THE Survey_Taker_Frontend SHALL validate all fields using Zod schemas before submission
3. THE Survey_Taker_Frontend SHALL display Profile_Completeness as a percentage with visual progress indicator
4. WHEN profile data is saved successfully, THE Survey_Taker_Frontend SHALL update the Profile_Completeness indicator
5. THE Survey_Taker_Frontend SHALL allow users to edit profile data at any time from the settings page
6. THE Survey_Taker_Frontend SHALL display which profile fields unlock additional survey opportunities
7. WHERE profile fields are optional, THE Survey_Taker_Frontend SHALL clearly indicate which fields are required versus optional
8. THE Survey_Taker_Frontend SHALL support multi-select for interests with minimum 3 and maximum 10 selections

### Requirement 6: Consent Management

**User Story:** As a user, I want to understand and control what data is collected about me, so that I can make informed decisions about my privacy.

#### Acceptance Criteria

1. WHEN a user first registers, THE Survey_Taker_Frontend SHALL display a consent screen explaining data collection practices
2. THE Survey_Taker_Frontend SHALL require explicit consent for profile data usage in survey matching
3. THE Survey_Taker_Frontend SHALL provide a consent management page where users can view and update their consent preferences
4. THE Survey_Taker_Frontend SHALL display consent information in clear, non-legal language in both Khmer and English
5. WHEN a user withdraws consent, THE Survey_Taker_Frontend SHALL call the backend to update consent status and inform the user of impacts

### Requirement 7: Survey Discovery Feed

**User Story:** As a user, I want to browse available surveys matched to my profile, so that I can choose which surveys to complete.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL display a Survey_Feed showing available surveys sorted by Match_Score descending
2. WHEN the Survey_Feed loads, THE Survey_Taker_Frontend SHALL fetch survey data from the backend using TanStack Query
3. FOR EACH survey in the feed, THE Survey_Taker_Frontend SHALL display title, estimated time, reward amount, and Match_Score
4. THE Survey_Taker_Frontend SHALL provide filter options for reward range, time duration, and category
5. WHEN a user applies filters, THE Survey_Taker_Frontend SHALL update the Survey_Feed without full page reload
6. THE Survey_Taker_Frontend SHALL implement infinite scroll for loading additional surveys
7. THE Survey_Taker_Frontend SHALL display a badge indicating "High Match" for surveys with Match_Score above 80%
8. WHERE a survey has age restrictions, THE Survey_Taker_Frontend SHALL only display it to eligible users based on profile age

### Requirement 8: Survey Screener Flow

**User Story:** As an advertiser, I want users to complete a screener before starting my survey, so that I only pay for qualified respondents.

#### Acceptance Criteria

1. WHEN a user selects a survey, THE Survey_Taker_Frontend SHALL check if a Screener is required
2. WHERE a Screener is required, THE Survey_Taker_Frontend SHALL display the screener questions before the main survey
3. THE Survey_Taker_Frontend SHALL render screener questions using the same Survey_Engine as main surveys
4. WHEN a user completes the Screener, THE Survey_Taker_Frontend SHALL submit responses to the backend for qualification evaluation
5. IF the user qualifies, THEN THE Survey_Taker_Frontend SHALL proceed to the main survey
6. IF the user does not qualify, THEN THE Survey_Taker_Frontend SHALL display a polite disqualification message and return to the Survey_Feed
7. THE Survey_Taker_Frontend SHALL not award points for screener completion regardless of qualification result

### Requirement 9: Survey Taking Experience

**User Story:** As a user, I want to complete surveys with various question types and smooth navigation, so that I can provide accurate responses and earn rewards.

#### Acceptance Criteria

1. THE Survey_Engine SHALL render question types including multiple choice, single choice, text input, numeric input, rating scales, matrix questions, and ranking
2. WHEN a survey loads, THE Survey_Engine SHALL display a progress indicator showing completion percentage
3. THE Survey_Engine SHALL validate each answer before allowing navigation to the next question
4. THE Survey_Engine SHALL provide "Previous" and "Next" navigation buttons with appropriate enable/disable states
5. WHEN a user navigates backward, THE Survey_Engine SHALL preserve previously entered answers
6. THE Survey_Engine SHALL implement Branching_Logic by showing or hiding questions based on previous answers
7. THE Survey_Engine SHALL display questions one at a time in a mobile-optimized layout
8. WHERE a question includes images or media, THE Survey_Engine SHALL load and display them with appropriate fallbacks

### Requirement 10: Survey Auto-Save

**User Story:** As a user, I want my survey progress to be saved automatically, so that I can resume if I'm interrupted or lose connection.

#### Acceptance Criteria

1. WHILE a user is taking a survey, THE Survey_Engine SHALL automatically save progress after each answer is submitted
2. THE Survey_Engine SHALL save progress to the backend every 30 seconds or after each question completion, whichever comes first
3. WHEN a user returns to an incomplete survey, THE Survey_Engine SHALL restore their progress and resume from the last answered question
4. IF auto-save fails due to network error, THEN THE Survey_Engine SHALL cache responses locally and retry when connection is restored
5. THE Survey_Engine SHALL display a visual indicator when auto-save is in progress and when it completes successfully
6. THE Survey_Engine SHALL expire incomplete surveys after 7 days and remove saved progress

### Requirement 11: Attention Checks

**User Story:** As an advertiser, I want to detect inattentive respondents, so that I receive high-quality survey data.

#### Acceptance Criteria

1. WHERE a survey includes Attention_Check questions, THE Survey_Engine SHALL render them identically to regular questions
2. THE Survey_Engine SHALL submit Attention_Check responses to the Fraud_Detector for validation
3. THE Survey_Engine SHALL not indicate to the user which questions are Attention_Checks
4. WHEN a user completes a survey, THE Survey_Engine SHALL include all Attention_Check results in the submission

### Requirement 12: Survey Submission

**User Story:** As a user, I want to submit my completed survey and see confirmation of my reward, so that I know my effort was recorded.

#### Acceptance Criteria

1. WHEN a user answers the final question, THE Survey_Engine SHALL display a review screen showing completion
2. THE Survey_Engine SHALL provide a "Submit Survey" button on the review screen
3. WHEN a user clicks submit, THE Survey_Engine SHALL send all responses to the backend in a single request
4. WHEN submission is successful, THE Survey_Engine SHALL display a confirmation screen showing Pending_Points earned
5. IF submission fails, THEN THE Survey_Engine SHALL display an error message and allow retry without losing responses
6. THE Survey_Engine SHALL prevent duplicate submissions by disabling the submit button after first click
7. WHEN submission is confirmed, THE Survey_Engine SHALL redirect to the Survey_Feed after 3 seconds

### Requirement 13: Rewards Wallet Display

**User Story:** As a user, I want to view my points balance and transaction history, so that I can track my earnings and withdrawals.

#### Acceptance Criteria

1. THE Rewards_Wallet SHALL display total Approved_Points, Pending_Points, and lifetime earnings
2. THE Rewards_Wallet SHALL display a transaction history list showing date, description, amount, and status for each transaction
3. THE Rewards_Wallet SHALL fetch wallet data from the backend using TanStack Query with automatic refresh
4. THE Rewards_Wallet SHALL implement pagination for transaction history with 20 transactions per page
5. THE Rewards_Wallet SHALL provide filter options for transaction type (earned, withdrawn, bonus, penalty)
6. THE Rewards_Wallet SHALL display the Minimum_Withdrawal_Threshold and indicate when it is met
7. THE Rewards_Wallet SHALL show estimated approval time for Pending_Points based on Trust_Tier
8. THE Rewards_Wallet SHALL convert points to local currency (KHR and USD) using current exchange rates

### Requirement 14: Withdrawal Request

**User Story:** As a user, I want to request withdrawal of my approved points to my mobile wallet, so that I can receive my earned money.

#### Acceptance Criteria

1. WHEN Approved_Points meet or exceed the Minimum_Withdrawal_Threshold, THE Rewards_Wallet SHALL enable the withdrawal button
2. WHEN a user initiates withdrawal, THE Survey_Taker_Frontend SHALL display a withdrawal form with Mobile_Wallet options (ABA Pay, WING, TrueMoney, Bank Transfer)
3. THE Survey_Taker_Frontend SHALL validate Mobile_Wallet account numbers according to each provider's format requirements
4. THE Survey_Taker_Frontend SHALL display withdrawal fees and final amount to be received before confirmation
5. WHEN a user confirms withdrawal, THE Survey_Taker_Frontend SHALL submit the request to the Payout_Service
6. WHEN withdrawal request is successful, THE Survey_Taker_Frontend SHALL display confirmation with estimated processing time
7. IF withdrawal request fails, THEN THE Survey_Taker_Frontend SHALL display specific error messages and allow retry
8. THE Survey_Taker_Frontend SHALL prevent multiple simultaneous withdrawal requests by disabling the button while one is pending

### Requirement 15: Payout History

**User Story:** As a user, I want to view my payout history and status, so that I can track my withdrawal requests.

#### Acceptance Criteria

1. THE Rewards_Wallet SHALL display a payout history section showing all withdrawal requests
2. FOR EACH payout request, THE Rewards_Wallet SHALL display date, amount, Mobile_Wallet provider, account number (masked), and status
3. THE Rewards_Wallet SHALL display payout statuses including Pending, Processing, Completed, and Failed
4. WHERE a payout has failed, THE Rewards_Wallet SHALL display the failure reason
5. THE Rewards_Wallet SHALL allow users to retry failed payouts from the history view

### Requirement 16: Trust Tier Display

**User Story:** As a user, I want to see my trust tier and reputation metrics, so that I understand how to improve my standing and unlock benefits.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL display the user's current Trust_Tier with visual badge
2. THE Survey_Taker_Frontend SHALL display Trust_Tier benefits including payout speed and survey access level
3. THE Survey_Taker_Frontend SHALL show progress toward the next Trust_Tier with specific requirements
4. THE Survey_Taker_Frontend SHALL display reputation metrics including surveys completed, accuracy score, and account age
5. WHERE a user has earned badges, THE Survey_Taker_Frontend SHALL display them in the profile section
6. THE Survey_Taker_Frontend SHALL display streak information for consecutive days with survey completions

### Requirement 17: Survey History

**User Story:** As a user, I want to view my completed surveys, so that I can track what I've done and when I was paid.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL provide a survey history page showing all completed surveys
2. FOR EACH completed survey, THE Survey_Taker_Frontend SHALL display title, completion date, time spent, points earned, and status
3. THE Survey_Taker_Frontend SHALL display survey statuses including Completed, Under Review, Approved, and Rejected
4. WHERE a survey was rejected, THE Survey_Taker_Frontend SHALL display the rejection reason
5. THE Survey_Taker_Frontend SHALL implement pagination for survey history with 20 surveys per page
6. THE Survey_Taker_Frontend SHALL provide filter options for date range and status

### Requirement 18: Notification Center

**User Story:** As a user, I want to receive notifications about new matched surveys, reward approvals, and payout updates, so that I stay informed about important events.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL display a notification bell icon with unread count badge in the header
2. WHEN a user clicks the notification bell, THE Survey_Taker_Frontend SHALL display a dropdown with recent notifications
3. THE Survey_Taker_Frontend SHALL fetch notifications from the backend using TanStack Query with polling every 60 seconds
4. FOR EACH notification, THE Survey_Taker_Frontend SHALL display title, message, timestamp, and read/unread status
5. WHEN a user clicks a notification, THE Survey_Taker_Frontend SHALL mark it as read and navigate to the relevant page
6. THE Survey_Taker_Frontend SHALL provide a "Mark all as read" action in the notification dropdown
7. THE Survey_Taker_Frontend SHALL display notification types including new surveys, points approved, payout completed, and trust tier changes

### Requirement 19: Push Notification Subscription

**User Story:** As a user, I want to enable push notifications, so that I'm alerted about new surveys even when not using the app.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL prompt users to enable push notifications after first login
2. WHEN a user grants push notification permission, THE Survey_Taker_Frontend SHALL register the device with the backend
3. THE Survey_Taker_Frontend SHALL allow users to manage push notification preferences in settings
4. THE Survey_Taker_Frontend SHALL provide granular controls for notification types (new surveys, rewards, payouts, promotions)
5. WHEN push notification permission is denied, THE Survey_Taker_Frontend SHALL not repeatedly prompt but show a settings link

### Requirement 20: Language Switching

**User Story:** As a Cambodian user, I want to switch between Khmer and English languages, so that I can use the app in my preferred language.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL provide a language selector in the header with Khmer and English options
2. WHEN a user selects a language, THE Survey_Taker_Frontend SHALL update all UI text immediately without page reload
3. THE Survey_Taker_Frontend SHALL persist language preference in local storage
4. THE Survey_Taker_Frontend SHALL load the user's preferred language on subsequent visits
5. THE Survey_Taker_Frontend SHALL display all static content, form labels, error messages, and navigation in the selected language
6. WHERE survey content is available in multiple languages, THE Survey_Taker_Frontend SHALL display surveys in the user's preferred language

### Requirement 21: Responsive Mobile Design

**User Story:** As a mobile user, I want the interface to work seamlessly on my phone, so that I can take surveys anywhere.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL implement a mobile-first responsive design using Tailwind CSS
2. THE Survey_Taker_Frontend SHALL display optimally on screen sizes from 320px to 2560px width
3. THE Survey_Taker_Frontend SHALL use touch-friendly UI elements with minimum 44px tap targets
4. THE Survey_Taker_Frontend SHALL optimize form inputs for mobile keyboards with appropriate input types
5. THE Survey_Taker_Frontend SHALL implement swipe gestures for survey navigation on touch devices
6. THE Survey_Taker_Frontend SHALL prevent zoom on form inputs while maintaining accessibility
7. THE Survey_Taker_Frontend SHALL load images responsively based on device screen size and pixel density

### Requirement 22: Loading States

**User Story:** As a user, I want to see clear loading indicators, so that I know the app is working when data is being fetched.

#### Acceptance Criteria

1. WHEN data is being fetched, THE Survey_Taker_Frontend SHALL display loading skeletons matching the expected content layout
2. THE Survey_Taker_Frontend SHALL display a loading spinner for actions that take longer than 300ms
3. THE Survey_Taker_Frontend SHALL disable interactive elements during loading to prevent duplicate submissions
4. WHEN initial page load occurs, THE Survey_Taker_Frontend SHALL display a branded loading screen
5. THE Survey_Taker_Frontend SHALL implement optimistic updates for non-critical actions to improve perceived performance

### Requirement 23: Error Handling

**User Story:** As a user, I want to see helpful error messages when something goes wrong, so that I understand what happened and what to do next.

#### Acceptance Criteria

1. WHEN an API request fails, THE Survey_Taker_Frontend SHALL display user-friendly error messages in the selected language
2. THE Survey_Taker_Frontend SHALL distinguish between network errors, validation errors, and server errors with appropriate messages
3. WHERE an error is recoverable, THE Survey_Taker_Frontend SHALL provide a retry action
4. THE Survey_Taker_Frontend SHALL log detailed error information to the console for debugging without exposing it to users
5. WHEN a critical error occurs, THE Survey_Taker_Frontend SHALL display an error boundary with option to reload or return home
6. THE Survey_Taker_Frontend SHALL display field-level validation errors inline below the relevant input

### Requirement 24: Offline Handling

**User Story:** As a user with unreliable internet, I want to know when I'm offline and have limited functionality preserved, so that I can continue using the app when possible.

#### Acceptance Criteria

1. WHEN network connection is lost, THE Survey_Taker_Frontend SHALL display an offline indicator banner
2. WHILE offline, THE Survey_Taker_Frontend SHALL allow viewing of previously loaded content from cache
3. WHILE offline, THE Survey_Taker_Frontend SHALL queue survey responses locally for submission when connection is restored
4. WHEN connection is restored, THE Survey_Taker_Frontend SHALL automatically sync queued data and dismiss the offline banner
5. THE Survey_Taker_Frontend SHALL prevent starting new surveys while offline

### Requirement 25: Session Management

**User Story:** As a user, I want my session to remain active while I'm using the app, so that I don't get logged out unexpectedly.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL automatically refresh authentication tokens before expiration
2. WHEN a token refresh fails, THE Survey_Taker_Frontend SHALL redirect to login and preserve the current page URL for post-login redirect
3. THE Survey_Taker_Frontend SHALL implement a session timeout warning 2 minutes before expiration
4. WHEN session timeout warning appears, THE Survey_Taker_Frontend SHALL provide an option to extend the session
5. THE Survey_Taker_Frontend SHALL log out the user and clear all stored data when session expires

### Requirement 26: Accessibility

**User Story:** As a user with disabilities, I want the interface to be accessible with assistive technologies, so that I can use the platform independently.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL implement ARIA labels and roles for all interactive elements
2. THE Survey_Taker_Frontend SHALL support full keyboard navigation with visible focus indicators
3. THE Survey_Taker_Frontend SHALL maintain color contrast ratios of at least 4.5:1 for normal text and 3:1 for large text
4. THE Survey_Taker_Frontend SHALL provide text alternatives for all images and icons
5. THE Survey_Taker_Frontend SHALL announce dynamic content changes to screen readers using ARIA live regions
6. THE Survey_Taker_Frontend SHALL allow text resizing up to 200% without loss of functionality

### Requirement 27: Performance Optimization

**User Story:** As a user on a slow connection, I want the app to load quickly, so that I can start taking surveys without long waits.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL achieve a First Contentful Paint under 1.5 seconds on 3G connections
2. THE Survey_Taker_Frontend SHALL implement code splitting to load only necessary JavaScript for each route
3. THE Survey_Taker_Frontend SHALL lazy load images below the fold with placeholder loading states
4. THE Survey_Taker_Frontend SHALL cache static assets with appropriate cache headers
5. THE Survey_Taker_Frontend SHALL prefetch data for likely next pages using TanStack Query
6. THE Survey_Taker_Frontend SHALL compress images and use modern formats (WebP) with fallbacks

### Requirement 28: Analytics Integration

**User Story:** As a product manager, I want to track user behavior and feature usage, so that I can make data-driven improvements.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL track page views for all major routes
2. THE Survey_Taker_Frontend SHALL track user actions including survey starts, completions, and abandonments
3. THE Survey_Taker_Frontend SHALL track conversion funnel events from registration through first payout
4. THE Survey_Taker_Frontend SHALL send analytics events to the backend without blocking user interactions
5. THE Survey_Taker_Frontend SHALL respect user privacy preferences and not track users who opt out

### Requirement 29: Security Headers

**User Story:** As a security engineer, I want the frontend to implement security best practices, so that user data is protected from common web vulnerabilities.

#### Acceptance Criteria

1. THE Survey_Taker_Frontend SHALL implement Content Security Policy headers to prevent XSS attacks
2. THE Survey_Taker_Frontend SHALL use httpOnly and secure flags for all cookies
3. THE Survey_Taker_Frontend SHALL implement CSRF protection for all state-changing requests
4. THE Survey_Taker_Frontend SHALL sanitize all user-generated content before rendering
5. THE Survey_Taker_Frontend SHALL not expose sensitive data in URLs or browser history

### Requirement 30: Age Gate

**User Story:** As a compliance officer, I want to restrict access to age-restricted surveys, so that we comply with data protection regulations.

#### Acceptance Criteria

1. WHERE a survey has age restrictions, THE Survey_Taker_Frontend SHALL verify user age from profile before allowing access
2. IF user age is below the survey requirement, THEN THE Survey_Taker_Frontend SHALL hide the survey from the Survey_Feed
3. THE Survey_Taker_Frontend SHALL display age requirements clearly on survey detail pages
4. THE Survey_Taker_Frontend SHALL prevent URL manipulation to bypass age restrictions by validating on survey load

---

## Notes

This requirements document covers the complete Survey Taker Frontend feature with 30 requirements and 180+ acceptance criteria. All requirements follow EARS patterns and INCOSE quality rules. The requirements are structured to support property-based testing where applicable, particularly for:

- Form validation logic (registration, profile, withdrawal)
- Survey response handling and auto-save
- State management and data synchronization
- Error handling and retry logic
- Responsive layout calculations

The document is ready for review and iteration before proceeding to the design phase.
