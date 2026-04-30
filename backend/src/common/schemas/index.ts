/**
 * Barrel export for Canonical Survey Schema v2.0 (Google Forms-inspired)
 *
 * ```ts
 * import {
 *   CanonicalSurveySchema,
 *   type CanonicalSurvey,
 *   type SurveyItem,
 *   AIActionSchema,
 *   createEmptySurvey,
 *   createQuestionItem,
 *   reorderItems,
 * } from '../common/schemas/index.js';
 * ```
 */

// Core canonical schema — Zod validators + TypeScript types
export {
  // Root
  CanonicalSurveySchema,
  type CanonicalSurvey,

  // Survey Info (Google Forms: Form.info)
  SurveyInfoSchema,
  type SurveyInfo,
  AIAgentModeSchema,
  type AIAgentMode,
  AIModificationRecordSchema,
  type AIModificationRecord,
  AIActionSummarySchema,
  type AIActionSummary,

  // Items (Google Forms: Form.items) — flat polymorphic list
  SurveyItemSchema,
  type SurveyItem,
  ItemTypeSchema,
  type ItemType,

  // Item payloads
  QuestionPayloadSchema,
  type QuestionPayload,
  SectionHeaderPayloadSchema,
  type SectionHeaderPayload,
  TextBlockPayloadSchema,
  type TextBlockPayload,
  ImagePayloadSchema,
  type ImagePayload,
  VideoPayloadSchema,
  type VideoPayload,

  // Questions
  QuestionTypeSchema,
  type QuestionType,
  QuestionOptionSchema,
  type QuestionOption,

  // Inline navigation (Google Forms: goToAction)
  GoToActionSchema,
  type GoToAction,

  // Type-specific configuration
  TypeConfigSchema,
  type TypeConfig,
  RatingScaleConfigSchema,
  NPSConfigSchema,
  LikertScaleConfigSchema,
  SliderConfigSchema,
  MatrixConfigSchema,
  TextConfigSchema,
  DateTimeConfigSchema,
  FileUploadConfigSchema,
  ImageChoiceConfigSchema,
  RankingConfigSchema,
  DropdownConfigSchema,

  // Validation
  QuestionValidationSchema,
  type QuestionValidation,

  // Media
  MediaPropertiesSchema,
  type MediaProperties,

  // Logic rules (complex logic)
  LogicRuleSchema,
  type LogicRule,
  LogicConditionSchema,
  type LogicCondition,
  LogicActionSchema,
  type LogicAction,
  LogicOperatorSchema,
  type LogicOperator,
  LogicActionTypeSchema,
  type LogicActionType,

  // Settings
  SurveySettingsSchema,
  type SurveySettings,
} from './survey-canonical.schema.js';

// AI Action types
export {
  AIActionTypeSchema,
  type AIActionType,
  AIActionSchema,
  type AIAction,
  ActionMetadataSchema,
  type ActionMetadata,
  AIRequestSchema,
  type AIRequest,
  AIResponseSchema,
  type AIResponse,
  RateLimitInfoSchema,
  type RateLimitInfo,
  ChatMessageSchema,
  type ChatMessage,
  ConversationContextSchema,
  type ConversationContext,
} from './survey-actions.schema.js';

// Helper utilities
export {
  generateId,
  reorderItems,
  normalizeOrder,
  findItem,
  getQuestionItems,
  getItemsBySection,
  createEmptySurvey,
  createQuestionItem,
  createSectionHeader,
  createTextBlock,
  createImageItem,
  createVideoItem,
  createOption,
  createReorderAction,
  calculateEstimatedDuration,
} from './survey-helpers.js';
