import { NextRequest, NextResponse } from 'next/server';
import { generateInitialEmployees } from '@/data/seedData';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  const staff = generateInitialEmployees();
  const matched = staff.find((e) => e.email.toLowerCase() === String(email).toLowerCase());

  if (!matched || password !== 'Alstom@2026') {
    return NextResponse.json({ error: 'Invalid credentials. Use Alstom@2026 for demo accounts.' }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      employeeCode: matched.employeeCode,
      name: `${matched.firstName} ${matched.lastName}`,
      email: matched.email,
      role: matched.sysRole,
      department: matched.department,
      designation: matched.designation,
    },
  });
}
