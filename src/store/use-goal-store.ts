import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Task {
  id: string;
  title: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
  duration?: string;
}

interface Roadmap {
  id: string;
  title: string;
  progress: number;
  milestones: number;
  tasks: number;
}

interface GoalState {
  tasks: Task[];
  roadmaps: Roadmap[];
  streak: number;
  xp: number;
  addTask: (task: Task) => void;
  removeTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  addXP: (amount: number) => void;
}

export const useGoalStore = create<GoalState>()(
  persist(
    (set) => ({
      tasks: [],
      roadmaps: [],
      streak: 12,
      xp: 2450,
      addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
      removeTask: (id) => set((state) => ({ tasks: state.tasks.filter((t) => t.id !== id) })),
      updateTaskStatus: (id, status) => 
        set((state) => ({
          tasks: state.tasks.map((t) => t.id === id ? { ...t, status } : t)
        })),
      addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
    }),
    {
      name: "goal-tracker-storage",
    }
  )
);
