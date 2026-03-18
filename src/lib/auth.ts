import type { DefaultSession, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { getStore } from "@/lib/demo-data";
import type { UserRole } from "@/types/domain";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
      businessId: string;
    };
  }

  interface User {
    role: UserRole;
    businessId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: UserRole;
    businessId?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "Demo credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          return null;
        }

        const store = getStore();
        const demoEmail = process.env.DEMO_USER_EMAIL ?? "owner@northshore.demo";
        const demoPassword = process.env.DEMO_USER_PASSWORD ?? "demo1234";
        const user = store.users.find((item) => item.email === credentials.email);

        if (!user) {
          return null;
        }

        if (credentials.email != demoEmail || credentials.password != demoPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          businessId: user.businessId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.businessId = user.businessId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub && token.role && token.businessId) {
        session.user.id = token.sub;
        session.user.role = token.role;
        session.user.businessId = token.businessId;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
};

export function auth() {
  return getServerSession(authOptions);
}
