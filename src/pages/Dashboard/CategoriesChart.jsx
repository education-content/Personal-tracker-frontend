// components/Dashboard/CategoriesChart.jsx
import React from "react";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function CategoriesChart({ data }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 text-white">
      <CardHeader>
        <CardTitle>Spending Categories</CardTitle>
      </CardHeader>
      <CardContent className="h-[180px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
            <XAxis type="number" stroke="#ccc" />
            <YAxis dataKey="category" type="category" stroke="#ccc" width={100} />
            <Tooltip />
            <Bar dataKey="amount" fill="#10b981" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
