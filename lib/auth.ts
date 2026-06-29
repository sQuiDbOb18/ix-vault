import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;

        const adminUsername = process.env.ADMIN_USERNAME;
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

        if (!adminUsername || !adminPasswordHash) {
          console.error("AUTH ERROR: missing ADMIN_USERNAME or ADMIN_PASSWORD_HASH");
          return null;
        }

        const usernameMatch = credentials.username.toLowerCase() === adminUsername.toLowerCase();
        const passwordMatch = await bcrypt.compare(credentials.password, adminPasswordHash);

        if (!usernameMatch || !passwordMatch) return null;

        return { id: "1", name: adminUsername, email: "admin@ixvault.local" };
      }
    })
  ],
  session: { strategy: "jwt", maxAge: 7 * 24 * 60 * 60 },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) session.user.name = token.name as string;
      return session;
    }
  }
};

export default NextAuth(authOptions);
