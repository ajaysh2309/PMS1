'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  LayoutDashboard, Users, BookOpen, Settings, FileBarChart, ShieldCheck,
  Search, Bell, Download, Plus, Upload, CheckCircle2, Clock, AlertTriangle,
  Calendar, ChevronRight, ArrowLeft, Edit3, Save, History, Award,
  Briefcase, Target, MessageSquare, FileText, Lock, RefreshCw, Send,
  Building2, MapPin, TrendingUp, Filter, X, Check
} from 'lucide-react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid,
  LineChart, Line, AreaChart, Area, Cell
} from 'recharts';
import {
  generateInitialEmployees,
  ROLE_TEMPLATES,
  EmployeeRecord,
  RoleTemplateData,
  SystemRole,
  CycleStatus,
  ObjectiveCategory
} from '@/data/seedData';

const STORAGE_KEY = 'alstom_cpms_employees_v1';
const TEMPLATES_KEY = 'alstom_cpms_templates_v1';
const AUDIT_KEY = 'alstom_cpms_audit_v1';

interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: SystemRole;
  action: string;
  target: string;
}

const StatusBadge = ({ status }: { status: CycleStatus }) => {
  const styles: Record<CycleStatus, string> = {
    COMPLETED: 'bg-[#1E8E5A]/15 text-[#1E8E5A] border-[#1E8E5A]/30',
    IN_PROGRESS: 'bg-[#1F4FB2]/15 text-[#1F4FB2] border-[#1F4FB2]/30',
    PENDING: 'bg-[#F2A900]/15 text-[#9A6700] border-[#F2A900]/40',
    OVERDUE: 'bg-[#E4002B]/15 text-[#E4002B] border-[#E4002B]/30',
    UPCOMING: 'bg-slate-100 text-slate-600 border-slate-300',
  };
  const labels: Record<CycleStatus, string> = {
    COMPLETED: 'Completed',
    IN_PROGRESS: 'In Progress',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    UPCOMING: 'Upcoming',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
};

export default function AlstomCPMSApp() {
  const [employees, setEmployees] = useState<EmployeeRecord[]>([]);
  const [templates, setTemplates] = useState<RoleTemplateData[]>(ROLE_TEMPLATES);
  const [auditLogs, setAuditLogs] = useState<AuditEntry[]>([]);
  const [loaded, setLoaded] = useState(false);

  // Role-based access state
  const [currentRole, setCurrentRole] = useState<SystemRole>('ADMIN_HR');
  const [activeNav, setActiveNav] = useState<'dashboard' | 'directory' | 'library' | 'reports' | 'settings' | 'audit'>('dashboard');
  const [selectedEmpCode, setSelectedEmpCode] = useState<string | null>(null);
  const [profileTab, setProfileTab] = useState<'overview' | 'jd' | 'objectives' | 'sessions' | 'appraisal' | 'history' | 'notes'>('overview');
  const [selectedSessionNum, setSelectedSessionNum] = useState<number>(1);

  // Filters & Search
  const [globalSearch, setGlobalSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [locationFilter, setLocationFilter] = useState('ALL');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Modals & Toasts
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const [editingJD, setEditingJD] = useState(false);
  const [jdDraftPurpose, setJdDraftPurpose] = useState('');
  const [jdChangeNote, setJdChangeNote] = useState('');

  // Cycle Settings state
  const [cycleYear, setCycleYear] = useState('2026-27');
  const [require100Weight, setRequire100Weight] = useState(true);

  const notify = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  const logAudit = (action: string, target: string) => {
    const actorMap: Record<SystemRole, string> = {
      ADMIN_HR: 'Kavitha Raghavan (ATPL-1008)',
      MANAGER: 'Aravind Chakraborty (ATPL-1006)',
      EMPLOYEE: 'Ajay Harikumar (ATPL-1025)',
    };
    const entry: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN'),
      actor: actorMap[currentRole],
      role: currentRole,
      action,
      target,
    };
    setAuditLogs((prev) => {
      const updated = [entry, ...prev];
      localStorage.setItem(AUDIT_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  useEffect(() => {
    const savedEmp = localStorage.getItem(STORAGE_KEY);
    const savedTpl = localStorage.getItem(TEMPLATES_KEY);
    const savedAud = localStorage.getItem(AUDIT_KEY);
    if (savedEmp) {
      setEmployees(JSON.parse(savedEmp));
    } else {
      const initial = generateInitialEmployees();
      setEmployees(initial);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    }
    if (savedTpl) setTemplates(JSON.parse(savedTpl));
    if (savedAud) {
      setAuditLogs(JSON.parse(savedAud));
    } else {
      setAuditLogs([
        { id: 'aud-1', timestamp: '15 Nov 2026, 10:15 AM', actor: 'Kavitha Raghavan (ATPL-1008)', role: 'ADMIN_HR', action: 'CYCLE_INITIALIZED', target: 'FY 2026-27 Appraisal Cycle (50 Employees)' },
        { id: 'aud-2', timestamp: '15 Nov 2026, 02:40 PM', actor: 'Aravind Chakraborty (ATPL-1006)', role: 'MANAGER', action: 'SESSION_SIGNED', target: 'Ajay Harikumar (ATPL-1025) – Session 2' },
      ]);
    }
    setLoaded(true);
  }, []);

  const persistEmployees = (next: EmployeeRecord[]) => {
    setEmployees(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const handleResetDemo = () => {
    const fresh = generateInitialEmployees();
    persistEmployees(fresh);
    setTemplates(ROLE_TEMPLATES);
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(ROLE_TEMPLATES));
    logAudit('RESET_DEMO_DATA', 'All 50 Employee Records & 10 Role Templates');
    notify('Demo database reset to initial 50 Alstom employees.');
  };

  // Role-scoped visible employees
  const visibleEmployees = useMemo(() => {
    if (currentRole === 'ADMIN_HR') return employees;
    if (currentRole === 'MANAGER') {
      return employees.filter((e) => e.managerCode === 'ATPL-1006' || e.employeeCode === 'ATPL-1006');
    }
    return employees.filter((e) => e.employeeCode === 'ATPL-1025');
  }, [employees, currentRole]);

  const filteredEmployees = useMemo(() => {
    return visibleEmployees.filter((e) => {
      const q = globalSearch.toLowerCase();
      const matchesSearch =
        !q ||
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.employeeCode.toLowerCase().includes(q) ||
        e.designation.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q);
      const matchesDept = deptFilter === 'ALL' || e.department === deptFilter;
      const matchesStatus = statusFilter === 'ALL' || e.cycleStatus === statusFilter;
      const matchesLoc = locationFilter === 'ALL' || e.location === locationFilter;
      return matchesSearch && matchesDept && matchesStatus && matchesLoc;
    });
  }, [visibleEmployees, globalSearch, deptFilter, statusFilter, locationFilter]);

  const departments = useMemo(() => Array.from(new Set(employees.map((e) => e.department))), [employees]);
  const locations = useMemo(() => Array.from(new Set(employees.map((e) => e.location))), [employees]);

  // Dashboard Metrics
  const kpiStats = useMemo(() => {
    const total = visibleEmployees.length;
    const allSessions = visibleEmployees.flatMap((e) => e.sessions);
    const completed = allSessions.filter((s) => s.status === 'COMPLETED').length;
    const pending = allSessions.filter((s) => s.status === 'PENDING').length;
    const overdue = allSessions.filter((s) => s.status === 'OVERDUE').length;
    const avgRating = total
      ? (visibleEmployees.reduce((acc, e) => acc + e.lastRating, 0) / total).toFixed(2)
      : '0.00';
    const allObjs = visibleEmployees.flatMap((e) => e.objectives);
    const avgObjProgress = allObjs.length
      ? Math.round(allObjs.reduce((acc, o) => acc + o.progress, 0) / allObjs.length)
      : 0;
    return { total, completed, pending, overdue, avgRating, avgObjProgress };
  }, [visibleEmployees]);

  const sessionChartData = useMemo(() => {
    return [1, 2, 3, 4, 5, 6].map((num) => {
      const total = visibleEmployees.length || 1;
      const done = visibleEmployees.filter((e) => e.sessions[num - 1]?.status === 'COMPLETED').length;
      const overdue = visibleEmployees.filter((e) => e.sessions[num - 1]?.status === 'OVERDUE').length;
      return {
        name: `Session ${num}`,
        Completion: Math.round((done / total) * 100),
        Overdue: Math.round((overdue / total) * 100),
      };
    });
  }, [visibleEmployees]);

  const deptChartData = useMemo(() => {
    return departments.map((dept) => {
      const group = visibleEmployees.filter((e) => e.department === dept);
      const objs = group.flatMap((e) => e.objectives);
      const progress = objs.length ? Math.round(objs.reduce((a, b) => a + b.progress, 0) / objs.length) : 0;
      return {
        department: dept.replace(' Engineering', '').replace(' & Integrated Systems', ''),
        Progress: progress,
        Headcount: group.length,
      };
    });
  }, [visibleEmployees, departments]);

  const ratingDistribution = useMemo(() => {
    const buckets = [
      { band: '3.0–3.5', count: 0 },
      { band: '3.6–3.9', count: 0 },
      { band: '4.0–4.2', count: 0 },
      { band: '4.3–4.5', count: 0 },
      { band: '4.6–5.0', count: 0 },
    ];
    visibleEmployees.forEach((e) => {
      if (e.lastRating <= 3.5) buckets[0].count++;
      else if (e.lastRating <= 3.9) buckets[1].count++;
      else if (e.lastRating <= 4.2) buckets[2].count++;
      else if (e.lastRating <= 4.5) buckets[3].count++;
      else buckets[4].count++;
    });
    return buckets;
  }, [visibleEmployees]);

  const exportCSV = () => {
    const headers = ['Employee ID', 'Name', 'Designation', 'Department', 'Grade', 'Location', 'Joining Date', 'CTC (INR)', 'Last Rating', 'Cycle Status'];
    const rows = filteredEmployees.map((e) => [
      e.employeeCode,
      `"${e.firstName} ${e.lastName}"`,
      `"${e.designation}"`,
      `"${e.department}"`,
      e.grade,
      e.location,
      e.joiningDate,
      e.currentCtc,
      e.lastRating,
      e.cycleStatus,
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Alstom_CPMS_Report_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    logAudit('EXPORT_CSV_REPORT', `${filteredEmployees.length} Employee Records`);
    notify('Exported CPMS report to CSV.');
  };

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.employeeCode === selectedEmpCode) || null,
    [employees, selectedEmpCode]
  );

  const updateSelectedEmployee = (updater: (emp: EmployeeRecord) => EmployeeRecord) => {
    if (!selectedEmployee) return;
    const next = employees.map((e) => (e.employeeCode === selectedEmployee.employeeCode ? updater(e) : e));
    persistEmployees(next);
  };

  // Add Employee Form State
  const [newEmp, setNewEmp] = useState({
    firstName: '',
    lastName: '',
    department: 'Digital & Integrated Systems',
    designation: 'Signalling Engineer – ATS',
    roleTemplateId: 'tpl-5',
    grade: 'E3',
    managerCode: 'ATPL-1006',
    location: 'Bengaluru',
    joiningDate: '2026-11-01',
    totalExperience: 5,
    currentCtc: 1800000,
  });

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmp.firstName || !newEmp.lastName) return;
    const nextNum = 1001 + employees.length;
    const code = `ATPL-${nextNum}`;
    const tpl = templates.find((t) => t.id === newEmp.roleTemplateId) || templates[0];
    const mgr = employees.find((m) => m.employeeCode === newEmp.managerCode);
    const mgrLabel = mgr ? `${mgr.firstName} ${mgr.lastName} (${mgr.employeeCode})` : 'Executive Board';

    const created: EmployeeRecord = {
      id: `emp-${Date.now()}`,
      employeeCode: code,
      email: `${newEmp.firstName.toLowerCase()}.${newEmp.lastName.toLowerCase()}@alstomgroup-demo.in`,
      firstName: newEmp.firstName,
      lastName: newEmp.lastName,
      designation: newEmp.designation,
      department: newEmp.department,
      grade: newEmp.grade,
      location: newEmp.location,
      joiningDate: newEmp.joiningDate,
      totalExperience: Number(newEmp.totalExperience),
      currentCtc: Number(newEmp.currentCtc),
      lastRating: 4.0,
      cycleStatus: 'IN_PROGRESS',
      status: 'ACTIVE',
      managerCode: newEmp.managerCode || null,
      sysRole: 'EMPLOYEE',
      roleTemplateId: tpl.id,
      jd: {
        jobTitle: newEmp.designation,
        purpose: tpl.purpose,
        reportingLine: mgrLabel,
        responsibilities: [...tpl.responsibilities],
        skills: [...tpl.skills],
        qualifications: tpl.qualifications,
        kpis: [...tpl.kpis],
        workingConditions: tpl.workingConditions,
        tools: [...tpl.tools],
        successFactors: [...tpl.successFactors],
        careerPath: tpl.careerPath,
        version: 1,
        history: [{ version: 1, date: new Date().toISOString().slice(0, 10), editedBy: 'HR Admin', note: 'Auto-generated from Role Template', purpose: tpl.purpose }],
      },
      objectives: tpl.objectives.map((o, idx) => ({
        id: `${code}-obj-${idx + 1}`,
        title: o.title,
        category: o.category,
        description: o.description,
        measureKpi: o.measureKpi,
        target: o.target,
        weightage: o.weightage,
        timeline: 'Apr 2026 – Mar 2027',
        progress: 0,
        status: 'PENDING',
        selfRating: 0,
        managerRating: 0,
        approvedByMgr: false,
      })),
      sessions: [1, 2, 3, 4, 5, 6].map((num) => ({
        sessionNumber: num,
        label: `Session ${num}`,
        scheduledDate: `2026-0${Math.min(9, num + 3)}-25`,
        completedDate: null,
        status: num === 1 ? 'PENDING' : 'UPCOMING',
        participants: [`${newEmp.firstName} ${newEmp.lastName}`, mgrLabel],
        objectiveReview: '',
        achievements: '',
        challenges: '',
        managerFeedback: '',
        employeeReflection: '',
        competencyRatings: {
          'Safety & Zero-Deviation Mindset': 0,
          'Technical & Engineering Rigor': 0,
          'Customer & Delivery Focus': 0,
          'Collaboration & Agility': 0,
          'Innovation & Digital Mindset': 0,
        },
        actionItems: [],
        developmentPlan: '',
        overallRating: null,
        employeeAck: false,
        managerAck: false,
      })),
      appraisal: {
        selfSummary: '',
        selfRating: 0,
        managerSummary: '',
        managerRating: 0,
        hrCalibrationNotes: '',
        finalRating: 0,
        promotionRecommended: false,
        recommendedDesignation: newEmp.designation,
        incrementPercentage: 0,
        status: 'PENDING',
      },
      history: [],
      awards: [],
      trainings: [],
      privateNotes: [],
    };

    persistEmployees([created, ...employees]);
    logAudit('CREATE_EMPLOYEE', `${created.firstName} ${created.lastName} (${code})`);
    setShowAddModal(false);
    notify(`Created ${created.firstName} ${created.lastName} (${code}) with auto-populated JD, Objectives & 6 Sessions.`);
  };

  if (!loaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F4F6FA]">
        <div className="text-[#0A2A6B] font-semibold animate-pulse">Loading Alstom Transport CPMS...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F6FA] text-[#1B2430]">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0A2A6B] text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 border border-white/15">
          <CheckCircle2 className="w-5 h-5 text-[#4DA3FF]" />
          <span className="text-sm font-medium">{toastMsg}</span>
        </div>
      )}

      <div className="flex flex-1">
        {/* Left Sidebar */}
        <aside className="w-64 bg-[#0A2A6B] text-white flex flex-col shrink-0 no-print">
          <div className="p-5 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center font-extrabold text-[#0A2A6B] text-lg tracking-tight">
                A
              </div>
              <div>
                <div className="font-bold tracking-wide text-base leading-tight">ALSTOM</div>
                <div className="text-[11px] text-blue-200 uppercase tracking-wider">India CPMS Portal</div>
              </div>
            </div>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {[
              { id: 'dashboard', label: 'Executive Dashboard', icon: LayoutDashboard },
              { id: 'directory', label: 'Employee Directory', icon: Users },
              { id: 'library', label: 'Objectives Library', icon: BookOpen },
              { id: 'reports', label: 'Analytics & Reports', icon: FileBarChart },
              { id: 'audit', label: 'Governance Audit Log', icon: ShieldCheck },
              { id: 'settings', label: 'Cycle & Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const active = activeNav === item.id && !selectedEmpCode;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedEmpCode(null);
                    setActiveNav(item.id as typeof activeNav);
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition ${
                    active ? 'bg-[#1F4FB2] text-white shadow-sm' : 'text-blue-100 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-white/10 space-y-3">
            <div className="bg-white/10 rounded-lg p-3 text-xs">
              <div className="text-blue-200 mb-1">Active Appraisal Cycle</div>
              <div className="font-semibold text-white">FY {cycleYear} (6 Check-ins)</div>
            </div>
            {currentRole === 'ADMIN_HR' && (
              <button
                onClick={handleResetDemo}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-medium text-blue-100 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Demo Data (50 Staff)
              </button>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Header Bar */}
          <header className="h-16 bg-white border-b border-[#D9DEE8] px-6 flex items-center justify-between gap-4 sticky top-0 z-20 no-print">
            <div className="relative w-80 max-w-full">
              <Search className="w-4 h-4 text-[#5B6677] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                placeholder="Search by Name, ATPL ID, or Role..."
                className="w-full pl-9 pr-3 py-1.5 text-sm bg-[#F4F6FA] border border-[#D9DEE8] rounded-lg focus:outline-none focus:border-[#1F4FB2]"
              />
            </div>

            <div className="flex items-center gap-4">
              {/* Role Switcher for Testing RBAC */}
              <div className="flex items-center gap-2 bg-[#F4F6FA] border border-[#D9DEE8] rounded-lg px-2.5 py-1">
                <span className="text-xs font-medium text-[#5B6677]">View as Role:</span>
                <select
                  value={currentRole}
                  onChange={(e) => {
                    const r = e.target.value as SystemRole;
                    setCurrentRole(r);
                    setSelectedEmpCode(r === 'EMPLOYEE' ? 'ATPL-1025' : null);
                    notify(`Switched RBAC session to ${r}`);
                  }}
                  className="text-xs font-semibold text-[#0A2A6B] bg-transparent focus:outline-none cursor-pointer"
                >
                  <option value="ADMIN_HR">Admin / HR (Kavitha R.)</option>
                  <option value="MANAGER">Manager (Aravind C. – CBTC)</option>
                  <option value="EMPLOYEE">Employee (Ajay H. – ATPL-1025)</option>
                </select>
              </div>

              <button
                onClick={() => notify('3 pending bi-monthly session acknowledgements require attention.')}
                className="relative p-2 rounded-lg hover:bg-[#F4F6FA] text-[#5B6677]"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E4002B]" />
              </button>

              <div className="flex items-center gap-2.5 pl-2 border-l border-[#D9DEE8]">
                <div className="w-8 h-8 rounded-full bg-[#0A2A6B] text-white flex items-center justify-center text-xs font-bold">
                  {currentRole === 'ADMIN_HR' ? 'KR' : currentRole === 'MANAGER' ? 'AC' : 'AH'}
                </div>
                <div className="hidden md:block text-left">
                  <div className="text-xs font-semibold text-[#1B2430]">
                    {currentRole === 'ADMIN_HR' ? 'Kavitha Raghavan' : currentRole === 'MANAGER' ? 'Aravind Chakraborty' : 'Ajay Harikumar'}
                  </div>
                  <div className="text-[11px] text-[#5B6677]">{currentRole}</div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Workspace */}
          <main className="flex-1 p-6 max-w-[1440px] w-full mx-auto space-y-6">
            {/* EMPLOYEE PROFILE VIEW */}
            {selectedEmployee ? (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setSelectedEmpCode(null)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#1F4FB2] hover:underline"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to {activeNav === 'dashboard' ? 'Dashboard' : 'Directory'}
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-white border border-[#D9DEE8] rounded-lg hover:bg-slate-50"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Print / Export Profile PDF
                  </button>
                </div>

                {/* Employee Header Strip */}
                <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-xl bg-[#0A2A6B] text-white flex items-center justify-center text-xl font-bold">
                        {selectedEmployee.firstName[0]}{selectedEmployee.lastName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <h1 className="text-xl font-bold text-[#0A2A6B]">
                            {selectedEmployee.firstName} {selectedEmployee.lastName}
                          </h1>
                          <span className="px-2.5 py-0.5 rounded bg-[#F4F6FA] border border-[#D9DEE8] text-xs font-mono font-semibold">
                            {selectedEmployee.employeeCode}
                          </span>
                          <span className="px-2.5 py-0.5 rounded bg-blue-50 text-[#1F4FB2] text-xs font-semibold">
                            Grade {selectedEmployee.grade}
                          </span>
                          <StatusBadge status={selectedEmployee.cycleStatus} />
                        </div>
                        <p className="text-sm font-medium text-[#1B2430] mt-1">{selectedEmployee.designation}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-[#5B6677] mt-2">
                          <span className="inline-flex items-center gap-1"><Building2 className="w-3.5 h-3.5" /> {selectedEmployee.department}</span>
                          <span className="inline-flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {selectedEmployee.location}</span>
                          <span className="inline-flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Joined {selectedEmployee.joiningDate} ({selectedEmployee.totalExperience} yrs exp)</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 bg-[#F4F6FA] p-3.5 rounded-xl border border-[#D9DEE8]">
                      <div>
                        <div className="text-[11px] text-[#5B6677] uppercase">Current CTC</div>
                        <div className="text-sm font-bold text-[#1B2430]">₹{(selectedEmployee.currentCtc / 100000).toFixed(2)} LPA</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5B6677] uppercase">Last Rating</div>
                        <div className="text-sm font-bold text-[#1E8E5A]">{selectedEmployee.lastRating} / 5.0</div>
                      </div>
                      <div>
                        <div className="text-[11px] text-[#5B6677] uppercase">Reporting To</div>
                        <div className="text-xs font-semibold text-[#1B2430] truncate max-w-[140px]">{selectedEmployee.jd.reportingLine}</div>
                      </div>
                    </div>
                  </div>

                  {/* 7 Profile Tabs */}
                  <div className="flex items-center gap-1 border-t border-[#D9DEE8] mt-5 pt-3 overflow-x-auto">
                    {[
                      { id: 'overview', label: 'Overview' },
                      { id: 'jd', label: 'Job Analysis & JD' },
                      { id: 'objectives', label: 'Objectives (KPI Chart)' },
                      { id: 'sessions', label: 'Feedback Sessions (1–6)' },
                      { id: 'appraisal', label: 'Annual Appraisal' },
                      { id: 'history', label: 'History & Compensation' },
                      { id: 'notes', label: 'Documents & Notes' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => setProfileTab(t.id as typeof profileTab)}
                        className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition ${
                          profileTab === t.id
                            ? 'bg-[#0A2A6B] text-white'
                            : 'text-[#5B6677] hover:bg-[#F4F6FA]'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* TAB A: OVERVIEW */}
                {profileTab === 'overview' && (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-xl border border-[#D9DEE8] p-5 space-y-4">
                      <h2 className="font-bold text-[#0A2A6B]">Multi-Year Appraisal Trend & Objective Progress</h2>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={[...selectedEmployee.history].reverse().map((h) => ({ year: h.year, rating: h.finalRating }))}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
                            <YAxis domain={[0, 5]} tick={{ fontSize: 12 }} />
                            <Tooltip />
                            <Area type="monotone" dataKey="rating" stroke="#1F4FB2" fill="#4DA3FF" fillOpacity={0.2} strokeWidth={2.5} />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 space-y-4">
                      <h2 className="font-bold text-[#0A2A6B]">CPMS Snapshot</h2>
                      <div className="space-y-3 text-sm">
                        <div className="p-3 rounded-lg bg-[#F4F6FA]">
                          <div className="text-xs text-[#5B6677]">Sessions Completed</div>
                          <div className="font-bold text-[#0A2A6B] text-lg">
                            {selectedEmployee.sessions.filter((s) => s.status === 'COMPLETED').length} / 6 Check-ins
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F6FA]">
                          <div className="text-xs text-[#5B6677]">Core Strengths</div>
                          <div className="font-medium text-xs mt-1 text-[#1B2430]">
                            CENELEC SIL-4 compliance, cross-functional FAT integration, zero-harm safety discipline.
                          </div>
                        </div>
                        <div className="p-3 rounded-lg bg-[#F4F6FA]">
                          <div className="text-xs text-[#5B6677]">Development Focus</div>
                          <div className="font-medium text-xs mt-1 text-[#1B2430]">
                            System architecture leadership & digital twin simulation certification.
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB B: JOB ANALYSIS & JD */}
                {profileTab === 'jd' && (
                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-[#0A2A6B]">Job Analysis & Role Description (v{selectedEmployee.jd.version})</h2>
                        <p className="text-xs text-[#5B6677]">Standardized Alstom competency & responsibility baseline with version history</p>
                      </div>
                      {currentRole !== 'EMPLOYEE' && (
                        <button
                          onClick={() => {
                            if (editingJD) {
                              updateSelectedEmployee((emp) => ({
                                ...emp,
                                jd: {
                                  ...emp.jd,
                                  purpose: jdDraftPurpose || emp.jd.purpose,
                                  version: emp.jd.version + 1,
                                  history: [
                                    {
                                      version: emp.jd.version + 1,
                                      date: new Date().toISOString().slice(0, 10),
                                      editedBy: currentRole,
                                      note: jdChangeNote || 'Updated role scope',
                                      purpose: jdDraftPurpose || emp.jd.purpose,
                                    },
                                    ...emp.jd.history,
                                  ],
                                },
                              }));
                              logAudit('UPDATE_JOB_DESCRIPTION', `${selectedEmployee.employeeCode} (v${selectedEmployee.jd.version + 1})`);
                              notify('Job Description updated and version snapshot saved.');
                              setEditingJD(false);
                            } else {
                              setJdDraftPurpose(selectedEmployee.jd.purpose);
                              setEditingJD(true);
                            }
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#0A2A6B] text-white text-xs font-semibold"
                        >
                          {editingJD ? <><Save className="w-3.5 h-3.5" /> Save New Version</> : <><Edit3 className="w-3.5 h-3.5" /> Edit Job Analysis</>}
                        </button>
                      )}
                    </div>

                    {editingJD ? (
                      <div className="space-y-3 p-4 bg-[#F4F6FA] rounded-xl border border-[#D9DEE8]">
                        <label className="block text-xs font-semibold">Role Purpose</label>
                        <textarea
                          rows={3}
                          value={jdDraftPurpose}
                          onChange={(e) => setJdDraftPurpose(e.target.value)}
                          className="w-full p-2.5 text-sm bg-white border border-[#D9DEE8] rounded-lg"
                        />
                        <input
                          type="text"
                          value={jdChangeNote}
                          onChange={(e) => setJdChangeNote(e.target.value)}
                          placeholder="Revision note (e.g., Added Urbalis CBTC Phase-2 scope)..."
                          className="w-full p-2 text-xs bg-white border border-[#D9DEE8] rounded-lg"
                        />
                      </div>
                    ) : (
                      <div className="p-4 bg-[#F4F6FA] rounded-xl border border-[#D9DEE8]">
                        <div className="text-xs font-semibold text-[#5B6677] uppercase">Role Purpose</div>
                        <p className="text-sm mt-1">{selectedEmployee.jd.purpose}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                      <div className="p-4 border border-[#D9DEE8] rounded-xl">
                        <h3 className="font-bold text-[#0A2A6B] mb-2">Key Responsibilities</h3>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          {selectedEmployee.jd.responsibilities.map((r, i) => <li key={i}>{r}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 border border-[#D9DEE8] rounded-xl">
                        <h3 className="font-bold text-[#0A2A6B] mb-2">Required Skills & Tools</h3>
                        <div className="flex flex-wrap gap-1.5 mb-3">
                          {selectedEmployee.jd.skills.map((s, i) => (
                            <span key={i} className="px-2 py-0.5 bg-blue-50 text-[#1F4FB2] rounded text-xs font-medium">{s}</span>
                          ))}
                        </div>
                        <div className="text-xs text-[#5B6677]"><strong>Tools:</strong> {selectedEmployee.jd.tools.join(', ')}</div>
                      </div>
                      <div className="p-4 border border-[#D9DEE8] rounded-xl">
                        <h3 className="font-bold text-[#0A2A6B] mb-2">KPIs & Critical Success Factors</h3>
                        <ul className="list-disc pl-5 space-y-1 text-xs">
                          {selectedEmployee.jd.kpis.map((k, i) => <li key={i}>{k}</li>)}
                          {selectedEmployee.jd.successFactors.map((sf, i) => <li key={`sf-${i}`}>{sf}</li>)}
                        </ul>
                      </div>
                      <div className="p-4 border border-[#D9DEE8] rounded-xl space-y-1.5 text-xs">
                        <h3 className="font-bold text-[#0A2A6B] text-sm mb-2">Qualifications & Career Path</h3>
                        <p><strong>Qualifications:</strong> {selectedEmployee.jd.qualifications}</p>
                        <p><strong>Working Conditions:</strong> {selectedEmployee.jd.workingConditions}</p>
                        <p><strong>Career Progression:</strong> {selectedEmployee.jd.careerPath}</p>
                      </div>
                    </div>

                    <div className="border-t border-[#D9DEE8] pt-4">
                      <h3 className="text-xs font-bold uppercase text-[#5B6677] mb-2 flex items-center gap-1.5">
                        <History className="w-3.5 h-3.5" /> JD Version History
                      </h3>
                      <div className="space-y-2">
                        {selectedEmployee.jd.history.map((v) => (
                          <div key={v.version} className="flex items-center justify-between text-xs p-2.5 bg-[#F4F6FA] rounded-lg">
                            <span><strong>v{v.version}</strong> — {v.note}</span>
                            <span className="text-[#5B6677]">{v.editedBy} • {v.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB C: OBJECTIVES (KPI CHART) */}
                {profileTab === 'objectives' && (() => {
                  const totalWeight = selectedEmployee.objectives.reduce((acc, o) => acc + o.weightage, 0);
                  return (
                    <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-lg font-bold text-[#0A2A6B]">FY {cycleYear} Objective Chart & KPI Progress</h2>
                          <p className="text-xs text-[#5B6677]">Adjust progress sliders or ratings; total weightage must equal 100%.</p>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-xs font-bold border ${totalWeight === 100 ? 'bg-[#1E8E5A]/10 text-[#1E8E5A] border-[#1E8E5A]/30' : 'bg-[#E4002B]/10 text-[#E4002B] border-[#E4002B]/30'}`}>
                          Total Weightage: {totalWeight}% {totalWeight === 100 ? '(Valid)' : '(Must equal 100%)'}
                        </div>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="border-b border-[#D9DEE8] text-[#5B6677] uppercase">
                              <th className="py-3 px-3">Objective & Category</th>
                              <th className="py-3 px-3">Measure / KPI</th>
                              <th className="py-3 px-3">Target</th>
                              <th className="py-3 px-3">Weight %</th>
                              <th className="py-3 px-3 w-48">Progress %</th>
                              <th className="py-3 px-3">Self / Mgr Rating</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#D9DEE8]">
                            {selectedEmployee.objectives.map((obj) => (
                              <tr key={obj.id} className="hover:bg-[#F4F6FA]/60">
                                <td className="py-3 px-3">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-[#1F4FB2]">{obj.category}</span>
                                  <div className="font-bold text-sm text-[#1B2430] mt-1">{obj.title}</div>
                                  <div className="text-[#5B6677] mt-0.5">{obj.description}</div>
                                </td>
                                <td className="py-3 px-3 font-medium">{obj.measureKpi}</td>
                                <td className="py-3 px-3 font-semibold text-[#0A2A6B]">{obj.target}</td>
                                <td className="py-3 px-3 font-bold">{obj.weightage}%</td>
                                <td className="py-3 px-3">
                                  <div className="flex items-center gap-2">
                                    <input
                                      type="range"
                                      min={0}
                                      max={100}
                                      value={obj.progress}
                                      onChange={(e) => {
                                        const val = Number(e.target.value);
                                        updateSelectedEmployee((emp) => ({
                                          ...emp,
                                          objectives: emp.objectives.map((o) => (o.id === obj.id ? { ...o, progress: val } : o)),
                                        }));
                                      }}
                                      className="w-28 accent-[#1F4FB2]"
                                    />
                                    <span className="font-bold w-9">{obj.progress}%</span>
                                  </div>
                                </td>
                                <td className="py-3 px-3 font-semibold">
                                  {obj.selfRating} / {obj.managerRating}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })()}

                {/* TAB D: 6 BI-MONTHLY FEEDBACK SESSIONS */}
                {profileTab === 'sessions' && (() => {
                  const activeSess = selectedEmployee.sessions.find((s) => s.sessionNumber === selectedSessionNum) || selectedEmployee.sessions[0];
                  return (
                    <div className="space-y-5">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                        {selectedEmployee.sessions.map((s) => (
                          <button
                            key={s.sessionNumber}
                            onClick={() => setSelectedSessionNum(s.sessionNumber)}
                            className={`p-3 rounded-xl border text-left transition ${
                              selectedSessionNum === s.sessionNumber
                                ? 'bg-[#0A2A6B] text-white border-[#0A2A6B]'
                                : 'bg-white border-[#D9DEE8] hover:border-[#1F4FB2]'
                            }`}
                          >
                            <div className="text-xs font-bold">Session {s.sessionNumber}</div>
                            <div className={`text-[11px] mt-0.5 ${selectedSessionNum === s.sessionNumber ? 'text-blue-200' : 'text-[#5B6677]'}`}>
                              {s.scheduledDate}
                            </div>
                            <div className="mt-2">
                              <StatusBadge status={s.status} />
                            </div>
                          </button>
                        ))}
                      </div>

                      <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D9DEE8] pb-4">
                          <div>
                            <h3 className="text-lg font-bold text-[#0A2A6B]">{activeSess.label} — Continuous Check-in Record</h3>
                            <p className="text-xs text-[#5B6677]">Participants: {activeSess.participants.join(' & ')} • Scheduled: {activeSess.scheduledDate}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <StatusBadge status={activeSess.status} />
                            <button
                              onClick={() => {
                                updateSelectedEmployee((emp) => ({
                                  ...emp,
                                  sessions: emp.sessions.map((s) =>
                                    s.sessionNumber === activeSess.sessionNumber
                                      ? {
                                          ...s,
                                          status: 'COMPLETED',
                                          completedDate: new Date().toISOString().slice(0, 10),
                                          employeeAck: currentRole === 'EMPLOYEE' ? true : s.employeeAck,
                                          managerAck: currentRole !== 'EMPLOYEE' ? true : s.managerAck,
                                        }
                                      : s
                                  ),
                                }));
                                logAudit(`SIGN_OFF_SESSION_${activeSess.sessionNumber}`, selectedEmployee.employeeCode);
                                notify(`Session ${activeSess.sessionNumber} saved & digitally signed.`);
                              }}
                              className="px-3.5 py-2 rounded-lg bg-[#1E8E5A] text-white text-xs font-semibold hover:opacity-95"
                            >
                              Save & Digitally Sign Session
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                          <div>
                            <label className="font-bold text-[#0A2A6B] block mb-1">Key Achievements</label>
                            <textarea
                              rows={3}
                              value={activeSess.achievements}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedEmployee((emp) => ({
                                  ...emp,
                                  sessions: emp.sessions.map((s) => (s.sessionNumber === activeSess.sessionNumber ? { ...s, achievements: val } : s)),
                                }));
                              }}
                              placeholder="Document milestone deliveries, gate approvals, safety wins..."
                              className="w-full p-2.5 border border-[#D9DEE8] rounded-lg bg-[#F4F6FA]/50"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#0A2A6B] block mb-1">Challenges & Blockers</label>
                            <textarea
                              rows={3}
                              value={activeSess.challenges}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedEmployee((emp) => ({
                                  ...emp,
                                  sessions: emp.sessions.map((s) => (s.sessionNumber === activeSess.sessionNumber ? { ...s, challenges: val } : s)),
                                }));
                              }}
                              placeholder="Note supplier delays, test-bench dependencies, resource bottlenecks..."
                              className="w-full p-2.5 border border-[#D9DEE8] rounded-lg bg-[#F4F6FA]/50"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#0A2A6B] block mb-1">Manager Coaching Feedback</label>
                            <textarea
                              rows={3}
                              disabled={currentRole === 'EMPLOYEE'}
                              value={activeSess.managerFeedback}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedEmployee((emp) => ({
                                  ...emp,
                                  sessions: emp.sessions.map((s) => (s.sessionNumber === activeSess.sessionNumber ? { ...s, managerFeedback: val } : s)),
                                }));
                              }}
                              placeholder="Manager observations on engineering rigor, safety & teamwork..."
                              className="w-full p-2.5 border border-[#D9DEE8] rounded-lg bg-[#F4F6FA]/50 disabled:opacity-60"
                            />
                          </div>
                          <div>
                            <label className="font-bold text-[#0A2A6B] block mb-1">Employee Self-Reflection & Development Plan</label>
                            <textarea
                              rows={3}
                              value={activeSess.employeeReflection}
                              onChange={(e) => {
                                const val = e.target.value;
                                updateSelectedEmployee((emp) => ({
                                  ...emp,
                                  sessions: emp.sessions.map((s) => (s.sessionNumber === activeSess.sessionNumber ? { ...s, employeeReflection: val } : s)),
                                }));
                              }}
                              placeholder="Self-assessment and learning goals for next 60 days..."
                              className="w-full p-2.5 border border-[#D9DEE8] rounded-lg bg-[#F4F6FA]/50"
                            />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 p-3.5 bg-[#F4F6FA] rounded-xl border border-[#D9DEE8] text-xs">
                          <div className="flex items-center gap-4">
                            <span className={`font-semibold ${activeSess.employeeAck ? 'text-[#1E8E5A]' : 'text-[#5B6677]'}`}>
                              {activeSess.employeeAck ? '✓ Employee Acknowledged' : '○ Pending Employee Sign-Off'}
                            </span>
                            <span className={`font-semibold ${activeSess.managerAck ? 'text-[#1E8E5A]' : 'text-[#5B6677]'}`}>
                              {activeSess.managerAck ? '✓ Manager Signed Off' : '○ Pending Manager Sign-Off'}
                            </span>
                          </div>
                          <div>
                            <strong>Session Rating:</strong> {activeSess.overallRating ? `${activeSess.overallRating} / 5.0` : 'Pending Evaluation'}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* TAB E: ANNUAL APPRAISAL */}
                {profileTab === 'appraisal' && (
                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-bold text-[#0A2A6B]">Annual Appraisal & HR Calibration (FY {cycleYear})</h2>
                      <StatusBadge status={selectedEmployee.appraisal.status} />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                      <div className="p-4 rounded-xl bg-[#F4F6FA] border border-[#D9DEE8]">
                        <div className="font-bold text-[#0A2A6B] mb-1">Self Appraisal Rating</div>
                        <div className="text-2xl font-extrabold text-[#1F4FB2]">{selectedEmployee.appraisal.selfRating || selectedEmployee.lastRating} / 5.0</div>
                        <p className="mt-2 text-[#5B6677]">{selectedEmployee.appraisal.selfSummary}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-[#F4F6FA] border border-[#D9DEE8]">
                        <div className="font-bold text-[#0A2A6B] mb-1">Manager Assessment</div>
                        <div className="text-2xl font-extrabold text-[#0A2A6B]">{selectedEmployee.appraisal.managerRating || selectedEmployee.lastRating} / 5.0</div>
                        <p className="mt-2 text-[#5B6677]">{selectedEmployee.appraisal.managerSummary}</p>
                      </div>
                      <div className="p-4 rounded-xl bg-blue-50/60 border border-[#1F4FB2]/30">
                        <div className="font-bold text-[#0A2A6B] mb-1">HR Calibrated Outcome</div>
                        <div className="text-2xl font-extrabold text-[#1E8E5A]">{selectedEmployee.appraisal.finalRating || selectedEmployee.lastRating} / 5.0</div>
                        <div className="mt-2 space-y-1">
                          <div><strong>Recommended Increment:</strong> {selectedEmployee.appraisal.incrementPercentage}%</div>
                          <div><strong>Promotion Flag:</strong> {selectedEmployee.appraisal.promotionRecommended ? `Yes (${selectedEmployee.appraisal.recommendedDesignation})` : 'No'}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB F: HISTORY & COMPENSATION */}
                {profileTab === 'history' && (
                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                    <h2 className="text-lg font-bold text-[#0A2A6B]">Compensation Progression & Past Appraisal History</h2>
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#D9DEE8] text-[#5B6677] uppercase">
                          <th className="py-2.5 px-3">Appraisal Year</th>
                          <th className="py-2.5 px-3">Designation</th>
                          <th className="py-2.5 px-3">Final Rating</th>
                          <th className="py-2.5 px-3">Increment %</th>
                          <th className="py-2.5 px-3">Promoted</th>
                          <th className="py-2.5 px-3">CTC (INR)</th>
                          <th className="py-2.5 px-3">Remarks</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE8]">
                        {selectedEmployee.history.map((h, i) => (
                          <tr key={i}>
                            <td className="py-3 px-3 font-bold">{h.year}</td>
                            <td className="py-3 px-3">{h.designation}</td>
                            <td className="py-3 px-3 font-bold text-[#1E8E5A]">{h.finalRating} / 5.0</td>
                            <td className="py-3 px-3 font-semibold">+{h.incrementPct}%</td>
                            <td className="py-3 px-3">{h.promoted ? 'Yes' : 'No'}</td>
                            <td className="py-3 px-3 font-mono">₹{(h.ctcAtTime / 100000).toFixed(2)} LPA</td>
                            <td className="py-3 px-3 text-[#5B6677]">{h.remarks}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TAB G: DOCUMENTS & NOTES */}
                {profileTab === 'notes' && (
                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-4">
                    <h2 className="text-lg font-bold text-[#0A2A6B]">Trainings, Awards & Confidential Notes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-4 border border-[#D9DEE8] rounded-xl">
                        <h3 className="font-bold text-[#0A2A6B] mb-2">Completed Alstom University Trainings</h3>
                        <ul className="space-y-2">
                          {selectedEmployee.trainings.map((t, i) => (
                            <li key={i} className="p-2 bg-[#F4F6FA] rounded-lg">
                              <div className="font-semibold">{t.title}</div>
                              <div className="text-[#5B6677]">{t.provider} • {t.hours} hrs ({t.date})</div>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 border border-[#D9DEE8] rounded-xl">
                        <h3 className="font-bold text-[#0A2A6B] mb-2">Recognitions & Awards</h3>
                        {selectedEmployee.awards.length > 0 ? (
                          selectedEmployee.awards.map((a, i) => (
                            <div key={i} className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                              <div className="font-bold text-[#9A6700]">{a.title} ({a.quarter})</div>
                              <p className="mt-1">{a.description}</p>
                            </div>
                          ))
                        ) : (
                          <p className="text-[#5B6677]">No formal awards logged for the current cycle yet.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : activeNav === 'dashboard' ? (
              /* MODULE 1: EXECUTIVE DASHBOARD */
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0A2A6B]">Performance Governance Dashboard</h1>
                    <p className="text-xs text-[#5B6677] mt-0.5">
                      Alstom Transport Private Limited • Real-time Continuous Performance Tracking (FY {cycleYear})
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <button
                      onClick={exportCSV}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-white border border-[#D9DEE8] rounded-lg text-xs font-semibold hover:bg-slate-50"
                    >
                      <Download className="w-3.5 h-3.5 text-[#0A2A6B]" />
                      Export Excel / CSV
                    </button>
                    {currentRole === 'ADMIN_HR' && (
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0A2A6B] text-white rounded-lg text-xs font-semibold hover:bg-[#1F4FB2]"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Employee
                      </button>
                    )}
                  </div>
                </div>

                {/* 6 KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {[
                    { label: 'Total Employees', value: kpiStats.total, sub: 'Active India Workforce', color: 'text-[#0A2A6B]' },
                    { label: 'Sessions Completed', value: kpiStats.completed, sub: 'Across 6 Check-ins', color: 'text-[#1E8E5A]' },
                    { label: 'Sessions Pending', value: kpiStats.pending, sub: 'Awaiting Sign-off', color: 'text-[#9A6700]' },
                    { label: 'Sessions Overdue', value: kpiStats.overdue, sub: 'Action Required', color: 'text-[#E4002B]' },
                    { label: 'Average Rating', value: `${kpiStats.avgRating}/5`, sub: 'Calibrated Mean', color: 'text-[#1F4FB2]' },
                    { label: 'Objectives Progress', value: `${kpiStats.avgObjProgress}%`, sub: 'Weighted KPI Avg', color: 'text-[#0A2A6B]' },
                  ].map((card, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-[#D9DEE8] p-4 shadow-sm">
                      <div className="text-xs font-medium text-[#5B6677]">{card.label}</div>
                      <div className={`text-2xl font-extrabold mt-1 ${card.color}`}>{card.value}</div>
                      <div className="text-[11px] text-[#5B6677] mt-1">{card.sub}</div>
                    </div>
                  ))}
                </div>

                {/* Recharts Analytics Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0A2A6B] mb-3">Completion % by Bi-Monthly Session</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sessionChartData}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                          <YAxis unit="%" tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="Completion" fill="#1F4FB2" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="Overdue" fill="#E4002B" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0A2A6B] mb-3">Objective Progress % by Department</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={deptChartData} layout="vertical">
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                          <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
                          <YAxis type="category" dataKey="department" width={110} tick={{ fontSize: 10 }} />
                          <Tooltip />
                          <Bar dataKey="Progress" fill="#0A2A6B" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm">
                    <h3 className="text-sm font-bold text-[#0A2A6B] mb-3">Rating Distribution (Bell Curve)</h3>
                    <div className="h-56">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={ratingDistribution}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E5E9F0" />
                          <XAxis dataKey="band" tick={{ fontSize: 11 }} />
                          <YAxis tick={{ fontSize: 11 }} />
                          <Tooltip />
                          <Bar dataKey="count" fill="#1E8E5A" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {/* Interactive Employees x 6 Sessions Heatmap Matrix */}
                <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div>
                      <h3 className="text-base font-bold text-[#0A2A6B]">Continuous Feedback Matrix (Employees × 6 Sessions)</h3>
                      <p className="text-xs text-[#5B6677]">Click any session cell to open that employee&apos;s specific bi-monthly check-in form</p>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1E8E5A]" /> Completed</span>
                      <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#F2A900]" /> Pending</span>
                      <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#E4002B]" /> Overdue</span>
                      <span className="inline-flex items-center gap-1"><span className="w-3 h-3 rounded bg-slate-200" /> Upcoming</span>
                    </div>
                  </div>

                  <div className="max-h-96 overflow-y-auto border border-[#D9DEE8] rounded-lg">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-[#F4F6FA] sticky top-0 z-10 border-b border-[#D9DEE8]">
                        <tr>
                          <th className="py-2.5 px-3 font-bold text-[#0A2A6B]">Employee</th>
                          <th className="py-2.5 px-3 font-bold text-[#0A2A6B]">Department</th>
                          {[1, 2, 3, 4, 5, 6].map((n) => (
                            <th key={n} className="py-2.5 px-2 text-center font-bold text-[#0A2A6B]">S{n}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE8]">
                        {filteredEmployees.map((emp) => (
                          <tr key={emp.employeeCode} className="hover:bg-slate-50">
                            <td className="py-2 px-3 font-semibold">
                              <button
                                onClick={() => {
                                  setSelectedEmpCode(emp.employeeCode);
                                  setProfileTab('overview');
                                }}
                                className="text-[#1F4FB2] hover:underline text-left"
                              >
                                {emp.firstName} {emp.lastName}
                              </button>
                              <span className="ml-1.5 text-[10px] font-mono text-[#5B6677]">{emp.employeeCode}</span>
                            </td>
                            <td className="py-2 px-3 text-[#5B6677]">{emp.department}</td>
                            {emp.sessions.map((sess) => {
                              const bg =
                                sess.status === 'COMPLETED'
                                  ? 'bg-[#1E8E5A] text-white'
                                  : sess.status === 'OVERDUE'
                                  ? 'bg-[#E4002B] text-white'
                                  : sess.status === 'PENDING'
                                  ? 'bg-[#F2A900] text-[#1B2430]'
                                  : 'bg-slate-200 text-slate-600';
                              return (
                                <td key={sess.sessionNumber} className="py-1.5 px-1.5 text-center">
                                  <button
                                    onClick={() => {
                                      setSelectedEmpCode(emp.employeeCode);
                                      setProfileTab('sessions');
                                      setSelectedSessionNum(sess.sessionNumber);
                                    }}
                                    title={`${emp.firstName} – Session ${sess.sessionNumber}: ${sess.status}`}
                                    className={`w-full py-1 rounded font-bold text-[10px] hover:opacity-85 transition ${bg}`}
                                  >
                                    {sess.status === 'COMPLETED' ? 'DONE' : sess.status === 'OVERDUE' ? 'LATE' : sess.status === 'PENDING' ? 'DUE' : '—'}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Pending Actions Queue */}
                <div className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h3 className="text-base font-bold text-[#0A2A6B]">Pending & Overdue Review Actions</h3>
                    <div className="flex items-center gap-2">
                      <select
                        value={deptFilter}
                        onChange={(e) => setDeptFilter(e.target.value)}
                        className="text-xs border border-[#D9DEE8] rounded-lg px-2.5 py-1.5 bg-[#F4F6FA]"
                      >
                        <option value="ALL">All Departments</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="text-xs border border-[#D9DEE8] rounded-lg px-2.5 py-1.5 bg-[#F4F6FA]"
                      >
                        <option value="ALL">All Statuses</option>
                        <option value="OVERDUE">Overdue</option>
                        <option value="PENDING">Pending</option>
                        <option value="IN_PROGRESS">In Progress</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-[#D9DEE8] text-[#5B6677] uppercase">
                          <th className="py-2.5 px-3">Employee</th>
                          <th className="py-2.5 px-3">Department</th>
                          <th className="py-2.5 px-3">Manager</th>
                          <th className="py-2.5 px-3">Cycle Status</th>
                          <th className="py-2.5 px-3 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D9DEE8]">
                        {filteredEmployees
                          .filter((e) => e.cycleStatus === 'OVERDUE' || e.cycleStatus === 'PENDING')
                          .slice(0, 10)
                          .map((emp) => (
                            <tr key={emp.employeeCode} className="hover:bg-[#F4F6FA]/60">
                              <td className="py-2.5 px-3 font-semibold">{emp.firstName} {emp.lastName} ({emp.employeeCode})</td>
                              <td className="py-2.5 px-3">{emp.department}</td>
                              <td className="py-2.5 px-3 text-[#5B6677]">{emp.jd.reportingLine}</td>
                              <td className="py-2.5 px-3"><StatusBadge status={emp.cycleStatus} /></td>
                              <td className="py-2.5 px-3 text-right">
                                <button
                                  onClick={() => {
                                    logAudit('SEND_REMINDER', `${emp.firstName} ${emp.lastName} (${emp.employeeCode})`);
                                    notify(`Reminder email & in-app nudge dispatched to ${emp.firstName} ${emp.lastName}.`);
                                  }}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-[#0A2A6B] text-white font-semibold hover:bg-[#1F4FB2]"
                                >
                                  <Send className="w-3 h-3" /> Send Reminder
                                </button>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ) : activeNav === 'directory' ? (
              /* MODULE 2: EMPLOYEE DIRECTORY */
              <div className="space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h1 className="text-2xl font-bold text-[#0A2A6B]">Employee Directory ({filteredEmployees.length})</h1>
                    <p className="text-xs text-[#5B6677]">Click any employee record to open their 7-tab Continuous Performance Profile</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="bg-white border border-[#D9DEE8] rounded-lg p-0.5 flex text-xs">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`px-2.5 py-1 rounded-md font-semibold ${viewMode === 'table' ? 'bg-[#0A2A6B] text-white' : 'text-[#5B6677]'}`}
                      >
                        Table
                      </button>
                      <button
                        onClick={() => setViewMode('cards')}
                        className={`px-2.5 py-1 rounded-md font-semibold ${viewMode === 'cards' ? 'bg-[#0A2A6B] text-white' : 'text-[#5B6677]'}`}
                      >
                        Cards
                      </button>
                    </div>
                    {currentRole === 'ADMIN_HR' && (
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0A2A6B] text-white rounded-lg text-xs font-semibold hover:bg-[#1F4FB2]"
                      >
                        <Plus className="w-3.5 h-3.5" /> Add Employee
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter Strip */}
                <div className="bg-white p-3.5 rounded-xl border border-[#D9DEE8] flex flex-wrap items-center gap-3">
                  <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)} className="text-xs border border-[#D9DEE8] rounded-lg px-3 py-1.5 bg-[#F4F6FA]">
                    <option value="ALL">All Departments</option>
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)} className="text-xs border border-[#D9DEE8] rounded-lg px-3 py-1.5 bg-[#F4F6FA]">
                    <option value="ALL">All Locations</option>
                    {locations.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                  <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="text-xs border border-[#D9DEE8] rounded-lg px-3 py-1.5 bg-[#F4F6FA]">
                    <option value="ALL">All Cycle Statuses</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="PENDING">Pending</option>
                    <option value="OVERDUE">Overdue</option>
                  </select>
                </div>

                {viewMode === 'table' ? (
                  <div className="bg-white rounded-xl border border-[#D9DEE8] overflow-hidden shadow-sm">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-[#F4F6FA] border-b border-[#D9DEE8] text-[#5B6677] uppercase">
                          <tr>
                            <th className="py-3 px-4">ID</th>
                            <th className="py-3 px-4">Employee</th>
                            <th className="py-3 px-4">Designation</th>
                            <th className="py-3 px-4">Department</th>
                            <th className="py-3 px-4">Location</th>
                            <th className="py-3 px-4">Joining Date</th>
                            <th className="py-3 px-4">Last Rating</th>
                            <th className="py-3 px-4">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#D9DEE8]">
                          {filteredEmployees.map((emp) => (
                            <tr
                              key={emp.employeeCode}
                              onClick={() => {
                                setSelectedEmpCode(emp.employeeCode);
                                setProfileTab('overview');
                              }}
                              className="hover:bg-blue-50/50 cursor-pointer transition"
                            >
                              <td className="py-3 px-4 font-mono font-semibold text-[#0A2A6B]">{emp.employeeCode}</td>
                              <td className="py-3 px-4 font-bold text-[#1B2430]">{emp.firstName} {emp.lastName}</td>
                              <td className="py-3 px-4">{emp.designation}</td>
                              <td className="py-3 px-4 text-[#5B6677]">{emp.department}</td>
                              <td className="py-3 px-4">{emp.location}</td>
                              <td className="py-3 px-4 text-[#5B6677]">{emp.joiningDate}</td>
                              <td className="py-3 px-4 font-bold text-[#1E8E5A]">{emp.lastRating}</td>
                              <td className="py-3 px-4"><StatusBadge status={emp.cycleStatus} /></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredEmployees.map((emp) => (
                      <div
                        key={emp.employeeCode}
                        onClick={() => {
                          setSelectedEmpCode(emp.employeeCode);
                          setProfileTab('overview');
                        }}
                        className="bg-white rounded-xl border border-[#D9DEE8] p-4 hover:border-[#1F4FB2] cursor-pointer transition shadow-sm"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[#0A2A6B] text-white flex items-center justify-center font-bold text-sm">
                              {emp.firstName[0]}{emp.lastName[0]}
                            </div>
                            <div>
                              <div className="font-bold text-sm text-[#1B2430]">{emp.firstName} {emp.lastName}</div>
                              <div className="text-[11px] font-mono text-[#5B6677]">{emp.employeeCode} • Grade {emp.grade}</div>
                            </div>
                          </div>
                          <StatusBadge status={emp.cycleStatus} />
                        </div>
                        <div className="mt-3 text-xs font-medium text-[#0A2A6B]">{emp.designation}</div>
                        <div className="mt-1 text-[11px] text-[#5B6677]">{emp.department} • {emp.location}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : activeNav === 'library' ? (
              /* MODULE 4: OBJECTIVES LIBRARY (10 ROLE TEMPLATES) */
              <div className="space-y-5">
                <div>
                  <h1 className="text-2xl font-bold text-[#0A2A6B]">Alstom Role & Objectives Library ({templates.length} Templates)</h1>
                  <p className="text-xs text-[#5B6677]">Standardized Job Descriptions and 100%-weighted KPI templates that auto-populate on employee onboarding</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {templates.map((tpl) => (
                    <div key={tpl.id} className="bg-white rounded-xl border border-[#D9DEE8] p-5 shadow-sm space-y-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1F4FB2] text-[10px] font-bold">{tpl.department} • {tpl.gradeBand}</span>
                          <h3 className="text-base font-bold text-[#0A2A6B] mt-1">{tpl.title}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-[#5B6677]">{tpl.purpose}</p>
                      <div className="border-t border-[#D9DEE8] pt-3 space-y-1.5">
                        <div className="text-[11px] font-bold uppercase text-[#5B6677]">Default Weighted KPI Objectives</div>
                        {tpl.objectives.map((o, i) => (
                          <div key={i} className="flex items-center justify-between text-xs p-2 bg-[#F4F6FA] rounded-lg">
                            <span className="font-medium">{o.title} <span className="text-[#5B6677]">({o.target})</span></span>
                            <span className="font-bold text-[#0A2A6B]">{o.weightage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeNav === 'reports' ? (
              /* MODULE 9: REPORTS */
              <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-xl font-bold text-[#0A2A6B]">Executive Reports & Calibration Exports</h1>
                    <p className="text-xs text-[#5B6677]">Generate department comparisons, rating distributions, and compensation increment summaries</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={exportCSV} className="px-3.5 py-2 rounded-lg bg-[#0A2A6B] text-white text-xs font-semibold flex items-center gap-1.5">
                      <Download className="w-3.5 h-3.5" /> Download Master Excel/CSV
                    </button>
                    <button onClick={() => window.print()} className="px-3.5 py-2 rounded-lg border border-[#D9DEE8] text-xs font-semibold">
                      Print PDF Summary
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  {deptChartData.map((d) => (
                    <div key={d.department} className="p-4 rounded-xl bg-[#F4F6FA] border border-[#D9DEE8]">
                      <div className="font-bold text-sm text-[#0A2A6B]">{d.department}</div>
                      <div className="mt-2 flex justify-between">
                        <span>Headcount: <strong>{d.Headcount}</strong></span>
                        <span>Avg KPI Progress: <strong className="text-[#1E8E5A]">{d.Progress}%</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeNav === 'audit' ? (
              /* MODULE 6: AUDIT LOG */
              <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-4">
                <h1 className="text-xl font-bold text-[#0A2A6B]">Governance & Compliance Audit Log</h1>
                <div className="divide-y divide-[#D9DEE8] text-xs">
                  {auditLogs.map((a) => (
                    <div key={a.id} className="py-3 flex items-center justify-between">
                      <div>
                        <span className="px-2 py-0.5 rounded bg-blue-50 text-[#1F4FB2] font-mono font-bold mr-2">{a.action}</span>
                        <span className="font-semibold">{a.target}</span>
                      </div>
                      <div className="text-[#5B6677]">{a.actor} • {a.timestamp}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* MODULE 8: CYCLE & SETTINGS */
              <div className="bg-white rounded-xl border border-[#D9DEE8] p-6 space-y-5 max-w-2xl">
                <h1 className="text-xl font-bold text-[#0A2A6B]">Appraisal Cycle & Governance Settings</h1>
                <div className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold mb-1">Active Appraisal Year</label>
                    <input
                      type="text"
                      value={cycleYear}
                      onChange={(e) => setCycleYear(e.target.value)}
                      className="w-full p-2.5 border border-[#D9DEE8] rounded-lg"
                    />
                  </div>
                  <label className="flex items-center gap-2 font-semibold">
                    <input
                      type="checkbox"
                      checked={require100Weight}
                      onChange={(e) => setRequire100Weight(e.target.checked)}
                    />
                    Enforce strict 100% objective weightage validation rule across all departments
                  </label>
                  <button
                    onClick={() => {
                      logAudit('UPDATE_CYCLE_SETTINGS', `FY ${cycleYear}`);
                      notify('Cycle configuration saved.');
                    }}
                    className="px-4 py-2 rounded-lg bg-[#0A2A6B] text-white font-semibold"
                  >
                    Save Configuration
                  </button>
                </div>
              </div>
            )}
          </main>

          {/* Consistent Corporate Footer */}
          <footer className="bg-white border-t border-[#D9DEE8] px-6 py-3.5 text-xs text-[#5B6677] flex flex-wrap items-center justify-between">
            <span>Alstom Transport Private Limited – Performance Management</span>
            <span>Mobility by Nature • CENELEC & IRIS Compliant Governance</span>
          </footer>
        </div>
      </div>

      {/* ADD EMPLOYEE MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-[#D9DEE8] pb-3">
              <h2 className="text-lg font-bold text-[#0A2A6B]">Onboard New Employee to CPMS</h2>
              <button onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-[#5B6677]" /></button>
            </div>
            <form onSubmit={handleCreateEmployee} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">First Name *</label>
                  <input required value={newEmp.firstName} onChange={(e) => setNewEmp({ ...newEmp, firstName: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Last Name *</label>
                  <input required value={newEmp.lastName} onChange={(e) => setNewEmp({ ...newEmp, lastName: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Role Template (Auto-populates JD & KPIs)</label>
                  <select value={newEmp.roleTemplateId} onChange={(e) => setNewEmp({ ...newEmp, roleTemplateId: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg">
                    {templates.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Designation</label>
                  <input required value={newEmp.designation} onChange={(e) => setNewEmp({ ...newEmp, designation: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Department</label>
                  <select value={newEmp.department} onChange={(e) => setNewEmp({ ...newEmp, department: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg">
                    {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Grade</label>
                  <input value={newEmp.grade} onChange={(e) => setNewEmp({ ...newEmp, grade: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg" />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Location</label>
                  <select value={newEmp.location} onChange={(e) => setNewEmp({ ...newEmp, location: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg">
                    <option>Bengaluru</option>
                    <option>Sri City</option>
                    <option>Savli</option>
                    <option>Delhi NCR</option>
                    <option>Mumbai</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Reporting Manager</label>
                  <select value={newEmp.managerCode} onChange={(e) => setNewEmp({ ...newEmp, managerCode: e.target.value })} className="w-full p-2 border border-[#D9DEE8] rounded-lg">
                    {employees.filter((m) => m.sysRole !== 'EMPLOYEE').map((m) => (
                      <option key={m.employeeCode} value={m.employeeCode}>{m.firstName} {m.lastName} ({m.employeeCode})</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Annual CTC (INR)</label>
                  <input type="number" value={newEmp.currentCtc} onChange={(e) => setNewEmp({ ...newEmp, currentCtc: Number(e.target.value) })} className="w-full p-2 border border-[#D9DEE8] rounded-lg" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-3 border-t border-[#D9DEE8]">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-3.5 py-2 border border-[#D9DEE8] rounded-lg font-semibold">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-[#0A2A6B] text-white rounded-lg font-semibold">Create & Auto-Populate CPMS</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
