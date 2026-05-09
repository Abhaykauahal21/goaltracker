import { syncUser } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Flame,
  Trophy,
  Target,
  Clock,
  TrendingUp,
  CheckCircle2,
  Calendar as CalendarIcon,
  BarChart as BarChartIcon
} from "lucide-react";

import { db } from "@/lib/db";
import { WeeklyActivityChart } from "@/components/features/weekly-activity-chart";

import {
  getCachedUser,
  getCachedUserTasks,
  getCachedUpcomingTasks,
  getCachedActiveRoadmaps
} from "@/lib/data-fetching";

export default async function DashboardPage() {
  const user = await syncUser();
  if (!user) return null;

  const dbUser = await getCachedUser(user.id);
  const userTasks = await getCachedUserTasks(user.id);

  const totalTasks = userTasks.length;
  const completedTasksCount = userTasks.filter(t => t.completed).length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasksCount / totalTasks) * 100) : 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = userTasks.filter(t => t.completed && new Date(t.updatedAt) >= today).length;

  const stats = [
    {
      title: "Overall Progress",
      value: `${progressPercentage}%`,
      description: `${completedTasksCount} of ${totalTasks} tasks completed`,
      icon: Target,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      title: "Current Streak",
      value: `${dbUser?.streak || 0} Days`,
      description: "Keep it up!",
      icon: Flame,
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      title: "XP Points",
      value: (dbUser?.xp || 0).toLocaleString(),
      description: "Total Experience",
      icon: Trophy,
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      title: "Tasks Today",
      value: completedToday.toString(),
      description: "Completed since midnight",
      icon: TrendingUp,
      color: "text-green-600",
      bg: "bg-green-100",
    },
  ];

  const upcomingTasksData = await getCachedUpcomingTasks(user.id);

  const upcomingTasks = upcomingTasksData.map(t => ({
    title: t.title,
    project: t.milestone?.roadmap?.title || "No Roadmap",
    due: "Pending", // Add real due date logic if needed
    priority: t.priority
  }));

  const activeRoadmapsData = await getCachedActiveRoadmaps(user.id);

  const activeRoadmaps = activeRoadmapsData.map(r => {
    const rTotalTasks = r.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
    const rCompletedTasks = r.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
    return {
      title: r.title,
      progress: rTotalTasks > 0 ? Math.round((rCompletedTasks / rTotalTasks) * 100) : 0,
      milestones: r.milestones.length.toString()
    };
  });

  const weeklyData = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const count = userTasks.filter(t => t.completed && t.updatedAt >= d && t.updatedAt < nextD).length;

    weeklyData.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      completed: count
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center text-center sm:items-start sm:text-left space-y-1">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}! 👋</h1>
        <p className="text-muted-foreground">Here's what's happening with your goals today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-col items-center justify-center space-y-2 pb-2 text-center sm:flex-row sm:items-center sm:justify-between sm:space-y-0 sm:text-left">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                <stat.icon size={16} />
              </div>
            </CardHeader>
            <CardContent className="text-center sm:text-left">
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        {/* Weekly Analytics - Placeholder for Recharts */}
        <Card className="col-span-4 border-none shadow-sm bg-white">
          <CardHeader className="text-center sm:text-left">
            <CardTitle>Weekly Activity</CardTitle>
            <CardDescription>Your productivity across the last 7 days.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center m-6 mt-0">
            <WeeklyActivityChart data={weeklyData} />
          </CardContent>
        </Card>

        {/* Upcoming Tasks */}
        <Card className="col-span-3 border-none shadow-sm bg-white">
          <CardHeader className="text-center sm:text-left">
            <CardTitle>Upcoming Tasks</CardTitle>
            <CardDescription>Don't miss these deadlines.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingTasks.map((task, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100 gap-4 text-center sm:text-left">
                  <div className="flex flex-col items-center sm:flex-row gap-3">
                    <div className={`h-2 w-2 rounded-full hidden sm:block ${task.priority === 'HIGH' ? 'bg-red-500' :
                      task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                      }`} />
                    <div className="flex flex-col items-center sm:items-start">
                      <p className="text-sm font-medium leading-none">{task.title}</p>
                      <p className="text-xs text-muted-foreground mt-1">{task.project}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center sm:items-end">
                    <p className="text-xs font-medium">{task.due}</p>
                    <Badge variant="outline" className="text-[10px] h-4 mt-1">
                      {task.priority}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Active Roadmaps */}
        <Card className="col-span-2 border-none shadow-sm bg-white">
          <CardHeader className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <CardTitle>Active Roadmaps</CardTitle>
              <CardDescription>Progress tracking for your learning paths.</CardDescription>
            </div>
            <Badge variant="secondary" className="cursor-pointer hover:bg-secondary/80">View All</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {activeRoadmaps.map((roadmap, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-center sm:text-left">
                    <div className="flex flex-col items-center sm:flex-row gap-2">
                      <CheckCircle2 size={14} className="text-primary hidden sm:block" />
                      <span className="font-medium">{roadmap.title}</span>
                    </div>
                    <span className="text-muted-foreground">{roadmap.milestones} Milestones</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <Progress value={roadmap.progress ?? 0} className="h-2" />
                    <span className="text-xs font-bold w-8">{roadmap.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Quote / Gamification */}
        <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Trophy size={120} />
          </div>
          <CardHeader className="text-center sm:text-left">
            <CardTitle className="text-primary-foreground/90">Daily Motivation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-center sm:text-left">
            <p className="text-xl font-medium italic">
              "The secret of getting ahead is getting started."
            </p>
            <div className="pt-4 border-t border-primary-foreground/20">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm">Experience (Level {Math.floor((dbUser?.xp || 0) / 1000) + 1})</span>
                <span className="text-sm font-bold">{(dbUser?.xp || 0) % 1000} / 1000 XP</span>
              </div>
              <Progress value={((dbUser?.xp || 0) % 1000) / 10} className="h-2 bg-primary-foreground/20" />
            </div>
            <div className="flex justify-center sm:justify-start gap-2 pt-2">
              <Badge variant="secondary" className="bg-white/20 hover:bg-white/30 border-none text-white">
                +50 XP for next task
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
