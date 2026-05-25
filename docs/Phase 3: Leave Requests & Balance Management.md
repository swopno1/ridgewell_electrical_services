# TimesheetPro: Leave Requests & Balance Tracking

Manage your time off efficiently by tracking your entitlements and submitting requests through the Leave module.

## 1. Understanding the Leave Dashboard

The Leave page (`/leave`) provides a real-time view of your current standing for the calendar year.

### Metrics Explained
- **Annual Leave Progress**: A visual bar showing how many days of your yearly entitlement (typically 20 days) you have used.
- **Remaining Days**: Your "available to spend" balance for Annual Leave.
- **Sick Leave**: A counter showing the total number of approved sick days logged.
- **Unpaid Leave**: A counter for any approved unpaid time off.

## 2. Submitting Leave Requests

To request time off, follow these steps:

1. Navigate to **Leave** in the sidebar.
2. Click **Request Leave**.
3. **Select Leave Type**: Choose between **Annual**, **Sick**, or **Unpaid**.
4. **Choose Dates**: Select the **Start Date** and **End Date**.
5. **Review Duration**: The system will automatically calculate the total number of workdays in your selected range.
6. **Reason**: Provide a brief explanation for your request (minimum 10 characters).
7. Click **Submit Request**.

## 3. Balance Checks & Rules

TimesheetPro enforces strict balance rules to prevent payroll errors.

### Annual Leave Limits
You cannot submit an Annual Leave request that exceeds your remaining balance. If you attempt to request more days than you have "Entitled," you will receive an error message upon submission.

### Tracking Behaviors
| Leave Type | Impact on Balance | Approval Required |
| :--- | :--- | :--- |
| **Annual Leave** | Deducts from yearly entitlement | Yes |
| **Sick Leave** | Increments "Sick Used" counter | Yes |
| **Unpaid Leave** | No impact on paid balances | Yes |

## 4. Cancelling Requests

If your plans change, you can withdraw a leave request that has not yet been processed.

### How to Cancel:
1. Locate the request in the **Leave History & Requests** table.
2. Ensure the status is **PENDING**.
3. Click the **Cancel** button in the Actions column.
4. Confirm the action in the browser pop-up.

> [!WARNING]
> **Non-Retractable Cancellations**
> Once a request is cancelled, it cannot be "un-cancelled." You must submit a new request if you decide you need that time off after all. Additionally, you cannot cancel requests that have already been **Approved** or **Rejected**; for these, you must contact your manager directly.
