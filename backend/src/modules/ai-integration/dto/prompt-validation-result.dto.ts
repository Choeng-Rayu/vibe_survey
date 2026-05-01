// Requirement 28: AI Prompt Parser and Validator
export class PromptValidationResultDto {
  isValid!: boolean;
  sanitizedPrompt?: string;
  detectedPatterns: string[];
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  blockedReasons: string[];

  constructor() {
    this.detectedPatterns = [];
    this.blockedReasons = [];
    this.riskLevel = 'low';
  }
}

export class SecurityEventDto {
  userId!: string;
  originalPrompt!: string;
  detectedPatterns!: string[];
  riskLevel!: string;
  timestamp!: Date;
  action!: 'blocked' | 'sanitized' | 'allowed';
}
