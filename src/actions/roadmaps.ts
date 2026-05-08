"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { revalidateUserCache } from "@/lib/revalidate";

export async function createRoadmap(title: string, description?: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  const roadmap = await db.roadmap.create({
    data: {
      title,
      description,
      userId: user.id,
    },
  });

  revalidatePath("/roadmaps");
  await revalidateUserCache();
  return roadmap;
}

export async function deleteRoadmap(roadmapId: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({ where: { clerkId } });
  if (!user) throw new Error("User not found");

  const roadmap = await db.roadmap.findUnique({ where: { id: roadmapId } });
  if (!roadmap || roadmap.userId !== user.id) throw new Error("Unauthorized");

  await db.roadmap.delete({ where: { id: roadmapId } });

  revalidatePath("/roadmaps");
  await revalidateUserCache();
  redirect("/roadmaps");
}

export async function addMilestone(roadmapId: string, title: string) {
  const milestone = await db.milestone.create({
    data: {
      roadmapId,
      title,
    },
  });
  revalidatePath(`/roadmaps/${roadmapId}`);
  await revalidateUserCache();
  return milestone;
}

export async function addTaskToMilestone(milestoneId: string, title: string, priority: "LOW" | "MEDIUM" | "HIGH" = "MEDIUM", externalUrl?: string) {
  const task = await db.task.create({
    data: {
      milestoneId,
      title,
      priority,
      externalUrl,
    },
  });
  revalidatePath("/roadmaps");
  await revalidateUserCache();
  return task;
}

export async function importRoadmapFromJson(jsonData: string) {
  const { userId: clerkId } = await auth();
  if (!clerkId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) throw new Error("User not found");

  const data = JSON.parse(jsonData);
  
  const roadmap = await db.roadmap.create({
    data: {
      title: data.title,
      description: data.description,
      userId: user.id,
      milestones: {
        create: data.milestones.map((m: any) => ({
          title: m.title,
          tasks: {
            create: m.tasks.map((t: any) => ({
              title: t.title,
              priority: t.priority || "MEDIUM",
              externalUrl: t.externalUrl || t.link || (t.links && t.links.length > 0 ? t.links[0] : null),
            })),
          },
        })),
      },
    },
  });

  revalidatePath("/roadmaps");
  await revalidateUserCache();
  return roadmap;
}

export async function getRoadmaps() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return [];

  const user = await db.user.findUnique({
    where: { clerkId },
  });

  if (!user) return [];

  return await db.roadmap.findMany({
    where: { userId: user.id },
    include: {
      milestones: {
        include: {
          tasks: true,
        },
      },
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
  });
}
