import { Injectable, BadRequestException, Logger } from '@nestjs/common';

@Injectable()
export class SurveyValidationService {
  private readonly logger = new Logger(SurveyValidationService.name);

  validate(definition: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!definition || typeof definition !== 'object') {
      errors.push('Survey definition must be an object');
      return { valid: false, errors };
    }

    if (!definition.questions || !Array.isArray(definition.questions)) {
      errors.push('Survey must have a questions array');
    } else if (definition.questions.length === 0) {
      errors.push('Survey must have at least one question');
    } else {
      definition.questions.forEach((q: any, idx: number) => {
        if (!q.id) errors.push(`Question ${idx + 1}: Missing id`);
        if (!q.type) errors.push(`Question ${idx + 1}: Missing type`);
        if (!q.text) errors.push(`Question ${idx + 1}: Missing text`);
        
        if (['single_choice', 'multiple_choice'].includes(q.type)) {
          if (!q.options || !Array.isArray(q.options) || q.options.length < 2) {
            errors.push(`Question ${idx + 1}: Choice questions need at least 2 options`);
          }
        }
      });
    }

    const valid = errors.length === 0;
    if (!valid) this.logger.warn(`Survey validation failed: ${errors.join(', ')}`);
    return { valid, errors };
  }

  validateAndThrow(definition: any): void {
    const result = this.validate(definition);
    if (!result.valid) {
      throw new BadRequestException({ message: 'Survey validation failed', errors: result.errors });
    }
  }
}
