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
  ChevronsUpDown,
  User,
  Shield,
  Bell,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  SidebarSeparator,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
} from '@/components/ui/sidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  userName?: string;
  userEmail?: string;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  LayoutDashboard,
  Clock,
  Calendar,
  Briefcase,
  BarChart3,
  Users,
  Settings,
};

export function DashboardLayout({
  children,
  userRole = 'EMPLOYEE',
  userName = 'John Doe',
  userEmail = 'john.doe@company.com',
}: DashboardLayoutProps) {
  const pathname = usePathname();

  const filteredNav = appConfig.navigation.mainNav.filter((item) => {
    if (item.adminOnly && userRole !== 'ADMIN') {
      return false;
    }
    return true;
  });

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  // Build breadcrumb items based on path
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/');
    const label = segment.charAt(0).toUpperCase() + segment.slice(1);
    return { href, label };
  });

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-slate-50 dark:bg-slate-950">
        {/* Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-slate-200 dark:border-slate-800">
          {/* Header */}
          <SidebarHeader className="flex h-16 items-center px-4 border-b border-slate-200 dark:border-slate-800">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="hover:bg-transparent cursor-default">
                  <div className="flex aspect-square h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{appConfig.app.name}</span>
                    <span className="truncate text-xs text-slate-500">v{appConfig.app.version}</span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>

          {/* Navigation Content */}
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel>Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {filteredNav.map((item) => {
                    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                    const IconComponent = iconMap[item.icon as string] || LayoutDashboard;

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          render={<Link href={item.href} />}
                          isActive={isActive}
                          tooltip={item.label}
                          className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                            isActive
                              ? 'bg-blue-600 text-white font-medium hover:bg-blue-700 hover:text-white'
                              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-slate-100'
                          }`}
                        >
                          <IconComponent className="h-4 w-4 shrink-0" />
                          <span>{item.label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          {/* Sidebar Footer with User Profile Dropdown */}
          <SidebarFooter className="border-t border-slate-200 dark:border-slate-800 p-2">
            <SidebarMenu>
              <SidebarMenuItem>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <SidebarMenuButton
                        size="lg"
                        className="w-full justify-between hover:bg-slate-100 dark:hover:bg-slate-900 data-[state=open]:bg-slate-100 dark:data-[state=open]:bg-slate-900"
                      />
                    }
                  >
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <Avatar className="h-8 w-8 rounded-lg bg-blue-100 text-blue-800 font-semibold dark:bg-blue-900/50 dark:text-blue-200">
                        <AvatarFallback className="text-xs">{getInitials(userName)}</AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-xs leading-tight">
                        <span className="truncate font-medium text-slate-800 dark:text-slate-200">{userName}</span>
                        <span className="truncate text-[10px] text-slate-500">{userEmail}</span>
                      </div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 text-slate-400 shrink-0" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" side="right" sideOffset={8}>
                    <DropdownMenuGroup>
                      <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none text-slate-800 dark:text-slate-200">{userName}</p>
                          <p className="text-xs leading-none text-slate-500">{userEmail}</p>
                          <span className="inline-flex items-center w-fit rounded-full bg-blue-50 px-1.5 py-0.5 text-3xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300">
                            {userRole}
                          </span>
                        </div>
                      </DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem render={<Link href="/profile" className="cursor-pointer flex items-center" />}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile Settings</span>
                    </DropdownMenuItem>
                    {userRole === 'ADMIN' && (
                      <DropdownMenuItem render={<Link href="/admin" className="cursor-pointer flex items-center" />}>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Admin Console</span>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>

        {/* Sidebar Inset (Main Page Content Wrapper) */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-900">
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 md:px-6">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <SidebarSeparator className="mx-2 h-4" />
              {/* Responsive Breadcrumbs */}
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/dashboard" className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                      Home
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  {breadcrumbs.map((breadcrumb, index) => {
                    const isLast = index === breadcrumbs.length - 1;
                    return (
                      <React.Fragment key={breadcrumb.href}>
                        <BreadcrumbSeparator />
                        <BreadcrumbItem>
                          {isLast ? (
                            <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                          ) : (
                            <BreadcrumbLink href={breadcrumb.href} className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                              {breadcrumb.label}
                            </BreadcrumbLink>
                          )}
                        </BreadcrumbItem>
                      </React.Fragment>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            
            {/* Header Actions */}
            <div className="flex items-center gap-4">
              <span className="text-xs text-slate-500 hidden md:block">
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              <Button variant="ghost" size="icon" className="relative text-slate-500 hover:text-slate-800 dark:hover:text-slate-200">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2 rounded-full bg-red-600" />
              </Button>
            </div>
          </header>

          {/* Main Area */}
          <main className="flex-1 overflow-auto p-4 md:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
