/**
 * Canonical Survey JSON Schema v2.0 — Google Forms-Inspired
 *
 * Single source of truth for all survey data across the Vibe Survey platform.
 *
 * Architecture inspired by Google Forms API:
 * - FLAT `items[]` array (no nested sections/questions hierarchy)
 * - Items are polymorphic: question, section_header, text_block, image, video, page_break
 * - Section headers act as page breaks + group markers (like Google Forms PageBreakItem)
 * - Branching logic is INLINE on options (goToAction) for simple flows
 * - Complex logic rules still in a separate `rules[]` array
 *
 * This flat structure makes drag-and-drop trivial (just reorder items in a flat list)
 * and AI modifications surgical (target any item by ID).
 *
 * Consumers:
 * - AI Agent: surgical modifications via Actions
 * - Survey Builder (creator frontend): drag-drop, manual CRUD, real-time collaboration
 * - Survey Taker (taker frontend): rendering, branching logic, response collection
 * - Backend API: validation, storage, versioning
 */
import { z } from 'zod';

// ─── Question Types ──────────────────────────────────────────────────────────
// 17 supported types covering:
// - Google Forms types: short_answer, paragraph, multiple_choice, checkboxes,
//   dropdown, linear_scale, grid, checkbox_grid, date, time, file_upload
// - Extended types: nps, likert_scale, image_choice, ranking, yes_no, slider

export const QuestionTypeSchema = z.enum([
  // Selection types (Google Forms: choiceQuestion)
  'single_choice', // Radio buttons / dropdown
  'multiple_choice', // Multi-select
  'checkbox', // Checkbox group
  'dropdown', // Dropdown select (single)
  'image_choice', // Visual selection with images
  'yes_no', // Boolean toggle

  // Text types (Google Forms: textQuestion)
  'text_short', // Short answer
  'text_long', // Paragraph

  // Scale types (Google Forms: scaleQuestion)
  'rating_scale', // 1-5 or 1-10 stars/numbers
  'nps', // Net Promoter Score 0-10
  'likert_scale', // Agreement scale with labels
  'slider', // Continuous range slider

  // Complex types (Google Forms: questionGroupItem)
  'ranking', // Drag-to-rank items
  'matrix_single', // Grid: one answer per row
  'matrix_multiple', // Grid: multiple answers per row

  // Date/Time types (Google Forms: dateQuestion, timeQuestion)
  'date', // Date picker
  'time', // Time picker

  // File types (Google Forms: fileUploadQuestion)
  'file_upload', // File attachment
]);

export type QuestionType = z.infer<typeof QuestionTypeSchema>;

// ─── Item Types ──────────────────────────────────────────────────────────────
// Like Google Forms, every element in a survey is an "item".
// Items are polymorphic: question, section_header, text_block, image, video.

export const ItemTypeSchema = z.enum([
  'question', // A survey question (most common)
  'section_header', // Page break + section title (Google Forms: pageBreakItem)
  'text_block', // Descriptive text / instructions (Google Forms: textItem)
  'image', // Standalone image (Google Forms: imageItem)
  'video', // Embedded video (Google Forms: videoItem)
]);

export type ItemType = z.infer<typeof ItemTypeSchema>;

// ─── Type-Specific Configuration ─────────────────────────────────────────────
// Discriminated union keyed by `configType`. Keeps the base question clean
// while allowing rich per-type configuration.

export const RatingScaleConfigSchema = z.object({
  configType: z.literal('rating_scale'),
  min: z.number().int().min(0).default(1),
  max: z.number().int().max(100).default(5),
  step: z.number().int().min(1).default(1),
  lowLabel: z.string().max(100).optional(),
  highLabel: z.string().max(100).optional(),
  showLabels: z.boolean().default(true),
});

export const NPSConfigSchema = z.object({
  configType: z.literal('nps'),
  lowLabel: z.string().max(100).default('Not at all likely'),
  highLabel: z.string().max(100).default('Extremely likely'),
});

