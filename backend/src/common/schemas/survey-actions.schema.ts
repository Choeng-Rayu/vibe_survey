/**
 * AI Action Types for the Canonical Survey Schema v2.0
 *
 * Adapted for the flat items[] model (Google Forms-inspired).
 *
 * Every mutation to the survey — whether from AI or manual editing —
 * is expressed as an Action. This enables:
 * - Unified undo/redo stack
 * - Version history with diffs
 * - Real-time collaboration sync via WebSocket
 * - Audit trail for compliance
 *
 * Actions target items by `itemId` (stable UUID), making them
 * resilient to drag-drop reordering.
 */
import { z } from 'zod';
import { AIAgentModeSchema } from './survey-canonical.schema.js';

// ─── AI Action Type Enum ─────────────────────────────────────────────────────

export const AIActionTypeSchema = z.enum([
  // Item operations (flat list CRUD)
  'add_item',             // Add any item type (question, section, text, image, video)
  'remove_item',          // Remove an item from the list
  'update_item',          // Update item title/description
  'duplicate_item',       // Duplicate an item
  'reorder_items',        // Reorder items (drag-drop)
  'move_item',            // Move item to a different position

  // Question-specific operations
  'update_question_type', // Change question type
  'update_question_config', // Update typeConfig

  // Option operations
  'add_option',           // Add answer option to a question
  'remove_option',        // Remove answer option
  'update_option',        // Update option text/value/navigation
  'reorder_options',      // Reorder options within a question

  // Logic operations
  'add_rule',             // Add a logic rule
  'remove_rule',          // Remove a logic rule
  'update_rule',          // Update a logic rule

  // Settings operations
  'update_settings',      // Update survey settings
  'update_info',          // Update survey info/metadata

  // Bulk operations
  'bulk_update',          // Apply multiple changes at once
]);

export type AIActionType = z.infer<typeof AIActionTypeSchema>;

// ─── Action Metadata ─────────────────────────────────────────────────────────

export const ActionMetadataSchema = z.object({
  /** Which AI mode produced this action (or 'manual' for user edits) */
  mode: AIAgentModeSchema,
  /** ISO 8601 timestamp */
  timestamp: z.string().datetime(),
  /** Human-readable description of the change */
  description: z.string().max(500),
  /** JSON path to the target in the schema tree (for Diff Viewer) */
  path: z.string().max(500),
});

export type ActionMetadata = z.infer<typeof ActionMetadataSchema>;

// ─── AI Action ───────────────────────────────────────────────────────────────

export const AIActionSchema = z.object({
  /** Stable UUID for this action */
  id: z.string().uuid(),
  /** The operation type */
  type: AIActionTypeSchema,
  /** Target item ID (the item being modified) */
  targetId: z.string(),
  /** The data to apply — structure depends on action type */
  payload: z.record(z.string(), z.unknown()),
  /** Audit metadata */
  metadata: ActionMetadataSchema,
});

export type AIAction = z.infer<typeof AIActionSchema>;

// ─── AI Request / Response ───────────────────────────────────────────────────

export const AIRequestSchema = z.object({
  /** Survey being modified */
  surveyId: z.string().uuid(),
  /** Natural language prompt from the user */
  prompt: z.string().min(1).max(5000),
  /** User making the request */
  userId: z.string().uuid(),
  /** Existing conversation ID for follow-up context */
  conversationId: z.string().uuid().optional(),
});

export type AIRequest = z.infer<typeof AIRequestSchema>;

export const AIResponseSchema = z.object({
  /** Which mode the AI selected */
  mode: AIAgentModeSchema,
  /** Proposed surgical actions */
  actions: z.array(AIActionSchema),
  /** AI explanation of what it did / proposes */
  explanation: z.string().max(5000),
  /** Conversation ID for follow-up */
  conversationId: z.string().uuid(),
  /** Whether the user must approve before applying */
  requiresApproval: z.boolean().default(true),
  /** AI confidence score 0-1 */
  confidence: z.number().min(0).max(1).optional(),
  /** Optional warnings */
  warnings: z.array(z.string()).optional(),
  /** Optional errors */
  errors: z.array(z.string()).optional(),
});

export type AIResponse = z.infer<typeof AIResponseSchema>;

// ─── Rate Limit Info ─────────────────────────────────────────────────────────

export const RateLimitInfoSchema = z.object({
  requestsRemaining: z.number().int().min(0),
  resetTime: z.string().datetime(),
  dailyLimit: z.number().int().min(1).default(100),
  currentUsage: z.number().int().min(0),
});

export type RateLimitInfo = z.infer<typeof RateLimitInfoSchema>;

// ─── Conversation Context ────────────────────────────────────────────────────

export const ChatMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(['user', 'assistant', 'system']),
  content: z.string().max(10000),
  timestamp: z.string().datetime(),
  actions: z.array(AIActionSchema).optional(),
  mode: AIAgentModeSchema.optional(),
});

export type ChatMessage = z.infer<typeof ChatMessageSchema>;

export const ConversationContextSchema = z.object({
  sessionId: z.string().uuid(),
  surveyId: z.string().uuid(),
  messages: z.array(ChatMessageSchema).default([]),
  currentMode: AIAgentModeSchema.default('modify'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export type ConversationContext = z.infer<typeof ConversationContextSchema>;
