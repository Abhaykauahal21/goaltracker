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
import { Label } from "@/components/ui/label";
import { Upload, Loader2 } from "lucide-react";
import { importRoadmapFromJson } from "@/actions/roadmaps";
import { useRouter } from "next/navigation";

import { toast } from "sonner";

export function UploadRoadmapDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [jsonInput, setJsonInput] = useState("");
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!jsonInput.trim()) return;
    
    setLoading(true);
    try {
      await importRoadmapFromJson(jsonInput);
      setOpen(false);
      setJsonInput("");
      toast.success("Roadmap imported successfully!");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Failed to import roadmap. Please check your JSON format.");
    } finally {
      setLoading(false);
    }
  }

  const exampleJson = {
    title: "My Roadmap",
    description: "A description of my journey",
    milestones: [
      {
        title: "Milestone 1",
        tasks: [
          { 
            title: "Task 1", 
            priority: "HIGH",
            links: ["https://leetcode.com/problems/two-sum/"]
          },
          { 
            title: "Task 2", 
            priority: "MEDIUM" 
          }
        ]
      }
    ]
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="outline">
            <Upload className="mr-2 h-4 w-4" />
            Import JSON
          </Button>
        }
      />
      <DialogContent className="sm:max-w-[500px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 space-y-4">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
                <Loader2 className="h-12 w-12 text-primary animate-spin relative z-10" />
              </div>
              <p className="text-lg font-bold text-slate-900">Importing Roadmap...</p>
              <p className="text-sm text-muted-foreground text-center px-4">
                Parsing JSON and generating your customized learning journey. Please do not close this window.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Import Roadmap from JSON</DialogTitle>
                <DialogDescription>
                  Paste your roadmap JSON below. It will automatically create all milestones and tasks.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label>JSON Format Template</Label>
                  <div className="relative">
                    <pre className="bg-slate-950 text-slate-50 p-3 rounded-lg text-[10px] font-mono overflow-x-auto border border-slate-800">
                      {JSON.stringify(exampleJson, null, 2)}
                    </pre>
                    <Button
                      type="button"
                      variant="ghost"
                      size="xs"
                      className="absolute top-2 right-2 h-6 text-[10px] bg-white/10 hover:bg-white/20 text-white border-none"
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(exampleJson, null, 2));
                      }}
                    >
                      Copy Template
                    </Button>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="json">Paste JSON Content</Label>
                  <textarea
                    id="json"
                    className="w-full min-h-[150px] p-3 text-xs font-mono rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary/20 bg-white"
                    placeholder="Paste your JSON here..."
                    value={jsonInput}
                    onChange={(e) => setJsonInput(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit" disabled={!jsonInput.trim()}>
                  Import Roadmap
                </Button>
              </DialogFooter>
            </form>
          )}
      </DialogContent>
    </Dialog>
  );
}
