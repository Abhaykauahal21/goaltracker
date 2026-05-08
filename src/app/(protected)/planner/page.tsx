import { getTasks } from "@/actions/tasks";
import PlannerClient from "./planner-client";

export default async function PlannerPage() {
  const tasks = await getTasks();

  // Convert DB tasks to format expected by client component if necessary
  const formattedTasks = tasks.map(t => ({
    id: t.id,
    title: t.title,
    priority: t.priority,
    completed: t.completed,
    status: t.status,
    externalUrl: t.externalUrl
  }));

  return <PlannerClient initialTasks={formattedTasks} />;
}
