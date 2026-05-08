"use client";

import { useState, useTransition } from "react";
import { buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreVertical, Trash2, Loader2 } from "lucide-react";
import { deleteRoadmap } from "@/actions/roadmaps";
import { toast } from "sonner";

export function DeleteRoadmapDropdown({ roadmapId }: { roadmapId: string }) {
  const [isPending, startTransition] = useTransition();
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  const handleDelete = () => {
    startTransition(async () => {
      try {
        await deleteRoadmap(roadmapId);
        toast.success("Roadmap deleted successfully");
      } catch (error) {
        console.error("Failed to delete roadmap", error);
        toast.error("Failed to delete roadmap");
      } finally {
        setShowDeleteAlert(false);
      }
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 text-muted-foreground focus-visible:ring-0" })}>
          {isPending ? <Loader2 className="animate-spin" size={16} /> : <MoreVertical size={16} />}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={() => setShowDeleteAlert(true)} 
              disabled={isPending} 
              className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete Roadmap</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              roadmap and remove all associated milestones and tasks from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault(); // prevent dialog from closing immediately
                handleDelete();
              }}
              disabled={isPending}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {isPending ? "Deleting..." : "Delete Roadmap"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
