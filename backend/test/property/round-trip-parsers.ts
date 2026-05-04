export interface ResponsePayload {
  response_id: string;
  survey_id: string;
  user_id: string;
  timestamp: string;
  answers: Record<string, unknown>;
  behavioral_data: Record<string, unknown>;
  quality_metrics: Record<string, unknown>;
}

export interface CampaignPayload {
  campaign_id: string;
  advertiser_id: string;
  survey_id: string;
  targeting_criteria: Record<string, unknown>;
  budget_settings: Record<string, unknown>;
  lifecycle_status: string;
}

export interface AIPromptPayload {
  prompt_id: string;
  user_id: string;
  agent_mode: string;
  prompt_text: string;
  conversation_context: Record<string, unknown>;
}

export interface TransactionPayload {
  transaction_id: string;
  user_id: string;
  amount: number;
  currency: string;
  payment_method: string;
  status: string;
}

export const JsonRoundTripParser = {
  parse<T extends Record<string, unknown>>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
  },
  print(value: Record<string, unknown>): string {
    return JSON.stringify(value);
  },
};
