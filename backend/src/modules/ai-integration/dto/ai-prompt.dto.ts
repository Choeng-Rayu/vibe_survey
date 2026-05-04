import { IsString, IsEnum, IsOptional, IsObject } from 'class-validator';

export class AiPromptDto {
  @IsEnum(['generate', 'modify', 'enhance', 'translate', 'analyze', 'normalize'])
  mode!: 'generate' | 'modify' | 'enhance' | 'translate' | 'analyze' | 'normalize';

  @IsString()
  prompt!: string;

  @IsOptional()
  @IsObject()
  context?: any;

  @IsOptional()
  @IsString()
  targetLanguage?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;
}