export const LikertPointSchema = z.object({
  value: z.number().int(),
  label: z.string().min(1).max(200),
});

export const LikertScaleConfigSchema = z.object({
  configType: z.literal('likert_scale'),
  points: z.array(LikertPointSchema).min(2).max(10),
});

export const SliderConfigSchema = z.object({
  configType: z.literal('slider'),
  min: z.number().default(0),
  max: z.number().default(100),
  step: z.number().min(0.01).default(1),
  defaultValue: z.number().optional(),
  lowLabel: z.string().max(100).optional(),
  highLabel: z.string().max(100).optional(),
  showValue: z.boolean().default(true),
  unit: z.string().max(20).optional(),
});

export const MatrixRowSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  order: z.number().int().min(0),
});

export const MatrixColumnSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1).max(500),
  value: z.string().min(1),
  order: z.number().int().min(0),
});

export const MatrixConfigSchema = z.object({
  configType: z.literal('matrix'),
  rows: z.array(MatrixRowSchema).min(1),
  columns: z.array(MatrixColumnSchema).min(2),
});

export const TextConfigSchema = z.object({
  configType: z.literal('text'),
  minLength: z.number().int().min(0).optional(),
  maxLength: z.number().int().max(10000).optional(),
  placeholder: z.string().max(500).optional(),
});

export const DateTimeConfigSchema = z.object({
  configType: z.literal('datetime'),
  includeYear: z.boolean().default(true),
  includeTime: z.boolean().default(false),
});

export const FileUploadConfigSchema = z.object({
  configType: z.literal('file_upload'),
  allowedTypes: z.array(z.string()).min(1),
  maxFileSize: z.number().int().min(1), // bytes
  maxFiles: z.number().int().min(1).max(20).default(1),
});

export const ImageChoiceConfigSchema = z.object({
  configType: z.literal('image_choice'),
  columns: z.number().int().min(1).max(6).default(2),
  showLabels: z.boolean().default(true),
  imageSize: z.enum(['small', 'medium', 'large']).default('medium'),
});

export const RankingConfigSchema = z.object({
  configType: z.literal('ranking'),
  maxSelections: z.number().int().min(1).optional(),
});

export const DropdownConfigSchema = z.object({
  configType: z.literal('dropdown'),
  searchable: z.boolean().default(false),
  placeholder: z.string().max(200).optional(),
});

export const TypeConfigSchema = z.discriminatedUnion('configType', [
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
]);

export type TypeConfig = z.infer<typeof TypeConfigSchema>;

// ─── Inline Navigation (Google Forms style) ──────────────────────────────────
// In Google Forms, branching logic is embedded directly in options via goToAction.
// This keeps simple branching logic co-located with the question.

export const GoToActionSchema = z.enum([
  'next_section', // Continue to next section (default)
  'submit_form', // Submit the form immediately
  'go_to_section', // Jump to a specific section by ID
]);

export type GoToAction = z.infer<typeof GoToActionSchema>;

// ─── Question Option ─────────────────────────────────────────────────────────

