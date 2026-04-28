# Requirements Document

## Introduction

The AI Survey Builder Agent is an intelligent assistant embedded within the campaign creation flow that enables advertisers to create, import, modify, validate, and export surveys through natural language interaction, Excel uploads, and an action-based modification system. The system maintains a canonical JSON schema as the single source of truth, ensuring consistency across all import, export, and modification operations.

## Glossary

- **AI_Agent**: The intelligent assistant that processes natural language prompts and generates survey modifications
- **Canonical_JSON_Schema**: The version 1.0 JSON schema that serves as the single source of truth for all survey data
- **Survey_Builder**: The complete system including AI agent, import/export modules, validation layer, and UI components
- **Action**: A discrete, surgical modification operation (e.g., add_question, update_logic, reorder_questions)
- **Agent_Mode**: One of six operational modes (Generate, Enhance, Normalize, Translate, Analyze, Modify)
- **Conversation_Context**: The maintained history of user interactions and survey modifications within a session
- **Diff_Viewer**: UI component that displays proposed changes before applying them to the survey
- **Import_Pipeline**: The Excel-to-JSON conversion system with intelligent defaults and AI normalization
- **Export_Module**: The JSON-to-Excel/PDF/JSON conversion system
- **Validation_Layer**: Two-level validation system consisting of Zod schema validation and business rules validation
- **Survey_Template**: Pre-built survey structure from the templates library
- **Version_History**: Chronological record of survey states enabling rollback capability
- **Business_Rules**: Semantic validation rules beyond schema structure (e.g., logic references valid questions)
- **Advertiser**: The user creating survey-based ad campaigns
- **Backend_API**: NestJS REST API handling survey operations, AI requests, and data persistence
- **Frontend_UI**: React-based user interface for survey creation and AI interaction
- **Rate_Limiter**: Security component that restricts API request frequency per user
- **Prompt_Injection_Guard**: Security component that detects and blocks malicious AI prompts

## Requirements

### Requirement 1: Canonical JSON Schema Management

**User Story:** As an Advertiser, I want all survey data stored in a consistent format, so that imports, exports, and modifications work reliably across all system components.

#### Acceptance Criteria

1. THE Survey_Builder SHALL store all survey data using Canonical_JSON_Schema version 1.0
2. THE Survey_Builder SHALL support 14 distinct question types in the Canonical_JSON_Schema (single_choice, multiple_choice, text_short, text_long, rating_scale, likert_scale, ranking, matrix_single, matrix_multiple, slider, date, time, file_upload, yes_no)
3. WHEN any import operation completes, THE Import_Pipeline SHALL convert the input to Canonical_JSON_Schema format
4. WHEN any export operation executes, THE Export_Module SHALL convert from Canonical_JSON_Schema to the target format
5. FOR ALL survey modifications, THE AI_Agent SHALL operate exclusively on Canonical_JSON_Schema structures

### Requirement 2: Excel Import with Intelligent Defaults

**User Story:** As an Advertiser, I want to upload Excel files containing survey questions, so that I can quickly import existing surveys without manual data entry.

#### Acceptance Criteria

1. WHEN an Advertiser uploads an Excel file, THE Import_Pipeline SHALL parse the file and extract survey questions
2. WHEN the Excel file lacks explicit question types, THE Import_Pipeline SHALL infer question types from question text and answer options
3. WHEN the Excel file contains incomplete data, THE Import_Pipeline SHALL apply intelligent defaults (e.g., required=true, randomize=false)
4. IF the Excel file contains invalid data, THEN THE Import_Pipeline SHALL return descriptive error messages identifying the specific rows and issues
5. WHEN import completes successfully, THE Import_Pipeline SHALL generate a valid Canonical_JSON_Schema survey object
6. THE Import_Pipeline SHALL support Excel files with columns for question text, question type, answer options, and logic rules

### Requirement 3: AI-Powered Import Normalization

**User Story:** As an Advertiser, I want the AI to clean up and standardize my imported survey data, so that inconsistent formatting doesn't cause issues.

