import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Star, Zap, Shield, BarChart } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b border-slate-100 sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="/">
          <div className="bg-primary text-primary-foreground p-1 rounded-md mr-2">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <span className="font-bold text-xl tracking-tight">GoalTracker</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#pricing">
            Pricing
          </Link>
          <Link href="/sign-in">
            <Button variant="ghost" size="sm">Log in</Button>
          </Link>
          <Link href="/sign-up">
            <Button size="sm">Get Started</Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 px-4">
          <div className="container mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
                  Master Your Day, <br />
                  <span className="text-primary">Conquer Your Goals.</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl lg:text-2xl mt-4">
                  The modern productivity platform for roadmaps, daily planning, and tracking progress. Built for high-achievers.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <Link href="/sign-up">
                  <Button size="lg" className="h-12 px-8 text-lg font-medium group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="h-12 px-8 text-lg font-medium">
                    Explore Features
                  </Button>
                </Link>
              </div>
              <div className="flex items-center space-x-4 text-sm text-slate-500 mt-8">
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-8 w-8 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/150?u=${i}`} alt="User" />
                    </div>
                  ))}
                </div>
                <p>Joined by 2,000+ productivity enthusiasts</p>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-slate-50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Built for Modern Productivity</h2>
              <p className="mt-4 text-slate-600 max-w-2xl mx-auto text-lg">
                Everything you need to manage your learning journeys and daily execution in one premium workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Visual Roadmaps",
                  desc: "Create and manage complex learning paths with milestones and tasks.",
                  icon: Map,
                },
                {
                  title: "Daily Planner",
                  desc: "Organize your day with a smart planner, priorities, and DND support.",
                  icon: Clock,
                },
                {
                  title: "Advanced Analytics",
                  desc: "Monitor your progress with beautiful charts and productivity scores.",
                  icon: BarChart,
                },
                {
                  title: "Gamification",
                  desc: "Stay motivated with streaks, XP points, and achievement badges.",
                  icon: Star,
                },
                {
                  title: "Smart Sync",
                  desc: "Your data stays in sync across all your devices in real-time.",
                  icon: Zap,
                },
                {
                  title: "Privacy First",
                  desc: "Your data is encrypted and secure. You own your information.",
                  icon: Shield,
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="h-12 w-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6">
                    {/* @ts-ignore */}
                    <feature.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-slate-600">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1 rounded-md">
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <span className="font-bold text-lg">GoalTracker</span>
            </div>
            <p className="text-sm text-slate-500">The modern roadmap and productivity tracker.</p>
          </div>
          <div className="flex gap-8 text-sm text-slate-500">
            <Link href="#" className="hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary">Terms of Service</Link>
            <Link href="#" className="hover:text-primary">Twitter</Link>
            <Link href="#" className="hover:text-primary">Support</Link>
          </div>
          <p className="text-sm text-slate-400">© 2026 GoalTracker Inc. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

// Map icon was missing in import, adding it here for the feature list
import { Map, Clock } from "lucide-react";
