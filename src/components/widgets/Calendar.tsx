'use client';

import { useState } from 'react';
import {
  format,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  isSameMonth,
  isSameDay,
  eachDayOfInterval
} from 'date-fns';
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { formatTime } from '@/lib/date-utils';

interface User {
  id: string;
  name: string | null;
}

interface Project {
  id: string;
  name: string;
}

interface TimesheetEntry {
  id: string;
  date: string | Date;
  totalHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  timeOn: string | Date;
  timeOff: string | Date;
  breakDuration: number;
  project?: Project;
  user?: User;
}

interface LeaveEntry {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  leaveType: 'ANNUAL' | 'SICK' | 'UNPAID';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  user?: User;
}

interface CalendarProps {
  timesheets: TimesheetEntry[];
  leaveRequests: LeaveEntry[];
  userRole?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  initialDate?: Date;
}

const VISIBLE_PER_DAY = 3;

export function Calendar({ timesheets, leaveRequests, userRole = 'EMPLOYEE', initialDate = new Date() }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  const getTimesheetsForDay = (day: Date): TimesheetEntry[] => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return timesheets.filter(ts => {
      const tsStr = typeof ts.date === 'string' ? ts.date.split('T')[0] : ts.date.toISOString().split('T')[0];
      return tsStr === dayStr;
    });
  };

  const getLeavesForDay = (day: Date): LeaveEntry[] => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return leaveRequests.filter(lr => {
      const startStr = typeof lr.startDate === 'string' ? lr.startDate.split('T')[0] : lr.startDate.toISOString().split('T')[0];
      const endStr = typeof lr.endDate === 'string' ? lr.endDate.split('T')[0] : lr.endDate.toISOString().split('T')[0];
      return dayStr >= startStr && dayStr <= endStr;
    });
  };

  const timesheetBadgeClass = (status: TimesheetEntry['status']) => {
    if (status === 'APPROVED') return 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400';
    if (status === 'REJECTED') return 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400';
    return 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400';
  };

  const leaveBadgeClass = (type: LeaveEntry['leaveType']) => {
    if (type === 'ANNUAL') return 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400';
    if (type === 'SICK') return 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400';
    return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300';
  };

  const selectedTimesheets = selectedDay ? getTimesheetsForDay(selectedDay) : [];
  const selectedLeaves = selectedDay ? getLeavesForDay(selectedDay) : [];

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <p className="text-sm text-slate-500">
          {userRole === 'EMPLOYEE' ? 'View your schedule and entries' : 'View all employee schedules'}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" size="icon" onClick={prevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={() => setCurrentMonth(new Date())}>
          Today
        </Button>
        <Button variant="outline" size="icon" onClick={nextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return (
      <div className="grid grid-cols-7 mb-2 border-b border-slate-200 dark:border-slate-800 pb-2">
        {days.map(day => (
          <div key={day} className="text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => (
    <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
      {calendarDays.map((day, idx) => {
        const dayTimesheets = getTimesheetsForDay(day);
        const dayLeaves = getLeavesForDay(day);
        const allEntries = [...dayTimesheets, ...dayLeaves];
        const total = allEntries.length;
        const isCurrentMonth = isSameMonth(day, monthStart);
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;

        const visibleTimesheets = dayTimesheets.slice(0, VISIBLE_PER_DAY);
        const visibleLeaves = dayLeaves.slice(0, Math.max(0, VISIBLE_PER_DAY - visibleTimesheets.length));
        const shownCount = visibleTimesheets.length + visibleLeaves.length;
        const overflow = total - shownCount;

        return (
          <div
            key={idx}
            onClick={() => total > 0 ? setSelectedDay(isSelected ? null : day) : undefined}
            className={`min-h-25 p-2 transition-colors ${
              total > 0 ? 'cursor-pointer' : ''
            } ${
              isSelected
                ? 'bg-blue-50 dark:bg-blue-950/20 ring-2 ring-inset ring-blue-500'
                : 'bg-white dark:bg-slate-950 hover:bg-slate-50 dark:hover:bg-slate-900/50'
            } ${
              !isCurrentMonth ? 'opacity-50' : ''
            }`}
          >
            <div className="flex justify-between items-start mb-1">
              <span className={`text-sm font-medium ${
                isToday
                  ? 'bg-blue-600 text-white h-6 w-6 flex items-center justify-center rounded-full'
                  : 'text-slate-700 dark:text-slate-300'
              }`}>
                {format(day, 'd')}
              </span>
              {total > 0 && (
                <span className="text-[9px] font-semibold text-slate-400">{total}</span>
              )}
            </div>

            <div className="space-y-0.5">
              {visibleTimesheets.map(ts => (
                <div
                  key={ts.id}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium ${timesheetBadgeClass(ts.status)}`}
                  title={`${ts.user?.name ? ts.user.name + ' — ' : ''}${ts.project?.name || 'No Project'} (${formatTime(new Date(ts.timeOn))} - ${formatTime(new Date(ts.timeOff))})`}
                >
                  <div className="flex items-center gap-0.5 truncate">
                    <Clock className="h-2 w-2 shrink-0" />
                    <span className="truncate">
                      {userRole !== 'EMPLOYEE' && ts.user?.name
                        ? ts.user.name.split(' ')[0]
                        : `${formatTime(new Date(ts.timeOn))}`}
                    </span>
                  </div>
                </div>
              ))}

              {visibleLeaves.map(lr => (
                <div
                  key={lr.id}
                  className={`px-1.5 py-0.5 rounded text-[9px] font-medium truncate ${leaveBadgeClass(lr.leaveType)}`}
                  title={lr.user?.name ? `${lr.user.name} — ${lr.leaveType}` : lr.leaveType}
                >
                  <div className="flex items-center gap-0.5">
                    <CalendarIcon className="h-2 w-2 shrink-0" />
                    <span className="truncate">
                      {userRole !== 'EMPLOYEE' && lr.user?.name
                        ? lr.user.name.split(' ')[0]
                        : lr.leaveType.charAt(0) + lr.leaveType.slice(1).toLowerCase()}
                    </span>
                  </div>
                </div>
              ))}

              {overflow > 0 && (
                <div className="text-[9px] font-semibold text-slate-500 dark:text-slate-400 pl-1">
                  +{overflow} more
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const renderDayDetail = () => {
    if (!selectedDay) return null;

    return (
      <div className="mt-4 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-950 shadow-sm">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white text-base">
              {format(selectedDay, 'EEEE, d MMMM yyyy')}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {selectedTimesheets.length} timesheet{selectedTimesheets.length !== 1 ? 's' : ''} &nbsp;·&nbsp; {selectedLeaves.length} leave request{selectedLeaves.length !== 1 ? 's' : ''}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSelectedDay(null)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="divide-y divide-slate-100 dark:divide-slate-800">
          {selectedTimesheets.map(ts => (
            <Link
              key={ts.id}
              href={`/timesheets/${ts.id}`}
              className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                ts.status === 'APPROVED' ? 'bg-emerald-500' :
                ts.status === 'REJECTED' ? 'bg-red-500' : 'bg-amber-500'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {ts.user?.name && (
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <User className="h-3 w-3" /> {ts.user.name}
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${timesheetBadgeClass(ts.status)}`}>
                    {ts.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {formatTime(new Date(ts.timeOn))} – {formatTime(new Date(ts.timeOff))}
                  {ts.project?.name && <span className="ml-2 opacity-75">· {ts.project.name}</span>}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">{ts.totalHours}h total</p>
              </div>
            </Link>
          ))}

          {selectedLeaves.map(lr => (
            <Link
              key={lr.id}
              href="/leave"
              className="flex items-start gap-3 px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors"
            >
              <div className={`mt-0.5 h-2.5 w-2.5 rounded-full shrink-0 ${
                lr.leaveType === 'ANNUAL' ? 'bg-blue-500' :
                lr.leaveType === 'SICK' ? 'bg-violet-500' : 'bg-slate-400'
              }`} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {lr.user?.name && (
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 flex items-center gap-1">
                      <User className="h-3 w-3" /> {lr.user.name}
                    </span>
                  )}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${leaveBadgeClass(lr.leaveType)}`}>
                    {lr.leaveType}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                    lr.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400' :
                    lr.status === 'REJECTED' ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400' :
                    lr.status === 'CANCELLED' ? 'bg-slate-100 text-slate-500' :
                    'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                  }`}>
                    {lr.status}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  <CalendarIcon className="h-3 w-3 inline mr-1" />
                  {typeof lr.startDate === 'string' ? lr.startDate : format(lr.startDate, 'dd MMM')}
                  {' – '}
                  {typeof lr.endDate === 'string' ? lr.endDate : format(lr.endDate, 'dd MMM yyyy')}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      {renderDayDetail()}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-emerald-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Approved Timesheet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-amber-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Pending Timesheet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-red-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Rejected Timesheet</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Annual Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-violet-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Sick Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-slate-400"></div>
          <span className="text-slate-600 dark:text-slate-400">Unpaid Leave</span>
        </div>
      </div>
    </div>
  );
}
