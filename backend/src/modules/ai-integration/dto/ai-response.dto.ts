export interface AiResponseDto {
  mode: string;
  survey?: any;
  suggestions?: any[];
  analysis?: any;
  diff?: {
    added: string[];
    removed: string[];
    modified: string[];
  };
  conversationId?: string;
  cached?: boolean;
}
