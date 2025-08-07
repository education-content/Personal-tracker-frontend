import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns";

export default function TopExpenses({ data = [] }) {
  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Top 5 Expenses</CardTitle>
      </CardHeader>
      <CardContent>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="py-2 text-left">Date</th>
              <th className="text-left">Category</th>
              <th className="text-right">Amount</th>
              <th className="text-left">Notes</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-400">
                  No expenses to display.
                </td>
              </tr>
            ) : (
              data.map((e) => (
                <tr key={e.id} className="border-b border-gray-800">
                  <td className="py-2">
                    {format(new Date(e.transaction_date), "d-MMM-yyyy")}
                  </td>
                  <td>{e.category_name}</td>
                  <td className="text-right">₹{e.amount}</td>
                  <td>{e.description}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
