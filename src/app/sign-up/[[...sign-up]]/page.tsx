import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-slate-900">Create your account</h1>
          <p className="mt-2 text-sm text-slate-500">Join GoalTracker and start achieving your dreams.</p>
        </div>
        <SignUp 
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
