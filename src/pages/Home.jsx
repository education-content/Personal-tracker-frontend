import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-24 px-4">
        <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Welcome to Your Personal Tracker
        </h1>
        <p className="text-gray-400 max-w-xl mb-8">
          Visualize your progress, stay organized, and achieve your goals effortlessly.
        </p>
        <div className="flex gap-4">
          <Link to="/register">
            <Button size="lg">Get Started</Button>
          </Link>
          <Link to="/login">
            <Button size="lg" variant="outline">
              Login
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Smart Analytics",
            description: "Detailed graphs and weekly insights to track your progress.",
          },
          {
            title: "Goal Reminders",
            description: "Get notified so you never miss your targets.",
          },
          {
            title: "Secure & Private",
            description: "Your data is encrypted and stays yours.",
          },
        ].map((feature, idx) => (
          <Card key={idx} className="bg-neutral-900 border border-neutral-800">
            <CardHeader>
              <CardTitle className="text-white">{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Call to Action */}
      <section className="py-20 text-center">
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-white">
          Ready to level up your productivity?
        </h2>
        <p className="text-gray-400 mb-8">
          Join now and start tracking your journey today.
        </p>
        <Link to="/register">
          <Button size="lg">Create Your Account</Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center border-t border-neutral-800">
        <small className="text-gray-500">
          &copy; {new Date().getFullYear()} Personal Tracker. All rights reserved.
        </small>
      </footer>
    </div>
  );
}
