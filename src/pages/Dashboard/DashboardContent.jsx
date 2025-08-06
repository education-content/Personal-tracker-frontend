import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import StatCard from "./StatCard";
import MonthlyChart from "./MonthlyChart";
import ScholarshipsChart from "./ScholarshipsChart";
import CategoriesChart from "./CategoriesChart";
import api from "../../api";

export default function DashboardContent({ user }) {
  const [summary, setSummary] = useState(null);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [scholarships, setScholarships] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userName = storedUser?.name || "User";


  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [summaryRes, monthlyRes, categoryRes, scholarshipRes] =
          await Promise.all([
            api.get("/dashboard/summary"),
            api.get("/dashboard/stats/monthly"),
            api.get("/dashboard/stats/categories"),
            api.get("/dashboard/stats/scholarships"),
          ]);

        setSummary(summaryRes.data);
        setMonthlyStats(monthlyRes.data);
        setCategories(categoryRes.data);
        setScholarships(scholarshipRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="text-white p-6">Loading dashboard...</div>;
  }

  return (
    <main className="flex-1 p-6 space-y-6">
      <Card className="bg-neutral-900 border-neutral-800 text-white">
        <CardHeader>
          <CardTitle className="text-xl font-bold">
            Welcome, {userName || "User"} 👋
          </CardTitle>
        </CardHeader>
        <CardContent className="text-neutral-400">
          Here's your personal finance overview.
        </CardContent>
      </Card>

      {summary ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Balance"
            value={`₹${summary.balance ?? 0}`}
            color="text-green-400"
          />
          <StatCard
            title="Total Received"
            value={`₹${summary.received ?? 0}`}
            color="text-blue-400"
          />
          <StatCard
            title="Total Spent"
            value={`₹${summary.spent ?? 0}`}
            color="text-red-400"
          />
          <StatCard
            title="Pending Settlements"
            value={`₹${summary.pending ?? 0}`}
            color="text-yellow-400"
          />
        </div>
      ) : (
        <p className="text-neutral-400 text-sm">No summary data found yet.</p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          {monthlyStats.length > 0 ? (
            <MonthlyChart data={monthlyStats} />
          ) : (
            <Card className="text-white p-6 bg-neutral-900 border-neutral-800">
              <p className="text-neutral-400">No monthly stats available.</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {scholarships.length > 0 ? (
            <ScholarshipsChart data={scholarships} />
          ) : (
            <Card className="text-white p-6 bg-neutral-900 border-neutral-800">
              <p className="text-neutral-400">No scholarship data yet.</p>
            </Card>
          )}

          {categories.length > 0 ? (
            <CategoriesChart data={categories} />
          ) : (
            <Card className="text-white p-6 bg-neutral-900 border-neutral-800">
              <p className="text-neutral-400">No category stats available.</p>
            </Card>
          )}
        </div>
      </div>
    </main>
  );
}
