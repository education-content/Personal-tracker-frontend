import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";

// Utility: group data by month, then by category
function formatCategoryTrendsData(data) {
  const monthMap = {};

  data.forEach(({ category_name, month, total }) => {
    if (!monthMap[month]) {
      monthMap[month] = { month };
    }
    monthMap[month][category_name] = total;
  });

  return Object.values(monthMap);
}

// Extract unique category names
function extractCategories(data) {
  const categories = new Set();
  data.forEach((item) => categories.add(item.category_name));
  return Array.from(categories);
}

export default function CategoryTrendsChart({ data }) {
  const formattedData = formatCategoryTrendsData(data || []);
  const categories = extractCategories(data || []);

  return (
    <Card className="bg-gray-900 border-gray-700 text-white">
      <CardHeader>
        <CardTitle>Category Trends</CardTitle>
      </CardHeader>
      <CardContent>
        {formattedData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
              <XAxis dataKey="month" stroke="#cbd5e0" />
              <YAxis stroke="#cbd5e0" />
              <Tooltip />
              <Legend />
              {categories.map((category, index) => (
                <Line
                  key={category}
                  type="monotone"
                  dataKey={category}
                  stroke={`hsl(${(index * 67) % 360}, 70%, 60%)`} // Distinct dynamic colors
                  strokeWidth={2}
                  dot={false}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="text-center text-gray-400">No data available</div>
        )}
      </CardContent>
    </Card>
  );
}
