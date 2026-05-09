"use server";

import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

interface RoadmapInput {
  title: string;
  description: string;
  milestones: {
    title: string;
    tasks: {
      title: string;
      priority: "LOW" | "MEDIUM" | "HIGH";
      links?: string[];
    }[];
  }[];
}

export async function saveRoadmap(data: RoadmapInput) {
  try {
    console.log("[SAVE_ROADMAP] Starting save process for:", data.title);
    
    const { userId: clerkId } = await auth();
    if (!clerkId) {
      console.error("[SAVE_ROADMAP] No clerkId found");
      return { success: false, error: "Unauthorized" };
    }

    const user = await db.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      console.error("[SAVE_ROADMAP] User not found for clerkId:", clerkId);
      return { success: false, error: "User not found. Please try logging in again." };
    }

    // Prepare data with defaults and casing normalization
    const roadmapData = {
      userId: user.id,
      title: data.title || "Untitled Roadmap",
      description: data.description || "",
      milestones: {
        create: (data.milestones || []).map((m) => ({
          title: m.title || "Untitled Milestone",
          tasks: {
            create: (m.tasks || []).map((t) => ({
              title: t.title || "Untitled Task",
              priority: (t.priority?.toUpperCase() as "LOW" | "MEDIUM" | "HIGH") || "MEDIUM",
              links: t.links || [],
            })),
          },
        })),
      },
    };

    const roadmap = await db.roadmap.create({
      data: roadmapData,
    });

    console.log("[SAVE_ROADMAP] Successfully saved roadmap:", roadmap.id);
    revalidatePath("/roadmaps");
    return { success: true, roadmapId: roadmap.id };
  } catch (error) {
    console.error("[SAVE_ROADMAP_ERROR]", error);
    // Provide more specific error if possible
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: `Failed to save roadmap: ${errorMessage}` };
  }
}
