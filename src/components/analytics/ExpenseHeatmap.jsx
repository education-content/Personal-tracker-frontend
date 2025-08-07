import React from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { subDays, format, parseISO } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ExpenseHeatmap({ data }) {
  const today = new Date();
  const startDate = subDays(today, 180);

  // Format backend data into heatmap format
  const formattedData = (data || []).map((item) => ({
    date: format(parseISO(item.date), "yyyy-MM-dd"),
    count: item.count || 0,
  }));

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <CardTitle className="text-lg">Spending Heatmap (Last 6 Months)</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="overflow-x-auto">
          <CalendarHeatmap
            startDate={startDate}
            endDate={today}
            values={formattedData}
            classForValue={(value) => {
              if (!value || value.count === 0) {
                return "color-empty";
              }
              return `color-github-${Math.min(value.count, 4)}`; // Max up to 4 classes
            }}
            tooltipDataAttrs={(value) => ({
              "data-tip": `${value.date}: ${value.count} txns`,
            })}
          />
        </div>
      </CardContent>
    </Card>
  );
}
