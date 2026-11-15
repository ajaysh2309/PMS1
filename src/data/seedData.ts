export type SystemRole = 'ADMIN_HR' | 'MANAGER' | 'EMPLOYEE';
export type CycleStatus = 'COMPLETED' | 'IN_PROGRESS' | 'PENDING' | 'OVERDUE' | 'UPCOMING';
export type ObjectiveCategory = 'BUSINESS' | 'TECHNICAL' | 'BEHAVIOURAL' | 'DEVELOPMENT';

export interface RoleTemplateData {
  id: string;
  title: string;
  department: string;
  gradeBand: string;
  purpose: string;
  responsibilities: string[];
  skills: string[];
  qualifications: string;
  kpis: string[];
  workingConditions: string;
  tools: string[];
  successFactors: string[];
  careerPath: string;
  objectives: {
    title: string;
    category: ObjectiveCategory;
    description: string;
    measureKpi: string;
    target: string;
    weightage: number;
  }[];
}

export interface ObjectiveItem {
  id: string;
  title: string;
  category: ObjectiveCategory;
  description: string;
  measureKpi: string;
  target: string;
  weightage: number;
  timeline: string;
  progress: number;
  status: CycleStatus;
  selfRating: number;
  managerRating: number;
  approvedByMgr: boolean;
}

export interface FeedbackSessionItem {
  sessionNumber: number;
  label: string;
  scheduledDate: string;
  completedDate: string | null;
  status: CycleStatus;
  participants: string[];
  objectiveReview: string;
  achievements: string;
  challenges: string;
  managerFeedback: string;
  employeeReflection: string;
  competencyRatings: Record<string, number>;
  actionItems: { task: string; owner: string; dueDate: string; status: string }[];
  developmentPlan: string;
  overallRating: number | null;
  employeeAck: boolean;
  managerAck: boolean;
}

export interface JDVersionItem {
  version: number;
  date: string;
  editedBy: string;
  note: string;
  purpose: string;
}

export interface EmployeeRecord {
  id: string;
  employeeCode: string;
  email: string;
  firstName: string;
  lastName: string;
  designation: string;
  department: string;
  grade: string;
  location: string;
  joiningDate: string;
  totalExperience: number;
  currentCtc: number;
  lastRating: number;
  cycleStatus: CycleStatus;
  status: 'ACTIVE' | 'DEACTIVATED';
  managerCode: string | null;
  sysRole: SystemRole;
  roleTemplateId: string;
  jd: {
    jobTitle: string;
    purpose: string;
    reportingLine: string;
    responsibilities: string[];
    skills: string[];
    qualifications: string;
    kpis: string[];
    workingConditions: string;
    tools: string[];
    successFactors: string[];
    careerPath: string;
    version: number;
    history: JDVersionItem[];
  };
  objectives: ObjectiveItem[];
  sessions: FeedbackSessionItem[];
  appraisal: {
    selfSummary: string;
    selfRating: number;
    managerSummary: string;
    managerRating: number;
    hrCalibrationNotes: string;
    finalRating: number;
    promotionRecommended: boolean;
    recommendedDesignation: string;
    incrementPercentage: number;
    status: CycleStatus;
  };
  history: {
    year: string;
    finalRating: number;
    incrementPct: number;
    promoted: boolean;
    designation: string;
    ctcAtTime: number;
    remarks: string;
  }[];
  awards: { title: string; quarter: string; description: string }[];
  trainings: { title: string; provider: string; date: string; hours: number }[];
  privateNotes: { id: string; author: string; date: string; text: string }[];
}

