// src/pages/Home.jsx
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-200 p-4">
      <Card className="w-full max-w-md shadow-xl border rounded-2xl">
        <CardContent className="p-8 text-center">
          <h1 className="text-3xl font-bold mb-4 text-gray-800">
            💸 Personal Expense Tracker
          </h1>
          <p className="text-gray-600 mb-8">
            Easily track your monthly expenses, split shared costs, and gain insights into your spending habits.
          </p>

          <div className="flex flex-col gap-4">
            <Link to="/login">
              <Button className="w-full text-lg">Login</Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="w-full text-lg">Register</Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
