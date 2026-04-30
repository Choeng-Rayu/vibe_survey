# Requirements Document

## Introduction

The Survey Creator Frontend is the advertiser-facing interface for a Survey-as-Ads platform with integrated AI Survey Builder Agent capabilities. This system enables companies to create advertising campaigns that incorporate surveys through natural language interaction, manage budgets, target specific audiences, and analyze response data. The platform operates as a three-sided marketplace connecting advertisers, users (survey respondents), and the platform itself.

The frontend integrates seamlessly with the AI Survey Builder Agent, providing natural language survey creation, intelligent import normalization, multi-format export, AI-powered enhancements, and conversational survey modification. All AI interactions are presented through a diff-based preview system ensuring advertisers maintain control over their survey content.

This document specifies the requirements for the advertiser side of the platform, covering the complete advertiser journey from registration through AI-assisted campaign creation, execution, and analytics.

## Glossary

- **Advertiser**: A company, organization, or individual that creates survey campaigns to collect user feedback
- **Campaign**: A complete advertising initiative including audience targeting, survey content, budget allocation, and execution timeline
- **Survey_Builder**: The drag-and-drop interface integrated with AI agent for creating survey questions and logic
- **AI_Agent_Panel**: The chat interface component for natural language interaction with the AI Survey Builder Agent
- **AI_Agent_Mode**: One of six operational modes (Generate, Enhance, Normalize, Translate, Analyze, Modify) displayed in the UI
- **Diff_Viewer**: UI component that displays proposed AI changes in a side-by-side comparison before applying them
- **Conversation_Context**: The maintained history of user interactions and AI responses within a survey editing session
- **AI_Action**: A discrete, surgical modification operation performed by the AI (e.g., add_question, update_logic, reorder_questions)
- **Import_Wizard**: The Excel upload interface with AI normalization capabilities
- **Export_Panel**: The multi-format export interface supporting Excel, PDF, and JSON formats
- **Template_Gallery**: The AI-powered template suggestion and modification interface
- **Version_History_Panel**: The interface displaying AI-generated changes and rollback capabilities
- **AI_Processing_State**: Loading and progress indicators for AI operations
- **AI_Error_Handler**: Specialized error handling for AI failures and recovery options
- **Rate_Limit_Display**: UI component showing remaining AI request quota
- **Security_Guard**: Frontend validation for prompt injection prevention
- **Audience_Targeting_Engine**: The system that defines and estimates target demographic segments
- **Budget_Manager**: The system that tracks spending, enforces caps, and manages quotas
- **Analytics_Dashboard**: The interface displaying campaign performance metrics and response data
- **Qualified_Response**: A survey response that passes fraud detection and meets quality standards
- **Qualification_Detection_System**: The system that automatically determines if a respondent meets platform and campaign criteria
- **CPR**: Cost Per (qualified) Response - the pricing model for the platform
- **Screener**: Pre-survey questions that determine respondent eligibility
- **Attention_Check**: Platform-inserted questions that verify respondent engagement
- **Fraud_Score**: A metric indicating the likelihood that a response is fraudulent or low-quality
- **Segment_Quota**: A limit on responses from a specific demographic group
- **Skip_Logic**: Survey flow control that skips questions based on previous answers
- **Branching_Logic**: Survey flow control that shows additional questions based on previous answers
- **Admin**: Platform administrator who reviews and approves campaigns and advertisers
- **Campaign_Lifecycle**: The progression of states from draft through completion
- **NPS**: Net Promoter Score - a metric measuring customer loyalty (0-10 scale)
- **Likert_Scale**: A rating scale typically using agreement levels (strongly disagree to strongly agree)
- **Cross_Tabulation**: Analysis comparing responses across different demographic segments
- **API_Backend**: The NestJS backend service that handles all data operations
- **Prepaid_Credit_Wallet**: An account balance system for pre-funding campaigns

## Requirements

### Requirement 1: Advertiser Registration and Verification

**User Story:** As an advertiser (company, organization, or individual), I want to register and verify my legitimacy, so that I can create survey campaigns on the platform.

#### Acceptance Criteria

