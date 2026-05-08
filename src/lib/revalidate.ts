import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { revalidateTag } from "next/cache";

export async function revalidateUserCache() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return;
  
  const user = await db.user.findUnique({ 
    where: { clerkId }, 
    select: { id: true } 
  });
  
  if (user) {
    revalidateTag(`user-data-${user.id}`, 'max');
  }
}
