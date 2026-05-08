"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toggleTask } from "@/actions/tasks";
import Link from "next/link";

interface RoadmapTaskItemProps {
  task: {
    id: string;
    title: string;
    completed: boolean;
    priority: string;
    externalUrl: string | null;
  };
}

export function RoadmapTaskItem({ task }: RoadmapTaskItemProps) {
  const [isPending, startTransition] = useTransition();
  const [completed, setCompleted] = useState(task.completed);

  const handleToggle = () => {
    const newCompletedState = !completed;
    setCompleted(newCompletedState);
    startTransition(async () => {
      try {
        await toggleTask(task.id, newCompletedState);
      } catch (error) {
        console.error("Failed to update task status", error);
        setCompleted(!newCompletedState); // Revert on failure
      }
    });
  };

  return (
    <div className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-primary/20 transition-all group">
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <button 
          onClick={handleToggle}
          disabled={isPending}
          className="flex-shrink-0 focus:outline-none"
        >
          {completed ? (
            <CheckCircle2 className="text-green-500 hover:text-green-600 transition-colors" size={20} />
          ) : (
            <Circle className="text-slate-300 hover:text-slate-400 transition-colors" size={20} />
          )}
        </button>
        <div className="flex flex-col min-w-0">
          <span className="text-sm font-medium truncate text-slate-900">
            {task.title}
          </span>
          {task.externalUrl && (
            <Link 
              href={task.externalUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:text-blue-700 hover:underline flex items-center gap-1 mt-0.5 w-fit"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink size={10} />
              <span>Practice on LeetCode</span>
            </Link>
          )}
        </div>
      </div>
      <Badge variant="outline" className={`ml-3 flex-shrink-0 text-[10px] h-4 ${
        task.priority === 'HIGH' ? 'text-red-600 bg-red-50' : 
        task.priority === 'MEDIUM' ? 'text-yellow-600 bg-yellow-50' : 'text-blue-600 bg-blue-50'
      }`}>
        {task.priority}
      </Badge>
    </div>
  );
}
