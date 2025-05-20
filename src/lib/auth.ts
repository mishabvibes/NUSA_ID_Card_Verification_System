import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Username and password are required")
        }

        const adminUsername = process.env.ADMIN_USERNAME
        const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH

        if (!adminUsername || !adminPasswordHash) {
          throw new Error("Server configuration error")
        }

        if (credentials.username !== adminUsername) {
          throw new Error("Invalid credentials")
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, adminPasswordHash)
        if (!isPasswordValid) {
          throw new Error("Invalid credentials")
        }

        return {
          id: "1",
          name: "Admin",
          email: "admin@example.com",
          role: "admin",
        }
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).role = (user as any).role
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
      }
      return session
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
}