import { Controller } from '@nestjs/common';
import { SurveysService } from './surveys.service.js';

@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}
}
