# Requirements Document

## Introduction

The Survey Creator Frontend is the advertiser-facing interface for a Survey-as-Ads platform. This system enables companies to create advertising campaigns that incorporate surveys, manage budgets, target specific audiences, and analyze response data. The platform operates as a three-sided marketplace connecting advertisers, users (survey respondents), and the platform itself.

This document specifies the requirements for the advertiser side of the platform, covering the complete advertiser journey from registration through campaign creation, execution, and analytics.

## Glossary

- **Advertiser**: A company or organization that creates survey campaigns to collect user feedback
- **Campaign**: A complete advertising initiative including audience targeting, survey content, budget allocation, and execution timeline
- **Survey_Builder**: The drag-and-drop interface or image for creating survey questions and logic
- **Audience_Targeting_Engine**: The system that defines and estimates target demographic segments
- **Budget_Manager**: The system that tracks spending, enforces caps, and manages quotas
- **Analytics_Dashboard**: The interface displaying campaign performance metrics and response data
- **Qualified_Response**: A survey response that passes fraud detection and meets quality standards
- **CPR**: Cost Per (qualified) Response - the pricing model for the platform
- **Screener**: Pre-survey questions that determine respondent eligibility
- **Attention_Check**: Platform-inserted questions that verify respondent engagement
- **Fraud_Score**: A metric indicating the likelihood that a response is fraudulent or low-quality
- **Segment_Quota**: A limit on responses from a specific demographic group
- **Skip_Logic**: Survey flow control that skips questions based on previous answers
- **Branching_Logic**: Survey flow control that shows additional questions based on previous answers
- **Admin**: Platform administrator who reviews and approves campaigns and advertisers
- **Business_License**: Official documentation verifying company legitimacy
- **Campaign_Lifecycle**: The progression of states from draft through completion
- **NPS**: Net Promoter Score - a metric measuring customer loyalty (0-10 scale)
- **Likert_Scale**: A rating scale typically using agreement levels (strongly disagree to strongly agree)
- **Cross_Tabulation**: Analysis comparing responses across different demographic segments
- **API_Backend**: The NestJS backend service that handles all data operations
- **Prepaid_Credit_Wallet**: An account balance system for pre-funding campaigns
- **Team_Role**: Permission level assigned to team members (Billing Contact, Campaign Manager, Analyst)

## Requirements

### Requirement 1: Advertiser Registration and Verification

**User Story:** As a company representative, I want to register my organization and verify my business legitimacy, so that I can create survey campaigns on the platform.

#### Acceptance Criteria

1. WHEN an advertiser submits a registration form with company details, THE Registration_System SHALL create a pending advertiser account
2. WHEN an advertiser uploads a business license document, THE Registration_System SHALL store the document and flag the account for admin review
3. THE Registration_System SHALL require company name, business email, phone number, business address, and business license upload
4. WHEN an admin reviews a pending advertiser account, THE Admin_Interface SHALL provide options to approve or reject with reason
5. WHEN an advertiser account is approved, THE Notification_System SHALL send an email notification with login credentials
6. WHEN an advertiser account is rejected, THE Notification_System SHALL send an email notification with the rejection reason
7. THE Registration_System SHALL validate that the business email domain matches the company domain
8. WHEN an advertiser attempts to create a campaign before approval, THE Campaign_System SHALL display a pending verification message

### Requirement 2: Campaign Creation Wizard

**User Story:** As an advertiser, I want to create a campaign through a guided wizard, so that I can systematically define my survey campaign parameters.

#### Acceptance Criteria

