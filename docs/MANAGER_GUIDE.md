# TimesheetPro: Manager Approvals Queue & Project Tracking

Welcome to the TimesheetPro Manager Guide. This document provides comprehensive instructions for Managers and Administrators to efficiently navigate the approvals workflow, review employee submissions, and audit project performance.

## 1. Navigating the Approvals Queue

The Approvals Queue is the central hub for reviewing labor hours and time-off requests. To ensure a focused workflow, these queues are separated by type.

### Accessing the Queues
- **Timesheet Approvals**: Navigate to **Timesheets** in the sidebar and select the **Approvals Queue** tab (or go to `/timesheets/approvals`).
- **Leave Approvals**: Navigate to **Leave** in the sidebar and select the **Approvals Queue** tab (or go to `/leave/approvals`).

### Filtering and Searching
Both queues support real-time searching to help you locate specific submissions:
- **Employee Search**: Use the search bar at the top of the table to find entries by employee name or email.
- **Pending Focus**: By default, the approvals queue only displays entries with a **PENDING** status, allowing you to focus entirely on items requiring action.

## 2. Understanding Queue Metrics

At the top of each approval page, a set of stats cards provides an immediate summary of the pending workload:

- **Pending Submissions / Requests**: The total count of individual entries awaiting your review.
- **Total Pending Hours / Days**:
    - In **Timesheets**, this shows the aggregate sum of hours logged across all pending entries.
    - In **Leave**, this shows the total number of days requested across all pending entries.
- **Employees Submitting / Requesting**: The number of distinct staff members who have at least one item in the queue. This helps in identifying if a specific team member has a backlog of entries.

## 3. Reviewing Submissions

Managers have two primary ways to process submissions: Quick-Approvals for routine entries and Detailed Audits for thorough verification.

### Performing Quick-Approvals
For entries that appear correct at a glance:
1. **Locate the entry** in the list.
2. **Review the basic details** (Employee, Date, and Hours/Days).
3. **Click the Approve button** (check-mark icon) in the **Actions** column.
4. The entry is immediately updated to **APPROVED** and the UI will refresh.

### Performing Detailed Audits
Before approving more complex entries, follow these steps:
1. **Verify the Project/Client**: In the Timesheets queue, ensure hours are billed to the correct project and client.
2. **Inspect the Notes**: Check the **Notes / Scope of Work** for a clear description of tasks.
3. **Check Leave Entitlements**: For Leave requests, verify that the **Leave Type** and dates align with the team schedule.
4. **Finalize Action**: Click **Approve** if all details are correct, or proceed to **Reject** if corrections are needed.

## 4. Handling Rejections

When an entry is inaccurate, incomplete, or assigned to the wrong project, you should reject it to allow the employee to make corrections.

### Rejection Workflow:
1. **Click the Reject button** (X icon) in the **Actions** column for the specific entry.
2. **Open the Review dialog**: A modal will appear titled "Reject Timesheet Entry" or "Reject Leave Request".
3. **Provide mandatory feedback**: Enter a descriptive **Comment** explaining why the entry is being returned (e.g., "Missing detailed notes" or "Please re-allocate to Project X").
4. **Finalize Rejection**: Click the red **Reject** button within the dialog to complete the action.

> [!IMPORTANT]
> **Rejection Comments are Mandatory**
> You cannot finalize a rejection without providing a comment. This feedback is critical as it is displayed directly to the employee, guiding them on how to correct and resubmit their entry.

## 5. Project Auditing

The **Projects** module allows Managers and Administrators to track company jobs and audit the labor resources allocated to them.

### Accessing Project Summaries
1. Navigate to **Projects** in the sidebar.
2. View the **Stats Header** for a high-level summary of **Total Projects**, **Active Jobs**, and **Total Hours Tracked**.

### Verifying Client Descriptors
1. Each project is mapped to a specific **Client**.
2. Use the **Search bar** on the projects page to filter by client name.
3. Verify that project names and descriptions align with specific client engagements.

### Auditing Aggregate Hours
1. Review the **Hours Logged** column in the projects table.
2. These figures are an aggregate of all **APPROVED** timesheet entries linked to that project.
3. Click the **Edit** icon to view project details or the **Toggle Status** icon to move a project between **Active** and **Inactive** status.
