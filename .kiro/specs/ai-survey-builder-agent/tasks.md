# Implementation Plan: AI Survey Builder Agent

## Overview

This implementation plan breaks down the AI Survey Builder Agent into discrete, incremental coding tasks. The system is built using NestJS with TypeScript, PostgreSQL with Prisma ORM, and integrates with external LLM APIs for AI-powered survey operations. The implementation follows a layered architecture with comprehensive validation, security features, and property-based testing for critical business logic.

## Tasks

- [ ] 1. Set up project foundation and database schema
  - [ ] 1.1 Create Prisma schema for surveys, versions, conversations, templates, and rate limits
    - Define all tables with proper relationships and indexes
    - Include JSONB columns for canonical_json storage
    - Set up UUID primary keys and timestamps
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5, 18.6_
  
  - [ ] 1.2 Generate and run Prisma migrations
    - Generate initial migration from schema
    - Apply migration to development database
    - Verify all tables and indexes created correctly
    - _Requirements: 18.1, 18.2, 18.3, 18.4, 18.5_
  
  - [ ] 1.3 Create Zod validation schemas for Canonical JSON Schema v1.0
    - Implement QuestionTypeSchema, QuestionOptionSchema, QuestionSchema
    - Implement SurveySectionSchema, LogicRuleSchema, CanonicalSurveySchema
    - Export TypeScript types from Zod schemas
    - _Requirements: 1.1, 1.2, 9.1, 22.4_
  
  - [ ]* 1.4 Write property test for Zod schema validation consistency
    - **Property 16: Schema Validation Consistency**
    - **Validates: Requirements 9.1**

- [ ] 2. Implement core Survey Service with CRUD operations
  - [ ] 2.1 Create SurveyService with create, findById, update, delete methods
    - Implement Prisma-based data access layer
    - Add version history creation on updates
    - Include proper error handling and validation
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 18.1, 18.2_
  
  - [ ] 2.2 Implement version history and rollback functionality
    - Create getVersionHistory method to retrieve survey versions
    - Implement rollback method to restore previous versions
    - Ensure version snapshots include complete canonical_json
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 17.8, 17.9_
  
  - [ ] 2.3 Create applyActions method for surgical survey modifications
    - Implement action application logic for all 18 action types
    - Ensure only targeted elements are modified
    - Validate survey state after action application
    - _Requirements: 5.1, 5.2, 5.4, 5.5, 5.6_
  
  - [ ]* 2.4 Write property test for surgical modification preservation
    - **Property 15: Surgical Modification Preservation**
    - **Validates: Requirements 5.4, 5.5**
  
  - [ ]* 2.5 Write unit tests for SurveyService CRUD operations
    - Test create, read, update, delete operations
    - Test error conditions and edge cases
    - Mock Prisma client for isolated testing
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 3. Implement Validation Service with two-tier validation
  - [ ] 3.1 Create ValidationService with schema and business rules validation
    - Implement validateSchema using Zod schemas
    - Implement validateBusinessRules for semantic validation
    - Create validateActions for action sequence validation
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_
  
  - [ ] 3.2 Implement business rules validators
    - Validate logic rules reference valid question IDs
    - Validate conditional logic operators and values
    - Validate matrix questions have rows and columns
    - Return specific error messages for each validation failure
    - _Requirements: 9.3, 9.4, 9.5, 9.6_
  
  - [ ]* 3.3 Write property test for validation sequence completeness
    - **Property 17: Validation Sequence Completeness**
    - **Validates: Requirements 9.2**
  
  - [ ]* 3.4 Write property test for logic reference validity
    - **Property 18: Logic Reference Validity**
    - **Validates: Requirements 9.3**
  
  - [ ]* 3.5 Write property test for conditional logic operator validity
    - **Property 19: Conditional Logic Operator Validity**
    - **Validates: Requirements 9.4**

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 5. Implement Import Service for Excel processing
  - [ ] 5.1 Create ImportService with Excel parsing functionality
    - Implement parseExcel method using xlsx library
    - Extract questions, metadata, and detect errors
    - Return ParsedSurveyData with structured results
    - _Requirements: 2.1, 2.6_
  
  - [ ] 5.2 Implement intelligent question type inference
    - Create inferQuestionTypes method
    - Analyze question text and answer options
    - Map to one of 14 supported question types
    - _Requirements: 2.2, 1.2_
  
  - [ ] 5.3 Implement intelligent defaults application
    - Create applyDefaults method
    - Set required=true, randomize=false as defaults
    - Generate UUIDs for all entities
    - Ensure complete Canonical JSON Schema output
    - _Requirements: 2.3, 2.5_
  
  - [ ] 5.4 Implement AI-powered normalization
    - Create normalizeWithAI method
    - Fix capitalization and whitespace issues
    - Suggest professional language alternatives
    - Return normalization changes for diff preview
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_
  
  - [ ]* 5.5 Write property test for import format conversion consistency
    - **Property 3: Import Format Conversion Consistency**
    - **Validates: Requirements 1.3**
  
  - [ ]* 5.6 Write property test for Excel parsing completeness
    - **Property 6: Excel Parsing Completeness**
    - **Validates: Requirements 2.1**
  
  - [ ]* 5.7 Write property test for question type inference validity
    - **Property 7: Question Type Inference Validity**
    - **Validates: Requirements 2.2**
  
  - [ ]* 5.8 Write property test for default value application completeness
    - **Property 8: Default Value Application Completeness**
    - **Validates: Requirements 2.3**
  
  - [ ]* 5.9 Write property test for successful import schema validity
    - **Property 10: Successful Import Schema Validity**
    - **Validates: Requirements 2.5**
  
  - [ ]* 5.10 Write unit tests for ImportService
    - Test Excel parsing with various file formats
    - Test error handling for invalid files
    - Test type inference edge cases
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