1. THE Campaign_Wizard SHALL present steps in the following order: objective definition, audience targeting, budget allocation, survey building, review, and submission
2. WHEN an advertiser completes a wizard step, THE Campaign_Wizard SHALL save the data as a draft and enable navigation to the next step
3. WHEN an advertiser navigates backward in the wizard, THE Campaign_Wizard SHALL preserve all previously entered data
4. THE Campaign_Wizard SHALL display a progress indicator showing current step and completion status
5. WHEN an advertiser exits the wizard before completion, THE Campaign_System SHALL save the draft campaign
6. WHEN an advertiser returns to a draft campaign, THE Campaign_Wizard SHALL resume from the last completed step
7. THE Campaign_Wizard SHALL validate required fields before allowing progression to the next step
8. WHEN an advertiser selects a campaign objective, THE Campaign_Wizard SHALL provide objective templates (brand awareness, product feedback, market research, customer satisfaction)

### Requirement 3: Audience Targeting Engine

**User Story:** As an advertiser, I want to define my target audience using multiple criteria, so that my survey reaches the most relevant respondents.

#### Acceptance Criteria

1. THE Audience_Targeting_Engine SHALL provide demographic filters including age range, gender, location (country, state, city), income level, education level, and employment status
2. THE Audience_Targeting_Engine SHALL provide interest-based filters including categories and subcategories
3. THE Audience_Targeting_Engine SHALL provide behavioral filters including device type, platform usage frequency, and past survey participation
4. WHEN an advertiser modifies targeting criteria, THE Audience_Size_Estimator SHALL update the estimated audience size within 2 seconds
5. THE Audience_Size_Estimator SHALL display minimum, maximum, and median estimated reach
6. THE Audience_Targeting_Engine SHALL support custom screener questions that filter respondents before the main survey
7. THE Audience_Targeting_Engine SHALL provide lookalike audience creation based on existing customer data upload
8. WHEN targeting criteria result in an audience size below the minimum threshold, THE Audience_Targeting_Engine SHALL display a warning message
9. THE Audience_Targeting_Engine SHALL allow combining multiple criteria with AND/OR logic operators

### Requirement 4: Survey Builder - Question Management

**User Story:** As an advertiser, I want to build surveys with various question types using a drag-and-drop interface, so that I can collect the specific data I need.

#### Acceptance Criteria

1. THE Survey_Builder SHALL provide a drag-and-drop interface for adding, reordering, and removing questions
2. THE Survey_Builder SHALL support the following question types: single choice, multiple choice, checkbox, short text, long text, rating scale (1-5 and 1-10), NPS (0-10), Likert scale, image choice, matrix/grid, yes/no, ranking, slider, and date/time picker
3. WHEN an advertiser adds a question, THE Survey_Builder SHALL assign a unique question identifier
4. THE Survey_Builder SHALL allow marking questions as required or optional
5. THE Survey_Builder SHALL allow setting character limits on text answer fields
6. THE Survey_Builder SHALL support image and video embedding within questions
7. WHEN an advertiser enables question randomization, THE Survey_Builder SHALL indicate that question order will vary for respondents
8. WHEN an advertiser enables answer randomization for a multiple choice question, THE Survey_Builder SHALL indicate that answer order will vary for respondents
9. THE Survey_Builder SHALL calculate and display estimated survey completion time based on question count and types
10. THE Survey_Builder SHALL support question duplication for rapid survey creation

### Requirement 5: Survey Builder - Logic Flow Editor

**User Story:** As an advertiser, I want to create conditional survey flows with branching and skip logic, so that respondents see relevant questions based on their answers.

#### Acceptance Criteria

1. THE Logic_Flow_Editor SHALL provide a visual representation of survey flow showing all questions and conditional paths
2. THE Logic_Flow_Editor SHALL support skip logic rules in the format "IF answer equals X, THEN skip to question N"
3. THE Logic_Flow_Editor SHALL support branching logic rules in the format "IF answer equals Y, THEN show sub-question Y1"
4. THE Logic_Flow_Editor SHALL support quota-based branching in the format "IF demographic quota is full, THEN route to disqualification"
5. WHEN an advertiser creates a logic rule, THE Logic_Flow_Editor SHALL validate that target questions exist
6. WHEN an advertiser creates a logic rule, THE Logic_Flow_Editor SHALL detect and warn about circular logic paths
7. THE Logic_Flow_Editor SHALL display all logic rules associated with each question in a summary panel
8. THE Logic_Flow_Editor SHALL allow editing and deleting existing logic rules
9. WHEN an advertiser deletes a question with associated logic rules, THE Logic_Flow_Editor SHALL prompt for confirmation and remove dependent rules

