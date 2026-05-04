import { readFileSync, readdirSync, statSync } from 'fs';
import { join } from 'path';

const backendRoot = join(__dirname, '..');
const srcRoot = join(backendRoot, 'src');

function readSourceFiles(dir: string): string {
  return readdirSync(dir)
    .flatMap((entry) => {
      const path = join(dir, entry);
      if (path.includes('node_modules') || path.includes('dist')) return [];
      if (statSync(path).isDirectory()) return readSourceFiles(path);
      return path.endsWith('.ts') ? readFileSync(path, 'utf8') : '';
    })
    .join('\n');
}

describe('Unified API route compliance', () => {
  const source = readSourceFiles(srcRoot);
  const main = readFileSync(join(srcRoot, 'main.ts'), 'utf8');

  it('uses one global /api/v1 prefix instead of per-controller prefixes', () => {
    expect(main).toContain("app.setGlobalPrefix('api/v1')");
    expect(source).not.toMatch(/@Controller\(['"]api\/v1/);
  });

  it.each([
    "Post('register')",
    "Post('login')",
    "Post('refresh')",
    "Get('oauth/google')",
    "Post('oauth/callback')",
    "Get('profile')",
    "Put('profile')",
    "Get('trust-tier')",
    'Post()',
    "Post('validate')",
    "Get('feed')",
    "Get(':id/flow-diagram')",
    "Post(':id/responses')",
    "Post('api-keys')",
    "Post('oauth/authorize')",
    "Post('oauth/token')",
    "Get('ai-services/status')",
    "Post('register')",
    "Post(':id/test')",
    "Controller('health')",
    "Controller('metrics')",
  ])('contains route decorator %s', (decorator) => {
    expect(source).toContain(decorator);
  });

  it('declares success/error response infrastructure', () => {
    expect(source).toContain('TransformInterceptor');
    expect(source).toContain('HttpExceptionFilter');
    expect(source).toContain('AllExceptionsFilter');
  });
});