- [ ] 6. Implement Export Service for multi-format export
  - [ ] 6.1 Create ExportService with JSON export
    - Implement exportToJson method
    - Return raw Canonical JSON Schema as Buffer
    - _Requirements: 10.3, 10.4, 10.5_
  
  - [ ] 6.2 Implement Excel export functionality
    - Create exportToExcel method using xlsx library
    - Convert Canonical JSON to Excel with questions, types, options, logic
    - Preserve all survey data in export
    - _Requirements: 10.1, 10.4, 10.5_
  
  - [ ] 6.3 Implement PDF export functionality
    - Create exportToPdf method using pdf generation library
    - Format survey as readable PDF document
    - Include all questions, options, and logic rules
    - _Requirements: 10.2, 10.4, 10.5_
  
  - [ ] 6.4 Implement download URL generation
    - Create generateDownloadUrl method
    - Handle file storage and temporary URL generation
    - Support all three export formats
    - _Requirements: 10.5_
  
  - [ ]* 6.5 Write property test for export format conversion validity
    - **Property 4: Export Format Conversion Validity**
    - **Validates: Requirements 1.4**
  
  - [ ]* 6.6 Write unit tests for ExportService
    - Test JSON, Excel, and PDF export
    - Verify data preservation across formats
    - Test download URL generation
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_

- [ ] 7. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 8. Implement AI Agent Mode Selector
  - [ ] 8.1 Create ModeSelector service with mode selection logic
    - Implement selectMode method with keyword analysis
    - Create classifyIntent and analyzeKeywords helper methods
    - Map prompts to appropriate AgentMode enum values
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_
  
  - [ ] 8.2 Implement keyword-based classification
    - Define keyword patterns for each mode (Generate, Modify, Enhance, Normalize, Translate, Analyze)
    - Implement scoring system for mode selection
    - Add fallback to Modify mode for ambiguous prompts
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7_
  
  - [ ]* 8.3 Write unit tests for ModeSelector
    - Test mode selection for various prompt types
    - Test keyword classification accuracy
    - Test fallback behavior
    - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.6, 20.7, 20.8_

