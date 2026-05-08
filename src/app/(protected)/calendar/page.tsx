import { getCachedUserTasksForCalendar } from "@/lib/data-fetching";
import { syncUser } from "@/actions/user";
import CalendarClient from "./calendar-client";

export default async function CalendarPage() {
  const user = await syncUser();

  if (!user) return null;

  const tasks = await getCachedUserTasksForCalendar(user.id);

  const events = tasks.map((t) => {
    const createdAt = new Date(t.createdAt);

    return {
      id: t.id,
      title: t.title,

      time: createdAt.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      }),

      category: t.milestone?.roadmap?.title || "Task",

      date: createdAt,

      status: t.completed
        ? ("COMPLETED" as const)
        : ("PENDING" as const),
    };
  });

  return <CalendarClient initialEvents={events} />;
}