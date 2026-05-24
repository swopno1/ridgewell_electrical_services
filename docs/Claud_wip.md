Now please implement PHASE 1: CORE FEATURES (HIGH PRIORITY)

Effort: 15-20 hours | Impact: Foundation for real usage

1.1 Employee Management

Files to create:



* `src/app/employees/page.tsx` - List employees with filters

* `src/app/employees/new/page.tsx` - Create new employee

* `src/app/employees/[id]/page.tsx` - Edit employee

* `src/actions/employee.ts` - CRUD server actions

* `src/components/forms/EmployeeForm.tsx` - Reusable form

* `src/components/tables/EmployeeTable.tsx` - Table component

What it needs:



* List all employees with pagination

* Create new employee (admin only)

* Edit employee details (admin only)

* Deactivate/reactivate employee (admin only)

* Search/filter by name, role, status

* View employee statistics

Server Actions Required:

typescript



```typescript

- createEmployee(data)

- updateEmployee(id, data)

- deleteEmployee(id)

- getEmployees(filters, pagination)

- getEmployeeById(id)

- toggleEmployeeStatus(id)

```



UI Components:



* EmployeeForm with validation

* EmployeeTable with sorting

* Status badge (active/inactive)

* Delete confirmation dialog

1.2 Project Management

Files to create:



* `src/app/projects/page.tsx` - List projects

* `src/app/projects/new/page.tsx` - Create project

* `src/app/projects/[id]/page.tsx` - Edit project

* `src/actions/project.ts` - CRUD server actions

* `src/components/forms/ProjectForm.tsx` - Form

* `src/components/tables/ProjectTable.tsx` - Table

What it needs:



* List all projects with pagination

* Create new project

* Edit project details

* Deactivate/reactivate project

* Show total hours tracked per project

* Assign employees to projects (optional for MVP)

Server Actions Required:

typescript



```typescript

- createProject(data)

- updateProject(id, data)

- getProjects(filters, pagination)

- getProjectById(id)

- toggleProjectStatus(id)

- getProjectHoursSummary(id)

```



UI Components:



* ProjectForm with client field

* ProjectTable with hours summary

* Status toggle

* Delete confirmation

1.3 Timesheet System

Files to create:



* `src/app/timesheets/page.tsx` - List timesheets

* `src/app/timesheets/new/page.tsx` - Create timesheet

* `src/app/timesheets/[id]/page.tsx` - Edit/view timesheet

* `src/app/timesheets/approvals/page.tsx` - Manager approval queue

* `src/components/forms/TimesheetForm.tsx` - Form

* `src/components/tables/TimesheetTable.tsx` - Table

* `src/components/dialogs/ApprovalDialog.tsx` - Approval dialog

What it needs:



* Create daily timesheet entry

* Auto-calculate total hours & overtime

* Show time on/off with validation

* Track project assignment

* Add optional break time

* Add notes field

* Approval workflow (manager/admin)

* Rejection with comment

* Employee can edit pending entries

* Manager can approve/reject/comment

Server Actions Exist:



* ✅ createTimesheetAction

* ✅ updateTimesheetAction

* ✅ approveTimesheetAction

* ✅ rejectTimesheetAction

UI Components Needed:



* TimesheetForm with time pickers

* TimesheetTable with status badges

* ApprovalDialog for managers

* Status indicator (pending/approved/rejected)

* Hour summary display

1.4 Leave Management

Files to create:



* `src/app/leave/page.tsx` - List leave requests

* `src/app/leave/new/page.tsx` - Create leave request

* `src/app/leave/[id]/page.tsx` - View/detail

* `src/app/leave/approvals/page.tsx` - Manager approval queue

* `src/components/forms/LeaveRequestForm.tsx` - Form

* `src/components/tables/LeaveTable.tsx` - Table

* `src/components/widgets/LeaveBalance.tsx` - Balance widget

What it needs:



* Request leave with dates & type

* Show leave balance (annual/sick/unpaid)

* Calculate total days automatically

* Add reason field

* Manager approval workflow

* Rejection with comment

* Show leave history

* Display remaining balance

* Cancel pending requests

Server Actions Exist:



* ✅ createLeaveRequestAction

* ✅ updateLeaveRequestAction

* ✅ approveLeaveRequestAction

* ✅ rejectLeaveRequestAction

* ✅ getLeaveBalance

UI Components Needed:



* LeaveRequestForm with date range picker

* LeaveTable with type badge

* LeaveBalance widget

* Approval dialog

* Status indicator