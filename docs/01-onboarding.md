# Onboarding & Setup

Welcome to **Ridgewell ES**, the timesheet and leave management system for Ridgewell Electrical Services. This guide will help you set up your account, understand your role permissions, and get started quickly.

---

## 1. Account Registration

Getting started begins with creating your personal account.

1. **Navigate to Sign Up**: Visit the Ridgewell ES homepage and click **Sign Up** (at `/auth/signup`).
2. **Enter Your Details**:
   - **Full Name**: Your first and last name.
   - **Email Address**: Your company email — this is your login identifier.
   - **Password**: Choose a secure password.

> **Password Requirements**
> Passwords must be at least **8 characters** and include an uppercase letter, a number, and a special character.

3. **Submit**: Click **Create Account** to register.

---

## 2. Account Activation

New accounts are set to **inactive** by default. Before you can log in, an Administrator must activate your account. Once activated you will be able to sign in immediately.

If you have not heard back within a reasonable time, contact your system administrator directly.

---

## 3. Signing In

Once your account is active, you can sign in.

1. **Navigate to Sign In**: Go to `/auth/signin`.
2. **Enter Credentials**: Your registered email address and password.
3. **Access Dashboard**: Click **Sign In** to reach your personal dashboard.

> **Invalid Credentials**
> If your email or password is incorrect, the system will display a generic error. It does not confirm which field is wrong — this is a security measure.

---

## 4. Forgot Password Flow

If you lose access to your account:

1. On the Sign In page, click **Forgot Password?**.
2. Enter the email address on your account and click **Send Reset Link**.
3. Check your inbox for a secure reset link, valid for **1 hour**.
4. Click the link, enter your new password, and confirm it.
5. Your password is updated — sign in with your new credentials.

---

## 5. Role & Scope Permissions

Ridgewell ES uses Role-Based Access Control (RBAC) to ensure each user has the right level of access.

| Feature / Action | EMPLOYEE | MANAGER | ADMIN |
| :--- | :---: | :---: | :---: |
| **Log Working Hours** | ✅ | ✅ | ✅ |
| **Request Leave** | ✅ | ✅ | ✅ |
| **View Personal Calendar** | ✅ | ✅ | ✅ |
| **View Personal Reports** | ✅ | ✅ | ✅ |
| **Review / Approve Timesheets** | ❌ | ✅ | ✅ |
| **Review / Approve Leave** | ❌ | ✅ | ✅ |
| **View Full Team Calendar** | ❌ | ✅ | ✅ |
| **Create / Manage Projects** | ❌ | ✅ | ✅ |
| **View All Company Reports** | ❌ | ✅ | ✅ |
| **Edit Employee Records** | ❌ | ❌ | ✅ |
| **Activate / Deactivate Users** | ❌ | ❌ | ✅ |
| **Access System Settings** | ❌ | ❌ | ✅ |

### Role Definitions

- **EMPLOYEE** — Can log hours and request leave. Sees their own data only.
- **MANAGER** — Everything an Employee can do, plus approving submissions and viewing the full team calendar and reports.
- **ADMIN** — Full access. Can manage users, projects, system settings, and all data.
