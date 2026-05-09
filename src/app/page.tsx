import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, Star, Zap, Shield, BarChart, Menu, Map, Clock } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Navbar */}
      <header className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link className="flex items-center" href="/">
              <div className="bg-primary text-primary-foreground p-1 rounded-md mr-2">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <span className="font-bold text-xl tracking-tight">GoalTracker</span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#features">
                Features
              </Link>
              <Link className="text-sm font-medium text-slate-600 hover:text-primary transition-colors" href="#pricing">
                Pricing
              </Link>
              <div className="flex items-center gap-4 ml-4">
                <Link href="/sign-in">
                  <Button variant="ghost" size="sm">Log in</Button>
                </Link>
                <Link href="/sign-up">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            </nav>

            {/* Mobile Nav */}
            <div className="flex md:hidden items-center gap-4">
              <Link href="/sign-up">
                <Button size="sm">Get Started</Button>
              </Link>
              <Sheet>
              <SheetTrigger
                render={
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Menu className="h-5 w-5" />
                  </Button>
                }
              />
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <SheetHeader className="text-left pb-6 border-b">
                    <SheetTitle className="flex items-center gap-2">
                      <div className="bg-primary text-primary-foreground p-1 rounded-md">
                        <CheckCircle2 className="h-5 w-5" />
                      </div>
                      GoalTracker
                    </SheetTitle>
                    <SheetDescription>
                      Master your day and conquer your goals.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    <Link href="#features" className="text-lg font-medium hover:text-primary">
                      Features
                    </Link>
                    <Link href="#pricing" className="text-lg font-medium hover:text-primary">
                      Pricing
                    </Link>
                    <hr className="my-2" />
                    <Link href="/sign-in">
                      <Button variant="outline" className="w-full justify-center">Log in</Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full justify-center">Get Started Free</Button>
                    </Link>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative w-full pt-32 pb-16 md:pt-48 md:pb-32 lg:pt-56 lg:pb-40 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col items-center text-center space-y-8 md:space-y-12">
              <div className="space-y-4 md:space-y-6">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl break-words">
                  Master Your Day, <br className="hidden sm:block" />
                  <span className="text-primary">Conquer Your Goals.</span>
                </h1>
                <p className="mx-auto max-w-[800px] text-slate-500 text-lg md:text-xl lg:text-2xl leading-relaxed">
                  The modern productivity platform for roadmaps, daily planning, and tracking progress. Built for high-achievers.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                <Link href="/sign-up" className="w-full sm:w-auto">
                  <Button size="lg" className="h-14 px-10 text-lg font-semibold w-full sm:w-auto shadow-lg shadow-primary/20 group">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Button>
                </Link>
                <Link href="#features" className="w-full sm:w-auto">
                  <Button variant="outline" size="lg" className="h-14 px-10 text-lg font-semibold w-full sm:w-auto">
                    Explore Features
                  </Button>
                </Link>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 text-slate-500 mt-12 bg-slate-50/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-100">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-10 w-10 rounded-full border-2 border-white bg-slate-200 flex items-center justify-center overflow-hidden shadow-sm">
                      <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" className="h-full w-full object-cover" />
                    </div>
                  ))}
                </div>
                <p className="font-medium text-sm md:text-base whitespace-nowrap">
                  Joined by <span className="text-slate-900 font-bold">2,000+</span> productivity enthusiasts
                </p>
              </div>
            </div>
          </div>
          
          {/* Subtle Background Elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 md:py-32 bg-slate-50 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16 md:mb-24">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl lg:text-6xl break-words">Built for Modern Productivity</h2>
              <p className="mt-6 text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
                Everything you need to manage your learning journeys and daily execution in one premium workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
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
                <div key={idx} className="group bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="h-14 w-14 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-7 w-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-16 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="flex flex-col items-center md:items-start gap-4">
              <div className="flex items-center gap-2">
                <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="font-bold text-2xl tracking-tight">GoalTracker</span>
              </div>
              <p className="text-slate-500 max-w-xs text-center md:text-left">
                The modern roadmap and productivity tracker built for high-achievers.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-4 text-sm font-medium text-slate-500">
              <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-primary transition-colors">Twitter</Link>
              <Link href="#" className="hover:text-primary transition-colors">Support</Link>
            </div>
            <div className="flex flex-col items-center md:items-end gap-2 text-sm text-slate-400">
              <p>© 2026 GoalTracker Inc.</p>
              <p>All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