1. WHEN an advertiser submits a registration form with account details, THE Registration_System SHALL create a pending advertiser account
2. WHEN an advertiser uploads verification documentation, THE Registration_System SHALL store the document and flag the account for admin review
3. THE Registration_System SHALL require advertiser name, email, phone number, address, and verification documentation upload
4. WHEN an admin reviews a pending advertiser account, THE Admin_Interface SHALL provide options to approve or reject with reason
5. WHEN an advertiser account is approved, THE Notification_System SHALL send an email notification with login credentials
6. WHEN an advertiser account is rejected, THE Notification_System SHALL send an email notification with the rejection reason
7. THE Registration_System SHALL validate email address format and domain authenticity
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

### Requirement 4: AI-Integrated Survey Builder - Question Management

**User Story:** As an advertiser, I want to build surveys with AI assistance using natural language commands and a drag-and-drop interface, so that I can efficiently create surveys without manual complexity.

#### Acceptance Criteria

1. THE Survey_Builder SHALL integrate with the AI_Agent_Panel for natural language survey creation and modification
2. THE Survey_Builder SHALL provide a drag-and-drop interface for adding, reordering, and removing questions
3. THE Survey_Builder SHALL support the following question types: single choice, multiple choice, checkbox, short text, long text, rating scale (1-5 and 1-10), NPS (0-10), Likert scale, image choice, matrix/grid, yes/no, ranking, slider, and date/time picker
4. WHEN an advertiser provides a natural language prompt, THE AI_Agent_Panel SHALL generate survey modifications and display them in the Diff_Viewer
5. WHEN an advertiser adds a question manually, THE Survey_Builder SHALL assign a unique question identifier
6. THE Survey_Builder SHALL allow marking questions as required or optional
7. THE Survey_Builder SHALL allow setting character limits on text answer fields
8. THE Survey_Builder SHALL support image and video embedding within questions
9. WHEN an advertiser enables question randomization, THE Survey_Builder SHALL indicate that question order will vary for respondents
10. WHEN an advertiser enables answer randomization for a multiple choice question, THE Survey_Builder SHALL indicate that answer order will vary for respondents
11. THE Survey_Builder SHALL calculate and display estimated survey completion time based on question count and types
12. THE Survey_Builder SHALL support question duplication for rapid survey creation
13. THE AI_Agent_Panel SHALL display the current AI_Agent_Mode (Generate, Modify, Enhance, Normalize, Translate, Analyze)
14. THE Survey_Builder SHALL maintain Conversation_Context across the survey editing session

### Requirement 5: AI-Enhanced Logic Flow Editor

**User Story:** As an advertiser, I want to create conditional survey flows with AI assistance and visual editing, so that I can build complex logic without manual complexity.

#### Acceptance Criteria

1. THE Logic_Flow_Editor SHALL provide a visual representation of survey flow showing all questions and conditional paths
2. THE Logic_Flow_Editor SHALL integrate with the AI_Agent_Panel for natural language logic creation
3. THE Logic_Flow_Editor SHALL support skip logic rules in the format "IF answer equals X, THEN skip to question N"
4. THE Logic_Flow_Editor SHALL support branching logic rules in the format "IF answer equals Y, THEN show sub-question Y1"
5. THE Logic_Flow_Editor SHALL support quota-based branching in the format "IF demographic quota is full, THEN route to disqualification"
6. WHEN an advertiser describes logic in natural language, THE AI_Agent_Panel SHALL generate the appropriate logic rules and display them in the Diff_Viewer
7. WHEN an advertiser creates a logic rule, THE Logic_Flow_Editor SHALL validate that target questions exist
8. WHEN an advertiser creates a logic rule, THE Logic_Flow_Editor SHALL detect and warn about circular logic paths
9. THE Logic_Flow_Editor SHALL display all logic rules associated with each question in a summary panel
10. THE Logic_Flow_Editor SHALL allow editing and deleting existing logic rules
11. WHEN an advertiser deletes a question with associated logic rules, THE Logic_Flow_Editor SHALL prompt for confirmation and remove dependent rules
12. THE AI_Agent_Panel SHALL suggest logic improvements when operating in Enhance mode

### Requirement 6: Survey Builder - Screener and Quality Controls

**User Story:** As an advertiser, I want the system to automatically detect qualified respondents and ensure response quality, so that I only pay for qualified, attentive respondents.

