import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CacheService } from '../../common/cache/cache.service';
import { FlowDiagramOptionsDto } from './dto/flow-diagram-options.dto';

interface SurveyQuestion {
  id?: string;
  text?: string;
  title?: string;
  type?: string;
  logic?: Array<{ condition?: string; next_question_id?: string; action?: string }>;
  skip_logic?: Array<{ condition?: string; target?: string }>;
}

interface FlowNode {
  id: string;
  label: string;
  type: string;
}

interface FlowEdge {
  from: string;
  to: string;
  label: string;
}

@Injectable()
export class SurveyFlowDiagramService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cacheService: CacheService,
  ) {}

  async generate(surveyId: string, options: FlowDiagramOptionsDto = {}) {
    const format = options.format ?? 'json';
    const cacheKey = `survey-flow:${surveyId}:${format}:${options.theme ?? 'soft-luxury'}`;
    const cached = await this.cacheService.get(cacheKey);
    if (cached) return cached;

    const survey = await this.prisma.survey.findFirst({
      where: { id: surveyId, deleted_at: null },
      select: { id: true, title: true, definition: true },
    });
    if (!survey) throw new NotFoundException('Survey not found');

    const graph = this.buildGraph(
      survey.definition as { questions?: SurveyQuestion[] },
      survey.title,
    );
    const result = format === 'svg' ? this.toSvg(graph) : graph;
    await this.cacheService.set(cacheKey, result, 300);
    return result;
  }

  private buildGraph(definition: { questions?: SurveyQuestion[] }, title: string) {
    const questions = definition.questions ?? [];
    const nodes: FlowNode[] = [
      { id: 'start', label: title || 'Survey Start', type: 'start' },
      ...questions.map((question, index) => ({
        id: question.id ?? `q${index + 1}`,
        label: question.text ?? question.title ?? `Question ${index + 1}`,
        type: question.type ?? 'question',
      })),
      { id: 'complete', label: 'Complete', type: 'end' },
    ];

    const edges: FlowEdge[] = [];
    if (questions[0]) edges.push({ from: 'start', to: questions[0].id ?? 'q1', label: 'begin' });

    questions.forEach((question, index) => {
      const from = question.id ?? `q${index + 1}`;
      const next =
        questions[index + 1]?.id ?? (questions[index + 1] ? `q${index + 2}` : 'complete');
      const logicEdges = [
        ...(question.logic ?? []).map((rule) => ({
          from,
          to: rule.next_question_id ?? next,
          label: rule.condition ?? rule.action ?? 'logic',
        })),
        ...(question.skip_logic ?? []).map((rule) => ({
          from,
          to: rule.target ?? next,
          label: rule.condition ?? 'skip',
        })),
      ];

      if (logicEdges.length > 0) edges.push(...logicEdges);
      else edges.push({ from, to: next, label: 'next' });
    });

    return { nodes, edges, quotas: definition['quotas' as keyof typeof definition] ?? [] };
  }

  private toSvg(graph: { nodes: FlowNode[]; edges: FlowEdge[] }) {
    const width = 960;
    const nodeHeight = 54;
    const gap = 34;
    const height = Math.max(160, graph.nodes.length * (nodeHeight + gap) + 60);
    const nodeX = 80;
    const nodeWidth = 520;

    const nodeMarkup = graph.nodes
      .map((node, index) => {
        const y = 40 + index * (nodeHeight + gap);
        return `<g><rect x="${nodeX}" y="${y}" width="${nodeWidth}" height="${nodeHeight}" rx="16" fill="#F2EDE5" stroke="#7C9E8A"/><text x="${nodeX + 18}" y="${y + 33}" font-family="DM Sans, Arial" font-size="15" fill="#1C1C1A">${this.escape(node.label)}</text></g>`;
      })
      .join('');

    const edgeMarkup = graph.edges
      .map((edge) => {
        const fromIndex = graph.nodes.findIndex((node) => node.id === edge.from);
        const toIndex = graph.nodes.findIndex((node) => node.id === edge.to);
        if (fromIndex < 0 || toIndex < 0) return '';
        const y1 = 40 + fromIndex * (nodeHeight + gap) + nodeHeight;
        const y2 = 40 + toIndex * (nodeHeight + gap);
        const x = nodeX + nodeWidth / 2;
        return `<path d="M ${x} ${y1} L ${x} ${y2}" stroke="#C4956A" stroke-width="2" fill="none"/><text x="${x + 12}" y="${(y1 + y2) / 2}" font-family="DM Sans, Arial" font-size="12" fill="#6B6860">${this.escape(edge.label)}</text>`;
      })
      .join('');

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img">${edgeMarkup}${nodeMarkup}</svg>`;
  }

  private escape(value: string) {
    return value.replace(/[&<>"']/g, (char) => {
      const replacements: Record<string, string> = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;',
      };
      return replacements[char] ?? char;
    });
  }
}
