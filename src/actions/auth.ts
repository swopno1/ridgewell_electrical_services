// src/actions/auth.ts
'use server';

import { signIn, signOut } from 'next-auth/react';
import { prisma } from '@/lib/prisma';
import { hashPassword, validatePasswordStrength } from '@/lib/auth-utils';
import { z } from 'zod';

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

export async function signUpAction(formData: unknown) {
  try {
    const validatedData = signUpSchema.parse(formData);

    const existingUser = await prisma.user.findUnique({
      where: { email: validatedData.email },
    });

    if (existingUser) {
      return { error: 'Email already registered' };
    }

    const passwordCheck = validatePasswordStrength(validatedData.password);
    if (!passwordCheck.isValid) {
      return { error: passwordCheck.errors.join(', ') };
    }

    const hashedPassword = await hashPassword(validatedData.password);

    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: 'EMPLOYEE',
        active: true,
      },
    });

    return { success: true, userId: user.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to create account' };
  }
}

export async function signInAction(formData: unknown) {
  try {
    const validatedData = signInSchema.parse(formData);

    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    if (!result?.ok) {
      return { error: 'Invalid email or password' };
    }

    return { success: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: error.errors[0].message };
    }
    return { error: 'Failed to sign in' };
  }
}

export async function signOutAction() {
  await signOut({ redirect: false });
  return { success: true };
}
