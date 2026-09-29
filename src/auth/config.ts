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

class AccountInactiveError extends CredentialsSignin {
  code = 'AccountInactive';
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

          if (!user || !user.password) {
            return null;
          }

          // Block sign in if email is not verified
          if (user.emailVerified === null) {
            throw new EmailNotVerifiedError();
          }

          const passwordsMatch = await comparePasswords(
            password,
            user.password
          );

          if (!passwordsMatch) {
            return null;
          }

          // Check if account is active after password verification
          if (!user.active) {
            throw new AccountInactiveError();
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.image,
            role: user.role,
          };
        } catch (error) {
          if (error instanceof EmailNotVerifiedError || error instanceof AccountInactiveError) {
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
        token.role = (user as any).role || 'EMPLOYEE';
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
    async authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const pathname = request.nextUrl.pathname;

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

      const isProtectedPath = protectedPaths.some((path) =>
        pathname.startsWith(path)
      );

      if (isProtectedPath && !isLoggedIn) {
        return false;
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
