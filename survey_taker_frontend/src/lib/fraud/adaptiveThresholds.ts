// Adaptive thresholds – adjust weighting based on survey characteristics.

/**
 * Adjust weight overrides for a given survey.
 * If the survey has fewer than five questions, reduce the responseTime weight.
 */
export function adjustWeights(survey: { questionCount: number }): Partial<Record<string, number>> {
  if (survey.questionCount < 5) {
    return { responseTime: 0.15 };
  }
  return {};
}
