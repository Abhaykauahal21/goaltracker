"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Loader2 } from "lucide-react";
import { createRoadmap } from "@/actions/roadmaps";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function CreateRoadmapDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;

    try {
      await createRoadmap(title, description);
      setOpen(false);
      toast.success("Roadmap created successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to create roadmap.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            Create Roadmap
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[425px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
              </div>
              <p className="text-lg font-bold text-slate-900">Creating Roadmap...</p>
              <p className="text-sm text-muted-foreground text-center px-4">
                Setting up your workspace. This will just take a moment.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create Roadmap</DialogTitle>
                <DialogDescription>
                  Give your roadmap a title and description. You can add milestones later.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="e.g. LeetCode 75, Full Stack Journey"
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    name="description"
                    placeholder="What is this roadmap about?"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">
                  Create Roadmap
                </Button>
              </DialogFooter>
            </form>
          )}
      </DialogContent>
    </Dialog>
  );
}
