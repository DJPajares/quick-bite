import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash =
          process.env.ADMIN_PASSWORD_HASH ||
          '$2b$10$SQZSMA3QndL5KyRcJRpUvuzpHRtiif94dL5GbCVpyhmB4HgY5u8d2';

        if (!adminUsername || !adminPasswordHash) {
          console.error('Admin credentials not configured');
          return null;
        }

        if (credentials.username !== adminUsername) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          adminPasswordHash,
        );

        if (!isValid) {
          return null;
        }

        return {
          id: '1',
          name: credentials.username as string,
          role: 'admin',
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/admin/login',
  },
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
  },
});
