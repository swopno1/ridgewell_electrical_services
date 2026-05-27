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
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

interface TimesheetEntry {
  id: string;
  date: string | Date;
  totalHours: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

interface LeaveEntry {
  id: string;
  startDate: string | Date;
  endDate: string | Date;
  leaveType: 'ANNUAL' | 'SICK' | 'UNPAID';
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
}

interface CalendarProps {
  timesheets: TimesheetEntry[];
  leaveRequests: LeaveEntry[];
  initialDate?: Date;
}

export function Calendar({ timesheets, leaveRequests, initialDate = new Date() }: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(initialDate);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const getTimesheetForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return timesheets.find(ts => {
      const tsStr = typeof ts.date === 'string' ? ts.date.split('T')[0] : ts.date.toISOString().split('T')[0];
      return tsStr === dayStr;
    });
  };

  const getLeaveForDay = (day: Date) => {
    const dayStr = format(day, 'yyyy-MM-dd');
    return leaveRequests.find(lr => {
      const startStr = typeof lr.startDate === 'string' ? lr.startDate.split('T')[0] : lr.startDate.toISOString().split('T')[0];
      const endStr = typeof lr.endDate === 'string' ? lr.endDate.split('T')[0] : lr.endDate.toISOString().split('T')[0];
      return dayStr >= startStr && dayStr <= endStr;
    });
  };

  const renderHeader = () => (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          {format(currentMonth, 'MMMM yyyy')}
        </h2>
        <p className="text-sm text-slate-500">View your schedule and entries</p>
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

  const renderCells = () => {
    return (
      <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg overflow-hidden">
        {calendarDays.map((day, idx) => {
          const ts = getTimesheetForDay(day);
          const lr = getLeaveForDay(day);
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`min-h-[100px] bg-white dark:bg-slate-950 p-2 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/50 ${
                !isCurrentMonth ? 'text-slate-400 bg-slate-50/50 dark:bg-slate-900/30' : ''
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-sm font-medium ${isToday ? 'bg-blue-600 text-white h-6 w-6 flex items-center justify-center rounded-full' : ''}`}>
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {ts && (
                  <Link
                    href={`/timesheets/${ts.id}`}
                    className={`block px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${
                      ts.status === 'APPROVED'
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400'
                        : ts.status === 'REJECTED'
                        ? 'bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400'
                        : 'bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <Clock className="h-2 w-2" />
                      <span>{ts.totalHours}h {ts.status.toLowerCase()}</span>
                    </div>
                  </Link>
                )}

                {lr && (
                  <Link
                    href={`/leave`}
                    className={`block px-1.5 py-0.5 rounded text-[10px] font-medium truncate ${
                      lr.leaveType === 'ANNUAL'
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400'
                        : lr.leaveType === 'SICK'
                        ? 'bg-violet-50 text-violet-700 dark:bg-violet-950/30 dark:text-violet-400'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-2 w-2" />
                      <span>{lr.leaveType} {lr.status.toLowerCase()}</span>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-white dark:bg-slate-950 p-6 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
      {renderHeader()}
      {renderDays()}
      {renderCells()}

      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-emerald-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Approved Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-amber-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Pending Time</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-blue-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Annual Leave</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-violet-500"></div>
          <span className="text-slate-600 dark:text-slate-400">Sick Leave</span>
        </div>
      </div>
    </div>
  );
}
