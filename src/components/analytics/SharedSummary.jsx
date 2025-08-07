import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function SharedSummary({ data }) {
  const owedToYou = data?.owedToYou ?? 0;
  const youOwe = data?.youOwe ?? 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-gray-900 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>Owed To You</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-400">
            ₹{owedToYou.toFixed(2)}
          </p>
        </CardContent>
      </Card>
      <Card className="bg-gray-900 border-gray-700 text-white">
        <CardHeader>
          <CardTitle>You Owe Others</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-400">
            ₹{youOwe.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
