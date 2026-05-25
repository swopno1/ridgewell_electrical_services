// src/lib/config.ts
export const appConfig = {
  // Application Meta
  app: {
    name: 'Ridgewell ES',
    description: 'Employee Timesheet & Leave Management System',
    version: '0.1.0',
  },

  // Company Info
  company: {
    name: 'Ridgewell Electrical Services LTD.',
    email: 'support@ridgewelles.co.uk',
    phone: '+44 (0) 123 4567',
    website: 'https://ridgewelles.co.uk',
    address: 'Ridgewell Headquarters, UK',
    logo: '/logo_ridgewell_es.png',
    favicon: '/favicon.ico',
  },

  // Authentication
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    passwordMinLength: 8,
    passwordRequireUppercase: true,
    passwordRequireNumbers: true,
    passwordRequireSpecial: true,
    enableOAuth: true, // Can be disabled for MVP
    enableEmailVerification: false, // Set to true for production
  },

  // UI / Theme
  theme: {
    primaryColor: '#2563eb', // Blue
    accentColor: '#059669', // Green
    dangerColor: '#dc2626', // Red
    warningColor: '#f59e0b', // Amber
    darkMode: false,
    borderRadius: '0.5rem',
    defaultFontFamily: 'system-ui, -apple-system, sans-serif',
  },

  // Navigation
  navigation: {
    mainNav: [
      { label: 'Dashboard', href: '/dashboard', icon: 'LayoutDashboard' },
      { label: 'Timesheets', href: '/timesheets', icon: 'Clock' },
      { label: 'Leave', href: '/leave', icon: 'CalendarClock' },
      { label: 'Calendar', href: '/calendar', icon: 'Calendar' },
      { label: 'Projects', href: '/projects', icon: 'Briefcase' },
      { label: 'Reports', href: '/reports', icon: 'BarChart3' },
      { label: 'Employees', href: '/employees', icon: 'Users', adminOnly: true },
      { label: 'Settings', href: '/settings', icon: 'Settings', adminOnly: true },
      { label: 'Documentation', href: '/docs', icon: 'BookOpen' },
    ],
  },

  // Timesheet Settings
  timesheet: {
    workdayHours: 8,
    overtimeThreshold: 8,
    requiredBreakMinutes: 30,
    minEntryHours: 0.5,
    maxEntryHours: 14,
    timeEntryInterval: 15, // minutes
    allowFutureDates: false,
    pastDaysAllowed: 7, // can submit past n days
  },

  // Leave Settings
  leave: {
    annualLeaveEntitlement: 20, // days per year
    sickLeaveEntitlement: 10, // days per year
    leaveTypes: ['ANNUAL', 'SICK', 'UNPAID'],
    minLeaveRequestDays: 1,
    maxLeaveRequestDays: 30,
    minNoticeBeforeLeave: 2, // days
    requireApproval: true,
    autoApproveUnder24Hours: false,
  },

  // Pagination
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [10, 25, 50, 100],
  },

  // Timezone
  timezone: {
    default: 'UTC',
    userSelectable: true,
  },

  // Date Format
  dateFormat: {
    short: 'MMM dd, yyyy',
    long: 'EEEE, MMMM dd, yyyy',
    time: 'HH:mm',
    dateTime: 'MMM dd, yyyy HH:mm',
  },

  // Currency & Payroll
  payroll: {
    currency: 'USD',
    currencySymbol: '$',
    decimalPlaces: 2,
    hourlyRateEditable: true,
    overtimeMultiplier: 1.5,
  },

  // Report Settings
  reports: {
    exportFormats: ['CSV', 'PDF'],
    defaultFormat: 'PDF',
    includeEmployeePhotos: false,
    includeBankDetails: false,
  },

  // Feature Flags
  features: {
    timesheets: true,
    leave: true,
    projects: true,
    reports: true,
    calendar: true,
    approvals: true,
    multipleApprovers: false, // MVP: single approver
    notifications: false, // Future feature
    integrations: false, // Future feature
    advancedAnalytics: false, // Future feature
    geolocation: false, // Future feature
    mobileApp: false, // Future feature
  },

  // Footer
  footer: {
    showVersion: true,
    showLinks: true,
    links: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Support', href: '/support' },
    ],
  },

  // Email
  email: {
    from: 'noreply@ridgewelles.co.uk',
    fromName: 'Ridgewell ES',
    supportEmail: 'support@ridgewelles.co.uk',
    enableNotifications: false, // Future feature
  },

  // Security
  security: {
    enableRateLimit: true,
    rateLimitRequests: 100,
    rateLimitWindow: 15 * 60 * 1000, // 15 minutes
    enableAuditLog: true,
    logSensitiveData: false,
  },

  // API
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    enableCaching: true,
  },
};

// Helper function to get role permissions
export const rolePermissions = {
  ADMIN: {
    canManageEmployees: true,
    canApproveTimesheets: true,
    canApproveLeave: true,
    canManageProjects: true,
    canViewAllReports: true,
    canEditAnyTimesheet: true,
    canDeleteAnyRecord: true,
    canAccessSettings: true,
  },
  MANAGER: {
    canManageEmployees: false,
    canApproveTimesheets: true,
    canApproveLeave: true,
    canManageProjects: true,
    canViewAllReports: true,
    canEditAnyTimesheet: false,
    canDeleteAnyRecord: false,
    canAccessSettings: false,
  },
  EMPLOYEE: {
    canManageEmployees: false,
    canApproveTimesheets: false,
    canApproveLeave: false,
    canManageProjects: false,
    canViewAllReports: false,
    canEditAnyTimesheet: false,
    canDeleteAnyRecord: false,
    canAccessSettings: false,
  },
};

// Helper to check permissions
export const hasPermission = (role: string, permission: string): boolean => {
  const permissions = rolePermissions[role as keyof typeof rolePermissions];
  return permissions ? (permissions[permission as keyof typeof permissions] ?? false) : false;
};