#### Acceptance Criteria

1. WHEN an Excel import contains inconsistent formatting, THE AI_Agent SHALL normalize question text (e.g., fix capitalization, remove extra whitespace)
2. WHEN an Excel import contains ambiguous question types, THE AI_Agent SHALL classify questions into the appropriate Canonical_JSON_Schema question type
3. WHEN an Excel import contains informal language, THE AI_Agent SHALL suggest professional alternatives while preserving meaning
4. THE AI_Agent SHALL operate in Normalize mode during import processing
5. WHEN normalization completes, THE AI_Agent SHALL present changes in the Diff_Viewer before applying them

### Requirement 4: Natural Language Survey Generation

**User Story:** As an Advertiser, I want to describe my survey needs in plain language, so that I can create surveys without learning complex tools.

#### Acceptance Criteria

1. WHEN an Advertiser provides a natural language prompt, THE AI_Agent SHALL generate a complete survey in Canonical_JSON_Schema format
2. THE AI_Agent SHALL operate in Generate mode when creating new surveys from prompts
3. WHEN generating surveys, THE AI_Agent SHALL include appropriate question types, answer options, and default settings
4. WHEN generation completes, THE AI_Agent SHALL display the generated survey in the Diff_Viewer for review
5. THE AI_Agent SHALL maintain Conversation_Context across multiple generation requests within a session

### Requirement 5: Action-Based Survey Modification

**User Story:** As an Advertiser, I want to modify surveys using natural language commands, so that I can make precise changes without manual editing.

#### Acceptance Criteria

1. WHEN an Advertiser requests a survey modification, THE AI_Agent SHALL decompose the request into discrete Action operations
2. THE AI_Agent SHALL support 18 action types (add_question, remove_question, update_question_text, update_question_type, add_option, remove_option, update_option_text, reorder_questions, reorder_options, add_logic, remove_logic, update_logic, update_settings, add_section, remove_section, update_section, duplicate_question, bulk_update)
3. THE AI_Agent SHALL operate in Modify mode when processing modification requests
4. WHEN modifications are proposed, THE AI_Agent SHALL display changes in the Diff_Viewer before applying them
5. THE AI_Agent SHALL never perform full survey rewrites, only surgical Action-based modifications
6. FOR ALL modifications, THE AI_Agent SHALL preserve existing survey structure except for explicitly modified elements

### Requirement 6: Survey Enhancement Suggestions

**User Story:** As an Advertiser, I want the AI to suggest improvements to my survey, so that I can create more effective surveys.

#### Acceptance Criteria

1. WHEN an Advertiser requests survey enhancement, THE AI_Agent SHALL analyze the survey and suggest improvements
2. THE AI_Agent SHALL operate in Enhance mode when providing improvement suggestions
3. THE AI_Agent SHALL suggest improvements for question clarity, answer option completeness, logic flow, and survey structure
4. WHEN enhancements are suggested, THE AI_Agent SHALL explain the rationale for each suggestion
5. THE AI_Agent SHALL allow Advertisers to accept or reject individual enhancement suggestions

### Requirement 7: Multi-Language Survey Translation

**User Story:** As an Advertiser, I want to translate surveys into different languages, so that I can reach international audiences.

#### Acceptance Criteria

1. WHEN an Advertiser requests survey translation, THE AI_Agent SHALL translate all question text, answer options, and instructions to the target language
2. THE AI_Agent SHALL operate in Translate mode during translation operations
3. THE AI_Agent SHALL preserve Canonical_JSON_Schema structure during translation
4. THE AI_Agent SHALL maintain cultural appropriateness in translated content
5. WHEN translation completes, THE AI_Agent SHALL display translated content in the Diff_Viewer for review

### Requirement 8: Survey Analysis and Insights

**User Story:** As an Advertiser, I want the AI to analyze my survey structure, so that I can identify potential issues before deployment.

#### Acceptance Criteria

