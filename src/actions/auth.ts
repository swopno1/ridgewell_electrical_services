// src/actions/auth.ts
'use server';

import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/auth-utils';
import { z } from 'zod';
import { signIn, signOut } from '@/auth';
import { sendEmail } from '@/lib/email';
import { revalidatePath } from 'next/cache';
import { AuthError } from 'next-auth';
import { appConfig } from '@/lib/config';

const signUpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const signInSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email address'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Helper to generate a random hex token
function generateToken(): string {
  return Array.from({ length: 32 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

export async function signUpAction(formData: unknown) {
  try {
    const validatedData = signUpSchema.parse(formData);
    const email = validatedData.email.toLowerCase();

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    const passwordCheck = validatePasswordStrength(validatedData.password);
    if (!passwordCheck.isValid) {
      return { error: passwordCheck.errors.join(', ') };
    }

    const hashedPassword = await hashPassword(validatedData.password);

    // amirhossain.limon@gmail.com is forced to ADMIN and automatically verified/active
    const isLimon = email === 'amirhossain.limon@gmail.com';
    const role = isLimon ? 'ADMIN' : 'EMPLOYEE';
    const emailVerified = isLimon ? new Date() : null;
    const active = isLimon;

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email,
        password: hashedPassword,
        role,
        active,
        emailVerified,
      },
    });

    // Seed initial leave balance for new users
    const year = new Date().getFullYear();
    await prisma.leaveBalance.create({
      data: {
        userId: user.id,
        year,
        annualEntitled: 20,
        annualUsed: 0,
        sickUsed: 0,
      },
    });

    // If verified immediately (e.g. Limon), return success
    if (isLimon) {
      return { success: true, verified: true };
    }

    // Delete any existing tokens for this email first
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    // Otherwise, generate verification token and send email
    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyLink = `${appUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      text: `Hi ${user.name},\n\nPlease verify your email by clicking the following link:\n${verifyLink}\n\nAfter verification, an administrator will review and activate your account.\n\nThis link is valid for 24 hours.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #2563eb;">Verify Your Email Address</h2>
          <p>Hi ${user.name},</p>
          <p>Thank you for signing up for ${appConfig.app.name}. Please click the button below to verify your email address:</p>
          <div style="margin: 24px 0;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 14px; color: #475569;">After verification, your account will be queued for administrator review and activation. You will receive an email once your account is ready to use.</p>
          <p style="font-size: 12px; color: #64748b;">Or copy and paste this link into your browser: <br/> ${verifyLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b;">This verification link is valid for 24 hours.</p>
        </div>
      `,
    });

    return { success: true, verified: false };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Sign-up error:', error);
    return { error: 'Failed to create account. Please try again.' };
  }
}

export async function verifyEmailAction(token: string, email: string) {
  try {
    const cleanedEmail = email.toLowerCase();
    
    const dbToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: cleanedEmail,
        token,
      },
    });

    if (!dbToken) {
      return { error: 'Invalid verification token.' };
    }

    if (dbToken.expires < new Date()) {
      // Clean up expired token
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: cleanedEmail,
            token,
          },
        },
      });
      return { error: 'Verification token has expired. Please request a new one.' };
    }

    // Update user and delete token
    await prisma.$transaction([
      prisma.user.update({
        where: { email: cleanedEmail },
        data: { emailVerified: new Date() },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: cleanedEmail,
            token,
          },
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    console.error('Email verification error:', error);
    return { error: 'Failed to verify email. Please try again.' };
  }
}

export async function resendVerificationAction(formData: { email: string }) {
  try {
    const email = formData.email.toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Secure response: do not disclose that user doesn't exist
      return { success: true };
    }

    if (user.emailVerified) {
      return { error: 'This email is already verified. Please sign in.' };
    }

    // Delete existing tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: email },
    });

    const token = generateToken();
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.verificationToken.create({
      data: {
        identifier: email,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const verifyLink = `${appUrl}/auth/verify-email?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      text: `Hi ${user.name},\n\nPlease verify your email by clicking the following link:\n${verifyLink}\n\nThis link is valid for 24 hours.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #2563eb;">Verify Your Email Address</h2>
          <p>Hi ${user.name},</p>
          <p>You requested a new verification link. Please click below to verify your email address:</p>
          <div style="margin: 24px 0;">
            <a href="${verifyLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Verify Email Address</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Or copy and paste this link into your browser: <br/> ${verifyLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b;">This link is valid for 24 hours.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    console.error('Resend verification error:', error);
    return { error: 'Failed to resend verification email.' };
  }
}

export async function forgotPasswordAction(formData: unknown) {
  try {
    const validated = forgotPasswordSchema.parse(formData);
    const email = validated.email.toLowerCase();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      // Secure response: do not disclose that user doesn't exist
      return { success: true };
    }

    // Generate reset token stored in VerificationToken with prefix identifier "reset:{email}"
    const resetIdentifier = `reset:${email}`;
    await prisma.verificationToken.deleteMany({
      where: { identifier: resetIdentifier },
    });

    const token = generateToken();
    const expires = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour validity

    await prisma.verificationToken.create({
      data: {
        identifier: resetIdentifier,
        token,
        expires,
      },
    });

    const appUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const resetLink = `${appUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;

    await sendEmail({
      to: email,
      subject: 'Reset Your Password',
      text: `Hi ${user.name},\n\nYou requested to reset your password. Please click the link below to set a new password:\n${resetLink}\n\nThis link is valid for 1 hour. If you did not make this request, you can ignore this email.`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; rounded: 8px;">
          <h2 style="color: #2563eb;">Reset Your Password</h2>
          <p>Hi ${user.name},</p>
          <p>We received a request to reset your password. Click the button below to configure a new one:</p>
          <div style="margin: 24px 0;">
            <a href="${resetLink}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
          </div>
          <p style="font-size: 12px; color: #64748b;">Or copy and paste this link into your browser: <br/> ${resetLink}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="font-size: 12px; color: #64748b;">This password reset link is valid for 1 hour.</p>
        </div>
      `,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Forgot password error:', error);
    return { error: 'Failed to process password reset request.' };
  }
}

export async function resetPasswordAction(formData: unknown) {
  try {
    const validated = resetPasswordSchema.parse(formData);
    const email = validated.email.toLowerCase();
    const resetIdentifier = `reset:${email}`;

    const dbToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: resetIdentifier,
        token: validated.token,
      },
    });

    if (!dbToken) {
      return { error: 'Invalid or expired password reset token.' };
    }

    if (dbToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: resetIdentifier,
            token: validated.token,
          },
        },
      });
      return { error: 'Reset token has expired. Please request a new one.' };
    }

    const passwordCheck = validatePasswordStrength(validated.password);
    if (!passwordCheck.isValid) {
      return { error: passwordCheck.errors.join(', ') };
    }

    const hashedPassword = await hashPassword(validated.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: { password: hashedPassword },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: resetIdentifier,
            token: validated.token,
          },
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Reset password error:', error);
    return { error: 'Failed to reset password.' };
  }
}

export async function signInAction(formData: unknown) {
  try {
    const validatedData = signInSchema.parse(formData);

    await signIn('credentials', {
      email: validatedData.email.toLowerCase(),
      password: validatedData.password,
      redirect: false,
    });

    return { success: true };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }

    // Inspect next-auth auth-errors
    if (error instanceof AuthError) {
      const cause = error.cause as any;
      if (cause?.err?.code === 'EmailNotVerified' || error.message?.includes('EmailNotVerified')) {
        return { error: 'EmailNotVerified' };
      }
      if (cause?.err?.code === 'AccountInactive' || error.message?.includes('AccountInactive')) {
        return { error: 'AccountInactive' };
      }
      return { error: 'Invalid email or password' };
    }

    // Re-throw redirect errors so Next.js handles route transitions
    if (error.name === 'RedirectError' || error.message === 'NEXT_REDIRECT') {
      throw error;
    }

    console.error('Sign-in action error:', error);
    return { error: 'Invalid email or password' };
  }
}

export async function signOutAction() {
  await signOut({ redirect: false });
  revalidatePath('/dashboard');
  return { success: true };
}

const setupPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export async function setupPasswordAction(formData: unknown) {
  try {
    const validated = setupPasswordSchema.parse(formData);
    const email = validated.email.toLowerCase();
    const setupIdentifier = `setup:${email}`;

    const dbToken = await prisma.verificationToken.findFirst({
      where: {
        identifier: setupIdentifier,
        token: validated.token,
      },
    });

    if (!dbToken) {
      return { error: 'Invalid or expired setup token.' };
    }

    if (dbToken.expires < new Date()) {
      await prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: setupIdentifier,
            token: validated.token,
          },
        },
      });
      return { error: 'Setup token has expired. Please contact your administrator.' };
    }

    const passwordCheck = validatePasswordStrength(validated.password);
    if (!passwordCheck.isValid) {
      return { error: passwordCheck.errors.join(', ') };
    }

    const hashedPassword = await hashPassword(validated.password);

    await prisma.$transaction([
      prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          emailVerified: new Date(), // Mark email as verified since they clicked the link
        },
      }),
      prisma.verificationToken.delete({
        where: {
          identifier_token: {
            identifier: setupIdentifier,
            token: validated.token,
          },
        },
      }),
    ]);

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    console.error('Setup password error:', error);
    return { error: 'Failed to set up password.' };
  }
}
