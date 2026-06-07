import { Shield, Clock, Calendar, CalendarRange, CheckSquare, Settings, LucideIcon, Server } from 'lucide-react';

export interface DocEntry {
  slug: string;
  title: string;
  filename: string;
  description: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
}

export const docsConfig: DocEntry[] = [
  {
    slug: 'onboarding',
    title: 'Onboarding & Setup',
    filename: '01-onboarding.md',
    description: 'Set up your account, understand account activation, and learn your role permissions within the system.',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    slug: 'timesheets',
    title: 'Timesheet Logging',
    filename: '02-timesheets.md',
    description: 'Log your daily shifts, enter time parameters, manage your history, and understand status indicators.',
    icon: Clock,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    slug: 'leave',
    title: 'Leave & Balances',
    filename: '03-leave.md',
    description: 'Check your leave entitlements, submit requests for time off, and track your balance status.',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    slug: 'calendar',
    title: 'Calendar View',
    filename: '06-calendar.md',
    description: 'Visualise timesheets and leave across the team calendar, explore day detail panels, and read colour-coded status indicators.',
    icon: CalendarRange,
    color: 'text-sky-600',
    bgColor: 'bg-sky-100',
    isNew: true,
  } as DocEntry & { isNew?: boolean },
  {
    slug: 'approvals',
    title: 'Manager Approvals',
    filename: '04-approvals.md',
    description: 'Review submissions, handle rejections with feedback, and use the calendar to spot conflicts before approving.',
    icon: CheckSquare,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    slug: 'admin',
    title: 'Administrator Console',
    filename: '05-admin.md',
    description: 'Manage employees, activate accounts, administer projects, and generate payroll and hour reports.',
    icon: Settings,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
  {
    slug: 'maintenance',
    title: 'Release Notes',
    filename: 'release-notes.md',
    description: 'Review version history, infrastructure details, and the steady-state maintenance and support plan.',
    icon: Server,
    color: 'text-rose-600',
    bgColor: 'bg-rose-100',
  },
];

export const getDocBySlug = (slug: string) => docsConfig.find((doc) => doc.slug === slug);
