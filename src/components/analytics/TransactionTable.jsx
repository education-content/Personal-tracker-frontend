import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function TransactionTable({ data = [] }) {
  const safeData = Array.isArray(data) ? data : [];
  console.log(safeData);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Transactions</CardTitle>
        <Button variant="outline" disabled>
          Export CSV
        </Button>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left">Date</th>
              <th className="text-left">Type</th>
              <th className="text-left">Category</th>
              <th className="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {safeData.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-400">
                  No transactions found.
                </td>
              </tr>
            ) : (
              safeData.map((t) => (
                <tr key={t.id} className="border-b border-gray-800">
                  <td className="py-2">{formatDate(t.date)}</td>
                  <td className="capitalize">{t.type}</td>
                  <td>{t.category}</td>
                  <td className="text-right">₹{formatAmount(t.amount)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