### Requirement 6: Survey Builder - Screener and Quality Controls

**User Story:** As an advertiser, I want to create screener questions and ensure response quality, so that I only pay for qualified, attentive respondents.

#### Acceptance Criteria

1. THE Survey_Builder SHALL provide a separate screener section that appears before the main survey
2. THE Survey_Builder SHALL allow defining disqualification criteria based on screener answers
3. THE Attention_Check_System SHALL automatically insert attention check questions at random positions in the survey
4. THE Survey_Builder SHALL prevent advertisers from disabling or removing platform-inserted attention checks
5. THE Survey_Builder SHALL display a notice indicating where attention checks will be inserted
6. WHEN an advertiser creates a screener question, THE Survey_Builder SHALL allow marking specific answers as disqualifying
7. THE Survey_Builder SHALL support screener quota limits that disqualify respondents when segment quotas are filled

### Requirement 7: Survey Builder - Preview and Collaboration

**User Story:** As an advertiser, I want to preview my survey and collaborate with team members, so that I can ensure quality before launch.

#### Acceptance Criteria

1. THE Survey_Preview SHALL display the survey in both desktop and mobile views
2. THE Survey_Preview SHALL render all question types, logic flows, and randomization as respondents will experience them
3. THE Survey_Preview SHALL allow test submissions that do not count toward campaign quotas or budgets
4. THE Survey_Builder SHALL maintain version history of all survey edits
5. THE Survey_Builder SHALL allow rolling back to previous survey versions
6. WHEN multiple team members edit a survey simultaneously, THE Survey_Builder SHALL display active editors and prevent conflicting edits
7. THE Survey_Builder SHALL provide a template library with pre-built survey structures for common use cases
8. THE Survey_Builder SHALL allow duplicating existing campaigns to create new campaigns with similar structure

### Requirement 8: Budget and Quota Management

**User Story:** As an advertiser, I want to set and monitor campaign budgets with automatic controls, so that I stay within spending limits.

#### Acceptance Criteria

1. THE Budget_Manager SHALL require advertisers to set a total campaign budget before submission
2. THE Budget_Manager SHALL enforce minimum budget requirements based on campaign type and audience size
3. THE Budget_Manager SHALL allow setting daily spending caps
4. THE Budget_Manager SHALL display real-time spending tracker showing spent amount, remaining budget, and projected completion date
5. WHEN campaign spending reaches 80% of total budget, THE Budget_Manager SHALL send a warning notification
6. WHEN campaign spending reaches 100% of total budget, THE Budget_Manager SHALL automatically pause the campaign
7. THE Budget_Manager SHALL allow setting segment quotas limiting responses from specific demographic groups
8. WHEN a segment quota is filled, THE Budget_Manager SHALL automatically pause targeting for that segment while continuing other segments
9. THE Budget_Manager SHALL allow advertisers to add additional budget to active campaigns (top-up)
10. THE Budget_Manager SHALL calculate and display cost per qualified response (CPR) in real-time

### Requirement 9: Campaign Lifecycle Management

**User Story:** As an advertiser, I want to control my campaign status through its lifecycle, so that I can manage when my survey is active and collecting responses.

#### Acceptance Criteria