#### Acceptance Criteria

1. THE Survey_Builder SHALL provide a separate screener section that appears before the main survey
2. THE Qualification_Detection_System SHALL automatically determine respondent qualification based on screener answers and platform criteria
3. THE Attention_Check_System SHALL automatically insert attention check questions at random positions in the survey
4. THE Survey_Builder SHALL prevent advertisers from disabling or removing platform-inserted attention checks
5. THE Survey_Builder SHALL display a notice indicating where attention checks will be inserted
6. WHEN an advertiser creates a screener question, THE Survey_Builder SHALL allow marking specific answers as disqualifying
7. THE Qualification_Detection_System SHALL support screener quota limits that disqualify respondents when segment quotas are filled

### Requirement 7: AI-Enhanced Survey Preview and Collaboration

**User Story:** As an advertiser, I want to preview my survey with AI analysis and collaborate with team members, so that I can ensure quality before launch.

#### Acceptance Criteria

1. THE Survey_Preview SHALL display the survey in both desktop and mobile views
2. THE Survey_Preview SHALL render all question types, logic flows, and randomization as respondents will experience them
3. THE Survey_Preview SHALL allow test submissions that do not count toward campaign quotas or budgets
4. THE Survey_Builder SHALL maintain Version_History_Panel of all survey edits including AI-generated changes
5. THE Version_History_Panel SHALL display AI_Action details for each modification with timestamps and mode information
6. THE Survey_Builder SHALL allow rolling back to previous survey versions
7. WHEN multiple team members edit a survey simultaneously, THE Survey_Builder SHALL display active editors and prevent conflicting edits
8. THE Template_Gallery SHALL provide AI-powered template suggestions based on campaign objectives
9. THE Survey_Builder SHALL allow duplicating existing campaigns to create new campaigns with similar structure
10. WHEN an advertiser requests survey analysis, THE AI_Agent_Panel SHALL operate in Analyze mode and provide quality feedback
11. THE AI_Agent_Panel SHALL suggest improvements for question clarity, logic flow, and survey structure when in Enhance mode

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

### Requirement 13: Billing and Invoicing

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
9. WHEN an invoice is generated, THE Notification_System SHALL send an email notification to the advertiser
10. THE Billing_System SHALL display spending trends and forecasts based on active campaign budgets

### Requirement 14: Authentication and Security

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

### Requirement 15: Data Communication with Backend and AI Services

**User Story:** As the frontend application, I want to communicate with the NestJS backend and AI Survey Builder Agent for all data operations, so that data access is centralized and secure.

#### Acceptance Criteria

1. THE Frontend_Application SHALL send all data requests to the API_Backend
2. THE Frontend_Application SHALL send all AI requests to the AI Survey Builder Agent API endpoints
3. THE Frontend_Application SHALL NOT access Supabase or any database directly
4. WHEN the API_Backend or AI service returns an error response, THE Frontend_Application SHALL display user-friendly error messages
5. THE Frontend_Application SHALL implement request retry logic with exponential backoff for failed requests
6. THE Frontend_Application SHALL validate all user input using Zod schemas before sending to API_Backend
7. THE Frontend_Application SHALL use TanStack Query for server state management and caching
8. THE Frontend_Application SHALL use Zustand for client-side state management including AI conversation context
9. WHEN the API_Backend or AI service is unavailable, THE Frontend_Application SHALL display an offline message and queue non-critical requests
10. THE Frontend_Application SHALL include authentication tokens in all API requests
11. THE Frontend_Application SHALL handle AI-specific error codes including rate limiting, prompt injection detection, and service unavailability
12. THE Frontend_Application SHALL cache AI conversation context locally and sync with backend periodically

### Requirement 16: AI-Enhanced User Interface and Experience

**User Story:** As an advertiser, I want an intuitive and responsive interface with integrated AI capabilities, so that I can efficiently create and manage campaigns with AI assistance.

#### Acceptance Criteria