1. WHEN an Advertiser requests survey analysis, THE AI_Agent SHALL evaluate the survey for completeness, clarity, and logical consistency
2. THE AI_Agent SHALL operate in Analyze mode during analysis operations
3. THE AI_Agent SHALL identify issues such as unclear questions, missing logic paths, excessive survey length, and biased question wording
4. THE AI_Agent SHALL provide actionable recommendations for identified issues
5. THE AI_Agent SHALL not modify the survey during analysis operations

### Requirement 9: Two-Level Validation System

**User Story:** As an Advertiser, I want my surveys validated automatically, so that I don't deploy surveys with structural or logical errors.

#### Acceptance Criteria

1. WHEN a survey is created or modified, THE Validation_Layer SHALL perform Zod schema validation against Canonical_JSON_Schema
2. WHEN Zod schema validation passes, THE Validation_Layer SHALL perform Business_Rules validation
3. THE Validation_Layer SHALL validate that logic rules reference valid question IDs
4. THE Validation_Layer SHALL validate that conditional logic uses valid operators and values
5. THE Validation_Layer SHALL validate that matrix questions have both rows and columns defined
6. IF validation fails, THEN THE Validation_Layer SHALL return specific error messages identifying the validation failures
7. THE Survey_Builder SHALL prevent saving invalid surveys

### Requirement 10: Survey Export to Multiple Formats

**User Story:** As an Advertiser, I want to export surveys to Excel, PDF, and JSON formats, so that I can share surveys with stakeholders and integrate with other systems.

#### Acceptance Criteria

1. WHEN an Advertiser requests Excel export, THE Export_Module SHALL convert the Canonical_JSON_Schema survey to Excel format with questions, types, options, and logic
2. WHEN an Advertiser requests PDF export, THE Export_Module SHALL generate a formatted PDF document displaying the complete survey
3. WHEN an Advertiser requests JSON export, THE Export_Module SHALL provide the raw Canonical_JSON_Schema in JSON format
4. THE Export_Module SHALL preserve all survey data during export operations
5. THE Export_Module SHALL generate downloadable files for all export formats

### Requirement 11: Survey Template Library

**User Story:** As an Advertiser, I want to start from pre-built survey templates, so that I can quickly create common survey types.

#### Acceptance Criteria

1. THE Survey_Builder SHALL provide at least 10 pre-built Survey_Template options
2. THE Survey_Builder SHALL include templates for customer satisfaction, product feedback, market research, event feedback, employee engagement, brand awareness, user experience, demographic surveys, net promoter score, and post-purchase surveys
3. WHEN an Advertiser selects a Survey_Template, THE Survey_Builder SHALL load the template in Canonical_JSON_Schema format
4. THE Survey_Builder SHALL allow Advertisers to modify loaded templates using all AI_Agent capabilities
5. THE Survey_Builder SHALL store all Survey_Template definitions in Canonical_JSON_Schema format

### Requirement 12: Version History and Rollback

**User Story:** As an Advertiser, I want to track survey changes and revert to previous versions, so that I can recover from mistakes.

#### Acceptance Criteria

1. WHEN a survey is modified, THE Survey_Builder SHALL save the previous state to Version_History
2. THE Survey_Builder SHALL store at least the last 50 versions of each survey
3. WHEN an Advertiser requests version history, THE Survey_Builder SHALL display a chronological list of survey versions with timestamps
4. WHEN an Advertiser selects a previous version, THE Survey_Builder SHALL display a diff comparing the selected version to the current version
5. WHEN an Advertiser confirms rollback, THE Survey_Builder SHALL restore the selected version as the current survey state

### Requirement 13: Conversation Context Management

**User Story:** As an Advertiser, I want the AI to remember our conversation history, so that I can make follow-up requests without repeating context.

#### Acceptance Criteria

1. WHEN an Advertiser interacts with the AI_Agent, THE Survey_Builder SHALL maintain Conversation_Context for the session
2. THE Conversation_Context SHALL include previous user prompts, AI responses, and applied modifications
3. WHEN an Advertiser makes a follow-up request, THE AI_Agent SHALL use Conversation_Context to interpret ambiguous references (e.g., "change that question to multiple choice")
4. THE Survey_Builder SHALL persist Conversation_Context to the database for session recovery
5. WHEN an Advertiser starts a new session, THE Survey_Builder SHALL load the previous Conversation_Context for the survey

