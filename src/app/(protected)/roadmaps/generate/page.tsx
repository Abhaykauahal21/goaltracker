"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sparkles, 
  Clock, 
  Target, 
  GraduationCap, 
  ArrowRight, 
  Loader2, 
  CheckCircle2, 
  Link as LinkIcon,
  ChevronRight,
  Save,
  RefreshCcw,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { saveRoadmap } from "@/actions/roadmap";

interface GeneratedRoadmap {
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

export default function GenerateRoadmapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roadmap, setRoadmap] = useState<GeneratedRoadmap | null>(null);
  
  const [formData, setFormData] = useState({
    topic: "",
    duration: "1 month",
    level: "Beginner",
    goal: ""
  });

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.topic) {
      toast.error("Please enter a topic");
      return;
    }

    setLoading(true);
    setRoadmap(null);

    try {
      const response = await fetch("/api/generate-roadmap", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || "Failed to generate roadmap");
      }

      setRoadmap(data);
      toast.success("Roadmap generated successfully!");
    } catch (error) {
      console.error(error);
      toast.error(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!roadmap) return;

    setSaving(true);
    try {
      const result = await saveRoadmap(roadmap);
      if (result.success) {
        toast.success("Roadmap saved!");
        router.push(`/roadmaps/${result.roadmapId}`);
      } else {
        toast.error(result.error || "Failed to save roadmap");
      }
    } catch (error) {
      toast.error("An error occurred while saving");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="bg-primary/10 text-primary p-3 rounded-2xl">
          <Sparkles size={32} />
        </div>
        <h1 className="text-3xl font-bold tracking-tight">AI Roadmap Generator</h1>
        <p className="text-muted-foreground max-w-xl">
          Enter your goal, and our AI will craft a personalized step-by-step roadmap with resources and tasks.
        </p>
      </div>

      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardContent className="p-6">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="topic">What do you want to learn? *</Label>
              <div className="relative">
                <Target className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <Input 
                  id="topic" 
                  placeholder="e.g. React.js Mastery, Marathon Training, UI Design..." 
                  className="pl-10 h-12 text-lg"
                  value={formData.topic}
                  onChange={(e) => setFormData({...formData, topic: e.target.value})}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Target Duration</Label>
              <div className="relative">
                <Clock className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <select 
                  id="duration"
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.duration}
                  onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  disabled={loading}
                >
                  <option>1 week</option>
                  <option>2 weeks</option>
                  <option>1 month</option>
                  <option>3 months</option>
                  <option>6 months</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="level">Skill Level</Label>
              <div className="relative">
                <GraduationCap className="absolute left-3 top-3 text-muted-foreground" size={18} />
                <select 
                  id="level"
                  className="flex h-12 w-full rounded-md border border-input bg-transparent px-10 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  value={formData.level}
                  onChange={(e) => setFormData({...formData, level: e.target.value})}
                  disabled={loading}
                >
                  <option>Beginner</option>
                  <option>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="goal">Any specific goals or focus areas? (Optional)</Label>
              <textarea 
                id="goal" 
                placeholder="e.g. Focus on performance optimization, I have 5 hours a week..." 
                className="flex min-h-[100px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                value={formData.goal}
                onChange={(e) => setFormData({...formData, goal: e.target.value})}
                disabled={loading}
              />
            </div>

            <div className="md:col-span-2 pt-2">
              <Button type="submit" size="lg" className="w-full h-12 font-bold" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating your roadmap...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate AI Roadmap
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <AnimatePresence>
        {roadmap && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-primary">{roadmap.title}</h2>
                <p className="text-muted-foreground">{roadmap.description}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="outline" onClick={() => setRoadmap(null)}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Regenerate
                </Button>
                <Button onClick={handleSave} disabled={saving}>
                  {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                  Save Roadmap
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {roadmap.milestones.map((milestone, mIdx) => (
                <Card key={mIdx} className="border-none shadow-sm bg-white overflow-hidden group">
                  <CardHeader className="bg-slate-50/50 border-b pb-4">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {mIdx + 1}
                      </div>
                      <CardTitle className="text-lg">{milestone.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-6">
                    <div className="space-y-4">
                      {milestone.tasks.map((task, tIdx) => (
                        <div key={tIdx} className="flex flex-col space-y-2 p-3 rounded-xl border border-slate-100 hover:border-primary/20 transition-colors">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                                task.priority === 'HIGH' ? 'bg-red-500' : 
                                task.priority === 'MEDIUM' ? 'bg-yellow-500' : 'bg-blue-500'
                              }`} />
                              <span className="text-sm font-medium leading-tight">{task.title}</span>
                            </div>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {task.priority}
                            </Badge>
                          </div>
                          
                          {task.links && task.links.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-1">
                              {task.links.map((link, lIdx) => (
                                <a 
                                  key={lIdx} 
                                  href={link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-[10px] text-primary hover:underline bg-primary/5 px-2 py-0.5 rounded-md"
                                >
                                  <LinkIcon size={10} />
                                  Resource {lIdx + 1}
                                </a>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
