import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";

export default function RoadmapsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <Skeleton className="h-9 w-40 mb-2" />
          <Skeleton className="h-5 w-80" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-32 rounded-md" />
          <Skeleton className="h-10 w-40 rounded-md" />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-2">
                <Skeleton className="h-5 w-20 rounded-full" />
                <Skeleton className="h-8 w-8 rounded-md" />
              </div>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </CardHeader>
            <CardContent className="pb-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-4 border-t border-slate-100">
              <Skeleton className="h-10 w-full rounded-md" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
