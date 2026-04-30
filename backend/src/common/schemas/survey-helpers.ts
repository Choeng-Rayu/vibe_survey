/**
 * Survey Schema Helper Utilities — Flat Items Model (Google Forms-inspired)
 *
 * Pure functions for common survey operations:
 * - Drag-and-drop reordering (trivial with flat items[])
 * - Item creation factories
 * - Section grouping helpers
 * - Estimated duration calculator
 *
 * With a flat items[] array, drag-drop is simply reordering
 * elements in a single list — no cross-section complexity.
 */
import { randomUUID } from 'node:crypto';
import type {
  CanonicalSurvey,
  QuestionOption,
  QuestionType,
  SurveyItem,
} from './survey-canonical.schema.js';
import type { AIAction } from './survey-actions.schema.js';

// ─── ID Generation ───────────────────────────────────────────────────────────

/** Generate a new stable UUID */
export function generateId(): string {
  return randomUUID();
}

// ─── Ordering Helpers ────────────────────────────────────────────────────────

/**
 * Reorder items in a flat list after a drag-drop event.
 * Since items[] is flat (like Google Forms), this is the ONLY
 * reorder function needed — no section-level nesting.
 *
 * @param items - Current flat items array
 * @param draggedId - The itemId being dragged
 * @param targetOrder - The new position index
 * @returns New array with updated `order` values
 *
 * @example
 * ```ts
 * // Move item 3 (order=2) to position 0
 * const reordered = reorderItems(items, 'item-3-id', 0);
 * // Result: item3 order=0, item1 order=1, item2 order=2, ...
 * ```
 */
export function reorderItems<T extends { itemId: string; order: number }>(
  items: T[],
  draggedId: string,
  targetOrder: number,
): T[] {
  const sorted = [...items].sort((a, b) => a.order - b.order);
  const draggedIndex = sorted.findIndex((item) => item.itemId === draggedId);

  if (draggedIndex === -1) {
    return items; // Item not found, return unchanged
  }

  const [dragged] = sorted.splice(draggedIndex, 1);
  const clampedTarget = Math.max(0, Math.min(targetOrder, sorted.length));
  sorted.splice(clampedTarget, 0, dragged);

  return sorted.map((item, index) => ({ ...item, order: index }));
}

/**
 * Normalize order values to be sequential (0, 1, 2, ...).
 * Useful after deletions that may leave gaps.
 */
export function normalizeOrder<T extends { order: number }>(items: T[]): T[] {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({ ...item, order: index }));
}

// ─── Item Lookup ─────────────────────────────────────────────────────────────

/** Find an item by ID */
export function findItem(
  survey: CanonicalSurvey,
  itemId: string,
): SurveyItem | undefined {
  return survey.items.find((item) => item.itemId === itemId);
}

/** Get all question items (filter out section_headers, text_blocks, etc) */
export function getQuestionItems(survey: CanonicalSurvey): SurveyItem[] {
  return survey.items
    .filter((item) => item.itemType === 'question')
    .sort((a, b) => a.order - b.order);
}

/**
 * Get items grouped by section.
 * Returns an array of { sectionHeader, items } groups.
 * Items before the first section_header are in a group with sectionHeader = undefined.
 *
 * This is how the Survey Taker renders pages: split items[] into sections.
 */
export function getItemsBySection(survey: CanonicalSurvey): Array<{
  sectionHeader: SurveyItem | undefined;
  items: SurveyItem[];
}> {
  const sorted = [...survey.items].sort((a, b) => a.order - b.order);
  const groups: Array<{
    sectionHeader: SurveyItem | undefined;
    items: SurveyItem[];
  }> = [];

  let currentGroup: { sectionHeader: SurveyItem | undefined; items: SurveyItem[] } = {
    sectionHeader: undefined,
    items: [],
  };

  for (const item of sorted) {
    if (item.itemType === 'section_header') {
      // Save current group if it has items
      if (currentGroup.items.length > 0 || currentGroup.sectionHeader) {
        groups.push(currentGroup);
      }
      // Start new group
      currentGroup = { sectionHeader: item, items: [] };
    } else {
      currentGroup.items.push(item);
    }
  }

  // Push the last group
  if (currentGroup.items.length > 0 || currentGroup.sectionHeader) {
    groups.push(currentGroup);
  }

  return groups;
}

// ─── Factory Helpers ─────────────────────────────────────────────────────────

/**
 * Create a new empty survey with sensible defaults.
 * Starts with a single section_header + no questions (like a blank Google Form).
 */