1. THE Frontend_Application SHALL be built using Next.js 16 with React 19 and TypeScript (TSX)
2. THE Frontend_Application SHALL use Next.js as the build framework with App Router
3. THE Frontend_Application SHALL use Tailwind CSS and shadcn/ui for styling and components
4. THE Frontend_Application SHALL be fully responsive supporting desktop, tablet, and mobile viewports
5. THE Frontend_Application SHALL display loading states during asynchronous operations including AI processing
6. THE Frontend_Application SHALL display success and error notifications for user actions and AI operations
7. THE Frontend_Application SHALL implement keyboard navigation for accessibility
8. THE Frontend_Application SHALL meet WCAG 2.1 Level AA accessibility standards
9. THE Frontend_Application SHALL display contextual help tooltips for complex features including AI capabilities
10. THE Frontend_Application SHALL persist user preferences such as theme, dashboard layout, and AI interaction preferences
11. THE Frontend_Application SHALL integrate AI_Agent_Panel, Diff_Viewer, Import_Wizard, Export_Panel, Template_Gallery, and Version_History_Panel components
12. THE Frontend_Application SHALL provide seamless transitions between manual editing and AI-assisted editing modes

### Requirement 17: Real-Time Updates and AI Notifications

**User Story:** As an advertiser, I want to receive real-time updates about my campaigns and AI operations, so that I can respond quickly to important events.

#### Acceptance Criteria

1. THE Notification_System SHALL send email notifications for account approval, campaign approval, campaign rejection, budget warnings, campaign completion, fraud alerts, and AI operation failures
2. THE Frontend_Application SHALL display in-app notifications for real-time events including AI processing completion
3. THE Analytics_Dashboard SHALL update metrics every 30 seconds using polling or WebSocket connections
4. THE AI_Agent_Panel SHALL provide real-time updates during AI processing operations
5. WHEN a campaign is automatically paused, THE Notification_System SHALL send an immediate notification explaining the reason
6. WHEN AI operations complete or fail, THE Frontend_Application SHALL display immediate notifications
7. THE Notification_System SHALL allow advertisers to configure notification preferences for each event type including AI events
8. THE Frontend_Application SHALL display a notification badge showing unread notification count
9. THE Notification_System SHALL maintain notification history accessible from the user interface
10. THE Rate_Limit_Display SHALL update in real-time as AI requests are consumed

### Requirement 18: AI Agent Panel Integration

**User Story:** As an advertiser, I want to interact with an AI agent through natural language, so that I can create and modify surveys conversationally.

#### Acceptance Criteria

1. THE AI_Agent_Panel SHALL provide a chat interface with message input and conversation history
2. THE AI_Agent_Panel SHALL display the current AI_Agent_Mode (Generate, Enhance, Normalize, Translate, Analyze, Modify)
3. WHEN an advertiser submits a natural language prompt, THE AI_Agent_Panel SHALL send the request to the AI Survey Builder Agent API
4. THE AI_Agent_Panel SHALL maintain Conversation_Context across the survey editing session
5. THE AI_Agent_Panel SHALL display AI_Processing_State indicators during request processing
6. WHEN the AI agent proposes changes, THE AI_Agent_Panel SHALL trigger the Diff_Viewer to display proposed modifications
7. THE AI_Agent_Panel SHALL allow advertisers to accept or reject AI-proposed changes
8. THE AI_Agent_Panel SHALL display error messages when AI requests fail with retry options
9. THE AI_Agent_Panel SHALL validate user prompts using Security_Guard to prevent prompt injection
10. THE AI_Agent_Panel SHALL display Rate_Limit_Display showing remaining AI request quota

### Requirement 19: Diff Viewer Component

**User Story:** As an advertiser, I want to preview AI-proposed changes before applying them, so that I can verify modifications are correct.

#### Acceptance Criteria

1. THE Diff_Viewer SHALL display a side-by-side comparison of current and proposed survey states
2. THE Diff_Viewer SHALL highlight added, removed, and modified elements using color coding
3. THE Diff_Viewer SHALL display changes at the question, option, and logic rule level
4. THE Diff_Viewer SHALL show AI_Action details for each proposed modification
5. THE Diff_Viewer SHALL allow advertisers to accept individual changes or accept all changes
6. THE Diff_Viewer SHALL allow advertisers to reject individual changes or reject all changes
7. WHEN changes are accepted, THE Diff_Viewer SHALL apply modifications to the survey and update the Survey_Builder
8. THE Diff_Viewer SHALL display change summaries indicating the number of additions, modifications, and deletions
9. THE Diff_Viewer SHALL support keyboard navigation for accessibility

