"use server";

import { db } from "@/lib/db";
import { currentUser } from "@clerk/nextjs/server";

export async function syncUser() {
  const user = await currentUser();

  if (!user) return null;

  const dbUser = await db.user.upsert({
    where: { clerkId: user.id },
    update: {
      name: `${user.firstName} ${user.lastName}`,
      image: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
    create: {
      clerkId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      image: user.imageUrl,
    },
  });

  return dbUser;
}
