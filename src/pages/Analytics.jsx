import React, { useEffect, useState } from "react";
import api from "../api";

import CashFlowChart from "../components/analytics/CashFlowChart";
import CategoryTrendsChart from "../components/analytics/CategoryTrendsChart";
import ExpenseHeatmap from "../components/analytics/ExpenseHeatmap";
import SharedSummary from "../components/analytics/SharedSummary";
import TopExpenses from "../components/analytics/TopExpenses";
import TransactionTable from "../components/analytics/TransactionTable";

export default function Analytics() {
  const [loading, setLoading] = useState(true);
  const [cashFlow, setCashFlow] = useState([]);
  const [categoryTrends, setCategoryTrends] = useState([]);
  const [heatmap, setHeatmap] = useState([]);
  const [sharedSummary, setSharedSummary] = useState(null);
  const [topExpenses, setTopExpenses] = useState([]);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [
          cashFlowRes,
          categoryTrendsRes,
          heatmapRes,
          sharedSummaryRes,
          topExpensesRes,
          transactionsRes,
        ] = await Promise.all([
          api.get("/analytics/cashflow"),
          api.get("/analytics/category-trends"),
          api.get("/analytics/heatmap"),
          api.get("/analytics/shared-summary"),
          api.get("/analytics/top-expenses"),
          api.get("/analytics/transactions"),
        ]);

        console.log(transactionsRes.data);


        setCashFlow(cashFlowRes.data);
        setCategoryTrends(categoryTrendsRes.data);
        setHeatmap(heatmapRes.data);
        setSharedSummary(sharedSummaryRes.data);
        setTopExpenses(topExpensesRes.data);
        setTransactions(transactionsRes.data.transactions);
      } catch (err) {
        console.error("Error loading analytics data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-white">
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto overflow-y-auto">
      {/* Shared Summary */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <SharedSummary data={sharedSummary} />
      </section>

      {/* Cash Flow Chart */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-2 text-white">Cash Flow Overview</h2>
        <CashFlowChart data={cashFlow} />
      </section>

      {/* Category Trends */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-2 text-white">Category Trends</h2>
        <CategoryTrendsChart data={categoryTrends} />
      </section>

      {/* Expense Heatmap */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-2 text-white">Expense Heatmap</h2>
        <ExpenseHeatmap data={heatmap} />
      </section>

      {/* Top Expenses */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-2 text-white">Top Expenses</h2>
        <TopExpenses data={topExpenses} />
      </section>

      {/* Transaction Table */}
      <section className="bg-gray-900 p-4 rounded-xl border border-gray-700">
        <h2 className="text-xl mb-2 text-white">All Transactions</h2>
        <TransactionTable data={transactions} />
      </section>
    </div>
  );
}
