"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Plus,
  Clock,
  CheckCircle2,
  Circle
} from "lucide-react";
import { format, isSameDay } from "date-fns";

type Event = {
  id: string;
  title: string;
  time: string;
  category: string;
  date: Date;
  status: "COMPLETED" | "PENDING";
};

export default function CalendarClient({ initialEvents }: { initialEvents: Event[] }) {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Filter events for the selected date
  const selectedDateEvents = initialEvents.filter(event =>
    date ? isSameDay(new Date(event.date), date) : false
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
        <p className="text-muted-foreground">Visualize your tasks and activity over time.</p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        <Card className="lg:col-span-8 border-none shadow-sm bg-white p-4">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            className="rounded-md border shadow-sm w-full"
          />
        </Card>

        <Card className="lg:col-span-4 border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-lg">
              Schedule for {date?.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </CardTitle>
            <CardDescription>You have {selectedDateEvents.length} tasks recorded on this day.</CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {selectedDateEvents.length === 0 ? (
                  <div className="text-center py-10 text-muted-foreground flex flex-col items-center gap-2">
                    <Clock className="h-8 w-8 opacity-20" />
                    <p className="text-sm">No tasks on this date.</p>
                  </div>
                ) : (
                  selectedDateEvents.map((event) => (
                    <div key={event.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-primary/20 transition-all group">
                      <div className="flex flex-col items-center justify-center min-w-[60px] py-1 border-r border-slate-200">
                        <span className="text-sm font-bold">{event.time.split(' ')[0]}</span>
                        <span className="text-[10px] text-muted-foreground font-medium">{event.time.split(' ')[1]}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className={`font-bold transition-colors ${event.status === 'COMPLETED' ? 'text-slate-500 line-through' : 'text-slate-900 group-hover:text-primary'}`}>
                            {event.title}
                          </h4>
                        </div>
                        <div className="flex items-center justify-between mt-2">
                          <Badge variant="outline" className="text-[10px] h-4 bg-white">
                            {event.category}
                          </Badge>
                          {event.status === 'COMPLETED' ? (
                            <CheckCircle2 size={14} className="text-green-500" />
                          ) : (
                            <Circle size={14} className="text-slate-300" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
