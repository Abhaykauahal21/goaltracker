import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MoreVertical,
  Layers,
  CheckSquare,
  Clock,
  ArrowRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getCachedUserRoadmapsTree } from "@/lib/data-fetching";
import { syncUser } from "@/actions/user";
import { CreateRoadmapDialog } from "@/components/features/create-roadmap-dialog";
import { UploadRoadmapDialog } from "@/components/features/upload-roadmap-dialog";
import { DeleteRoadmapDropdown } from "@/components/features/delete-roadmap-button";

export default async function RoadmapsPage() {
  const user = await syncUser();
  if (!user) return null;
  const roadmaps = await getCachedUserRoadmapsTree(user.id);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Roadmaps</h1>
          <p className="text-muted-foreground mt-1">Manage your long-term learning journeys and milestones.</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/roadmaps/generate">
            <Button variant="outline" className="gap-2 border-primary/20 hover:border-primary/40 text-primary">
              <Sparkles size={16} />
              Generate with AI
            </Button>
          </Link>
          <UploadRoadmapDialog />
          <CreateRoadmapDialog />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {roadmaps.map((roadmap) => {
          const totalTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.length, 0);
          const completedTasks = roadmap.milestones.reduce((acc, m) => acc + m.tasks.filter(t => t.completed).length, 0);
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return (
            <Card key={roadmap.id} className="group border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="secondary" className="bg-slate-100 text-slate-600 hover:bg-slate-200 border-none px-2 py-0">
                    Roadmap
                  </Badge>
                  <DeleteRoadmapDropdown roadmapId={roadmap.id} />
                </div>
                <CardTitle className="text-xl group-hover:text-primary transition-colors">{roadmap.title}</CardTitle>
                <CardDescription className="line-clamp-2 mt-2">{roadmap.description || "No description provided."}</CardDescription>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="space-y-4">
                  <div className="flex justify-between items-end text-sm">
                    <span className="text-muted-foreground">Overall Progress</span>
                    <span className="font-bold text-slate-900">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <Layers size={14} className="text-blue-500 mb-1" />
                      <span className="text-xs font-bold">{roadmap.milestones.length}</span>
                      <span className="text-[10px] text-muted-foreground">Milestones</span>
                    </div>
                    <div className="flex flex-col items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                      <CheckSquare size={14} className="text-green-500 mb-1" />
                      <span className="text-xs font-bold">{completedTasks}/{totalTasks}</span>
                      <span className="text-[10px] text-muted-foreground">Tasks</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-0 flex justify-between items-center text-xs text-muted-foreground border-t border-slate-50 mt-2 py-4">
                <span className="flex items-center">
                  <Clock size={12} className="mr-1" />
                  Created {new Date(roadmap.createdAt).toLocaleDateString()}
                </span>
                <Link href={`/roadmaps/${roadmap.id}`} className="text-primary font-medium hover:underline flex items-center">
                  View Details
                  <ArrowRight size={12} className="ml-1" />
                </Link>
              </CardFooter>
            </Card>
          );
        })}

        {roadmaps.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center p-12 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-500 font-medium text-lg">No roadmaps yet.</p>
            <p className="text-slate-400 text-sm mb-6">Create your first roadmap to start tracking your goals.</p>
            <CreateRoadmapDialog />
          </div>
        )}
      </div>
    </div>
  );
}

