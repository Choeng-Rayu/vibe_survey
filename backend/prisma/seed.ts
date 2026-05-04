import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function seed() {
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vibesurvey.com' },
    update: {},
    create: {
      email: 'admin@vibesurvey.com',
      role: Role.admin,
      is_email_verified: true,
      password_hash: await bcrypt.hash('admin123-change-me', 12),
      profile: {
        create: {
          first_name: 'Vibe',
          last_name: 'Admin',
          language: 'en',
        },
      },
      wallet: {
        create: {
          currency: 'USD',
        },
      },
    },
  });

  await prisma.featureFlag.upsert({
    where: { name: 'ai-survey-builder' },
    update: {},
    create: {
      name: 'ai-survey-builder',
      is_enabled: true,
      rollout_pct: 100,
      description: 'Enables AI survey generation and modification endpoints',
      updated_by: admin.id,
    },
  });
}

seed()
  .then(async () => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
