"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { revalidateUserCache } from "@/lib/revalidate";

export async function getTasks() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) return [];

  return await db.task.findMany({
    where: {
      milestone: {
        roadmap: {
          userId: user.id
        }
      }
    },
    orderBy: [{ createdAt: "asc" }, { id: "asc" }],
  });
}

export async function toggleTask(taskId: string, completed: boolean) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const task = await db.task.update({
    where: { id: taskId },
    data: { completed },
  });

  // Gamification logic: Add XP on completion
  if (completed) {
    const user = await db.user.findUnique({ where: { clerkId } });
    if (user) {
      await db.user.update({
        where: { id: user.id },
        data: { xp: { increment: 50 } }
      });
    }
  }

  revalidatePath("/planner");
  revalidatePath("/dashboard");
  revalidatePath("/roadmaps", "layout");
  await revalidateUserCache();
  return task;
}

export async function deleteTask(taskId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  await db.task.delete({
    where: { id: taskId },
  });

  revalidatePath("/planner");
  revalidatePath("/roadmaps");
  await revalidateUserCache();
}
