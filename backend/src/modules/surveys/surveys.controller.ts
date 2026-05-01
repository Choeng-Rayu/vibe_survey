import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { SurveysService } from './surveys.service';
import { SurveyValidationService } from './survey-validation.service';
import { SurveyVersioningService } from './survey-versioning.service';
import { TemplateService } from './template.service';
import { QuestionBankService } from './question-bank.service';
import { SurveyImportExportService } from './survey-import-export.service';
import { SurveyFeedService } from './survey-feed.service';
import { ResponseService } from './response.service';
import { CreateSurveyDto, UpdateSurveyDto } from './dto/survey.dto';
import { CreateTemplateDto, CreateQuestionBankDto } from './dto/template.dto';
import { SurveyFeedQueryDto } from './dto/survey-feed.dto';
import { SubmitResponseDto, AutoSaveDto, StartSurveyDto } from './dto/survey-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('surveys')
@UseGuards(JwtAuthGuard)
export class SurveysController {
  constructor(
    private readonly surveysService: SurveysService,
    private readonly validationService: SurveyValidationService,
    private readonly versioningService: SurveyVersioningService,
    private readonly templateService: TemplateService,
    private readonly questionBankService: QuestionBankService,
    private readonly importExportService: SurveyImportExportService,
    private readonly feedService: SurveyFeedService,
    private readonly responseService: ResponseService,
  ) {}

  @Post()
  create(@CurrentUser('userId') userId: string, @Body() dto: CreateSurveyDto) {
    return this.surveysService.create(userId, dto);
  }

  @Post('validate')
  validate(@Body('definition') definition: any) {
    return this.validationService.validate(definition);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.surveysService.findAll(userId, role);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.surveysService.findOne(id, userId, role);
  }

  @Put(':id')
  update(@Param('id') id: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: string, @Body() dto: UpdateSurveyDto) {
    return this.surveysService.update(id, userId, role, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.surveysService.remove(id, userId, role);
  }

  @Post(':id/duplicate')
  duplicate(@Param('id') id: string, @CurrentUser('userId') userId: string, @CurrentUser('role') role: string) {
    return this.surveysService.duplicate(id, userId, role);
  }

  @Get(':id/versions')
  getVersionHistory(@Param('id') id: string) {
    return this.versioningService.getVersionHistory(id);
  }

  @Get(':id/versions/:version')
  getVersion(@Param('id') id: string, @Param('version') version: string) {
    return this.versioningService.getVersion(id, parseInt(version));
  }

  @Post(':id/versions/:version/rollback')
  rollback(@Param('id') id: string, @Param('version') version: string, @CurrentUser('userId') userId: string) {
    return this.versioningService.rollback(id, parseInt(version), userId);
  }

  @Get(':id/versions/compare/:v1/:v2')
  compareVersions(@Param('id') id: string, @Param('v1') v1: string, @Param('v2') v2: string) {
    return this.versioningService.compareVersions(id, parseInt(v1), parseInt(v2));
  }

  @Post(':id/template')
  createTemplate(@Param('id') id: string, @CurrentUser('userId') userId: string, @Body() dto: CreateTemplateDto) {
    return this.templateService.createTemplate(userId, id, dto);
  }

  @Get('templates')
  getTemplates(@Query('category') category?: string) {
    return this.templateService.getTemplates(category);
  }

  @Post('templates/:id/instantiate')
  instantiateTemplate(@Param('id') id: string, @CurrentUser('userId') userId: string, @Body('title') title: string) {
    return this.templateService.instantiateTemplate(id, userId, title);
  }

  @Delete('templates/:id')
  deleteTemplate(@Param('id') id: string) {
    return this.templateService.deleteTemplate(id);
  }

  @Post('questions')
  createQuestion(@CurrentUser('userId') userId: string, @Body() dto: CreateQuestionBankDto) {
    return this.questionBankService.create(userId, dto);
  }

  @Get('questions')
  getQuestions(@CurrentUser('userId') userId: string, @Query('tags') tags?: string) {
    const tagArray = tags ? tags.split(',') : undefined;
    return this.questionBankService.findAll(userId, tagArray);
  }

  @Get('questions/:id')
  getQuestion(@Param('id') id: string) {
    return this.questionBankService.findOne(id);
  }

  @Put('questions/:id')
  updateQuestion(@Param('id') id: string, @CurrentUser('userId') userId: string, @Body() dto: CreateQuestionBankDto) {
    return this.questionBankService.update(id, userId, dto);
  }

  @Delete('questions/:id')
  deleteQuestion(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.questionBankService.remove(id, userId);
  }

  @Get(':id/export')
  async exportSurvey(@Param('id') id: string, @Query('format') format: string, @Res() res: Response) {
    if (format === 'json') {
      const data = await this.importExportService.exportToJSON(id);
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="survey-${id}.json"`);
      return res.send(data);
    } else if (format === 'excel') {
      const buffer = await this.importExportService.exportToExcel(id);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', `attachment; filename="survey-${id}.xlsx"`);
      return res.send(buffer);
    } else if (format === 'pdf') {
      const buffer = await this.importExportService.exportToPDF(id);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="survey-${id}.pdf"`);
      return res.send(buffer);
    }
    return res.status(400).send({ message: 'Invalid format' });
  }

