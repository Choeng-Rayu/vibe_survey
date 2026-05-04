import { Controller } from '@nestjs/common';
import { ResponsesService } from './responses.service.js';

@Controller('responses')
export class ResponsesController {
  constructor(private readonly responsesService: ResponsesService) {}
}