### Requirement 20: AI-Enhanced Import Wizard

**User Story:** As an advertiser, I want to import Excel files with AI normalization, so that inconsistent data is automatically cleaned and standardized.

#### Acceptance Criteria

1. THE Import_Wizard SHALL provide file upload interface for Excel files
2. WHEN an Excel file is uploaded, THE Import_Wizard SHALL parse the file and extract survey questions
3. THE Import_Wizard SHALL display a preview of parsed questions with detected question types
4. THE Import_Wizard SHALL trigger AI normalization in Normalize mode for inconsistent formatting
5. WHEN AI normalization is complete, THE Import_Wizard SHALL display normalized changes in the Diff_Viewer
6. THE Import_Wizard SHALL allow advertisers to review and approve normalization changes
7. THE Import_Wizard SHALL display import progress indicators during processing
8. THE Import_Wizard SHALL handle import errors with descriptive error messages and retry options
9. THE Import_Wizard SHALL support Excel files with columns for question text, question type, answer options, and logic rules
10. THE Import_Wizard SHALL validate imported data against survey schema requirements

### Requirement 21: Multi-Format Export Panel

**User Story:** As an advertiser, I want to export surveys to multiple formats, so that I can share surveys with stakeholders and integrate with other systems.

#### Acceptance Criteria

1. THE Export_Panel SHALL provide format selection options for Excel, PDF, and JSON exports
2. THE Export_Panel SHALL display export configuration options specific to each format
3. WHEN an advertiser requests Excel export, THE Export_Panel SHALL generate an Excel file with questions, types, options, and logic
4. WHEN an advertiser requests PDF export, THE Export_Panel SHALL generate a formatted PDF document displaying the complete survey
5. WHEN an advertiser requests JSON export, THE Export_Panel SHALL provide the canonical JSON schema format
6. THE Export_Panel SHALL display export progress indicators during file generation
7. THE Export_Panel SHALL provide download links when export files are ready
8. THE Export_Panel SHALL handle export errors with descriptive error messages and retry options
9. THE Export_Panel SHALL preserve all survey data during export operations

### Requirement 22: AI Processing States and Error Handling

**User Story:** As an advertiser, I want clear feedback on AI operations and error recovery options, so that I can understand system status and resolve issues.

#### Acceptance Criteria

1. THE AI_Processing_State SHALL display loading indicators during AI request processing
2. THE AI_Processing_State SHALL show progress indicators for long-running operations like import normalization
3. THE AI_Processing_State SHALL display estimated completion time for AI operations
4. THE AI_Error_Handler SHALL display specific error messages for different AI failure types
5. THE AI_Error_Handler SHALL provide retry options for failed AI requests
6. THE AI_Error_Handler SHALL suggest alternative approaches when AI operations fail repeatedly
7. WHEN AI rate limits are exceeded, THE Rate_Limit_Display SHALL show when limits will reset
8. THE AI_Error_Handler SHALL log AI errors for debugging purposes
9. THE AI_Processing_State SHALL allow canceling long-running AI operations

### Requirement 23: Security Integration for AI

**User Story:** As a system administrator, I want the frontend to prevent malicious AI prompts, so that users cannot exploit the AI system.

#### Acceptance Criteria

1. THE Security_Guard SHALL validate user prompts before sending to the AI agent
2. THE Security_Guard SHALL detect prompt injection patterns such as "ignore previous instructions" and "you are now"
3. WHEN a malicious prompt is detected, THE Security_Guard SHALL block the request and display a warning message
4. THE Security_Guard SHALL sanitize user inputs to remove potentially harmful content
5. THE Rate_Limit_Display SHALL show current AI request usage and remaining quota
6. THE Rate_Limit_Display SHALL warn advertisers when approaching rate limits
7. THE Frontend_Application SHALL enforce client-side rate limiting to prevent excessive AI requests
8. THE Security_Guard SHALL log blocked prompts for security monitoring

### Requirement 24: Conversation Context Management

**User Story:** As an advertiser, I want the AI to remember our conversation history, so that I can make follow-up requests without repeating context.

#### Acceptance Criteria

