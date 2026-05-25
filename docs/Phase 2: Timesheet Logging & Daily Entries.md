# TimesheetPro: Timesheet Logging & Daily Shift Entries

This guide provides instructions for Employees on how to accurately record their daily work hours, manage their logs, and understand how the system handles time calculations.

## 1. Logging a Daily Shift

Recording your work hours should be done at the end of each shift or daily to ensure accuracy.

### Steps to Log a Shift:
1. Navigate to **Timesheets** in the sidebar.
2. Click the **Add Entry** button (or go to `/timesheets/new`).
3. **Select Project**: Choose the active project or client job you were working on from the dropdown menu.
4. **Select Date**: Pick the date for the work being logged.
5. **Set Time Parameters**:
    - **Time On**: Select your shift start time.
    - **Time Off**: Select your shift end time.
    - **Break Duration**: Choose your break length (15m, 30m, 45m, 1h, 2h).
6. **Notes / Scope of Work**: Provide a brief description of the tasks performed (e.g., "Initial wiring for Sector 4" or "General maintenance and testing").
7. Click **Save Entry**.

## 2. Automated Calculations

TimesheetPro automatically processes your inputs to provide clean data for payroll and project tracking.

### Total Hours Calculation
The system calculates your net working hours by subtracting the selected **Break Duration** from the total time between **Time On** and **Time Off**.
> *Example: 08:00 to 17:00 (9 hours) with a 1h break results in 8.0 Total Hours.*

### Overtime Tracking
The system features an automatic overtime threshold. Any hours worked beyond **8.0 hours** in a single day are automatically categorized as **Overtime (OT)**. This is displayed in your history for transparency.

## 3. Timesheet Management

You can review and manage your logged hours from the main Timesheets page.

### Browsing & Filtering
- **Search**: Use the search bar to find entries by project name.
- **Filter**: Filter your list by status (**PENDING**, **APPROVED**, **REJECTED**) to see which entries have been processed by your manager.

### Editing & Deleting Logs
If you make a mistake, you can correct it as long as the entry has not yet been approved.
1. Locate the entry in the table.
2. Click the **Edit** (pencil) or **Delete** (trash) icon.
3. Confirm your changes or deletion.

> [!IMPORTANT]
> **Locked Entries**
> Once a timesheet entry has been **APPROVED** or **REJECTED** by a manager, it is locked. You cannot edit or delete locked entries. If an approved entry requires a correction, you must contact your manager or an administrator.

---
