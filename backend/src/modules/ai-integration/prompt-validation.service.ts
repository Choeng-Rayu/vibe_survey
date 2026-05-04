import { Injectable, Logger } from '@nestjs/common';
import { PromptValidationResultDto, SecurityEventDto } from './dto/prompt-validation-result.dto';

// Requirement 6.2: Prompt injection detection and prevention
// Requirement 28: AI Prompt Parser and Validator
@Injectable()
export class PromptValidationService {
  private readonly logger = new Logger(PromptValidationService.name);

  // Requirement 28.7: Malicious pattern database
  private readonly injectionPatterns = [
    /ignore\s+(previous|all|above)\s+instructions?/i,
    /disregard\s+(previous|all|above)\s+(instructions?|prompts?)/i,
    /forget\s+(everything|all|previous)/i,
    /new\s+instructions?:/i,
    /system\s*:\s*/i,
    /\[SYSTEM\]/i,
    /\[INST\]/i,
    /<\|im_start\|>/i,
    /<\|im_end\|>/i,
    /you\s+are\s+now/i,
    /act\s+as\s+(a\s+)?different/i,
    /pretend\s+you\s+are/i,
    /roleplay\s+as/i,
  ];

  private readonly suspiciousPatterns = [
    /\bsudo\b/i,
    /\broot\b/i,
    /\badmin\b/i,
    /\bexecute\b/i,
    /\beval\b/i,
    /\bscript\b/i,
    /<script>/i,
    /javascript:/i,
    /onerror=/i,
    /onclick=/i,
  ];

  // Track violations per user (in-memory for demo)
  private violationCount = new Map<string, number>();

  // Requirement 28.3: Detect and reject malicious prompts
  validatePrompt(userId: string, prompt: string): PromptValidationResultDto {
    const result = new PromptValidationResultDto();

    // Check for injection patterns
    for (const pattern of this.injectionPatterns) {
      if (pattern.test(prompt)) {
        result.detectedPatterns.push(pattern.source);
        result.riskLevel = 'critical';
        result.blockedReasons.push('Prompt injection attempt detected');
      }
    }

    // Check for suspicious patterns
    for (const pattern of this.suspiciousPatterns) {
      if (pattern.test(prompt)) {
        result.detectedPatterns.push(pattern.source);
        if (result.riskLevel === 'low') result.riskLevel = 'medium';
        result.blockedReasons.push('Suspicious content detected');
      }
    }

    // Check for excessive length
    if (prompt.length > 5000) {
      result.riskLevel = 'high';
      result.blockedReasons.push('Prompt exceeds maximum length');
    }

    // Check for repeated violations
    const violations = this.violationCount.get(userId) || 0;
    if (violations >= 3) {
      result.riskLevel = 'critical';
      result.blockedReasons.push('Repeated violation threshold exceeded');
    }

    // Determine if valid
    result.isValid = result.riskLevel === 'low' || result.riskLevel === 'medium';

    // Requirement 28.8: Sanitize while preserving intent
    if (result.isValid) {
      result.sanitizedPrompt = this.sanitizePrompt(prompt);
    }

    // Requirement 28.7: Log security events
    if (!result.isValid) {
      this.logSecurityEvent(userId, prompt, result);
      this.incrementViolations(userId);
    }

    return result;
  }

  // Requirement 28.8: Sanitize prompt content while preserving intent
  private sanitizePrompt(prompt: string): string {
    let sanitized = prompt;

    // Remove HTML tags
    sanitized = sanitized.replace(/<[^>]*>/g, '');

    // Remove script-like content
    sanitized = sanitized.replace(/javascript:/gi, '');
    sanitized = sanitized.replace(/on\w+=/gi, '');

    // Normalize whitespace
    sanitized = sanitized.replace(/\s+/g, ' ').trim();

    // Limit length
    if (sanitized.length > 5000) {
      sanitized = sanitized.substring(0, 5000);
    }

    return sanitized;
  }

  // Requirement 28.7: Log security events and block processing
  private logSecurityEvent(
    userId: string,
    prompt: string,
    result: PromptValidationResultDto,
  ): void {
    const event: SecurityEventDto = {
      userId,
      originalPrompt: prompt.substring(0, 200), // Log only first 200 chars
      detectedPatterns: result.detectedPatterns,
      riskLevel: result.riskLevel,
      timestamp: new Date(),
      action: result.isValid ? 'sanitized' : 'blocked',
    };

    this.logger.warn(`Security event: ${JSON.stringify(event)}`);
  }

  // Track violations for automatic blocking
  private incrementViolations(userId: string): void {
    const current = this.violationCount.get(userId) || 0;
    this.violationCount.set(userId, current + 1);

    if (current + 1 >= 3) {
      this.logger.error(`User ${userId} exceeded violation threshold (${current + 1} violations)`);
    }
  }

  // Reset violations (for testing or admin override)
  resetViolations(userId: string): void {
    this.violationCount.delete(userId);
    this.logger.log(`Reset violations for user ${userId}`);
  }

  // Get violation count for a user
  getViolationCount(userId: string): number {
    return this.violationCount.get(userId) || 0;
  }
}
