"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from "recharts";

interface WeeklyActivityChartProps {
  data: {
    day: string;
    completed: number;
  }[];
}

export function WeeklyActivityChart({ data }: WeeklyActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis 
          dataKey="day" 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12, fill: '#64748b' }} 
          dy={10}
        />
        <YAxis 
          tickLine={false} 
          axisLine={false} 
          tick={{ fontSize: 12, fill: '#64748b' }}
          allowDecimals={false}
        />
        <Tooltip 
          cursor={{ fill: '#f1f5f9' }}
          contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
        />
        <Bar 
          dataKey="completed" 
          fill="#3b82f6" 
          radius={[4, 4, 0, 0]} 
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
