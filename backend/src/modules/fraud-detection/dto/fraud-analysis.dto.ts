// Requirement 11: Fraud Detection System

export interface FraudAnalysisResult {
  fraud_score: number; // 0-100
  quality_label: 'high_quality' | 'suspicious' | 'likely_fraud';
  fraud_signals: FraudSignals;
  behavioral_metrics: BehavioralMetrics;
  should_reject: boolean;
}

export interface FraudSignals {
  failed_attention_checks?: number;
  fast_responses?: boolean;
  straight_lining?: boolean;
  pattern_answers?: boolean;
  honeypot_violation?: boolean;
  auto_clicking?: boolean;
  suspicious_device?: boolean;
  duplicate_fingerprint?: boolean;
}

export interface BehavioralMetrics {
  avg_response_time: number;
  response_time_variance: number;
  click_pattern_score: number;
  interaction_depth_score: number;
  scroll_depth: number;
  mouse_movement_score: number;
}

export interface DeviceFingerprint {
  user_agent: string;
  screen_resolution: string;
  timezone: string;
  language: string;
  platform: string;
  ip_address?: string;
}
