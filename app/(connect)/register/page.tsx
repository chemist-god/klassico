import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const RegisterPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-950">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-xl bg-stone-900 flex flex-col gap-6">
        <div className="flex flex-col items-center mb-2">
          <span className="text-3xl font-bold text-primary mb-2">Create your account</span>
        </div>
        <form className="flex flex-col gap-4">
          <Input placeholder="Username" required />
          <Input placeholder="Email" type="email" required />
          <Input placeholder="Password" type="password" required />
          <Input placeholder="Confirm Password" type="password" required />
          <div className="flex items-center gap-2">
            <Input className="w-24" placeholder="19 + 18 = ?" required />
            <span className="text-xs text-muted-foreground">What's the answer?</span>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" required className="accent-primary" id="tos" />
            <label htmlFor="tos" className="text-xs text-muted-foreground">I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a></label>
          </div>
          <Button className="w-full mt-2" type="submit">Sign Up</Button>
        </form>
        <div className="text-center text-sm text-muted-foreground mt-2">
          Already have an account? <a href="/login" className="text-primary hover:underline">Sign in</a>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;