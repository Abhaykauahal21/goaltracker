"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from "recharts";

type WeeklyData = {
  day: string;
  score: number;
  tasks: number;
};

type CategoryData = {
  name: string;
  value: number;
};

export function AnalyticsCharts({
  weeklyData,
  categoryData
}: {
  weeklyData: WeeklyData[];
  categoryData: CategoryData[];
}) {
  const COLORS = ["#0f172a", "#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899", "#f43f5e"];

  return (
    <>
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Productivity Score</CardTitle>
            <CardDescription>Daily performance score based on task completion.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData}>
                <defs>
                  <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                  cursor={{ stroke: '#e2e8f0', strokeWidth: 2 }}
                />
                <Area type="monotone" dataKey="score" stroke="#0f172a" strokeWidth={3} fillOpacity={1} fill="url(#colorScore)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Focus by Roadmap</CardTitle>
            <CardDescription>Distribution of your completed tasks across roadmaps.</CardDescription>
          </CardHeader>
          <CardContent className="h-[350px] flex items-center">
            {categoryData.length === 0 ? (
              <div className="w-full text-center text-muted-foreground">No tasks completed yet.</div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={80}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-col gap-4 pr-8 max-h-[300px] overflow-y-auto">
                  {categoryData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                      <span className="text-sm font-medium text-slate-600 truncate max-w-[100px]" title={entry.name}>{entry.name}</span>
                      <span className="text-sm font-bold text-slate-900 ml-auto">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none shadow-sm bg-white">
        <CardHeader>
          <CardTitle>Task Completion Velocity</CardTitle>
          <CardDescription>Number of tasks completed per day.</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="tasks" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </>
  );
}