1. THE Campaign_Lifecycle_System SHALL support the following states: draft, pending review, approved, active, paused, completed, and archived
2. WHEN an advertiser submits a draft campaign, THE Campaign_Lifecycle_System SHALL transition the campaign to pending review state
3. WHEN an admin approves a pending campaign, THE Campaign_Lifecycle_System SHALL transition the campaign to approved state
4. WHEN an advertiser activates an approved campaign, THE Campaign_Lifecycle_System SHALL transition the campaign to active state and begin showing surveys to targeted users
5. WHEN an advertiser pauses an active campaign, THE Campaign_Lifecycle_System SHALL transition the campaign to paused state and stop showing surveys to users
6. WHEN an advertiser attempts to edit an active campaign, THE Campaign_Lifecycle_System SHALL require pausing the campaign first
7. WHEN a campaign budget is exhausted or end date is reached, THE Campaign_Lifecycle_System SHALL automatically transition the campaign to completed state
8. THE Campaign_Lifecycle_System SHALL allow advertisers to archive completed campaigns
9. WHEN fraud rate exceeds 30% for a campaign, THE Campaign_Lifecycle_System SHALL automatically pause the campaign and notify the advertiser
10. THE Campaign_Lifecycle_System SHALL support auto-approval for campaigns from verified advertisers with good standing

### Requirement 10: Analytics Dashboard - Response Metrics

**User Story:** As an advertiser, I want to view comprehensive response metrics, so that I can understand campaign performance and response quality.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display total response counts categorized as submitted, qualified, rejected, and in-progress
2. THE Analytics_Dashboard SHALL calculate and display overall completion rate as percentage of started surveys that were completed
3. THE Analytics_Dashboard SHALL calculate and display drop-off rate for each question showing percentage of respondents who abandoned at that point
4. THE Analytics_Dashboard SHALL calculate and display average completion time for qualified responses
5. THE Analytics_Dashboard SHALL display fraud score distribution showing percentage of responses in each fraud risk category
6. THE Analytics_Dashboard SHALL calculate and display average response quality score
7. THE Analytics_Dashboard SHALL display cost per qualified response (CPR) with comparison to target CPR
8. THE Analytics_Dashboard SHALL update metrics in real-time with data refreshed every 30 seconds
9. THE Analytics_Dashboard SHALL display statistical confidence level indicator based on sample size

### Requirement 11: Analytics Dashboard - Demographic Analysis

**User Story:** As an advertiser, I want to analyze responses by demographic segments, so that I can understand how different groups respond to my survey.

#### Acceptance Criteria

1. THE Analytics_Dashboard SHALL display demographic breakdown charts for age, gender, location, and device type
2. THE Analytics_Dashboard SHALL display answer distribution for each question using appropriate visualizations (bar charts for single choice, pie charts for categorical data, word clouds for text responses)
3. THE Analytics_Dashboard SHALL provide cross-tabulation filtering allowing comparison of answers across demographic subgroups
4. WHEN an advertiser selects a demographic filter, THE Analytics_Dashboard SHALL update all charts and metrics to reflect the filtered segment
5. THE Analytics_Dashboard SHALL display screener funnel visualization showing drop-off at each screener question
6. THE Analytics_Dashboard SHALL provide NPS summary with score calculation and benchmark comparison
7. THE Analytics_Dashboard SHALL provide Likert scale summaries with mean, median, and distribution visualization
8. THE Analytics_Dashboard SHALL generate AI-powered sentiment analysis clusters for open-text responses
9. THE Analytics_Dashboard SHALL anonymize all displayed data ensuring no personally identifiable information (PII) is exposed

### Requirement 12: Export and Reporting

**User Story:** As an advertiser, I want to export survey data and generate reports, so that I can analyze results in external tools and share findings with stakeholders.

#### Acceptance Criteria

1. THE Export_System SHALL support exporting response data in CSV and XLSX formats
2. THE Export_System SHALL support generating PDF executive summary reports
3. THE Export_System SHALL generate AI-powered insight reports highlighting key findings and trends
4. THE Export_System SHALL allow scheduling automated report delivery via email on daily, weekly, or monthly intervals
5. THE Export_System SHALL provide API access for programmatic data retrieval
6. THE Export_System SHALL anonymize all exported data ensuring no PII is included
7. WHEN an advertiser requests an export, THE Export_System SHALL generate the file asynchronously and notify when ready for download
8. THE Export_System SHALL include metadata in exports such as campaign name, date range, total responses, and completion rate
9. THE Export_System SHALL allow filtering export data by date range, demographic segment, and response quality