- [ ] 9. Implement Action Engine for survey modifications
  - [ ] 9.1 Create ActionEngine service with action generation
    - Implement generateActions method
    - Support all 18 action types (add_question, remove_question, update_question_text, etc.)
    - Parse natural language requests into structured actions
    - _Requirements: 5.1, 5.2_
  
  - [ ] 9.2 Implement action optimization and validation
    - Create optimizeActions to remove redundant operations
    - Implement validateActionSequence for conflict detection
    - Ensure action sequences maintain survey validity
    - _Requirements: 5.1, 5.2, 5.3_
  
  - [ ]* 9.3 Write property test for action decomposition validity
    - **Property 14: Action Decomposition Validity**
    - **Validates: Requirements 5.1, 5.2**
  
  - [ ]* 9.4 Write unit tests for ActionEngine
    - Test action generation for each action type
    - Test action optimization logic
    - Test action sequence validation
    - _Requirements: 5.1, 5.2, 5.3_

- [ ] 10. Implement Prompt Processor with security features
  - [ ] 10.1 Create PromptProcessor service with injection detection
    - Implement detectInjection method
    - Detect patterns like "ignore previous instructions", "you are now", "system prompt override"
    - Return InjectionDetectionResult with threat assessment
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ] 10.2 Implement input sanitization and LLM formatting
    - Create sanitizeInput method to clean user inputs
    - Implement formatForLLM to prepare prompts for external API
    - Add context isolation to prevent prompt leakage
    - _Requirements: 15.5, 4.5, 13.1, 13.2, 13.3_
  
  - [ ]* 10.3 Write unit tests for PromptProcessor security features
    - Test injection detection with various attack patterns
    - Test input sanitization effectiveness
    - Test LLM prompt formatting
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

- [ ] 11. Implement core AI Agent Service
  - [ ] 11.1 Create AIAgentService with request processing
    - Implement processRequest method orchestrating all AI operations
    - Integrate ModeSelector, ActionEngine, and PromptProcessor
    - Handle conversation context management
    - Return AIResponse with actions and explanations
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 5.3, 5.4_
  
  - [ ] 11.2 Implement LLM API integration
    - Create LLM client for external API calls (OpenAI, Anthropic, etc.)
    - Handle API authentication and rate limiting
    - Implement retry logic with exponential backoff
    - Parse LLM responses into structured actions
    - _Requirements: 4.1, 4.2, 4.3, 3.4, 6.1, 6.2, 6.3, 6.4, 7.1, 7.2, 7.3, 7.4, 8.1, 8.2, 8.3, 8.4_
  
  - [ ] 11.3 Implement conversation context management
    - Store conversation history in database
    - Load previous context for follow-up requests
    - Maintain context across sessions
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [ ]* 11.4 Write property test for AI operation schema preservation
    - **Property 5: AI Operation Schema Preservation**
    - **Validates: Requirements 1.5**
  
  - [ ]* 11.5 Write property test for survey generation completeness
    - **Property 13: Survey Generation Completeness**
    - **Validates: Requirements 4.1**
  
  - [ ]* 11.6 Write unit tests for AIAgentService
    - Test request processing flow
    - Test mode selection integration
    - Test conversation context management
    - Mock LLM API responses
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 13.1, 13.2, 13.3_

- [ ] 12. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 13. Implement Rate Limiter for abuse prevention
  - [ ] 13.1 Create RateLimiterService with request tracking
    - Implement rate limit enforcement (100 AI requests/hour, 10 imports/hour)
    - Track request counts per user in database
    - Return error messages with reset time when limits exceeded
    - _Requirements: 16.1, 16.2, 16.3, 16.4_
  
  - [ ] 13.2 Create RateLimiterGuard for NestJS integration
    - Implement CanActivate interface
    - Check rate limits before request processing
    - Display remaining quota to users
    - _Requirements: 16.1, 16.2, 16.3, 16.5_
  
  - [ ]* 13.3 Write unit tests for RateLimiterService
    - Test rate limit enforcement
    - Test request count tracking
    - Test reset time calculation
    - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5_

