// components/Dashboard/MonthlyChart.jsx
import React from "react";
import { format, parse } from "date-fns";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function MonthlyChart({ data }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 text-white lg:col-span-2">
      <CardHeader>
        <CardTitle>Monthly Spent vs Received</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] p-4">

        <ResponsiveContainer width="100%" height="110%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis
              dataKey="month"
              tickFormatter={(month) => {
                const parsedDate = parse(month, "yyyy-MM", new Date());
                return format(parsedDate, "MMM"); // Shows "Aug", "Sep", etc.
              }}
            />

            <YAxis stroke="#ccc" />
            <Tooltip />
            <Legend />
            <Bar dataKey="spent" fill="#ef4444" name="Spent" />
            <Bar dataKey="received" fill="#3b82f6" name="Received" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
