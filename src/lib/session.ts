// src/lib/session.ts
import { auth } from '@/auth';

export async function getSession() {
  return auth();
}

export async function getCurrentUser() {
  const session = await getSession();
  return session?.user;
}
