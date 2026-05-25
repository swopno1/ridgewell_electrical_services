import { Shield, Clock, Calendar, CheckSquare, Settings, LucideIcon } from 'lucide-react';

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
    description: 'Learn how to set up your account, verify your email, and understand your role within the system.',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    slug: 'timesheets',
    title: 'Timesheet Logging',
    filename: '02-timesheets.md',
    description: 'A complete guide to logging your daily shifts, entering time parameters, and managing your log history.',
    icon: Clock,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-100',
  },
  {
    slug: 'leave',
    title: 'Leave & Balances',
    filename: '03-leave.md',
    description: 'How to check your leave entitlements, submit requests for time off, and track your balance status.',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    slug: 'approvals',
    title: 'Manager Approvals',
    filename: '04-approvals.md',
    description: 'Guidance for managers on reviewing submissions, handling rejections, and auditing project performance.',
    icon: CheckSquare,
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  {
    slug: 'admin',
    title: 'Administrator Console',
    filename: '05-admin.md',
    description: 'Advanced documentation for system administrators on employee directory management and financial reporting.',
    icon: Settings,
    color: 'text-slate-600',
    bgColor: 'bg-slate-100',
  },
];

export const getDocBySlug = (slug: string) => docsConfig.find((doc) => doc.slug === slug);
