import { db } from "@/lib/db";
import { syncUser } from "@/actions/user";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Activity,
  Target,
  Award,
  Calendar
} from "lucide-react";
import { AnalyticsCharts } from "./analytics-charts";

import {
  getCachedTasksWithRoadmapTitles,
  getCachedAllMilestones
} from "@/lib/data-fetching";

export default async function AnalyticsPage() {
  const user = await syncUser();
  if (!user) return null;

  const tasks = await getCachedTasksWithRoadmapTitles(user.id);
  const completedTasks = tasks.filter(t => t.completed);

  // Compute Weekly Data
  const weeklyData = [];
  let tasksLast7Days = 0;
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const nextD = new Date(d);
    nextD.setDate(nextD.getDate() + 1);

    const dayTasks = completedTasks.filter(t => new Date(t.updatedAt) >= d && new Date(t.updatedAt) < nextD).length;
    tasksLast7Days += dayTasks;

    weeklyData.push({
      day: d.toLocaleDateString('en-US', { weekday: 'short' }),
      score: dayTasks * 15, // Pseudo productivity score
      tasks: dayTasks
    });
  }

  // Compute Category Data (Roadmap distribution)
  const roadmapCounts: Record<string, number> = {};
  completedTasks.forEach(t => {
    const title = t.milestone?.roadmap?.title || "Uncategorized";
    roadmapCounts[title] = (roadmapCounts[title] || 0) + 1;
  });

  const categoryData = Object.entries(roadmapCounts)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Compute completed milestones
  const allMilestones = await getCachedAllMilestones(user.id);
  const completedMilestones = allMilestones.filter(m =>
    m.tasks.length > 0 && m.tasks.every(t => t.completed)
  ).length;

  const weeklyAvg = Math.round(tasksLast7Days / 7);
  const focusTimeHours = Math.round((completedTasks.length * 30) / 60);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your productivity and performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Avg Tasks/Day", value: weeklyAvg.toString(), change: "This Week", trend: "up", icon: Activity },
          { title: "Total Tasks", value: completedTasks.length.toString(), change: "All Time", trend: "up", icon: Target },
          { title: "Milestones", value: completedMilestones.toString(), change: "Completed", trend: "up", icon: Award },
          { title: "Est. Focus Time", value: `${focusTimeHours}h`, change: "~30m/task", trend: "up", icon: Calendar },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
                  <stat.icon size={20} />
                </div>
                <Badge variant="outline" className={`border-none ${stat.trend === 'up' ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}>
                  {stat.change}
                </Badge>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <AnalyticsCharts weeklyData={weeklyData} categoryData={categoryData} />
    </div>
  );
}