export const QuestionOptionSchema = z.object({
  /** Stable UUID */
  id: z.string().uuid(),
  /** Display text shown to respondents */
  text: z.string().min(1).max(500),
  /** Machine-readable value stored in responses */
  value: z.string().min(1),
  /** Sort key for drag-drop ordering */
  order: z.number().int().min(0),
  /** Optional image for image_choice questions */
  imageUrl: z.string().url().optional(),

  // ── Inline branching (Google Forms style) ──
  /** Navigation action when this option is selected */
  goToAction: GoToActionSchema.optional(),
  /** Target section_header item ID (when goToAction = 'go_to_section') */
  goToSectionId: z.string().uuid().optional(),

  // ── Screener support ──
  /** Whether selecting this option disqualifies the respondent */
  isDisqualifying: z.boolean().default(false),
  /** Whether this is an "Other" option with free text input */
  isOther: z.boolean().default(false),

  /** Extensibility */
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type QuestionOption = z.infer<typeof QuestionOptionSchema>;

// ─── Question Validation ─────────────────────────────────────────────────────

export const QuestionValidationSchema = z.object({
  type: z.enum([
    'required',
    'min_length',
    'max_length',
    'min_value',
    'max_value',
    'pattern',
    'min_selections',
    'max_selections',
    'file_type',
    'file_size',
  ]),
  value: z.union([z.string(), z.number()]),
  message: z.string().max(500).optional(),
});

export type QuestionValidation = z.infer<typeof QuestionValidationSchema>;

// ─── Media Object (shared) ───────────────────────────────────────────────────

export const MediaPropertiesSchema = z.object({
  alignment: z.enum(['left', 'center', 'right']).default('center'),
  width: z.number().int().positive().optional(),
});

export type MediaProperties = z.infer<typeof MediaPropertiesSchema>;

// ─── Survey Item: The Core Building Block ────────────────────────────────────
// Like Google Forms, every element is an "item" in a flat array.
// The `itemType` discriminator determines the item's role.

// -- Question Item Payload --
export const QuestionPayloadSchema = z.object({
  /** Discriminator for rendering and typeConfig */
  type: QuestionTypeSchema,
  /** Whether an answer is required to proceed */
  required: z.boolean().default(true),
  /** Answer options — for choice-based question types */
  options: z.array(QuestionOptionSchema).optional(),
  /** Type-specific configuration (rating ranges, matrix layout, etc) */
  typeConfig: TypeConfigSchema.optional(),
  /** Validation rules applied to responses */
  validation: z.array(QuestionValidationSchema).optional(),
  /** Whether answer options should be randomized per respondent */
  shuffleOptions: z.boolean().default(false),
  /** Optional image displayed alongside the question (Google Forms: QuestionItem.image) */
  image: z
    .object({
      sourceUrl: z.string().url(),
      altText: z.string().max(500).optional(),
      properties: MediaPropertiesSchema.optional(),
    })
    .optional(),
  /** Whether this question was generated by AI */
  aiGenerated: z.boolean().default(false),
});

export type QuestionPayload = z.infer<typeof QuestionPayloadSchema>;

// -- Section Header Payload (Google Forms: PageBreakItem) --
export const SectionHeaderPayloadSchema = z.object({
  /** Whether this section is a screener (pre-qualification) */
  isScreener: z.boolean().default(false),
  /** Navigation after completing this section (Google Forms style) */
  goToAction: GoToActionSchema.optional(),
  /** Target section ID for conditional navigation */
  goToSectionId: z.string().uuid().optional(),
});

export type SectionHeaderPayload = z.infer<typeof SectionHeaderPayloadSchema>;

// -- Text Block Payload (Google Forms: TextItem) --
export const TextBlockPayloadSchema = z.object({
  /** Rich text content (markdown or HTML) */
  content: z.string().max(5000).optional(),
});

export type TextBlockPayload = z.infer<typeof TextBlockPayloadSchema>;

// -- Image Payload (Google Forms: ImageItem) --
export const ImagePayloadSchema = z.object({
  sourceUrl: z.string().url(),
  altText: z.string().max(500).optional(),
  properties: MediaPropertiesSchema.optional(),
});

export type ImagePayload = z.infer<typeof ImagePayloadSchema>;

// -- Video Payload (Google Forms: VideoItem) --
export const VideoPayloadSchema = z.object({
  youtubeUrl: z.string().url().optional(),
  sourceUrl: z.string().url().optional(),
  caption: z.string().max(500).optional(),
  properties: MediaPropertiesSchema.optional(),
});

export type VideoPayload = z.infer<typeof VideoPayloadSchema>;

// ── The unified SurveyItem ──
export const SurveyItemSchema = z.object({
  /** Stable UUID — assigned on creation, never changes */
  itemId: z.string().uuid(),

  /** Sort key for drag-drop ordering in the flat list */
  order: z.number().int().min(0),

  /** Item title (question text for questions, heading for sections) */
  title: z.string().max(2000).optional(),

  /** Description / help text displayed below title */
  description: z.string().max(2000).optional(),

  /** Discriminator: what kind of item this is */
  itemType: ItemTypeSchema,

  // ── Type-specific payloads (only one should be set, matching itemType) ──
  /** Present when itemType = 'question' */
  questionItem: QuestionPayloadSchema.optional(),
  /** Present when itemType = 'section_header' */
  sectionHeaderItem: SectionHeaderPayloadSchema.optional(),
  /** Present when itemType = 'text_block' */
  textBlockItem: TextBlockPayloadSchema.optional(),
  /** Present when itemType = 'image' */
  imageItem: ImagePayloadSchema.optional(),
  /** Present when itemType = 'video' */
  videoItem: VideoPayloadSchema.optional(),

  /** Extensibility */
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export type SurveyItem = z.infer<typeof SurveyItemSchema>;

// ─── Logic Rules (for complex cross-item logic) ─────────────────────────────
// Simple branching: use inline goToAction on options/section headers.
// Complex rules (multi-condition, quotas, conditional visibility):
// use this separate rules array.

export const LogicOperatorSchema = z.enum([
  'equals',
  'not_equals',
  'contains',
  'not_contains',
  'greater_than',
  'less_than',
  'greater_than_or_equal',
  'less_than_or_equal',
  'is_empty',
  'is_not_empty',
  'in',
  'not_in',
]);

export type LogicOperator = z.infer<typeof LogicOperatorSchema>;

export const LogicConditionSchema: z.ZodType<LogicCondition> = z.object({
  /** Source question item ID */
  questionId: z.string().uuid(),
  /** Comparison operator */
  operator: LogicOperatorSchema,
  /** Value(s) to compare against */
  value: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]),
  /** Combine multiple conditions */
  combinator: z.enum(['and', 'or']).optional(),
  /** Nested sub-conditions for complex logic */
  children: z.lazy(() => z.array(LogicConditionSchema)).optional(),
});

export interface LogicCondition {
  questionId: string;
  operator: LogicOperator;
  value: string | number | boolean | string[];
  combinator?: 'and' | 'or';
  children?: LogicCondition[];
}

export const LogicActionTypeSchema = z.enum([
  'show', // Show an item
  'hide', // Hide an item
  'skip_to', // Skip to a specific item
  'end_survey', // End the survey (disqualify)
  'quota_check', // Check quota before proceeding
]);

export type LogicActionType = z.infer<typeof LogicActionTypeSchema>;

export const LogicActionSchema = z.object({
  type: LogicActionTypeSchema,
  /** Target item ID (for skip_to, show, hide) */
  targetId: z.string().uuid().optional(),
  /** Disqualification message (for end_survey) */
  message: z.string().max(1000).optional(),
  /** Demographic segment (for quota_check) */
  quotaSegment: z.string().max(200).optional(),
});

export type LogicAction = z.infer<typeof LogicActionSchema>;

export const LogicRuleSchema = z.object({
  id: z.string().uuid(),
  name: z.string().max(255).optional(),
  condition: LogicConditionSchema,
  action: LogicActionSchema,
  priority: z.number().int().min(0).default(0),
  aiGenerated: z.boolean().default(false),
  enabled: z.boolean().default(true),
});

export type LogicRule = z.infer<typeof LogicRuleSchema>;

// ─── Survey Settings ─────────────────────────────────────────────────────────

export const SurveySettingsSchema = z.object({
  /** Randomize question order per respondent */
  shuffleQuestions: z.boolean().default(false),
  /** Allow respondents to go back to previous sections */
  allowBackNavigation: z.boolean().default(true),
  /** Show progress bar during survey taking */
  showProgressBar: z.boolean().default(true),
  /** Allow anonymous responses (no login required) */
  allowAnonymous: z.boolean().default(false),
  /** Maximum time to complete in minutes */
  maxResponseTime: z.number().int().min(1).optional(),
  /** Auto-calculated estimated completion time in minutes */
  estimatedCompletionTime: z.number().int().min(1).optional(),
  /** Limit to one response per user */
  limitOneResponsePerUser: z.boolean().default(true),
  /** Show link to submit another response after completion */
  showLinkToRespondAgain: z.boolean().default(false),
  /** Custom theme identifier */
  theme: z.string().max(100).optional(),

  // ── Confirmation / completion messages ──
  confirmationMessage: z.string().max(2000).default('Your response has been recorded.'),
  disqualificationMessage: z.string().max(2000).optional(),
});

export type SurveySettings = z.infer<typeof SurveySettingsSchema>;

// ─── Survey Info (Google Forms: Form.info) ───────────────────────────────────

export const AIAgentModeSchema = z.enum([
  'generate',
  'modify',
  'enhance',
  'normalize',
  'translate',
  'analyze',
]);

export type AIAgentMode = z.infer<typeof AIAgentModeSchema>;

export const AIActionSummarySchema = z.object({
  type: z.string(),
  target: z.string(),
  description: z.string().max(500),
});

export type AIActionSummary = z.infer<typeof AIActionSummarySchema>;

export const AIModificationRecordSchema = z.object({
  id: z.string().uuid(),
  mode: AIAgentModeSchema,
  actions: z.array(AIActionSummarySchema),
  prompt: z.string().max(5000),
  timestamp: z.string().datetime(),
  userId: z.string().uuid(),
});

export type AIModificationRecord = z.infer<typeof AIModificationRecordSchema>;

export const SurveyInfoSchema = z.object({
  /** Survey title — required, shown to respondents */
  title: z.string().min(1).max(255),
  /** Subtitle / description shown on the first page */
  description: z.string().max(2000).optional(),
  /** Internal document title (not shown to respondents) */
  documentTitle: z.string().max(255).optional(),
  /** Primary language (ISO 639-1) */
  language: z.string().min(2).max(10).default('en'),
  /** Category for template organization */
  category: z.string().max(100).optional(),
  /** Searchable tags */
  tags: z.array(z.string().max(50)).default([]),
  /** Estimated completion time in minutes */
  estimatedDuration: z.number().int().min(1).optional(),
  /** Campaign ID this survey belongs to */
  campaignId: z.string().uuid().optional(),
  /** Version number — incremented on each save */
  version: z.number().int().min(1).default(1),
  /** User IDs of collaborators */
  collaborators: z.array(z.string().uuid()).default([]),
  /** AI modification history */
  aiModifications: z.array(AIModificationRecordSchema).default([]),
});

export type SurveyInfo = z.infer<typeof SurveyInfoSchema>;

// ─── Root: Canonical Survey (Google Forms: Form) ─────────────────────────────

export const CanonicalSurveySchema = z.object({
  /** Stable UUID — never changes once created */
  id: z.string().uuid(),
  /** Schema version for migration support */
  schemaVersion: z.literal('2.0'),

  /** Survey info — title, description, language (Google Forms: Form.info) */
  info: SurveyInfoSchema,

  /** Flat list of items — questions, sections, text, images, videos
   *  (Google Forms: Form.items) */
  items: z.array(SurveyItemSchema).min(1),

  /** Complex logic rules (for multi-condition, quota, visibility rules).
   *  Simple branching uses inline goToAction on options. */
  rules: z.array(LogicRuleSchema).default([]),

  /** Survey-level settings */
  settings: SurveySettingsSchema,

  /** Audit trail */
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  createdBy: z.string().uuid(),
  updatedBy: z.string().uuid(),
});

export type CanonicalSurvey = z.infer<typeof CanonicalSurveySchema>;