1. THE Conversation_Context SHALL maintain chat history for the current survey editing session
2. THE Conversation_Context SHALL include previous user prompts, AI responses, and applied modifications
3. THE Conversation_Context SHALL persist to the backend for session recovery
4. WHEN an advertiser makes a follow-up request, THE AI_Agent_Panel SHALL include relevant context in the API request
5. THE Conversation_Context SHALL support referencing previous changes (e.g., "change that question to multiple choice")
6. THE Conversation_Context SHALL display conversation history in the AI_Agent_Panel
7. THE Conversation_Context SHALL allow clearing conversation history to start fresh
8. THE Conversation_Context SHALL automatically save context changes to prevent data loss

### Requirement 25: Template Integration with AI

**User Story:** As an advertiser, I want AI-powered template suggestions and modifications, so that I can quickly start with relevant survey structures.

#### Acceptance Criteria

1. THE Template_Gallery SHALL display pre-built survey templates organized by category
2. THE Template_Gallery SHALL use AI to suggest relevant templates based on campaign objectives
3. WHEN an advertiser selects a template, THE Template_Gallery SHALL load the template into the Survey_Builder
4. THE Template_Gallery SHALL allow AI modification of loaded templates through the AI_Agent_Panel
5. THE Template_Gallery SHALL display template previews with question counts and estimated completion times
6. THE Template_Gallery SHALL support searching templates by keywords and categories
7. THE Template_Gallery SHALL allow saving custom templates from existing surveys
8. THE Template_Gallery SHALL integrate with the AI agent for template enhancement suggestions

### Requirement 26: Version History with AI Tracking

**User Story:** As an advertiser, I want to track AI-generated changes and revert to previous versions, so that I can manage survey evolution and recover from mistakes.

#### Acceptance Criteria

1. THE Version_History_Panel SHALL display chronological list of survey versions with timestamps
2. THE Version_History_Panel SHALL indicate which changes were made by AI versus manual edits
3. THE Version_History_Panel SHALL show AI_Agent_Mode and AI_Action details for AI-generated changes
4. THE Version_History_Panel SHALL display change summaries for each version
5. WHEN an advertiser selects a previous version, THE Version_History_Panel SHALL display a diff comparison
6. THE Version_History_Panel SHALL allow rolling back to any previous version
7. THE Version_History_Panel SHALL preserve AI conversation context associated with each version
8. THE Version_History_Panel SHALL support branching from previous versions to create alternative survey paths

### Requirement 27: Real-Time AI Integration Updates

**User Story:** As an advertiser, I want real-time updates during AI operations, so that I understand system progress and can respond to changes.

#### Acceptance Criteria

1. THE AI_Agent_Panel SHALL update in real-time during AI processing operations
2. THE Survey_Builder SHALL reflect AI-applied changes immediately after acceptance
3. THE Diff_Viewer SHALL update dynamically as AI generates proposed changes
4. THE Rate_Limit_Display SHALL update in real-time as AI requests are consumed
5. THE Conversation_Context SHALL update immediately as new messages are exchanged
6. THE Version_History_Panel SHALL update automatically when AI changes are applied
7. THE AI_Processing_State SHALL provide live progress updates for long-running operations
8. THE Frontend_Application SHALL use WebSocket connections or polling for real-time AI updates

### Requirement 28: Survey Response Parser and Validator

**User Story:** As the system, I want to parse and validate survey responses from the backend, so that the analytics dashboard displays accurate and properly formatted data.

#### Acceptance Criteria

1. WHEN the API_Backend returns survey response data, THE Response_Parser SHALL parse the JSON response into typed Response objects
2. THE Response_Validator SHALL validate that each response contains required fields: response_id, campaign_id, timestamp, answers, demographic_data, fraud_score, and quality_score
3. WHEN a response contains invalid or missing data, THE Response_Validator SHALL log the error and exclude the response from analytics
4. THE Response_Pretty_Printer SHALL format Response objects back into valid JSON for export functionality
5. FOR ALL valid Response objects, parsing then printing then parsing SHALL produce an equivalent object (round-trip property)
6. THE Response_Parser SHALL handle all supported question types and answer formats
7. WHEN the response data structure changes, THE Response_Parser SHALL gracefully handle legacy response formats
