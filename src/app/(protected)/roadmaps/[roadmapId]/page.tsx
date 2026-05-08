import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, Circle, Clock, Layers } from "lucide-react";
import { AddMilestoneDialog } from "@/components/features/add-milestone-dialog";
import { AddTaskDialog } from "@/components/features/add-task-dialog";
import { RoadmapTaskItem } from "@/components/features/roadmap-task-item";
import { DeleteRoadmapDropdown } from "@/components/features/delete-roadmap-button";

export default async function RoadmapDetailsPage({ params }: { params: Promise<{ roadmapId: string }> }) {
  const { roadmapId } = await params;
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const roadmap = await db.roadmap.findUnique({
    where: { id: roadmapId },
    include: {
      milestones: {
        include: {
          tasks: {
            orderBy: [{ createdAt: "asc" }, { id: "asc" }]
          },
        },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
      },
    },
  });

  if (!roadmap) notFound();

  const totalTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
  const completedTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Layers size={14} />
            <span>Roadmap</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">{roadmap.title}</h1>
          <p className="text-muted-foreground mt-1">{roadmap.description}</p>
        </div>
        <div className="flex items-center gap-3">
          <AddMilestoneDialog roadmapId={roadmap.id} />
          <DeleteRoadmapDropdown roadmapId={roadmap.id} />
        </div>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardContent className="pt-6">
          <div className="flex justify-between items-end mb-4 text-sm font-medium">
            <span>Overall Completion</span>
            <span>{progress}% ({completedTasks}/{totalTasks} tasks)</span>
          </div>
          <Progress value={progress} className="h-3" />
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h2 className="text-xl font-bold text-foreground">Milestones</h2>
        {roadmap.milestones.map((milestone) => (
          <Card key={milestone.id} className="border-none shadow-sm bg-card overflow-hidden">
            <CardHeader className="bg-muted/50 pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg text-foreground">{milestone.title}</CardTitle>
                </div>
                <AddTaskDialog milestoneId={milestone.id} />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {milestone.tasks.map((task) => (
                  <RoadmapTaskItem key={task.id} task={task} />
                ))}
                {milestone.tasks.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-4 italic">
                    No tasks added to this milestone yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {roadmap.milestones.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">No milestones yet. Start by adding one!</p>
          </div>
        )}
      </div>
    </div>
  );
}