export function createEmptySurvey(
  title: string,
  userId: string,
): CanonicalSurvey {
  const now = new Date().toISOString();

  return {
    id: generateId(),
    schemaVersion: '2.0',
    info: {
      title,
      language: 'en',
      tags: [],
      version: 1,
      collaborators: [],
      aiModifications: [],
    },
    items: [
      {
        itemId: generateId(),
        order: 0,
        title,
        description: undefined,
        itemType: 'section_header',
        sectionHeaderItem: {
          isScreener: false,
        },
      },
    ],
    rules: [],
    settings: {
      shuffleQuestions: false,
      allowBackNavigation: true,
      showProgressBar: true,
      allowAnonymous: false,
      limitOneResponsePerUser: true,
      showLinkToRespondAgain: false,
      confirmationMessage: 'Your response has been recorded.',
    },
    createdAt: now,
    updatedAt: now,
    createdBy: userId,
    updatedBy: userId,
  };
}

/**
 * Create a new question item.
 */
export function createQuestionItem(
  type: QuestionType,
  order: number,
  text: string = 'Untitled Question',
): SurveyItem {
  return {
    itemId: generateId(),
    order,
    title: text,
    itemType: 'question',
    questionItem: {
      type,
      required: true,
      shuffleOptions: false,
      aiGenerated: false,
    },
  };
}

/**
 * Create a new section header item (page break).
 */
export function createSectionHeader(
  order: number,
  title: string = 'Untitled Section',
  isScreener: boolean = false,
): SurveyItem {
  return {
    itemId: generateId(),
    order,
    title,
    itemType: 'section_header',
    sectionHeaderItem: {
      isScreener,
    },
  };
}

/**
 * Create a new text block item.
 */
export function createTextBlock(
  order: number,
  title?: string,
  content?: string,
): SurveyItem {
  return {
    itemId: generateId(),
    order,
    title,
    itemType: 'text_block',
    textBlockItem: {
      content,
    },
  };
}

/**
 * Create a new image item.
 */
export function createImageItem(
  order: number,
  sourceUrl: string,
  altText?: string,
): SurveyItem {
  return {
    itemId: generateId(),
    order,
    itemType: 'image',
    imageItem: {
      sourceUrl,
      altText,
    },
  };
}

/**
 * Create a new video item.
 */
export function createVideoItem(
  order: number,
  url: string,
  caption?: string,
): SurveyItem {
  return {
    itemId: generateId(),
    order,
    itemType: 'video',
    videoItem: {
      youtubeUrl: url,
      caption,
    },
  };
}

/**
 * Create a new answer option.
 */
export function createOption(
  text: string,
  order: number,
): QuestionOption {
  return {
    id: generateId(),
    text,
    value: text.toLowerCase().replace(/\s+/g, '_'),
    order,
    isDisqualifying: false,
    isOther: false,
  };
}

// ─── Drag-Drop → Action Converter ───────────────────────────────────────────

/**
 * Convert a drag-drop reorder event into an AIAction.
 * With a flat items[] list, this is dead simple.
 */
export function createReorderAction(
  reorderedItems: Array<{ itemId: string; order: number }>,
): AIAction {
  return {
    id: generateId(),
    type: 'reorder_items',
    targetId: 'survey',
    payload: {
      newOrder: reorderedItems,
    },
    metadata: {
      mode: 'modify',
      timestamp: new Date().toISOString(),
      description: 'Reordered items via drag-drop',
      path: 'items',
    },
  };
}

// ─── Estimated Duration Calculator ───────────────────────────────────────────

/** Average seconds per question type (research-based estimates) */
const QUESTION_TIME_ESTIMATES: Record<string, number> = {
  single_choice: 10,
  multiple_choice: 15,
  checkbox: 12,
  dropdown: 8,
  image_choice: 15,
  yes_no: 5,
  text_short: 20,
  text_long: 60,
  rating_scale: 8,
  nps: 10,
  likert_scale: 12,
  slider: 8,
  ranking: 25,
  matrix_single: 30,
  matrix_multiple: 45,
  date: 10,
  time: 10,
  file_upload: 30,
};

/**
 * Calculate estimated survey completion time in minutes.
 */
export function calculateEstimatedDuration(survey: CanonicalSurvey): number {
  const questionItems = getQuestionItems(survey);

  const totalSeconds = questionItems.reduce((sum, item) => {
    const qType = item.questionItem?.type ?? 'single_choice';
    const base = QUESTION_TIME_ESTIMATES[qType] ?? 15;
    const optionBonus = Math.max(0, (item.questionItem?.options?.length ?? 0) - 4) * 2;
    return sum + base + optionBonus;
  }, 0);

  return Math.max(1, Math.ceil(totalSeconds / 60));
}
