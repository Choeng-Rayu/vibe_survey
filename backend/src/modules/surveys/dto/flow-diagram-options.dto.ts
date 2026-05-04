import { IsEnum, IsOptional, IsString } from 'class-validator';

export class FlowDiagramOptionsDto {
  @IsOptional()
  @IsEnum(['json', 'svg'])
  format?: 'json' | 'svg' = 'json';

  @IsOptional()
  @IsString()
  theme?: 'soft-luxury' | 'default' = 'soft-luxury';
}
