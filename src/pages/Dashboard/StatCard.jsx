// components/Dashboard/StatCard.jsx
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function StatCard({ title, value, color = "text-white" }) {
  return (
    <Card className="bg-neutral-900 border-neutral-800 text-white">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className={`text-2xl font-semibold ${color}`}>
        {value}
      </CardContent>
    </Card>
  );
}
