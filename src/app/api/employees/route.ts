import { NextResponse } from 'next/server';
import { generateInitialEmployees } from '@/data/seedData';

// Production endpoint: connects to Prisma when DATABASE_URL is configured,
// and gracefully falls back to the deterministic 50-employee dataset for zero-config deployments.
export async function GET() {
  try {
    if (process.env.DATABASE_URL) {
      const { PrismaClient } = await import('@prisma/client');
      const prisma = new PrismaClient();
      const employees = await prisma.employee.findMany({
        include: {
          objectives: true,
          feedbackSessions: true,
          jobDescription: true,
          appraisalHistory: true,
          currentAppraisal: true,
        },
        orderBy: { employeeCode: 'asc' },
      });
      await prisma.$disconnect();
      if (employees.length > 0) {
        return NextResponse.json({ source: 'postgresql', data: employees });
      }
    }
  } catch (err) {
    console.warn('Database not reachable, serving deterministic seed dataset:', err);
  }

  return NextResponse.json({
    source: 'seed-fallback',
    data: generateInitialEmployees(),
  });
}
