# TimesheetPro: Timesheet Logging & Daily Shift Entries

Welcome to the TimesheetPro User Guide. This document provides step-by-step instructions for employees to accurately record their work hours, manage their shifts, and understand how the system processes their data.

## 1. Log Daily Shift

Logging your daily shift is the primary way to ensure you are paid correctly and your work is tracked against the right projects.

### Step-by-Step Instructions:
1. **Navigate to Timesheets**: From the sidebar, click on **Timesheets**.
2. **Open the Log Form**: Click the **Log Hours** button located at the top right of the page.
3. **Select Project**: Choose the active project you worked on from the "Select Project" dropdown.
4. **Select Date**: Pick the date of the shift.
    > [!NOTE]
    > You can only log one timesheet entry per day. If you worked on multiple projects in a single day, please summarize the total hours and note the distribution in the "Notes" section, or consult your manager for project-specific logging.
5. **Fill Time Parameters**: Enter your start and end times (see Section 2).
6. **Submit**: Click **Log Time** to save your entry.

## 2. Entering Time Parameters

Accuracy in entering your start and end times is crucial for calculating your total hours.

- **Time On (Start Shift)**: Enter the exact time you began your work day.
- **Time Off (End Shift)**: Enter the exact time you finished your work day.
- **Break Duration**: Select your total break time from the dropdown menu. Options include:
  - **No Break (0 mins)**
  - **15 Minutes**
  - **30 Minutes**
  - **45 Minutes**
  - **1 Hour (60 mins)**
  - **1.5 Hours (90 mins)**
  - **2 Hours (120 mins)**

## 3. Notes & Scope of Work

The **Notes / Scope of Work** field is your opportunity to provide context for your shift. This information is often used for client billing and project management.

### Guidelines for Helpful Logs:
- **Be Specific**: Instead of "Worked on site," use "Rough-in wiring for 2nd floor office space."
- **Include Milestones**: Note any major tasks completed or significant progress made.
- **Clarity**: Keep summaries concise but descriptive enough for a manager to understand the work performed without further clarification.

## 4. Automated Calculations

TimesheetPro automatically handles the math to ensure consistency across the company.

### Total Hours
The system calculates your total work hours using the following logic:
`Total Hours = (Time Off - Time On) - Break Duration`

### Daily Overtime
The standard workday is set to **8.0 hours**. Any hours worked beyond this threshold in a single day are automatically flagged as overtime.
- **Example**: If you work 9.5 total hours, the system will record **8.0 Standard Hours** and **1.5 Overtime Hours**.

## 5. Timesheet Management

You can view and manage all your historical entries from the main **Timesheets** page.

### Features:
- **Search**: Use the search bar to find entries by **Project Name** or **Client**.
- **Filter by Status**: Use the dropdown menu to filter your view by:
  - **All Statuses**
  - **Pending**: Entries awaiting review.
  - **Approved**: Entries verified by a manager (Locked).
  - **Rejected**: Entries requiring correction.
- **Edit/Delete**: For pending entries, click the **Edit** (pencil) or **Delete** (trash can) icons in the Actions column.

## 6. Submission Constraints

To maintain data integrity and payroll accuracy, certain constraints apply to your entries.

> [!IMPORTANT]
> **Status-Based Locking**
> - **PENDING**: You can freely edit or delete entries while they are in 'Pending' status.
> - **APPROVED**: Once an entry is approved, it is locked. Approved entries **cannot** be modified or deleted. If you discover an error in an approved entry, please contact your manager.
> - **REJECTED**: If an entry is rejected, check the notes from your manager, make the necessary corrections, and re-submit.

> [!WARNING]
> **Duplicate Dates**
> The system prevents multiple entries for the same date. If you need to change a log for a specific date, you must edit the existing entry rather than creating a new one.
