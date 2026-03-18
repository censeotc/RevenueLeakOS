import { LoginForm } from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In — RevenueLeak OS",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-xl bg-blue-500 flex items-center justify-center">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <span className="text-white font-semibold text-xl">RevenueLeak OS</span>
          </div>
          <p className="text-slate-400 text-sm">Revenue recovery for home service businesses</p>
        </div>
        <LoginForm />
        <p className="text-center text-slate-500 text-xs mt-6">
          Demo credentials: owner@northshoreht.com / demo1234
        </p>
      </div>
    </div>
  );
}
