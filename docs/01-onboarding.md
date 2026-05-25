# Onboarding & Setup

Welcome to **TimesheetPro**, your comprehensive solution for employee timesheet and leave management. This guide will help you navigate the initial setup, account management, and understand your role-based permissions within the platform.

---

## 1. Account Registration

Getting started with TimesheetPro begins with creating your personal account.

1.  **Navigate to Signup**: Visit the TimesheetPro homepage and click on the **Sign Up** link (usually found at `/auth/signup`).
2.  **Enter Your Details**:
    *   **Full Name**: Enter your first and last name.
    *   **Email Address**: Provide your corporate or preferred email. This will be your primary login identifier.
    *   **Password**: Choose a secure password.
        > [!TIP]
        > **Secure Passwords**
        > Passwords must be at least 8 characters long and typically require a mix of uppercase letters, numbers, and special characters for enhanced security.
3.  **Submit**: Click the **Create Account** button to register.

---

## 2. Email Verification Gate

To ensure the security of your data and verify ownership of your email address, TimesheetPro implements a verification gate.

1.  **Check Your Inbox**: After signing up, check your email for a verification message from TimesheetPro.
2.  **Activate Account**: Click the **Verify Email** button or the link provided in the email. This will activate your account and redirect you to the login page.
3.  **Handling Expired Links**: Verification links are valid for 24 hours. If your link has expired:
    *   Try to log in; you will be prompted with an "Email not verified" message.
    *   Click the **Resend Verification Link** button on the verification status page to receive a fresh link.

> [!IMPORTANT]
> **Verification Required**
> You will not be able to access the dashboard or log hours until your email address has been successfully verified.

---

## 3. Signing In

Once your account is active, you can sign in to access your dashboard.

1.  **Navigate to Sign In**: Go to the login page (at `/auth/signin`).
2.  **Enter Credentials**: Input your registered email address and password.
3.  **Access Granted**: Click **Sign In**. Upon success, you will be redirected to your personal dashboard.

> [!WARNING]
> **Invalid Credentials**
> If you enter an incorrect email or password, you will receive an "Invalid email or password" warning. For security reasons, the system does not specify which part of the credentials was incorrect.

---

## 4. Forgot Password Flow

If you lose access to your account, you can securely reset your password.

1.  **Request Reset**: On the Sign In page, click **Forgot Password?**.
2.  **Submit Email**: Enter the email address associated with your account and click **Send Reset Link**.
3.  **Check Email**: You will receive an email containing a secure, one-time-use reset link valid for 1 hour.
4.  **Set New Password**: Click the link in the email, enter your new password, and confirm it.
5.  **Complete Update**: Once submitted, your password will be updated, and you can sign in with your new credentials.

---

## 5. Role & Scope Permissions

TimesheetPro uses a Role-Based Access Control (RBAC) system to ensure users have the appropriate level of access. Below is a comparison of permissions for **Employee**, **Manager**, and **Admin** roles.

| Feature / Action | EMPLOYEE | MANAGER | ADMIN |
| :--- | :---: | :---: | :---: |
| **Log Working Hours** | ✅ | ✅ | ✅ |
| **Request Leave** | ✅ | ✅ | ✅ |
| **View Personal Reports** | ✅ | ✅ | ✅ |
| **Review/Approve Timesheets** | ❌ | ✅ | ✅ |
| **Review/Approve Leave** | ❌ | ✅ | ✅ |
| **Create/Manage Projects** | ❌ | ✅ | ✅ |
| **View All Company Reports** | ❌ | ✅ | ✅ |
| **Edit Employee Records** | ❌ | ❌ | ✅ |
| **Toggle User Active State** | ❌ | ❌ | ✅ |
| **Access System Settings** | ❌ | ❌ | ✅ |

### Key Definitions:
*   **Log Hours**: Ability to submit daily time entries against specific projects.
*   **Request Leave**: Ability to submit requests for Annual, Sick, or Unpaid leave.
*   **Approve Timesheets/Leave**: Managers and Admins can review and approve/reject submissions from their team members.
*   **Edit Employee Records**: Only Administrators can update user profiles, change roles, or modify base leave entitlements.
*   **Toggle User Active State**: Administrators can deactivate users to prevent them from logging in, without deleting their historical data.
