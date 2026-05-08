import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Welcome back</h1>
          <p className="mt-2 text-sm text-slate-500">Sign in to your GoalTracker account to continue.</p>
        </div>
        <SignIn 
          forceRedirectUrl="/dashboard"
          appearance={{
            elements: {
              formButtonPrimary: "bg-primary hover:bg-primary/90 text-sm",
              card: "shadow-none border border-slate-200 rounded-2xl",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
            }
          }}
        />
      </div>
    </div>
  );
}
