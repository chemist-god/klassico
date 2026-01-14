import { RegisterForm } from "./register-form";
import { ROUTES } from "@/lib/utils/constants";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-card border border-border flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <span className="text-3xl font-bold text-primary mb-2">
            Create your account
          </span>
        </div>
        <RegisterForm />
        <div className="text-center text-sm text-muted-foreground mt-2">
          Already have an account?{" "}
          <a href={ROUTES.LOGIN} className="text-primary hover:underline">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}