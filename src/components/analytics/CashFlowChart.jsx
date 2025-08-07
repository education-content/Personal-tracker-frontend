// CashflowChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

export default function CashflowChart({ data }) {
  const formattedData = data?.map((item) => ({
    month: item.month,               // e.g., "2025-08"
    credit: item.income || 0,
    debit: item.expenses || 0
  })) || [];

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Cashflow</CardTitle>
      </CardHeader>
      <CardContent>
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="month" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip />
              <Legend />
              <Bar dataKey="credit" fill="#48bb78" name="Credits" />
              <Bar dataKey="debit" fill="#f56565" name="Debits" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-400">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}
