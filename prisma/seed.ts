import { PrismaClient, SystemRole, ObjectiveCategory, CycleStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { ROLE_TEMPLATES, generateInitialEmployees } from '../src/data/seedData';

const prisma = new PrismaClient();

export async function main() {
  console.log('Seeding Alstom Transport Private Limited CPMS database...');
  const passwordHash = await bcrypt.hash('Alstom@2026', 10);

  await prisma.cycleConfig.upsert({
    where: { id: 'default-cycle' },
    update: {},
    create: {
      id: 'default-cycle',
      appraisalYear: '2026-27',
      sessionWindows: [
        { session: 1, label: 'Session 1 (Apr–May)', deadline: '2026-05-31' },
        { session: 2, label: 'Session 2 (Jun–Jul)', deadline: '2026-07-31' },
        { session: 3, label: 'Session 3 (Aug–Sep)', deadline: '2026-09-30' },
        { session: 4, label: 'Session 4 (Oct–Nov)', deadline: '2026-11-30' },
        { session: 5, label: 'Session 5 (Dec–Jan)', deadline: '2027-01-31' },
        { session: 6, label: 'Session 6 (Feb–Mar)', deadline: '2027-03-25' }
      ],
      ratingScale: {
        1: 'Below Expectations',
        2: 'Developing / Needs Improvement',
        3: 'Meets Expectations',
        4: 'Exceeds Expectations',
        5: 'Outstanding / Role Model'
      },
      competencies: [
        'Safety & Zero-Deviation Mindset',
        'Technical & Engineering Rigor',
        'Customer & Delivery Focus',
        'Collaboration & Agility',
        'Innovation & Digital Mindset'
      ],
      requireExact100: true,
      reminderDays: 7
    }
  });

  const templateMap = new Map<string, string>();
  for (const tpl of ROLE_TEMPLATES) {
    const created = await prisma.roleTemplate.upsert({
      where: { title: tpl.title },
      update: {},
      create: {
        title: tpl.title,
        department: tpl.department,
        gradeBand: tpl.gradeBand,
        purpose: tpl.purpose,
        responsibilities: tpl.responsibilities,
        skills: tpl.skills,
        qualifications: tpl.qualifications,
        kpis: tpl.kpis,
        workingConditions: tpl.workingConditions,
        tools: tpl.tools,
        successFactors: tpl.successFactors,
        careerPath: tpl.careerPath,
        objectives: {
          create: tpl.objectives.map((o) => ({
            title: o.title,
            category: o.category as ObjectiveCategory,
            description: o.description,
            measureKpi: o.measureKpi,
            target: o.target,
            weightage: o.weightage
          }))
        }
      }
    });
    templateMap.set(tpl.id, created.id);
  }

  const employees = generateInitialEmployees();
  const codeToDbId = new Map<string, string>();

  for (const emp of employees) {
    const user = await prisma.user.upsert({
      where: { email: emp.email },
      update: {},
      create: {
        email: emp.email,
        passwordHash,
        role: emp.sysRole as SystemRole
      }
    });

    const dbEmp = await prisma.employee.upsert({
      where: { employeeCode: emp.employeeCode },
      update: {},
      create: {
        employeeCode: emp.employeeCode,
        userId: user.id,
        firstName: emp.firstName,
        lastName: emp.lastName,
        designation: emp.designation,
        department: emp.department,
        grade: emp.grade,
        location: emp.location,
        joiningDate: new Date(emp.joiningDate),
        totalExperience: emp.totalExperience,
        currentCtc: emp.currentCtc,
        lastRating: emp.lastRating,
        cycleStatus: emp.cycleStatus as CycleStatus,
        roleTemplateId: templateMap.get(emp.roleTemplateId),
        jobDescription: {
          create: {
            jobTitle: emp.jd.jobTitle,
            purpose: emp.jd.purpose,
            reportingLine: emp.jd.reportingLine,
            responsibilities: emp.jd.responsibilities,
            skills: emp.jd.skills,
            qualifications: emp.jd.qualifications,
            kpis: emp.jd.kpis,
            workingConditions: emp.jd.workingConditions,
            tools: emp.jd.tools,
            successFactors: emp.jd.successFactors,
            careerPath: emp.jd.careerPath
          }
        },
        objectives: {
          create: emp.objectives.map((o) => ({
            title: o.title,
            category: o.category as ObjectiveCategory,
            description: o.description,
            measureKpi: o.measureKpi,
            target: o.target,
            weightage: o.weightage,
            timeline: o.timeline,
            progress: o.progress,
            status: o.status as CycleStatus,
            selfRating: o.selfRating,
            managerRating: o.managerRating,
            approvedByMgr: o.approvedByMgr
          }))
        },
        appraisalHistory: {
          create: emp.history.map((h) => ({
            year: h.year,
            finalRating: h.finalRating,
            incrementPct: h.incrementPct,
            promoted: h.promoted,
            designation: h.designation,
            ctcAtTime: h.ctcAtTime,
            remarks: h.remarks
          }))
        }
      }
    });

    codeToDbId.set(emp.employeeCode, dbEmp.id);

    for (const sess of emp.sessions) {
      await prisma.feedbackSession.upsert({
        where: {
          employeeId_appraisalYear_sessionNumber: {
            employeeId: dbEmp.id,
            appraisalYear: '2026-27',
            sessionNumber: sess.sessionNumber
          }
        },
        update: {},
        create: {
          employeeId: dbEmp.id,
          appraisalYear: '2026-27',
          sessionNumber: sess.sessionNumber,
          scheduledDate: new Date(sess.scheduledDate),
          completedDate: sess.completedDate ? new Date(sess.completedDate) : null,
          status: sess.status as CycleStatus,
          participants: sess.participants,
          objectiveReview: sess.objectiveReview || null,
          achievements: sess.achievements || null,
          challenges: sess.challenges || null,
          managerFeedback: sess.managerFeedback || null,
          employeeReflection: sess.employeeReflection || null,
          competencyRatings: sess.competencyRatings,
          actionItems: sess.actionItems,
          developmentPlan: sess.developmentPlan || null,
          overallRating: sess.overallRating,
          employeeAck: sess.employeeAck,
          managerAck: sess.managerAck
        }
      });
    }
  }

  for (const emp of employees) {
    if (emp.managerCode && codeToDbId.has(emp.managerCode)) {
      await prisma.employee.update({
        where: { employeeCode: emp.employeeCode },
        data: { managerId: codeToDbId.get(emp.managerCode) }
      });
    }
  }

  console.log('Seeded 50 Alstom Transport Private Limited employees successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