- [ ] 14. Implement Prompt Injection Guard
  - [ ] 14.1 Create PromptInjectionGuard for NestJS integration
    - Implement CanActivate interface
    - Integrate with PromptProcessor for injection detection
    - Reject requests and log injection attempts
    - _Requirements: 15.1, 15.2, 15.3_
  
  - [ ]* 14.2 Write unit tests for PromptInjectionGuard
    - Test injection detection and blocking
    - Test logging of malicious attempts
    - Test legitimate prompt handling
    - _Requirements: 15.1, 15.2, 15.3_

- [ ] 15. Implement Survey Template management
  - [ ] 15.1 Create TemplateService for template operations
    - Implement methods to retrieve available templates
    - Load template data from database
    - Support at least 10 pre-built templates
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 17.10_
  
  - [ ] 15.2 Seed database with initial survey templates
    - Create seed script for 10+ templates (customer satisfaction, product feedback, market research, etc.)
    - Store templates in Canonical JSON Schema format
    - Include metadata (name, description, category)
    - _Requirements: 11.1, 11.2, 11.5_
  
  - [ ]* 15.3 Write unit tests for TemplateService
    - Test template retrieval
    - Test template loading
    - Verify all templates are valid Canonical JSON Schema
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_

- [ ] 16. Implement REST API endpoints
  - [ ] 16.1 Create SurveyController with CRUD endpoints
    - POST /api/surveys - create new survey
    - GET /api/surveys/:id - retrieve survey
    - PUT /api/surveys/:id - update survey
    - DELETE /api/surveys/:id - delete survey
    - Return appropriate HTTP status codes and error messages
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.11, 17.12_
  
  - [ ] 16.2 Create AI modification endpoint
    - POST /api/surveys/:id/ai-modify - process AI modification requests
    - Integrate with AIAgentService
    - Return proposed changes for diff preview
    - Require explicit approval before applying changes
    - _Requirements: 17.5, 14.1, 14.2, 14.3, 14.4, 14.5_
  
  - [ ] 16.3 Create import and export endpoints
    - POST /api/surveys/import - handle Excel imports
    - GET /api/surveys/:id/export?format={json|excel|pdf} - handle exports
    - Support file upload and download
    - _Requirements: 17.6, 17.7_
  
  - [ ] 16.4 Create version history endpoints
    - GET /api/surveys/:id/versions - retrieve version history
    - POST /api/surveys/:id/rollback - rollback to previous version
    - _Requirements: 17.8, 17.9_
  
  - [ ] 16.5 Create template endpoint
    - GET /api/templates - retrieve available templates
    - _Requirements: 17.10_
  
  - [ ]* 16.6 Write integration tests for all API endpoints
    - Test complete request/response cycles
    - Test authentication and authorization
    - Test error handling and validation
    - Use Supertest for API testing
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10, 17.11, 17.12_

- [ ] 17. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 18. Implement JSON Parser and Pretty Printer
  - [ ] 18.1 Create Parser service for JSON parsing
    - Implement parse method using Zod validation
    - Return descriptive error messages for invalid JSON
    - Validate against Canonical JSON Schema v1.0
    - _Requirements: 22.1, 22.2, 22.4_
  
  - [ ] 18.2 Create PrettyPrinter service for JSON formatting
    - Implement format method with consistent indentation
    - Ensure consistent field ordering
    - Generate readable JSON output
    - _Requirements: 22.3, 22.4_
  
  - [ ]* 18.3 Write property test for JSON parsing consistency
    - **Property 20: JSON Parsing Consistency**
    - **Validates: Requirements 22.1**
  
  - [ ]* 18.4 Write property test for JSON error message specificity
    - **Property 21: JSON Error Message Specificity**
    - **Validates: Requirements 22.2**
  
  - [ ]* 18.5 Write property test for JSON formatting consistency
    - **Property 22: JSON Formatting Consistency**
    - **Validates: Requirements 22.3**
  
  - [ ]* 18.6 Write property test for JSON round-trip preservation
    - **Property 23: JSON Round-Trip Preservation**
    - **Validates: Requirements 22.4**
  
  - [ ]* 18.7 Write unit tests for Parser and PrettyPrinter
    - Test parsing valid and invalid JSON
    - Test error message generation
    - Test formatting consistency
    - Test round-trip operations
    - _Requirements: 22.1, 22.2, 22.3, 22.4_