### Requirement 13: Team Management

**User Story:** As an advertiser account owner, I want to add team members with specific roles, so that multiple people can collaborate on campaigns with appropriate permissions.

#### Acceptance Criteria

1. THE Team_Management_System SHALL support adding multiple users to an advertiser account
2. THE Team_Management_System SHALL provide three role types: Billing Contact, Campaign Manager, and Analyst
3. WHEN a user has the Billing Contact role, THE Team_Management_System SHALL grant access to billing, invoices, and payment methods
4. WHEN a user has the Campaign Manager role, THE Team_Management_System SHALL grant access to create, edit, and manage campaigns
5. WHEN a user has the Analyst role, THE Team_Management_System SHALL grant read-only access to analytics and export capabilities
6. THE Team_Management_System SHALL allow account owners to invite team members via email
7. WHEN a team member invitation is sent, THE Notification_System SHALL send an email with registration link
8. THE Team_Management_System SHALL allow account owners to modify team member roles
9. THE Team_Management_System SHALL allow account owners to remove team members from the account
10. THE Team_Management_System SHALL display audit logs showing which team member performed each action

### Requirement 14: Billing and Invoicing

**User Story:** As an advertiser, I want to manage my billing and view invoices, so that I can track spending and make payments.

#### Acceptance Criteria

1. THE Billing_System SHALL support prepaid credit wallet funding
2. THE Billing_System SHALL support post-pay billing with monthly invoicing
3. WHEN an advertiser adds funds to prepaid credit wallet, THE Billing_System SHALL update the available balance immediately
4. WHEN a campaign incurs costs, THE Billing_System SHALL deduct from prepaid credit wallet or accumulate post-pay charges
5. THE Billing_System SHALL generate invoices showing campaign name, response counts, CPR, and total charges
6. THE Billing_System SHALL send budget alert notifications when prepaid credit wallet balance falls below 20% of average monthly spending
7. THE Billing_System SHALL provide invoice history with download capability
8. THE Billing_System SHALL support multiple payment methods including credit card, bank transfer, and wire transfer
9. WHEN an invoice is generated, THE Notification_System SHALL send an email notification to users with Billing Contact role
10. THE Billing_System SHALL display spending trends and forecasts based on active campaign budgets

### Requirement 15: Authentication and Security

**User Story:** As an advertiser, I want secure access to my account, so that my campaign data and business information remain protected.

#### Acceptance Criteria

1. THE Authentication_System SHALL require email and password for login
2. THE Authentication_System SHALL enforce password complexity requirements (minimum 8 characters, uppercase, lowercase, number, special character)
3. THE Authentication_System SHALL support password reset via email verification
4. THE Authentication_System SHALL implement session timeout after 30 minutes of inactivity
5. THE Authentication_System SHALL support two-factor authentication (2FA) via email or authenticator app
6. WHEN a login attempt fails three times, THE Authentication_System SHALL temporarily lock the account for 15 minutes
7. THE Authentication_System SHALL log all login attempts with timestamp, IP address, and device information
8. THE API_Backend SHALL validate authentication tokens on every request
9. THE API_Backend SHALL enforce role-based access control for all endpoints

### Requirement 16: Data Communication with Backend

**User Story:** As the frontend application, I want to communicate with the NestJS backend for all data operations, so that data access is centralized and secure.

#### Acceptance Criteria

1. THE Frontend_Application SHALL send all data requests to the API_Backend
2. THE Frontend_Application SHALL NOT access Supabase or any database directly
3. WHEN the API_Backend returns an error response, THE Frontend_Application SHALL display user-friendly error messages
4. THE Frontend_Application SHALL implement request retry logic with exponential backoff for failed requests
5. THE Frontend_Application SHALL validate all user input using Zod schemas before sending to API_Backend
6. THE Frontend_Application SHALL use TanStack Query for server state management and caching
7. THE Frontend_Application SHALL use Zustand for client-side state management
8. WHEN the API_Backend is unavailable, THE Frontend_Application SHALL display an offline message and queue non-critical requests
9. THE Frontend_Application SHALL include authentication tokens in all API requests