  @Post('import')
  @UseInterceptors(FileInterceptor('file'))
  async importSurvey(@UploadedFile() file: Express.Multer.File, @CurrentUser('userId') userId: string, @Query('format') format: string) {
    if (format === 'excel') {
      return this.importExportService.importFromExcel(file.buffer, userId);
    } else if (format === 'json') {
      const jsonData = JSON.parse(file.buffer.toString());
      return this.importExportService.importFromJSON(jsonData, userId);
    }
    throw new Error('Invalid format');
  }

  @Post('import/preview')
  @UseInterceptors(FileInterceptor('file'))
  async previewImport(@UploadedFile() file: Express.Multer.File, @Query('format') format: string) {
    return this.importExportService.previewImport(file.buffer, format as 'excel' | 'json');
  }

  // Requirement 10.1: Survey feed generation with personalized recommendations
  @Get('feed')
  getFeed(@CurrentUser('userId') userId: string, @Query() query: SurveyFeedQueryDto) {
    return this.feedService.getGenericFeed(query);
  }

  @Get('feed/personalized')
  getPersonalizedFeed(@CurrentUser('userId') userId: string, @Query() query: SurveyFeedQueryDto) {
    return this.feedService.getPersonalizedFeed(userId, query);
  }

  @Get('recommendations')
  getRecommendations(@CurrentUser('userId') userId: string, @Query() query: SurveyFeedQueryDto) {
    return this.feedService.getPersonalizedFeed(userId, { ...query, sort_by: 'match_score' });
  }

  // Requirement 10.2: Screener question evaluation
  @Post(':id/screener')
  evaluateScreener(@Param('id') id: string, @Body() answers: Record<string, any>) {
    return this.feedService.evaluateScreener(id, answers);
  }

  @Get(':id/eligibility')
  checkEligibility(@Param('id') campaignId: string, @CurrentUser('userId') userId: string) {
    return this.feedService.checkEligibility(userId, campaignId);
  }

  // Requirement 10.7: Survey completion and submission
  @Post(':id/start')
  startSurvey(@Param('id') surveyId: string, @CurrentUser('userId') userId: string, @Body() dto: StartSurveyDto) {
    return this.responseService.startSurvey(userId, { ...dto, survey_id: surveyId });
  }

  @Post(':id/responses')
  submitResponse(@Param('id') surveyId: string, @CurrentUser('userId') userId: string, @Body() dto: SubmitResponseDto) {
    return this.responseService.submitResponse(userId, { ...dto, survey_id: surveyId });
  }

  // Requirement 10.6: Auto-save functionality
  @Put(':id/responses/autosave')
  autoSave(@Param('id') surveyId: string, @CurrentUser('userId') userId: string, @Body() dto: AutoSaveDto) {
    return this.responseService.autoSave(userId, surveyId, dto);
  }

  // Requirement 10.10: Survey resume functionality
  @Get(':id/responses/resume')
  resumeSurvey(@Param('id') surveyId: string, @CurrentUser('userId') userId: string) {
    return this.responseService.resumeSurvey(userId, surveyId);
  }

  @Post(':id/complete')
  completeSurvey(@Param('id') surveyId: string, @CurrentUser('userId') userId: string, @Body() dto: SubmitResponseDto) {
    return this.responseService.submitResponse(userId, { ...dto, survey_id: surveyId });
  }
}