export const ROLE_TEMPLATES: RoleTemplateData[] = [
  {
    id: 'tpl-1',
    title: 'Chief Operating Officer / Leadership',
    department: 'Executive Leadership',
    gradeBand: 'E8-E9',
    purpose: 'Drive India rail mobility strategy, P&L execution, zero-harm safety culture, and Make-in-India localization targets.',
    responsibilities: [
      'Lead multi-site operations across Bengaluru, Sri City, and Savli',
      'Ensure on-time metro & mainline rolling stock/signalling delivery',
      'Champion EHS zero-deviation governance and board reporting'
    ],
    skills: ['Strategic P&L Management', 'Railway Concession Governance', 'Executive Stakeholder Alignment', 'EHS Leadership'],
    qualifications: 'B.Tech/M.Tech in Engineering + MBA from Tier-1 Institute; 18+ years in rail/infrastructure.',
    kpis: ['India Order Intake & EBIT %', 'Zero LTI Safety Index', 'On-Time Project Delivery > 96%'],
    workingConditions: 'Corporate HQ (Bengaluru) with frequent travel to manufacturing sites and customer depots.',
    tools: ['SAP S/4HANA', 'PowerBI Executive Suite', 'Alstom APSYS Governance'],
    successFactors: ['Customer trust with Metro Corporations', 'Localization > 75%'],
    careerPath: 'Managing Director – India & South Asia / SVP Asia-Pacific',
    objectives: [
      { title: 'India EBIT & Cash Conversion', category: 'BUSINESS', description: 'Deliver annual regional EBIT and free cash flow targets across rolling stock and signalling.', measureKpi: 'EBIT % & FCF (INR Cr)', target: '11.5% EBIT / ₹240 Cr FCF', weightage: 35 },
      { title: 'Zero Harm EHS Governance', category: 'BEHAVIOURAL', description: 'Enforce Alstom Zero Deviation Plan across all manufacturing plants and depot sites.', measureKpi: 'Lost Time Injury Rate (LTIR)', target: '0.00 LTIR', weightage: 25 },
      { title: 'Make-in-India Localization', category: 'TECHNICAL', description: 'Increase local supplier value addition for propulsion and bogie subsystems.', measureKpi: 'Localization %', target: '>= 78% Domestic Value', weightage: 25 },
      { title: 'Leadership Succession Pipeline', category: 'DEVELOPMENT', description: 'Mentor top 12 high-potential department heads for regional leadership roles.', measureKpi: 'Succession Readiness Ratio', target: '2:1 Ready-Now Bench', weightage: 15 }
    ]
  },
  {
    id: 'tpl-2',
    title: 'Department Head',
    department: 'Engineering & Operations',
    gradeBand: 'E6-E7',
    purpose: 'Head functional engineering delivery, resource capacity planning, and technical quality gates across Indian and global rail programs.',
    responsibilities: [
      'Manage 40–80 engineers across specialized rail subsystems',
      'Own Gate Review approvals (GR0–GR5) and engineering budget adherence',
      'Drive digital engineering adoption (MBSE, BIM, automated testing)'
    ],
    skills: ['Multi-Project Portfolio Management', 'EN 50126/50128/50129 Standards', 'Resource Forecasting', 'Cross-Site Collaboration'],
    qualifications: 'B.E./B.Tech in Electrical/Mechanical/Electronics; 14+ years in railway engineering.',
    kpis: ['Engineering Hours Adherence', 'First-Time-Right Design Gate Pass %', 'Attrition < 8%'],
    workingConditions: 'Engineering Center (Bengaluru) with periodic depot commissioning audits.',
    tools: ['Jira Enterprise', 'DOORS', 'SAP PS', 'Polarion ALM'],
    successFactors: ['Zero critical safety non-conformities', 'High team engagement'],
    careerPath: 'VP Engineering / Chief Operating Officer',
    objectives: [
      { title: 'On-Time Design Gate Delivery', category: 'TECHNICAL', description: 'Achieve >=95% on-time clearance for CDR and FDR milestones across active metro bids.', measureKpi: 'Gate Milestone Adherence %', target: '>= 95%', weightage: 35 },
      { title: 'Engineering Productivity & Cost', category: 'BUSINESS', description: 'Optimize work-package hours through reusable platform architectures.', measureKpi: 'Work-Package Variance %', target: '<= -3% under budget', weightage: 25 },
      { title: 'RAMS & Safety Compliance', category: 'TECHNICAL', description: 'Zero SIL-4 safety audit findings during independent safety assessments.', measureKpi: 'ISA Major Non-Conformities', target: '0 Major Findings', weightage: 25 },
      { title: 'Capability Building & Retention', category: 'DEVELOPMENT', description: 'Certify 30% of department engineers in INCOSE / IRSE credentials.', measureKpi: 'Certified Staff %', target: '30% Certified', weightage: 15 }
    ]
  },
  {
    id: 'tpl-3',
    title: 'Engineering Manager',
    department: 'Engineering',
    gradeBand: 'E4-E5',
    purpose: 'Lead sprint execution, technical reviews, and subsystem delivery for metro/mainline projects while coaching team engineers.',
    responsibilities: [
      'Supervise 8–15 engineers on daily deliverables and technical peer reviews',
      'Resolve cross-functional interface bottlenecks between hardware, software, and site teams',
      'Conduct bi-monthly continuous performance check-ins'
    ],
    skills: ['Agile & V-Model Delivery', 'System Interface Management', 'Technical Mentoring', 'Risk Mitigation'],
    qualifications: 'B.Tech/M.Tech in Engineering; 9–14 years domain experience.',
    kpis: ['Sprint Velocity & Delivery %', 'Defect Escape Rate', 'Team Check-in Completion 100%'],
    workingConditions: 'Hybrid Engineering Office & Hardware-in-Loop (HIL) Lab.',
    tools: ['IBM DOORS', 'GitLab CI/CD', 'ClearQuest', 'MS Project'],
    successFactors: ['Proactive interface resolution', 'Timely bi-monthly feedback'],
    careerPath: 'Department Head / Principal Chief Engineer',
    objectives: [
      { title: 'Subsystem Delivery Schedule', category: 'TECHNICAL', description: 'Deliver assigned CBTC/Rolling Stock work packages on schedule.', measureKpi: 'On-Time Deliverable %', target: '96%', weightage: 35 },
      { title: 'Defect Density Reduction', category: 'TECHNICAL', description: 'Reduce post-FAT integration defects through automated regression benches.', measureKpi: 'Defects per KLOC / Module', target: '-20% YoY reduction', weightage: 25 },
      { title: 'Budget & Effort Tracking', category: 'BUSINESS', description: 'Maintain accurate weekly timesheet and EAC forecasting.', measureKpi: 'EAC Forecast Accuracy', target: '+/- 2%', weightage: 20 },
      { title: 'Team Coaching & Feedback', category: 'BEHAVIOURAL', description: 'Complete all 6 CPMS feedback sessions on time with actionable IDPs.', measureKpi: 'CPMS On-Time Rate', target: '100%', weightage: 20 }
    ]
  },
  {
    id: 'tpl-4',
    title: 'Senior Design Engineer',
    department: 'Rolling Stock Engineering',
    gradeBand: 'E3',
    purpose: 'Architect 3D CAD assemblies, structural finite-element validations, and manufacturing drawings for metro carbodies and interiors.',
    responsibilities: [
      'Own complex 3D CAD assemblies in CATIA V5/3DEXPERIENCE',
      'Validate EN 12663 structural load cases and crashworthiness criteria',
      'Support Sri City and Savli production lines during First Article Inspection (FAI)'
    ],
    skills: ['CATIA V5 / 3DEXPERIENCE', 'EN 12663 Structural Standards', 'GD&T', 'DFMEA'],
    qualifications: 'B.E./B.Tech in Mechanical/Aerospace Engineering; 5–9 years experience.',
    kpis: ['Drawing Release First-Pass Yield', 'FAI Closure Lead Time', 'Weight Optimization (kg)'],
    workingConditions: 'Design Office with periodic plant visits to Sri City / Savli.',
    tools: ['CATIA V5', 'ENOVIA PLM', 'ANSYS Mechanical', 'SAP PLM'],
    successFactors: ['Zero shop-floor fouling issues', 'Lightweight carbody compliance'],
    careerPath: 'Lead Design Architect / Engineering Manager',
    objectives: [
      { title: 'Carbody & Interior Drawing Release', category: 'TECHNICAL', description: 'Release 100% of production 2D/3D drawings ahead of Savli manufacturing cut-off.', measureKpi: 'Drawing Release Adherence', target: '100% On-Time', weightage: 40 },
      { title: 'Weight & Cost Value Engineering', category: 'BUSINESS', description: 'Achieve 180 kg carbody weight reduction via topology optimization.', measureKpi: 'Net Mass Saved (kg)', target: '>= 180 kg/car', weightage: 25 },
      { title: 'FAI & Shop-Floor Support', category: 'TECHNICAL', description: 'Resolve manufacturing engineering queries within 48 hours.', measureKpi: 'Avg Query Turnaround', target: '<= 48 Hours', weightage: 20 },
      { title: '3DEXPERIENCE Digital Twin Upskilling', category: 'DEVELOPMENT', description: 'Complete advanced kinematic simulation certification.', measureKpi: 'Certification Status', target: 'Completed by Q3', weightage: 15 }
    ]
  },
  {
    id: 'tpl-5',
    title: 'Signalling Engineer',
    department: 'Digital & Integrated Systems',
    gradeBand: 'E2-E3',
    purpose: 'Design, configure, and test Urbalis CBTC interlocking, ATS (Automatic Train Supervision), and wayside signalling subsystems.',
    responsibilities: [
      'Develop interlocking logic, track layout schematics, and ATS timetable interfaces',
      'Execute Factory Acceptance Testing (FAT) and depot dynamic trials',
      'Ensure strict compliance with CENELEC SIL-4 safety processes'
    ],
    skills: ['Urbalis CBTC', 'ATS / Interlocking Logic', 'CENELEC EN 50128', 'Wireshark / Linux'],
    qualifications: 'B.Tech in Electronics, Instrumentation, or Electrical Engineering; 3–8 years experience.',
    kpis: ['FAT Test Pass Rate', 'Zero Safety Rule Violations', 'Site Commissioning Hours'],
    workingConditions: 'Bengaluru Lab + Night-block metro corridor testing (Delhi/Mumbai/Chennai).',
    tools: ['Urbalis Configuration Suite', 'IBM DOORS', 'Wireshark', 'Python Test Scripts'],
    successFactors: ['Flawless night-block testing', 'Traceable requirement coverage'],
    careerPath: 'Senior Signalling Architect / Commissioning Lead',
    objectives: [
      { title: 'CBTC / ATS Application Data Delivery', category: 'TECHNICAL', description: 'Deliver validated interlocking and ATS database releases for Phase-2 corridor.', measureKpi: 'Release Gate Pass %', target: '100% First-Pass', weightage: 40 },
      { title: 'Automated FAT Script Coverage', category: 'TECHNICAL', description: 'Automate 60% of routine ATS regression test scenarios using Python.', measureKpi: 'Test Automation %', target: '>= 60%', weightage: 25 },
      { title: 'Site Safety & Night-Block Discipline', category: 'BEHAVIOURAL', description: 'Maintain 100% PTW (Permit-to-Work) and track-safety compliance during trials.', measureKpi: 'Safety Audit Score', target: '100%', weightage: 20 },
      { title: 'IRSE Signalling Module Certification', category: 'DEVELOPMENT', description: 'Pass IRSE Module 2 exam in the current appraisal year.', measureKpi: 'Exam Result', target: 'Pass', weightage: 15 }
    ]
  },
  {
    id: 'tpl-6',
    title: 'Rolling Stock / Mechanical Engineer',
    department: 'Rolling Stock Engineering',
    gradeBand: 'E2-E3',
    purpose: 'Engineer bogie frames, pneumatic braking, HVAC integration, and coupler systems for regional and metro trainsets.',
    responsibilities: [
      'Perform brake distance calculations, bogie kinematics, and piping routing',
      'Coordinate vendor type-testing for dampers, wheels, and brake calipers',
      'Support static and dynamic type tests at customer test tracks'
    ],
    skills: ['Bogie & Suspension Dynamics', 'UIC/EN Braking Standards', 'Pneumatic Schematics', 'Vampire Simulation'],
    qualifications: 'B.E./B.Tech in Mechanical Engineering; 3–8 years in rail rolling stock.',
    kpis: ['Type-Test Approval Rate', 'Supplier Technical Query SLA', 'BOM Accuracy %'],
    workingConditions: 'Office + Manufacturing Plant (Sri City) + Test Track.',
    tools: ['CATIA V5', 'Vampire Pro', 'AMESim', 'SAP MM/PLM'],
    successFactors: ['Zero braking distance deviations', 'Accurate BOM freeze'],
    careerPath: 'Senior Mechanical Lead / Bogie Platform Manager',
    objectives: [
      { title: 'Bogie & Brake System Validation', category: 'TECHNICAL', description: 'Complete EN 13749 bogie frame fatigue validation and brake blending curves.', measureKpi: 'Validation Reports Approved', target: '100% by Q3', weightage: 40 },
      { title: 'Vendor Localization Qualification', category: 'BUSINESS', description: 'Qualify 2 domestic Indian suppliers for secondary suspension components.', measureKpi: 'Qualified Suppliers', target: '2 Vendors', weightage: 25 },
      { title: 'BOM & ECR Cycle Time', category: 'TECHNICAL', description: 'Close Engineering Change Requests within 5 working days.', measureKpi: 'Avg ECR Closure', target: '<= 5 Days', weightage: 20 },
      { title: 'Acoustic & Vibration Modelling', category: 'DEVELOPMENT', description: 'Complete NVH simulation workshop and apply to current metro project.', measureKpi: 'Training & Application', target: 'Completed', weightage: 15 }
    ]
  },
  {
    id: 'tpl-7',
    title: 'Electrical / Traction Engineer',
    department: 'Traction & Electrical Systems',
    gradeBand: 'E2-E3',
    purpose: 'Design high-voltage propulsion converters, auxiliary power supply (APS), traction motors, and TCMS harnesses.',
    responsibilities: [
      'Design 25kV AC / 750V DC traction schematics and EMI/EMC routing',
      'Configure TCMS MVB/Ethernet vehicle bus signals and fault diagnostics',
      'Execute combined traction & motor test-bench trials'
    ],
    skills: ['25kV/750V Traction Systems', 'TCMS (IEC 61375)', 'E3.series Schematics', 'EMI/EMC EN 50121'],
    qualifications: 'B.Tech in Electrical / Power Electronics Engineering; 3–8 years experience.',
    kpis: ['Harness Routing Zero-Clash %', 'Combined Test Bench Pass Rate', 'Energy Regeneration Efficiency'],
    workingConditions: 'Engineering Office + High-Voltage Traction Lab.',
    tools: ['Zuken E3.series', 'MATLAB/Simulink', 'ControlDesk', 'CANalyzer'],
    successFactors: ['Clean EMI/EMC certification', 'Zero harness rework at plant'],
    careerPath: 'Lead Traction Architect / Electrical System Manager',
    objectives: [
      { title: 'Traction & TCMS Schematic Freeze', category: 'TECHNICAL', description: 'Release zero-error E3 electrical schematics and wire lists for trainset build.', measureKpi: 'Harness Rework Rate', target: '< 0.5%', weightage: 40 },
      { title: 'Regenerative Braking Efficiency', category: 'TECHNICAL', description: 'Tune inverter control parameters to maximize energy recovery.', measureKpi: 'Regen Efficiency %', target: '>= 32%', weightage: 25 },
      { title: 'EMI/EMC Pre-Compliance Testing', category: 'TECHNICAL', description: 'Pass EN 50121-3-2 lab tests on first attempt.', measureKpi: 'First-Attempt Pass', target: '100% Pass', weightage: 20 },
      { title: 'SiC Inverter Topology Mastery', category: 'DEVELOPMENT', description: 'Complete Silicon Carbide propulsion architecture certification.', measureKpi: 'Course Completion', target: 'Q4', weightage: 15 }
    ]
  },
  {
    id: 'tpl-8',
    title: 'Quality & Safety Engineer',
    department: 'Quality, EHS & RAMS',
    gradeBand: 'E2-E4',
    purpose: 'Enforce IRIS (ISO/TS 22163) quality standards, supplier quality audits, RAMS reliability targets, and workplace EHS compliance.',
    responsibilities: [
      'Lead 8D root-cause investigations and Non-Conformance Report (NCR) closures',
      'Conduct supplier process audits and IRIS internal compliance checks',
      'Monitor site EHS adherence and safety observations'
    ],
    skills: ['ISO/TS 22163 (IRIS)', '8D / Six Sigma Root Cause', 'RAMS EN 50126', 'EHS Auditing'],
    qualifications: 'B.E./B.Tech + Six Sigma Green/Black Belt or NEBOSH certification; 4–10 years experience.',
    kpis: ['NCR Closure SLA %', 'Cost of Poor Quality (COPQ) %', 'Supplier Audit Compliance'],
    workingConditions: 'Manufacturing Sites (Sri City/Savli) & Supplier Locations.',
    tools: ['SAP QM', 'Minitab', 'Alstom QMS Portal', 'PowerBI'],
    successFactors: ['Zero repeat customer NCRs', 'Proactive hazard elimination'],
    careerPath: 'Quality & EHS Manager / Regional RAMS Head',
    objectives: [
      { title: 'Cost of Poor Quality (COPQ) Reduction', category: 'BUSINESS', description: 'Reduce internal scrap and warranty rework costs across assigned lines.', measureKpi: 'COPQ % of Revenue', target: '<= 1.2%', weightage: 35 },
      { title: '8D NCR Closure Velocity', category: 'TECHNICAL', description: 'Close 95% of supplier and shop-floor NCRs with verified root cause within 15 days.', measureKpi: 'On-Time 8D Closure %', target: '>= 95%', weightage: 30 },
      { title: 'IRIS ISO/TS 22163 Surveillance Audit', category: 'TECHNICAL', description: 'Achieve zero major non-conformities in annual external IRIS audit.', measureKpi: 'Major NCs', target: '0', weightage: 20 },
      { title: 'Six Sigma Black Belt Project', category: 'DEVELOPMENT', description: 'Complete DMAIC project on welding distortion reduction.', measureKpi: 'Project Certification', target: 'Certified by Q4', weightage: 15 }
    ]
  },
  {
    id: 'tpl-9',
    title: 'HR Business Partner',
    department: 'Human Resources',
    gradeBand: 'E3-E4',
    purpose: 'Partner with engineering and plant leaders on talent retention, continuous performance adoption, workforce planning, and employee relations.',
    responsibilities: [
      'Drive 100% adoption of bi-monthly CPMS check-ins and annual calibration',
      'Manage critical engineering hiring, onboarding, and succession mapping',
      'Lead diversity & inclusion (Women in Rail) and employee engagement programs'
    ],
    skills: ['HR Business Partnering', 'Compensation & Calibration', 'Employee Relations', 'People Analytics'],
    qualifications: 'MBA / PGDM in Human Resources (MDI, XLRI, TISS, SCMHRD); 4–10 years experience.',
    kpis: ['CPMS Completion Rate %', 'Regrettable Attrition %', 'Time-to-Fill Critical Roles'],
    workingConditions: 'Corporate / Site HR Office (Bengaluru / Gurugram / Sri City).',
    tools: ['Workday / SAP SuccessFactors', 'Alstom CPMS', 'PowerBI HR', 'Excel'],
    successFactors: ['High manager coaching maturity', 'Fair and transparent calibrations'],
    careerPath: 'Senior HRBP / Country Talent & Culture Lead',
    objectives: [
      { title: 'CPMS Bi-Monthly Adoption', category: 'BUSINESS', description: 'Ensure >=98% completion of all 6 feedback sessions across assigned business units.', measureKpi: 'Session Completion %', target: '>= 98%', weightage: 35 },
      { title: 'Critical Engineering Retention', category: 'BUSINESS', description: 'Keep regrettable attrition among high-performing E2–E4 engineers below 7.5%.', measureKpi: 'Regrettable Attrition %', target: '<= 7.5%', weightage: 30 },
      { title: 'Diversity Hiring & Inclusion', category: 'BEHAVIOURAL', description: 'Achieve 32% women representation in campus and lateral engineering hires.', measureKpi: 'Gender Diversity Hire %', target: '>= 32%', weightage: 20 },
      { title: 'People Analytics Certification', category: 'DEVELOPMENT', description: 'Build predictive attrition dashboard for India engineering centers.', measureKpi: 'Dashboard Live', target: 'Q3', weightage: 15 }
    ]
  },
  {
    id: 'tpl-10',
    title: 'Finance Analyst / Manager',
    department: 'Finance & Controlling',
    gradeBand: 'E3-E5',
    purpose: 'Manage project controlling, EAC (Estimate at Completion) margin reviews, FX hedging compliance, and statutory financial reporting.',
    responsibilities: [
      'Partner with Project Directors on monthly CPR (Contract Performance Reviews)',
      'Monitor working capital, milestone billing, and milestone cash collection',
      'Ensure strict adherence to IFRS-15 revenue recognition and internal controls'
    ],
    skills: ['Project Controlling (IFRS 15)', 'SAP FI/CO', 'Cash Flow & FX Forecasting', 'Financial Modelling'],
    qualifications: 'Chartered Accountant (CA) / CMA / MBA Finance; 4–11 years experience.',
    kpis: ['Project Margin Accuracy', 'Overdue Receivables Reduction', 'Month-End Close SLA'],
    workingConditions: 'Corporate Finance Hub (Bengaluru / Gurugram).',
    tools: ['SAP S/4HANA FI/CO', 'Hyperion / OneStream', 'Advanced Excel', 'PowerBI'],
    successFactors: ['Zero audit adjustments', 'Proactive margin slippage alerts'],
    careerPath: 'Site Finance Controller / Country Finance Director',
    objectives: [
      { title: 'Contract Margin & EAC Governance', category: 'BUSINESS', description: 'Conduct monthly CPR reviews with zero unforecasted margin erosion > 50 bps.', measureKpi: 'CPR Variance (bps)', target: '<= 50 bps', weightage: 35 },
      { title: 'Overdue Receivables Collection', category: 'BUSINESS', description: 'Reduce metro customer DSO (Days Sales Outstanding) by 12 days.', measureKpi: 'DSO Reduction', target: '-12 Days', weightage: 30 },
      { title: 'IFRS-15 & Statutory Audit Compliance', category: 'TECHNICAL', description: 'Deliver clean internal and statutory audit with zero material weaknesses.', measureKpi: 'Audit Findings', target: '0 Material Findings', weightage: 20 },
      { title: 'SAP Analytics Cloud Automation', category: 'DEVELOPMENT', description: 'Automate monthly project cash-flow variance packs.', measureKpi: 'Close Time Saved', target: '-2 Days', weightage: 15 }
    ]
  }
];

