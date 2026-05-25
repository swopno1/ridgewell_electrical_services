# TimesheetPro: Admin Console, Directory & Reports

This guide is designed for **System Administrators** and **Managers** to help manage the workforce, project portfolio, and financial reporting within TimesheetPro.

---

## 1. Employee Directory Management

The Employee Directory is the central hub for managing your team's access and profiles. Only users with the **ADMIN** role can register new employees or modify existing accounts.

### Registering New Employees
To add a new member to the system:
1. Navigate to **Employees** in the sidebar.
2. Click the **Add Employee** button.
3. Fill in the required fields:
   - **Full Name**: The legal name of the employee.
   - **Email Address**: Used for login and system notifications.
   - **Role**: Select between **EMPLOYEE**, **MANAGER**, or **ADMIN**.
4. Click **Create Employee**.

#### Default Credentials & Setup
- **Automatic Leave Balance**: Upon registration, the system automatically initializes an annual leave balance of **20 days** for the current calendar year.
- **Initial Password**: New accounts are created with a default temporary password:
  `Employee@123456`
  Employees should be instructed to change this password immediately after their first login via the Settings page.

### Modifying Employee Details
To update an employee's profile:
1. Locate the employee in the directory list.
2. Click the **Edit** (pencil) icon.
3. Update the name, email, or role as needed.
4. Click **Save Changes**.

---

## 2. Account Deactivation

Managing the active status of accounts is critical for security and data integrity.

> [!CAUTION]
> **Immediate Impact of Deactivation**
> Toggling an account to **Inactive** has the following immediate effects:
> - The user is instantly blocked from logging into the system.
> - Any active sessions for that user are invalidated.
> - The user can no longer input timesheets or request leave.
> - Managers can still view historical data for inactive users in reports.

### How to Toggle Status
1. In the **Employees** list, locate the **Status** column.
2. Click the toggle switch next to the employee's name.
3. Confirm the action in the dialog box.

---

## 3. Project Administration

Projects allow for granular tracking of work hours. Managers and Admins can manage the project list to ensure employees are logging time against the correct client accounts.

### Creating New Projects
1. Navigate to **Projects** in the sidebar.
2. Click **Create Project**.
3. Provide the **Project Name**, **Client Name**, and an optional **Description**.
4. Set the initial status (Active/Inactive).
5. Click **Save Project**.

### Managing Project Status
- **Active Projects**: Visible to all employees in their timesheet dropdowns.
- **Inactive Projects**: Hidden from new timesheet entries but retained for historical reporting.

> [!IMPORTANT]
> **Mapping Restrictions**
> Deactivating a project does not delete existing timesheets associated with it, but it prevents any future logs from being recorded against that project.

---

## 4. Reports & Exports

TimesheetPro provides powerful reporting tools to summarize hours for payroll and project costing.

### Generating Summaries
1. Navigate to **Reports** in the sidebar.
2. Select the type of report:
   - **Hours Summary**: Total hours per employee (Regular vs. Overtime).
   - **Payroll Summary**: Comprehensive view including leave days for payroll processing.
   - **Project Report**: Aggregated hours logged against specific clients and projects.

### Selecting Reporting Periods
- Use the **Date Range Picker** to select a specific window (e.g., Last Week, Current Month, or a Custom Range).
- Reports are generated in real-time based on **APPROVED** timesheets only.

### Exporting Data
Once a report is generated, you can export the grid for use in external accounting software:
1. Click the **Export** button at the top of the report view.
2. Select your preferred format:
   - **CSV**: Best for Excel or importing into payroll systems.
   - **PDF**: Best for archiving or distribution.

---

© 2024 Ridgewell Electrical Services LTD. All rights reserved.