### Requirement 17: User Interface and Experience

**User Story:** As an advertiser, I want an intuitive and responsive interface, so that I can efficiently create and manage campaigns.

#### Acceptance Criteria

1. THE Frontend_Application SHALL be built using React with TypeScript (TSX)
2. THE Frontend_Application SHALL use Vite as the build tool
3. THE Frontend_Application SHALL use Tailwind CSS and shadcn/ui for styling and components
4. THE Frontend_Application SHALL be fully responsive supporting desktop, tablet, and mobile viewports
5. THE Frontend_Application SHALL display loading states during asynchronous operations
6. THE Frontend_Application SHALL display success and error notifications for user actions
7. THE Frontend_Application SHALL implement keyboard navigation for accessibility
8. THE Frontend_Application SHALL meet WCAG 2.1 Level AA accessibility standards
9. THE Frontend_Application SHALL display contextual help tooltips for complex features
10. THE Frontend_Application SHALL persist user preferences such as theme and dashboard layout

### Requirement 18: Campaign Review and Approval

**User Story:** As an admin, I want to review and approve advertiser campaigns before they go live, so that I can ensure platform quality and policy compliance.

#### Acceptance Criteria

1. WHEN an advertiser submits a campaign, THE Admin_Interface SHALL add the campaign to the review queue
2. THE Admin_Interface SHALL display campaign details including objective, audience targeting, survey content, and budget
3. THE Admin_Interface SHALL provide options to approve, reject, or request modifications
4. WHEN an admin rejects a campaign, THE Admin_Interface SHALL require a rejection reason
5. WHEN an admin approves or rejects a campaign, THE Notification_System SHALL send an email to the advertiser
6. THE Admin_Interface SHALL display review history showing all admin actions and timestamps
7. THE Campaign_Lifecycle_System SHALL support auto-approval for verified advertisers based on account standing and history
8. WHEN a campaign is flagged for policy violation, THE Admin_Interface SHALL highlight the specific policy concern

### Requirement 19: Real-Time Updates and Notifications

**User Story:** As an advertiser, I want to receive real-time updates about my campaigns, so that I can respond quickly to important events.

#### Acceptance Criteria

1. THE Notification_System SHALL send email notifications for account approval, campaign approval, campaign rejection, budget warnings, campaign completion, and fraud alerts
2. THE Frontend_Application SHALL display in-app notifications for real-time events
3. THE Analytics_Dashboard SHALL update metrics every 30 seconds using polling or WebSocket connections
4. WHEN a campaign is automatically paused, THE Notification_System SHALL send an immediate notification explaining the reason
5. THE Notification_System SHALL allow advertisers to configure notification preferences for each event type
6. THE Frontend_Application SHALL display a notification badge showing unread notification count
7. THE Notification_System SHALL maintain notification history accessible from the user interface

### Requirement 20: Survey Response Parser and Validator

**User Story:** As the system, I want to parse and validate survey responses from the backend, so that the analytics dashboard displays accurate and properly formatted data.

#### Acceptance Criteria

1. WHEN the API_Backend returns survey response data, THE Response_Parser SHALL parse the JSON response into typed Response objects
2. THE Response_Validator SHALL validate that each response contains required fields: response_id, campaign_id, timestamp, answers, demographic_data, fraud_score, and quality_score
3. WHEN a response contains invalid or missing data, THE Response_Validator SHALL log the error and exclude the response from analytics
4. THE Response_Pretty_Printer SHALL format Response objects back into valid JSON for export functionality
5. FOR ALL valid Response objects, parsing then printing then parsing SHALL produce an equivalent object (round-trip property)
6. THE Response_Parser SHALL handle all supported question types and answer formats
7. WHEN the response data structure changes, THE Response_Parser SHALL gracefully handle legacy response formats
