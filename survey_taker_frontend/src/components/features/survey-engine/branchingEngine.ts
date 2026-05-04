import { Question } from '@/lib/api/surveys';

/**
 * Simple branching engine.
 * If a question defines `skipIfAnswer` and the recorded answer for that question
 * matches the value, the *following* question is omitted from the rendered list.
 */
export function applyBranching(
  questions: Question[],
  responses: Map<string, any>,
): Question[] {
  const result: Question[] = [];
  let skipNext = false;
  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    if (skipNext) {
      // Do not include this question, reset flag
      skipNext = false;
      continue;
    }
    result.push(q);
    const answer = responses.get(q.id);
    if (q.skipIfAnswer !== undefined && answer === q.skipIfAnswer) {
      // Mark the next question (if any) to be skipped
      skipNext = true;
    }
  }
  return result;
}
