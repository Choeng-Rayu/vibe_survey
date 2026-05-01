import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

// Requirement 5.1: Survey versioning with rollback functionality
@Injectable()
export class SurveyVersioningService {
  private readonly logger = new Logger(SurveyVersioningService.name);

  constructor(private readonly prisma: PrismaService) {}

  async createVersion(surveyId: string, version: number, definition: any, createdBy: string, changeNote?: string) {
    const surveyVersion = await this.prisma.surveyVersion.create({
      data: { survey_id: surveyId, version, definition, created_by: createdBy, change_note: changeNote },
    });
    this.logger.log(`Version ${version} created for survey: ${surveyId}`);
    return surveyVersion;
  }

  async getVersionHistory(surveyId: string) {
    return this.prisma.surveyVersion.findMany({
      where: { survey_id: surveyId },
      orderBy: { version: 'desc' },
    });
  }

  async getVersion(surveyId: string, version: number) {
    const surveyVersion = await this.prisma.surveyVersion.findUnique({
      where: { survey_id_version: { survey_id: surveyId, version } },
    });
    if (!surveyVersion) throw new NotFoundException(`Version ${version} not found`);
    return surveyVersion;
  }

  async rollback(surveyId: string, targetVersion: number, userId: string) {
    const targetVersionData = await this.getVersion(surveyId, targetVersion);
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new NotFoundException('Survey not found');

    const updated = await this.prisma.survey.update({
      where: { id: surveyId },
      data: { definition: targetVersionData.definition as any, version: survey.version + 1 },
    });

    await this.createVersion(surveyId, updated.version, targetVersionData.definition, userId, `Rolled back to version ${targetVersion}`);
    this.logger.log(`Survey ${surveyId} rolled back to version ${targetVersion}`);
    return updated;
  }

  async compareVersions(surveyId: string, version1: number, version2: number) {
    const [v1, v2] = await Promise.all([
      this.getVersion(surveyId, version1),
      this.getVersion(surveyId, version2),
    ]);
    return { version1: v1, version2: v2, diff: this.generateDiff(v1.definition, v2.definition) };
  }

  private generateDiff(def1: any, def2: any): string[] {
    const changes: string[] = [];
    if (JSON.stringify(def1) === JSON.stringify(def2)) return ['No changes'];
    
    if (def1.questions?.length !== def2.questions?.length) {
      changes.push(`Question count changed: ${def1.questions?.length || 0} → ${def2.questions?.length || 0}`);
    }
    return changes.length > 0 ? changes : ['Structure modified'];
  }
}
