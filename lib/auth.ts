import bcrypt from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "IX VAULT Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        const username = process.env.ADMIN_USERNAME;
        const passwordHash = process.env.ADMIN_PASSWORD_HASH;
        if (!username || !passwordHash || !credentials?.username || !credentials.password) return null;
        const userMatches = credentials.username.trim() === username;
        const passwordMatches = await bcrypt.compare(credentials.password, passwordHash);
        if (!userMatches || !passwordMatches) return null;
        return { id: "ix-vault-admin", name: username };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.name = user.name;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.name = token.name;
      return session;
    }
  }
};
