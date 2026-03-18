import { DefaultSession } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";
import { UserRoleValue } from "@/lib/domain/types";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRoleValue;
      businessId: string;
    };
  }

  interface User {
    role: UserRoleValue;
    businessId: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRoleValue;
    businessId?: string;
  }
}
