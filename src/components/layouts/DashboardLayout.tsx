// src/components/layouts/DashboardLayout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { appConfig } from '@/lib/config';
import {
  LayoutDashboard,
  Clock,
  Calendar,
  Briefcase,
  BarChart3,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: string;
}

const iconMap: Record<string, React.ReactNode> = {
  LayoutDashboard: <LayoutDashboard className="w-5 h-5" />,
  Clock: <Clock className="w-5 h-5" />,
  Calendar: <Calendar className="w-5 h-5" />,
  Briefcase: <Briefcase className="w-5 h-5" />,
  BarChart3: <BarChart3 className="w-5 h-5" />,
  Users: <Users className="w-5 h-5" />,
  Settings: <Settings className="w-5 h-5" />,
};

export function DashboardLayout({
  children,
  userRole = 'EMPLOYEE',
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const filteredNav = appConfig.navigation.mainNav.filter((item) => {
    if (item.adminOnly && userRole !== 'ADMIN') {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Mobile Sidebar Toggle */}
      <div className="fixed top-0 left-0 z-50 md:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="m-4"
        >
          {sidebarOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </Button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-screen w-64 bg-slate-900 text-white transition-transform md:relative md:translate-x-0 z-40 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-center p-6 border-b border-slate-700">
          <h1 className="text-2xl font-bold">{appConfig.app.name}</h1>
        </div>

        {/* Navigation */}
        <nav className="mt-8 space-y-2 px-4">
          {filteredNav.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <span>{iconMap[item.icon as string]}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <Button
            variant="ghost"
            className="w-full justify-start text-slate-300 hover:bg-slate-800"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-slate-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">
              {appConfig.app.name}
            </h2>
            <div className="text-sm text-slate-600">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
}
