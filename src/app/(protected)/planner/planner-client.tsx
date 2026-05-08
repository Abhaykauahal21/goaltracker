"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  RotateCcw,
  Plus,
  GripVertical,
  CheckCircle2,
  Circle,
  Calendar as CalendarIcon,
  Trash2,
  ExternalLink
} from "lucide-react";
import { toggleTask, deleteTask } from "@/actions/tasks";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface Task {
  id: string;
  title: string;
  priority: string;
  completed: boolean;
  status: string;
  externalUrl: string | null;
}

function PlannerTaskItem({ task, handleDelete }: { task: Task, handleDelete: (id: string) => void }) {
  const router = useRouter();
  const [completed, setCompleted] = useState(task.completed);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const newCompleted = !completed;
    setCompleted(newCompleted); // instant UI update
    startTransition(async () => {
      try {
        await toggleTask(task.id, newCompleted);
        router.refresh();
      } catch (error) {
        setCompleted(!newCompleted); // revert
        console.error(error);
      }
    });
  };

  return (
    <div className={`flex items-center justify-between p-4 rounded-xl border transition-all ${completed ? 'bg-white border-slate-100' : 'bg-white border-slate-100 hover:border-primary/30 hover:shadow-sm'
      }`}>
      <div className="flex items-center gap-4 flex-1">
        <GripVertical className="text-slate-300 cursor-grab" size={20} />
        <button
          onClick={handleToggle}
          disabled={isPending}
          className="text-primary hover:scale-110 transition-transform focus:outline-none"
        >
          {completed ? <CheckCircle2 size={24} className="text-green-500" /> : <Circle size={24} className="text-slate-300" />}
        </button>
        <div className="flex-1">
          <p className="font-medium text-slate-900">
            {task.title}
          </p>
          <div className="flex items-center gap-3 mt-1">
            <Badge variant="outline" className={`text-[10px] h-4 ${task.priority === 'HIGH' ? 'text-red-600 bg-red-50' :
                task.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 'text-blue-600 bg-blue-50'
              }`}>
              {task.priority}
            </Badge>
            {task.externalUrl && (
              <Link
                href={task.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLink size={10} />
                <span>Practice on LeetCode</span>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          onClick={() => handleDelete(task.id)}
        >
          <Trash2 size={16} />
        </Button>
      </div>
    </div>
  );
}

export default function PlannerPage({ initialTasks }: { initialTasks: Task[] }) {
  const router = useRouter();

  async function handleDelete(taskId: string) {
    if (!confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTask(taskId);
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Daily Planner</h1>
          <p className="text-muted-foreground mt-1">Organize your tasks and stay focused with Pomodoro.</p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border shadow-sm">
          <Button variant="ghost" size="sm" className="h-8">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-none shadow-sm bg-white">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Tasks for Today</CardTitle>
                <CardDescription>Real-time task management for your roadmaps.</CardDescription>
              </div>
              <Button size="sm" disabled>
                <Plus className="mr-2 h-4 w-4" />
                Add Custom Task
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {initialTasks.map((task) => (
                  <PlannerTaskItem key={task.id} task={task} handleDelete={handleDelete} />
                ))}
                {initialTasks.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed rounded-xl">
                    <p className="text-slate-400">No tasks found. Add milestones to your roadmaps first!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar: Pomodoro */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-slate-400 text-sm font-medium tracking-widest uppercase">Pomodoro Timer</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center py-6">
              <div className="relative flex items-center justify-center mb-8">
                <svg className="w-48 h-48 transform -rotate-90">
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-800" />
                  <circle cx="96" cy="96" r="88" stroke="currentColor" strokeWidth="8" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * 0} strokeLinecap="round" fill="transparent" className="text-primary" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-5xl font-bold tracking-tight">25:00</span>
                  <span className="text-xs text-slate-400 mt-1 font-medium">STAY FOCUSED</span>
                </div>
              </div>
              <div className="flex gap-4">
                <Button size="lg" className="h-14 w-14 rounded-full bg-primary hover:bg-primary/90">
                  <Play className="fill-current" />
                </Button>
                <Button size="lg" variant="outline" className="h-14 w-14 rounded-full border-slate-700 hover:bg-slate-800 text-white">
                  <RotateCcw />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
