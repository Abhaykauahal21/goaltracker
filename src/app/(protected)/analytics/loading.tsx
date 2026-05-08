import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function AnalyticsLoading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <Skeleton className="h-9 w-40 mb-2" />
        <Skeleton className="h-5 w-80" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="border-none shadow-sm bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <Skeleton className="h-10 w-10 rounded-lg" />
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-16" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="h-[350px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="h-[350px]">
            <Skeleton className="w-full h-full rounded-xl" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
