import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-6">
        <h2 className="text-2xl font-semibold mb-8">Dashboard</h2>
        <nav className="space-y-4">
          <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white">
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
          <Button variant="ghost" className="w-full justify-start text-neutral-300 hover:text-white">
            <BarChart className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </nav>
        <div className="mt-10">
          <Button
            variant="destructive"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6">
        <Card className="bg-neutral-900 border-neutral-800 text-white">
          <CardHeader>
            <CardTitle className="text-xl font-bold">
              Welcome, {user?.name || "User"} 👋
            </CardTitle>
          </CardHeader>
          <CardContent className="text-neutral-400">
            Here’s an overview of your activity.
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>Total Sessions</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-white">24</CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>Active Goals</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-white">5</CardContent>
          </Card>

          <Card className="bg-neutral-900 border-neutral-800 text-white">
            <CardHeader>
              <CardTitle>Progress Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold text-white">68%</CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
