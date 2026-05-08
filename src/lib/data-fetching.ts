import { unstable_cache } from "next/cache";
import { db } from "./db";

// Fetch user's basic info
export const getCachedUser = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.user.findUnique({ where: { id: userId } });
    },
    [`user-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Dashboard: All user tasks
export const getCachedUserTasks = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.task.findMany({
        where: { milestone: { roadmap: { userId } } },
        select: { id: true, completed: true, updatedAt: true, createdAt: true, title: true, priority: true }
      });
    },
    [`user-tasks-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Dashboard: Upcoming tasks
export const getCachedUpcomingTasks = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.task.findMany({
        where: { 
          milestone: { roadmap: { userId } },
          completed: false 
        },
        select: {
          title: true,
          priority: true,
          milestone: {
            select: { roadmap: { select: { title: true } } }
          }
        },
        orderBy: [{ priority: "desc" }, { createdAt: "asc" }],
        take: 4,
      });
    },
    [`user-upcoming-tasks-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Dashboard: Active Roadmaps
export const getCachedActiveRoadmaps = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.roadmap.findMany({
        where: { userId },
        select: {
          title: true,
          milestones: {
            select: { tasks: { select: { completed: true } } }
          }
        },
        orderBy: { updatedAt: "desc" },
        take: 3,
      });
    },
    [`user-active-roadmaps-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Analytics: User Tasks with Roadmap titles
export const getCachedTasksWithRoadmapTitles = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.task.findMany({
        where: { milestone: { roadmap: { userId } } },
        select: {
          completed: true,
          updatedAt: true,
          milestone: {
            select: { roadmap: { select: { title: true } } }
          }
        }
      });
    },
    [`user-tasks-with-titles-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Analytics & Achievements: All milestones to check completion
export const getCachedAllMilestones = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.milestone.findMany({
        where: { roadmap: { userId } },
        select: { tasks: { select: { completed: true } } }
      });
    },
    [`user-all-milestones-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Roadmaps Page: Full user roadmaps tree
export const getCachedUserRoadmapsTree = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.roadmap.findMany({
        where: { userId },
        include: {
          milestones: {
            include: { tasks: true }
          }
        },
        orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      });
    },
    [`user-roadmaps-tree-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();

// Calendar: Tasks with title and date
export const getCachedUserTasksForCalendar = (userId: string) => 
  unstable_cache(
    async () => {
      return await db.task.findMany({
        where: { milestone: { roadmap: { userId } } },
        select: {
          id: true,
          title: true,
          createdAt: true,
          completed: true,
          milestone: { select: { roadmap: { select: { title: true } } } }
        },
        orderBy: { createdAt: "asc" }
      });
    },
    [`user-calendar-tasks-${userId}`],
    { tags: [`user-data-${userId}`], revalidate: 3600 }
  )();
