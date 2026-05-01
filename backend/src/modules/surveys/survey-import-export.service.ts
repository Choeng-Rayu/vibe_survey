import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as XLSX from 'xlsx';
const PDFDocument = require('pdfkit');

// Requirement 7: Survey import/export in multiple formats
@Injectable()
export class SurveyImportExportService {
  private readonly logger = new Logger(SurveyImportExportService.name);

  constructor(private readonly prisma: PrismaService) {}

  async exportToJSON(surveyId: string): Promise<any> {
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new BadRequestException('Survey not found');

    this.logger.log(`Survey exported to JSON: ${surveyId}`);
    return {
      id: survey.id,
      title: survey.title,
      description: survey.description,
      definition: survey.definition,
      version: survey.version,
      language: survey.language,
      exportedAt: new Date().toISOString(),
    };
  }

  async exportToExcel(surveyId: string): Promise<Buffer> {
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new BadRequestException('Survey not found');

    const definition = survey.definition as any;
    const questions = definition.questions || [];

    const worksheetData = [
      ['Survey Title', survey.title],
      ['Description', survey.description || ''],
      ['Version', survey.version],
      [''],
      ['Question ID', 'Question Text', 'Type', 'Required', 'Options'],
      ...questions.map((q: any) => [
        q.id || '',
        q.text || '',
        q.type || '',
        q.required ? 'Yes' : 'No',
        q.options ? JSON.stringify(q.options) : '',
      ]),
    ];

    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Survey');

    this.logger.log(`Survey exported to Excel: ${surveyId}`);
    return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
  }

  async exportToPDF(surveyId: string): Promise<Buffer> {
    const survey = await this.prisma.survey.findUnique({ where: { id: surveyId } });
    if (!survey) throw new BadRequestException('Survey not found');

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument();
      const chunks: Buffer[] = [];

      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      doc.fontSize(20).text(survey.title, { align: 'center' });
      doc.moveDown();
      doc.fontSize(12).text(survey.description || '', { align: 'left' });
      doc.moveDown();

      const definition = survey.definition as any;
      const questions = definition.questions || [];

      questions.forEach((q: any, idx: number) => {
        doc.fontSize(14).text(`${idx + 1}. ${q.text}`);
        doc.fontSize(10).text(`Type: ${q.type}`);
        if (q.options) {
          q.options.forEach((opt: any) => {
            doc.fontSize(10).text(`  - ${opt.text || opt}`);
          });
        }
        doc.moveDown();
      });

      doc.end();
      this.logger.log(`Survey exported to PDF: ${surveyId}`);
    });
  }

  async importFromExcel(buffer: Buffer, userId: string): Promise<any> {
    const workbook = XLSX.read(buffer, { type: 'buffer' });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    if (data.length < 6) throw new BadRequestException('Invalid Excel format');

    const title = data[0][1] || 'Imported Survey';
    const description = data[1][1] || '';
    const questions: any[] = [];

    for (let i = 5; i < data.length; i++) {
      const row = data[i];
      if (row[0]) {
        questions.push({
          id: row[0],
          text: row[1],
          type: row[2],
          required: row[3] === 'Yes',
          options: row[4] ? JSON.parse(row[4]) : undefined,
        });
      }
    }

    const survey = await this.prisma.survey.create({
      data: {
        title,
        description,
        definition: { questions },
        status: 'draft',
        user_id: userId,
        version: 1,
        language: 'en',
      },
    });

    this.logger.log(`Survey imported from Excel: ${survey.id}`);
    return survey;
  }

  async importFromJSON(jsonData: any, userId: string): Promise<any> {
    if (!jsonData.title || !jsonData.definition) {
      throw new BadRequestException('Invalid JSON format: missing title or definition');
    }

    const survey = await this.prisma.survey.create({
      data: {
        title: jsonData.title,
        description: jsonData.description,
        definition: jsonData.definition,
        status: 'draft',
        user_id: userId,
        version: 1,
        language: jsonData.language || 'en',
      },
    });

    this.logger.log(`Survey imported from JSON: ${survey.id}`);
    return survey;
  }

  async previewImport(buffer: Buffer, format: 'excel' | 'json'): Promise<any> {
    if (format === 'excel') {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

      return {
        title: data[0]?.[1] || 'Unknown',
        description: data[1]?.[1] || '',
        questionCount: Math.max(0, data.length - 5),
        preview: data.slice(0, 10),
      };
    } else {
      const jsonData = JSON.parse(buffer.toString());
      return {
        title: jsonData.title,
        description: jsonData.description,
        questionCount: jsonData.definition?.questions?.length || 0,
      };
    }
  }
}