const RAW_STAFF = [
  { code: 'ATPL-1001', first: 'Rajeshwar', last: 'Krishnamurthy', roleIdx: 0, desig: 'Managing Director & COO – India', dept: 'Executive Leadership', grade: 'E9', loc: 'Bengaluru', join: '2012-04-16', exp: 24, ctc: 9800000, mgr: null, sysRole: 'ADMIN_HR' as SystemRole, rating: 4.8 },
  { code: 'ATPL-1002', first: 'Ananya', last: 'Deshpande', roleIdx: 1, desig: 'VP – Rolling Stock Engineering', dept: 'Rolling Stock Engineering', grade: 'E7', loc: 'Bengaluru', join: '2014-08-11', exp: 19, ctc: 6400000, mgr: 'ATPL-1001', sysRole: 'MANAGER' as SystemRole, rating: 4.6 },
  { code: 'ATPL-1003', first: 'Vikramaditya', last: 'Nair', roleIdx: 1, desig: 'VP – Digital & Signalling Systems', dept: 'Digital & Integrated Systems', grade: 'E7', loc: 'Bengaluru', join: '2015-02-02', exp: 18, ctc: 6200000, mgr: 'ATPL-1001', sysRole: 'MANAGER' as SystemRole, rating: 4.7 },

  { code: 'ATPL-1004', first: 'Siddharth', last: 'Menon', roleIdx: 2, desig: 'Engineering Manager – Carbody & Interiors', dept: 'Rolling Stock Engineering', grade: 'E5', loc: 'Bengaluru', join: '2016-06-20', exp: 13, ctc: 3650000, mgr: 'ATPL-1002', sysRole: 'MANAGER' as SystemRole, rating: 4.4 },
  { code: 'ATPL-1005', first: 'Meenakshi', last: 'Subramanian', roleIdx: 2, desig: 'Engineering Manager – Bogie & Braking', dept: 'Rolling Stock Engineering', grade: 'E5', loc: 'Sri City', join: '2017-01-09', exp: 12, ctc: 3450000, mgr: 'ATPL-1002', sysRole: 'MANAGER' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1006', first: 'Aravind', last: 'Chakraborty', roleIdx: 2, desig: 'Engineering Manager – Urbalis CBTC & ATS', dept: 'Digital & Integrated Systems', grade: 'E5', loc: 'Bengaluru', join: '2016-11-14', exp: 14, ctc: 3800000, mgr: 'ATPL-1003', sysRole: 'MANAGER' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1007', first: 'Prashanth', last: 'Kulkarni', roleIdx: 2, desig: 'Engineering Manager – Traction & TCMS', dept: 'Traction & Electrical Systems', grade: 'E5', loc: 'Savli', join: '2017-07-03', exp: 12, ctc: 3500000, mgr: 'ATPL-1002', sysRole: 'MANAGER' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1008', first: 'Kavitha', last: 'Raghavan', roleIdx: 8, desig: 'Head – HR Business Partnering', dept: 'Human Resources', grade: 'E5', loc: 'Bengaluru', join: '2018-03-19', exp: 11, ctc: 3200000, mgr: 'ATPL-1001', sysRole: 'ADMIN_HR' as SystemRole, rating: 4.6 },
  { code: 'ATPL-1009', first: 'Nitin', last: 'Bhardwaj', roleIdx: 9, desig: 'Senior Manager – Project Controlling', dept: 'Finance & Controlling', grade: 'E5', loc: 'Delhi NCR', join: '2017-09-25', exp: 12, ctc: 3350000, mgr: 'ATPL-1001', sysRole: 'MANAGER' as SystemRole, rating: 4.4 },

  { code: 'ATPL-1010', first: 'Karthik', last: 'Venkatesh', roleIdx: 3, desig: 'Senior Design Engineer – Carbody', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2019-04-08', exp: 8, ctc: 2150000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1011', first: 'Divya', last: 'Nambiar', roleIdx: 3, desig: 'Senior Design Engineer – Interior Systems', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2020-01-13', exp: 7, ctc: 1980000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1012', first: 'Rohan', last: 'Joshi', roleIdx: 3, desig: 'Senior Design Engineer – Structural FEA', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2018-08-20', exp: 9, ctc: 2300000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.1 },
  { code: 'ATPL-1013', first: 'Sneha', last: 'Iyer', roleIdx: 5, desig: 'Rolling Stock Engineer – Cab Ergonomics', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Bengaluru', join: '2022-07-04', exp: 4, ctc: 1380000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 },
  { code: 'ATPL-1014', first: 'Abhishek', last: 'Tiwari', roleIdx: 5, desig: 'Rolling Stock Engineer – Gangway & Doors', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Savli', join: '2021-09-15', exp: 5, ctc: 1520000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.9 },
  { code: 'ATPL-1015', first: 'Pooja', last: 'Malhotra', roleIdx: 3, desig: 'Senior Design Engineer – Driver Desk', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2019-11-04', exp: 7.5, ctc: 2050000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1016', first: 'Harish', last: 'Gowda', roleIdx: 5, desig: 'Mechanical Engineer – Weldment Fixtures', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Sri City', join: '2023-02-13', exp: 3.5, ctc: 1260000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.8 },
  { code: 'ATPL-1017', first: 'Nandini', last: 'Pillai', roleIdx: 5, desig: 'Rolling Stock Engineer – HVAC Integration', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2020-06-01', exp: 6.5, ctc: 1890000, mgr: 'ATPL-1004', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.4 },

  { code: 'ATPL-1018', first: 'Suresh', last: 'Balasubramanian', roleIdx: 5, desig: 'Senior Mechanical Engineer – Bogie Frames', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Sri City', join: '2018-10-15', exp: 9, ctc: 2250000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1019', first: 'Deepika', last: 'Patil', roleIdx: 5, desig: 'Mechanical Engineer – Pneumatic Braking', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Sri City', join: '2021-05-10', exp: 5.5, ctc: 1580000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.1 },
  { code: 'ATPL-1020', first: 'Manoj', last: 'Varma', roleIdx: 5, desig: 'Mechanical Engineer – Wheelset & Bearings', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Sri City', join: '2022-08-22', exp: 4, ctc: 1350000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.7 },
  { code: 'ATPL-1021', first: 'Shweta', last: 'Kamble', roleIdx: 5, desig: 'Senior Mechanical Engineer – Couplers', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Bengaluru', join: '2019-07-15', exp: 8, ctc: 2100000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1022', first: 'Varun', last: 'Reddy', roleIdx: 5, desig: 'Mechanical Engineer – Suspension Dynamics', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Bengaluru', join: '2023-07-10', exp: 3, ctc: 1220000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 },
  { code: 'ATPL-1023', first: 'Gayathri', last: 'Krishnan', roleIdx: 3, desig: 'Senior Design Engineer – Underframe', dept: 'Rolling Stock Engineering', grade: 'E3', loc: 'Sri City', join: '2020-03-02', exp: 7, ctc: 1950000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.4 },
  { code: 'ATPL-1024', first: 'Ashwin', last: 'Shetty', roleIdx: 5, desig: 'Mechanical Engineer – Brake Rigging', dept: 'Rolling Stock Engineering', grade: 'E2', loc: 'Savli', join: '2024-01-15', exp: 2.5, ctc: 1150000, mgr: 'ATPL-1005', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.9 },

  { code: 'ATPL-1025', first: 'Ajay', last: 'Harikumar', roleIdx: 4, desig: 'Senior Signalling Engineer – ATS Integration', dept: 'Digital & Integrated Systems', grade: 'E3', loc: 'Bengaluru', join: '2022-06-15', exp: 4.5, ctc: 1850000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.6 },
  { code: 'ATPL-1026', first: 'Pranav', last: 'Mukherjee', roleIdx: 4, desig: 'Senior Signalling Engineer – Interlocking', dept: 'Digital & Integrated Systems', grade: 'E3', loc: 'Bengaluru', join: '2018-05-14', exp: 9.5, ctc: 2420000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1027', first: 'Lakshmi', last: 'Narayanan', roleIdx: 4, desig: 'Signalling Engineer – CBTC Radio & Wayside', dept: 'Digital & Integrated Systems', grade: 'E2', loc: 'Bengaluru', join: '2021-08-02', exp: 5, ctc: 1620000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1028', first: 'Gaurav', last: 'Saxena', roleIdx: 4, desig: 'Signalling Engineer – SCADA & HMI', dept: 'Digital & Integrated Systems', grade: 'E2', loc: 'Delhi NCR', join: '2020-09-14', exp: 6, ctc: 1740000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 },
  { code: 'ATPL-1029', first: 'Nivedita', last: 'Bose', roleIdx: 4, desig: 'Senior Signalling Engineer – V&V Safety', dept: 'Digital & Integrated Systems', grade: 'E3', loc: 'Bengaluru', join: '2019-02-18', exp: 8, ctc: 2280000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.4 },
  { code: 'ATPL-1030', first: 'Tarun', last: 'Kapoor', roleIdx: 4, desig: 'Signalling Engineer – Axle Counters & Balise', dept: 'Digital & Integrated Systems', grade: 'E2', loc: 'Mumbai', join: '2022-11-07', exp: 4, ctc: 1450000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.8 },
  { code: 'ATPL-1031', first: 'Revathi', last: 'Srinivasan', roleIdx: 4, desig: 'Signalling Engineer – Timetable & ATO', dept: 'Digital & Integrated Systems', grade: 'E2', loc: 'Bengaluru', join: '2023-06-19', exp: 3, ctc: 1320000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.1 },
  { code: 'ATPL-1032', first: 'Mohit', last: 'Agarwal', roleIdx: 4, desig: 'Signalling Engineer – Depot Commissioning', dept: 'Digital & Integrated Systems', grade: 'E3', loc: 'Delhi NCR', join: '2019-10-07', exp: 7.5, ctc: 2080000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1033', first: 'Keerthana', last: 'Mohan', roleIdx: 4, desig: 'Signalling Engineer – Cybersecurity', dept: 'Digital & Integrated Systems', grade: 'E2', loc: 'Bengaluru', join: '2024-07-01', exp: 2, ctc: 1200000, mgr: 'ATPL-1006', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 },

  { code: 'ATPL-1034', first: 'Venkatesh', last: 'Prasad', roleIdx: 6, desig: 'Senior Traction Engineer – Propulsion', dept: 'Traction & Electrical Systems', grade: 'E3', loc: 'Bengaluru', join: '2018-04-09', exp: 9.5, ctc: 2380000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1035', first: 'Ankita', last: 'Deshmukh', roleIdx: 6, desig: 'Electrical Engineer – TCMS Software', dept: 'Traction & Electrical Systems', grade: 'E3', loc: 'Bengaluru', join: '2020-02-10', exp: 6.5, ctc: 1960000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1036', first: 'Naveen', last: 'Chandra', roleIdx: 6, desig: 'Electrical Engineer – HV Harness & Routing', dept: 'Traction & Electrical Systems', grade: 'E2', loc: 'Savli', join: '2021-10-18', exp: 5, ctc: 1540000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.9 },
  { code: 'ATPL-1037', first: 'Pallavi', last: 'Kulkarni', roleIdx: 6, desig: 'Electrical Engineer – Auxiliary Power Supply', dept: 'Traction & Electrical Systems', grade: 'E2', loc: 'Bengaluru', join: '2022-04-11', exp: 4.5, ctc: 1460000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.1 },
  { code: 'ATPL-1038', first: 'Rakesh', last: 'Yadav', roleIdx: 6, desig: 'Electrical Engineer – Traction Motors', dept: 'Traction & Electrical Systems', grade: 'E3', loc: 'Savli', join: '2019-08-19', exp: 8, ctc: 2120000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1039', first: 'Soundarya', last: 'Rajan', roleIdx: 6, desig: 'Electrical Engineer – Battery & UPS', dept: 'Traction & Electrical Systems', grade: 'E2', loc: 'Sri City', join: '2023-09-04', exp: 3, ctc: 1280000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 },
  { code: 'ATPL-1040', first: 'Sandeep', last: 'Verma', roleIdx: 6, desig: 'Electrical Engineer – Pantograph & Roof HV', dept: 'Traction & Electrical Systems', grade: 'E2', loc: 'Savli', join: '2021-01-25', exp: 5.5, ctc: 1600000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.6 },
  { code: 'ATPL-1041', first: 'Chitra', last: 'Venkataraman', roleIdx: 6, desig: 'Electrical Engineer – EMI/EMC Compliance', dept: 'Traction & Electrical Systems', grade: 'E3', loc: 'Bengaluru', join: '2020-11-09', exp: 6, ctc: 1900000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.4 },

  { code: 'ATPL-1042', first: 'Ritika', last: 'Sen', roleIdx: 8, desig: 'HR Business Partner – Engineering', dept: 'Human Resources', grade: 'E3', loc: 'Bengaluru', join: '2021-03-15', exp: 6, ctc: 1820000, mgr: 'ATPL-1008', sysRole: 'ADMIN_HR' as SystemRole, rating: 4.4 },
  { code: 'ATPL-1043', first: 'Abhinav', last: 'Kaul', roleIdx: 8, desig: 'HR Business Partner – Manufacturing Sites', dept: 'Human Resources', grade: 'E3', loc: 'Sri City', join: '2020-07-20', exp: 6.5, ctc: 1780000, mgr: 'ATPL-1008', sysRole: 'ADMIN_HR' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1044', first: 'Madhuri', last: 'Patwardhan', roleIdx: 8, desig: 'Talent & Performance Specialist', dept: 'Human Resources', grade: 'E2', loc: 'Bengaluru', join: '2023-05-08', exp: 3.5, ctc: 1350000, mgr: 'ATPL-1008', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.1 },

  { code: 'ATPL-1045', first: 'Subramanian', last: 'Swaminathan', roleIdx: 9, desig: 'Lead Finance Controller – Metro Projects', dept: 'Finance & Controlling', grade: 'E4', loc: 'Bengaluru', join: '2018-12-03', exp: 9, ctc: 2550000, mgr: 'ATPL-1009', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1046', first: 'Neha', last: 'Chaturvedi', roleIdx: 9, desig: 'Finance Analyst – FP&A and Treasury', dept: 'Finance & Controlling', grade: 'E3', loc: 'Delhi NCR', join: '2021-06-14', exp: 5.5, ctc: 1760000, mgr: 'ATPL-1009', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.2 },
  { code: 'ATPL-1047', first: 'Kiran', last: 'Hegde', roleIdx: 9, desig: 'Plant Finance Analyst – Costing', dept: 'Finance & Controlling', grade: 'E2', loc: 'Savli', join: '2022-10-10', exp: 4, ctc: 1420000, mgr: 'ATPL-1009', sysRole: 'EMPLOYEE' as SystemRole, rating: 3.9 },

  { code: 'ATPL-1048', first: 'Balaji', last: 'Sundaram', roleIdx: 7, desig: 'Lead Quality & IRIS Auditor', dept: 'Quality, EHS & RAMS', grade: 'E4', loc: 'Sri City', join: '2017-04-17', exp: 11, ctc: 2600000, mgr: 'ATPL-1002', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.5 },
  { code: 'ATPL-1049', first: 'Anuradha', last: 'Menon', roleIdx: 7, desig: 'RAMS & Safety Assurance Engineer', dept: 'Quality, EHS & RAMS', grade: 'E3', loc: 'Bengaluru', join: '2020-08-24', exp: 6.5, ctc: 1940000, mgr: 'ATPL-1003', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.3 },
  { code: 'ATPL-1050', first: 'Devendra', last: 'Solanki', roleIdx: 7, desig: 'Site EHS & Supplier Quality Engineer', dept: 'Quality, EHS & RAMS', grade: 'E2', loc: 'Savli', join: '2023-01-09', exp: 4, ctc: 1390000, mgr: 'ATPL-1007', sysRole: 'EMPLOYEE' as SystemRole, rating: 4.0 }
];

export function generateInitialEmployees(): EmployeeRecord[] {
  const sessionLabels = [
    'Session 1 (Apr–May)',
    'Session 2 (Jun–Jul)',
    'Session 3 (Aug–Sep)',
    'Session 4 (Oct–Nov)',
    'Session 5 (Dec–Jan)',
    'Session 6 (Feb–Mar)'
  ];
  const sessionDates = ['2026-05-22', '2026-07-24', '2026-09-25', '2026-11-26', '2027-01-22', '2027-03-19'];

  return RAW_STAFF.map((s, idx) => {
    const tpl = ROLE_TEMPLATES[s.roleIdx];
    const mgrObj = RAW_STAFF.find((m) => m.code === s.mgr);
    const mgrName = mgrObj ? `${mgrObj.first} ${mgrObj.last} (${mgrObj.code})` : 'Global Executive Board';

    const cycleStatus: CycleStatus =
      idx % 9 === 0 ? 'OVERDUE' : idx % 4 === 0 ? 'PENDING' : 'IN_PROGRESS';

    const sessions: FeedbackSessionItem[] = [1, 2, 3, 4, 5, 6].map((num) => {
      let st: CycleStatus = 'UPCOMING';
      if (num <= 2) {
        st = idx % 11 === 0 && num === 2 ? 'OVERDUE' : 'COMPLETED';
      } else if (num === 3) {
        st = idx % 3 === 0 ? 'COMPLETED' : idx % 3 === 1 ? 'PENDING' : 'OVERDUE';
      } else if (num === 4) {
        st = idx % 2 === 0 ? 'PENDING' : 'UPCOMING';
      }
      const isDone = st === 'COMPLETED';
      return {
        sessionNumber: num,
        label: sessionLabels[num - 1],
        scheduledDate: sessionDates[num - 1],
        completedDate: isDone ? sessionDates[num - 1] : null,
        status: st,
        participants: [`${s.first} ${s.last}`, mgrName],
        objectiveReview: isDone
          ? `Reviewed Session ${num} KPI progress across weighted goals; subsystem milestones tracking ahead of gate review.`
          : '',
        achievements: isDone
          ? 'Completed CENELEC design validation checks with zero critical NCRs; supported FAT bench integration.'
          : '',
        challenges: isDone
          ? 'Minor hardware test-bench slot contention during peak sprint; mitigated via overnight automated regression runs.'
          : '',
        managerFeedback: isDone
          ? 'Demonstrates high technical ownership and zero-deviation safety mindset. Continue mentoring junior engineers.'
          : '',
        employeeReflection: isDone
          ? 'Strengthened cross-functional coordination with site commissioning teams; targeting domain certification next quarter.'
          : '',
        competencyRatings: {
          'Safety & Zero-Deviation Mindset': isDone ? 5 : 0,
          'Technical & Engineering Rigor': isDone ? 4 : 0,
          'Customer & Delivery Focus': isDone ? 4 : 0,
          'Collaboration & Agility': isDone ? 4 : 0,
          'Innovation & Digital Mindset': isDone ? 4 : 0
        },
        actionItems: isDone
          ? [
              { task: 'Finalize Interface Control Document (ICD) Rev-C', owner: `${s.first} ${s.last}`, dueDate: '2026-10-15', status: 'Completed' },
              { task: 'Lead peer design review for next subsystem release', owner: mgrName, dueDate: '2026-11-30', status: 'In Progress' }
            ]
          : [],
        developmentPlan: isDone ? 'Complete IRSE / Six Sigma module and shadow lead architect on upcoming tender.' : '',
        overallRating: isDone ? s.rating : null,
        employeeAck: isDone,
        managerAck: isDone
      };
    });

    return {
      id: `emp-${idx + 1}`,
      employeeCode: s.code,
      email: `${s.first.toLowerCase()}.${s.last.toLowerCase()}@alstomgroup-demo.in`,
      firstName: s.first,
      lastName: s.last,
      designation: s.desig,
      department: s.dept,
      grade: s.grade,
      location: s.loc,
      joiningDate: s.join,
      totalExperience: s.exp,
      currentCtc: s.ctc,
      lastRating: s.rating,
      cycleStatus,
      status: 'ACTIVE',
      managerCode: s.mgr,
      sysRole: s.sysRole,
      roleTemplateId: tpl.id,
      jd: {
        jobTitle: s.desig,
        purpose: tpl.purpose,
        reportingLine: mgrName,
        responsibilities: [...tpl.responsibilities],
        skills: [...tpl.skills],
        qualifications: tpl.qualifications,
        kpis: [...tpl.kpis],
        workingConditions: tpl.workingConditions,
        tools: [...tpl.tools],
        successFactors: [...tpl.successFactors],
        careerPath: tpl.careerPath,
        version: 1,
        history: [
          {
            version: 1,
            date: '2026-04-01',
            editedBy: 'Kavitha Raghavan (HRBP)',
            note: 'Initial FY 2026-27 role baseline from Alstom Competency Library',
            purpose: tpl.purpose
          }
        ]
      },
      objectives: tpl.objectives.map((o, oIdx) => ({
        id: `${s.code}-obj-${oIdx + 1}`,
        title: o.title,
        category: o.category,
        description: o.description,
        measureKpi: o.measureKpi,
        target: o.target,
        weightage: o.weightage,
        timeline: 'Apr 2026 – Mar 2027',
        progress: Math.min(96, 48 + ((idx * 7 + oIdx * 13) % 44)),
        status: 'IN_PROGRESS',
        selfRating: Number((3.8 + ((idx + oIdx) % 12) * 0.1).toFixed(1)),
        managerRating: Number((3.7 + ((idx + oIdx) % 11) * 0.1).toFixed(1)),
        approvedByMgr: true
      })),
      sessions,
      appraisal: {
        selfSummary: 'Delivered all assigned metro & mainline subsystem milestones on schedule with zero safety deviations.',
        selfRating: s.rating,
        managerSummary: 'Consistently high engineering rigor and reliable delivery across critical project gates.',
        managerRating: s.rating,
        hrCalibrationNotes: 'Aligned with Grade band bell-curve calibration guidelines.',
        finalRating: s.rating,
        promotionRecommended: idx % 7 === 0,
        recommendedDesignation: idx % 7 === 0 ? `Lead ${s.desig}` : s.desig,
        incrementPercentage: s.rating >= 4.5 ? 12.5 : s.rating >= 4.1 ? 9.5 : 7.5,
        status: 'IN_PROGRESS'
      },
      history: [
        {
          year: '2025-26',
          finalRating: s.rating,
          incrementPct: s.rating >= 4.5 ? 12.0 : 9.0,
          promoted: idx % 6 === 0,
          designation: s.desig,
          ctcAtTime: Math.round(s.ctc / 1.1),
          remarks: 'Strong execution on CENELEC quality gates and cross-site coordination.'
        },
        {
          year: '2024-25',
          finalRating: Number(Math.max(3.4, s.rating - 0.2).toFixed(1)),
          incrementPct: 8.5,
          promoted: false,
          designation: s.desig,
          ctcAtTime: Math.round(s.ctc / 1.19),
          remarks: 'Solid contribution to India localization and FAT milestones.'
        }
      ],
      awards: idx % 3 === 0 ? [{ title: 'Alstom Zero-Deviation Safety Champion', quarter: 'Q1 FY26-27', description: 'Recognized for proactive hazard identification during FAT bench trials.' }] : [],
      trainings: [
        { title: 'CENELEC EN 50126/50128/50129 Rail Safety Lifecycle', provider: 'Alstom University', date: '2026-06-12', hours: 16 },
        { title: 'APSYS Lean Engineering & Continuous Improvement', provider: 'Alstom Academy India', date: '2026-08-05', hours: 12 }
      ],
      privateNotes: []
    };
  });
}