- [ ] 19. Implement error handling and recovery
  - [ ] 19.1 Create global exception filter
    - Implement ExceptionFilter interface
    - Format error responses with ErrorResponse structure
    - Include error codes, messages, details, and recovery actions
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_
  
  - [ ] 19.2 Implement error logging
    - Log all errors to backend for debugging
    - Include request context and stack traces
    - Integrate with logging service (Winston, Pino, etc.)
    - _Requirements: 21.5_
  
  - [ ] 19.3 Implement retry logic and circuit breakers
    - Add exponential backoff for transient failures
    - Implement circuit breaker for external service calls
    - Add automatic rollback on critical validation failures
    - _Requirements: 21.2_
  
  - [ ]* 19.4 Write unit tests for error handling
    - Test exception filter formatting
    - Test error logging
    - Test retry logic and circuit breakers
    - _Requirements: 21.1, 21.2, 21.3, 21.4, 21.5_

- [ ] 20. Implement remaining property tests for comprehensive coverage
  - [ ]* 20.1 Write property test for canonical schema storage consistency
    - **Property 1: Canonical Schema Storage Consistency**
    - **Validates: Requirements 1.1**
  
  - [ ]* 20.2 Write property test for question type completeness
    - **Property 2: Question Type Completeness**
    - **Validates: Requirements 1.2**
  
  - [ ]* 20.3 Write property test for error message specificity
    - **Property 9: Error Message Specificity**
    - **Validates: Requirements 2.4**
  
  - [ ]* 20.4 Write property test for text normalization consistency
    - **Property 11: Text Normalization Consistency**
    - **Validates: Requirements 3.1**
  
  - [ ]* 20.5 Write property test for question classification validity
    - **Property 12: Question Classification Validity**
    - **Validates: Requirements 3.2**

- [ ] 21. Wire all components together in AppModule
  - [ ] 21.1 Configure NestJS module dependencies
    - Import all service modules
    - Configure Prisma module
    - Set up Redis for caching
    - Configure environment variables
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5, 17.6, 17.7, 17.8, 17.9, 17.10_
  
  - [ ] 21.2 Apply global guards and interceptors
    - Apply RateLimiterGuard globally
    - Apply PromptInjectionGuard to AI endpoints
    - Add logging interceptor
    - Add error handling filter
    - _Requirements: 15.1, 15.2, 15.3, 16.1, 16.2, 16.3, 21.5_
  
  - [ ] 21.3 Configure CORS and security middleware
    - Set up CORS configuration
    - Add helmet for security headers
    - Configure request validation pipes
    - _Requirements: 15.5_
  
  - [ ]* 21.4 Write end-to-end tests for complete workflows
    - Test complete survey creation flow
    - Test Excel import to AI modification to export flow
    - Test version history and rollback flow
    - Test template selection and modification flow
    - _Requirements: 1.1, 2.1, 4.1, 10.1, 11.1, 12.1_

- [ ] 22. Final checkpoint - Comprehensive testing and validation
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation throughout implementation
- Property tests validate universal correctness properties using fast-check library
- Unit tests validate specific examples and edge cases
- Integration tests validate complete API workflows
- The implementation uses TypeScript with NestJS framework
- All code follows the project's existing patterns and conventions
- Security features (rate limiting, prompt injection prevention) are integrated throughout
- The system maintains Canonical JSON Schema v1.0 as single source of truth across all operations
