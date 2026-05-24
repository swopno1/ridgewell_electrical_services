// src/auth/config.ts
import type { NextAuthConfig } from 'next-auth';
import { CredentialsSignin } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from '@/lib/prisma';
import { comparePasswords, hashPassword } from '@/lib/auth-utils';
import { z } from 'zod';

class EmailNotVerifiedError extends CredentialsSignin {
  code = 'EmailNotVerified';
}

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const authConfig = {
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const { email, password } = credentialsSchema.parse(credentials);

          const user = await prisma.user.findUnique({
            where: { email },
          });

          if (!user || !user.password || !user.active) {
            return null;
          }

          // Force amirhossain.limon@gmail.com to be ADMIN
          const isLimon = email.toLowerCase() === 'amirhossain.limon@gmail.com';
          const resolvedRole = isLimon ? 'ADMIN' : user.role;

          // Block sign in if email is not verified (except for Limon admin email)
          if (!isLimon && user.emailVerified === null) {
            throw new EmailNotVerifiedError();
          }

          const passwordsMatch = await comparePasswords(
            password,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: resolvedRole,
          };
        } catch (error) {
          if (error instanceof EmailNotVerifiedError) {
            throw error;
          }
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        const isLimon = user.email?.toLowerCase() === 'amirhossain.limon@gmail.com';
        token.role = isLimon ? 'ADMIN' : ((user as any).role || 'EMPLOYEE');
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        const isLimon = session.user.email?.toLowerCase() === 'amirhossain.limon@gmail.com';
        session.user.role = isLimon ? 'ADMIN' : (token.role as string);
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;

      if (!isLoggedIn) {
        return false;
      }

      // Protected routes
      const protectedPaths = [
        '/dashboard',
        '/timesheets',
        '/leave',
        '/projects',
        '/reports',
        '/employees',
        '/settings',
      ];

      const pathname = request.nextUrl.pathname;
      const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (isProtectedPath) {
        return true;
      }

      return true;
    },
  },
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;

// Helper function to create default admin user
export async function createDefaultAdmin() {
  const adminEmail = process.env.DEFAULT_ADMIN_EMAIL || 'admin@example.com';
  const adminPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'Admin@123456';

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await hashPassword(adminPassword);
    await prisma.user.create({
      data: {
        name: 'Admin User',
        email: adminEmail,
        password: hashedPassword,
        role: 'ADMIN',
        active: true,
      },
    });
    console.log(`Default admin created: ${adminEmail}`);
  }
}