### Requirement 14: Diff Preview Before Applying Changes

**User Story:** As an Advertiser, I want to preview AI-proposed changes before they're applied, so that I can verify modifications are correct.

#### Acceptance Criteria

1. WHEN the AI_Agent proposes survey modifications, THE Diff_Viewer SHALL display a side-by-side comparison of current and proposed states
2. THE Diff_Viewer SHALL highlight added, removed, and modified elements
3. THE Diff_Viewer SHALL display changes at the question, option, and logic rule level
4. THE Survey_Builder SHALL require explicit Advertiser approval before applying proposed changes
5. THE Survey_Builder SHALL allow Advertisers to reject proposed changes and provide feedback

### Requirement 15: Security and Prompt Injection Prevention

**User Story:** As a system administrator, I want to protect the AI agent from malicious prompts, so that users cannot exploit the system.

#### Acceptance Criteria

1. WHEN an Advertiser submits a prompt, THE Prompt_Injection_Guard SHALL analyze the prompt for injection attempts
2. THE Prompt_Injection_Guard SHALL detect patterns such as "ignore previous instructions", "you are now", and "system prompt override"
3. IF a prompt injection attempt is detected, THEN THE Prompt_Injection_Guard SHALL reject the request and log the attempt
4. THE AI_Agent SHALL operate within defined guardrails preventing generation of harmful, biased, or inappropriate content
5. THE Survey_Builder SHALL sanitize all user inputs before processing

### Requirement 16: Rate Limiting and Abuse Prevention

**User Story:** As a system administrator, I want to limit API request rates, so that users cannot abuse the AI service.

#### Acceptance Criteria

1. THE Rate_Limiter SHALL enforce a maximum of 100 AI requests per Advertiser per hour
2. THE Rate_Limiter SHALL enforce a maximum of 10 import operations per Advertiser per hour
3. IF rate limits are exceeded, THEN THE Rate_Limiter SHALL return an error message indicating when the limit will reset
4. THE Rate_Limiter SHALL track request counts per Advertiser using database persistence
5. THE Survey_Builder SHALL display remaining request quota to Advertisers

### Requirement 17: Backend API for Survey Operations

**User Story:** As a frontend developer, I want a REST API for survey operations, so that I can integrate the AI Survey Builder into the campaign creation flow.

#### Acceptance Criteria

1. THE Backend_API SHALL provide POST /api/surveys endpoint for creating new surveys
2. THE Backend_API SHALL provide GET /api/surveys/:id endpoint for retrieving survey data
3. THE Backend_API SHALL provide PUT /api/surveys/:id endpoint for updating surveys
4. THE Backend_API SHALL provide DELETE /api/surveys/:id endpoint for deleting surveys
5. THE Backend_API SHALL provide POST /api/surveys/:id/ai-modify endpoint for AI modification requests
6. THE Backend_API SHALL provide POST /api/surveys/import endpoint for Excel import operations
7. THE Backend_API SHALL provide GET /api/surveys/:id/export endpoint for export operations with format parameter
8. THE Backend_API SHALL provide GET /api/surveys/:id/versions endpoint for version history retrieval
9. THE Backend_API SHALL provide POST /api/surveys/:id/rollback endpoint for version rollback operations
10. THE Backend_API SHALL provide GET /api/templates endpoint for retrieving available Survey_Template options
11. THE Backend_API SHALL return appropriate HTTP status codes (200, 201, 400, 404, 429, 500)
12. THE Backend_API SHALL return error responses with descriptive error messages

### Requirement 18: Database Schema for Survey Persistence

**User Story:** As a backend developer, I want a database schema for storing surveys, so that I can persist survey data reliably.

#### Acceptance Criteria

