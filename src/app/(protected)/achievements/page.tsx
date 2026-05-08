import { db } from "@/lib/db";
import { syncUser } from "@/actions/user";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Trophy,
  Star,
  Flame,
  Zap,
  Shield,
  Target,
  Lock,
  CheckCircle2
} from "lucide-react";

import {
  getCachedUser,
  getCachedTasksWithRoadmapTitles,
  getCachedAllMilestones,
  getCachedActiveRoadmaps
} from "@/lib/data-fetching";

export default async function AchievementsPage() {
  const user = await syncUser();
  if (!user) return null;

  const dbUser = await getCachedUser(user.id);
  const tasks = await getCachedTasksWithRoadmapTitles(user.id);

  const completedTasks = tasks.filter(t => t.completed);

  // Early Bird: completed any task before 8 AM
  const hasEarlyBird = completedTasks.some(t => {
    const hours = new Date(t.updatedAt).getHours();
    return hours >= 4 && hours <= 8; // Assuming 4 AM to 8 AM is early bird
  });

  // Consistency King: streak >= 7
  const hasConsistency = (dbUser?.streak || 0) >= 7;

  // Milestone Master: complete 10 milestones
  const allMilestones = await getCachedAllMilestones(user.id);
  const completedMilestones = allMilestones.filter(m =>
    m.tasks.length > 0 && m.tasks.every(t => t.completed)
  ).length;
  const milestoneProgress = Math.min(100, Math.round((completedMilestones / 10) * 100));

  // Knowledge Seeker: Finish one roadmap entirely
  const activeRoadmapsData = await getCachedActiveRoadmaps(user.id);
  const hasKnowledgeSeeker = activeRoadmapsData.some(r => {
    const rTotalTasks = r.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
    const rCompletedTasks = r.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
    return rTotalTasks > 0 && rCompletedTasks === rTotalTasks;
  });

  // Productivity Ninja: Complete 5 tasks today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const completedToday = completedTasks.filter(t => new Date(t.updatedAt) >= today).length;
  const ninjaProgress = Math.min(100, Math.round((completedToday / 5) * 100));

  const achievements = [
    {
      id: 1,
      title: "Early Bird",
      description: "Complete a task between 4:00 AM and 8:00 AM.",
      icon: Zap,
      status: hasEarlyBird ? "UNLOCKED" : "LOCKED",
      color: "text-yellow-600",
      bg: "bg-yellow-100",
    },
    {
      id: 2,
      title: "Consistency King",
      description: "Maintain a 7-day streak of daily goals.",
      icon: Flame,
      status: hasConsistency ? "UNLOCKED" : "IN_PROGRESS",
      progress: Math.min(100, Math.round(((dbUser?.streak || 0) / 7) * 100)),
      color: "text-orange-600",
      bg: "bg-orange-100",
    },
    {
      id: 3,
      title: "Milestone Master",
      description: `Complete 10 milestones (${completedMilestones}/10).`,
      icon: Target,
      status: completedMilestones >= 10 ? "UNLOCKED" : "IN_PROGRESS",
      progress: milestoneProgress,
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      id: 4,
      title: "Knowledge Seeker",
      description: "Finish your first roadmap completely.",
      icon: Star,
      status: hasKnowledgeSeeker ? "UNLOCKED" : "LOCKED",
      color: hasKnowledgeSeeker ? "text-purple-600" : "text-slate-400",
      bg: hasKnowledgeSeeker ? "bg-purple-100" : "bg-slate-100",
    },
    {
      id: 5,
      title: "Productivity Ninja",
      description: `Complete 5 tasks in a single day (${completedToday}/5 today).`,
      icon: Shield,
      status: completedToday >= 5 ? "UNLOCKED" : "IN_PROGRESS",
      progress: ninjaProgress,
      color: completedToday >= 5 ? "text-emerald-600" : "text-slate-400",
      bg: completedToday >= 5 ? "bg-emerald-100" : "bg-slate-100",
    },
  ];

  const currentLevel = Math.floor((dbUser?.xp || 0) / 1000) + 1;
  const currentLevelXp = (dbUser?.xp || 0) % 1000;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Achievements</h1>
          <p className="text-muted-foreground">Celebrate your progress and unlock special badges.</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Total XP</p>
          <p className="text-3xl font-bold text-primary">{(dbUser?.xp || 0).toLocaleString()}</p>
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-5">
          <Trophy size={160} />
        </div>
        <CardHeader>
          <CardTitle>Level {currentLevel} Achiever</CardTitle>
          <CardDescription>Keep completing tasks to level up!</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 max-w-md">
            <div className="flex justify-between text-sm font-medium">
              <span>Progress to Level {currentLevel + 1}</span>
              <span>{currentLevelXp} / 1000 XP</span>
            </div>
            <Progress value={currentLevelXp / 10} className="h-3" />
            <p className="text-xs text-muted-foreground">Unlock more features as you climb the ranks.</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((achievement) => (
          <Card key={achievement.id} className={`border-none shadow-sm transition-all ${achievement.status === 'LOCKED' ? 'opacity-60 bg-slate-50' : 'bg-white hover:shadow-md'
            }`}>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shrink-0 ${achievement.bg} ${achievement.color}`}>
                  {achievement.status === 'LOCKED' ? <Lock size={24} /> : <achievement.icon size={24} />}
                </div>
                <div className="space-y-1 flex-1">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">{achievement.title}</h3>
                    {achievement.status === 'UNLOCKED' && <CheckCircle2 size={16} className="text-green-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {achievement.description}
                  </p>

                  {achievement.status === 'IN_PROGRESS' && (
                    <div className="pt-3 space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold">
                        <span>Progress</span>
                        <span>{achievement.progress}%</span>
                      </div>
                      <Progress value={achievement.progress ?? 0} className="h-1.5" />
                    </div>
                  )}

                  {achievement.status === 'UNLOCKED' && (
                    <Badge variant="outline" className="text-[10px] h-4 mt-3 bg-green-50 text-green-600 border-green-200 font-medium">
                      UNLOCKED
                    </Badge>
                  )}

                  {achievement.status === 'LOCKED' && (
                    <Badge variant="outline" className="text-[10px] h-4 mt-3 bg-white text-slate-400 border-slate-200 font-medium">
                      LOCKED
                    </Badge>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
