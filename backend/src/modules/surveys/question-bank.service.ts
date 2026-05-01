import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateQuestionBankDto } from './dto/template.dto';

// Requirement 5.3: Question banks for reusable questions
@Injectable()
export class QuestionBankService {
  private readonly logger = new Logger(QuestionBankService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateQuestionBankDto) {
    const question = await this.prisma.questionBank.create({
      data: {
        user_id: userId,
        title: dto.title,
        type: dto.type,
        definition: dto.definition,
        tags: dto.tags || [],
        is_public: dto.is_public || false,
      },
    });
    this.logger.log(`Question bank created: ${question.id}`);
    return question;
  }

  async findAll(userId: string, tags?: string[]) {
    const where = tags?.length
      ? { OR: [{ user_id: userId }, { is_public: true }], tags: { hasSome: tags } }
      : { OR: [{ user_id: userId }, { is_public: true }] };
    return this.prisma.questionBank.findMany({ where, orderBy: { created_at: 'desc' } });
  }

  async findOne(id: string) {
    const question = await this.prisma.questionBank.findUnique({ where: { id } });
    if (!question) throw new NotFoundException('Question not found');
    return question;
  }

  async update(id: string, userId: string, dto: Partial<CreateQuestionBankDto>) {
    const question = await this.findOne(id);
    if (question.user_id !== userId) throw new NotFoundException('Access denied');

    const updated = await this.prisma.questionBank.update({
      where: { id },
      data: { title: dto.title, definition: dto.definition, tags: dto.tags, is_public: dto.is_public },
    });
    this.logger.log(`Question bank updated: ${id}`);
    return updated;
  }

  async remove(id: string, userId: string) {
    const question = await this.findOne(id);
    if (question.user_id !== userId) throw new NotFoundException('Access denied');

    await this.prisma.questionBank.update({ where: { id }, data: { deleted_at: new Date() } });
    this.logger.log(`Question bank deleted: ${id}`);
    return { message: 'Question deleted' };
  }
}