1. THE Survey_Builder SHALL store survey data in a PostgreSQL database using JSONB columns for Canonical_JSON_Schema
2. THE Survey_Builder SHALL maintain a surveys table with columns for id, advertiser_id, title, canonical_json, created_at, updated_at
3. THE Survey_Builder SHALL maintain a survey_versions table with columns for id, survey_id, version_number, canonical_json, created_at
4. THE Survey_Builder SHALL maintain a survey_conversations table with columns for id, survey_id, messages (JSONB array), created_at, updated_at
5. THE Survey_Builder SHALL maintain a survey_templates table with columns for id, name, description, category, canonical_json, created_at
6. THE Survey_Builder SHALL use Prisma ORM for database operations

### Requirement 19: Frontend UI Components

**User Story:** As an Advertiser, I want an intuitive user interface for interacting with the AI Survey Builder, so that I can create surveys efficiently.

#### Acceptance Criteria

1. THE Frontend_UI SHALL provide an AI Agent Panel with a chat interface for natural language interaction
2. THE Frontend_UI SHALL provide a Survey Preview Panel displaying the current survey state
3. THE Frontend_UI SHALL provide an Import Wizard for uploading and configuring Excel imports
4. THE Frontend_UI SHALL provide an Export Panel with format selection and download options
5. THE Frontend_UI SHALL provide a Template Gallery for browsing and selecting Survey_Template options
6. THE Frontend_UI SHALL provide a Version History Panel displaying previous survey versions
7. THE Frontend_UI SHALL integrate the Diff_Viewer for displaying proposed changes
8. THE Frontend_UI SHALL display loading states during AI processing
9. THE Frontend_UI SHALL display error messages for failed operations
10. THE Frontend_UI SHALL use TanStack Query for API state management and Zustand for local state management

### Requirement 20: AI Agent Mode Selection

**User Story:** As an Advertiser, I want the AI to automatically select the appropriate mode for my request, so that I get the most relevant assistance.

#### Acceptance Criteria

1. WHEN an Advertiser submits a prompt, THE AI_Agent SHALL analyze the prompt and select the appropriate Agent_Mode
2. THE AI_Agent SHALL select Generate mode for prompts requesting new survey creation
3. THE AI_Agent SHALL select Modify mode for prompts requesting specific changes to existing surveys
4. THE AI_Agent SHALL select Enhance mode for prompts requesting improvement suggestions
5. THE AI_Agent SHALL select Normalize mode during import operations
6. THE AI_Agent SHALL select Translate mode for prompts requesting language translation
7. THE AI_Agent SHALL select Analyze mode for prompts requesting survey evaluation
8. THE Frontend_UI SHALL display the selected Agent_Mode to the Advertiser

### Requirement 21: Error Handling and Recovery

**User Story:** As an Advertiser, I want clear error messages and recovery options, so that I can resolve issues quickly.

#### Acceptance Criteria

1. WHEN an import operation fails, THE Survey_Builder SHALL display specific error messages identifying problematic rows and columns
2. WHEN an AI request fails, THE Survey_Builder SHALL display the error message and allow retry
3. WHEN validation fails, THE Survey_Builder SHALL highlight invalid fields and provide correction guidance
4. WHEN network errors occur, THE Survey_Builder SHALL display connection status and retry options
5. THE Survey_Builder SHALL log all errors to the backend for debugging purposes

### Requirement 22: Survey JSON Schema Parser and Pretty Printer

**User Story:** As a developer, I want to parse and format survey JSON reliably, so that the system can process surveys consistently.

#### Acceptance Criteria

1. WHEN the Survey_Builder receives JSON input, THE Parser SHALL parse it into a validated Canonical_JSON_Schema object
2. IF the JSON input is invalid, THEN THE Parser SHALL return descriptive error messages identifying the specific schema violations
3. THE Pretty_Printer SHALL format Canonical_JSON_Schema objects into readable JSON with consistent indentation and ordering
4. FOR ALL valid Canonical_JSON_Schema objects, parsing then printing then parsing SHALL produce an equivalent object (round-trip property)
5. THE Parser SHALL validate against the Canonical_JSON_Schema version 1.0 specification using Zod

