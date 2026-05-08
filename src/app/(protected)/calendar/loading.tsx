import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CalendarLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-72" />
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-sm bg-white p-4">
          <Skeleton className="w-full h-[400px] rounded-xl" />
        </Card>

        <Card className="lg:col-span-4 border-none shadow-sm bg-white">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex flex-col items-center justify-center min-w-[60px] py-1 border-r border-slate-200">
                    <Skeleton className="h-4 w-12 mb-1" />
                    <Skeleton className="h-3 w-8" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-16 rounded-full" />
                    </div>
                    <Skeleton className="h-3 w-20 mt-2" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
