import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-neutral-900 border border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-semibold">
            Login to Your Account
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-neutral-300">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <Button className="w-full bg-white text-black hover:bg-neutral-200 mt-2">
            Login
          </Button>
          </form>
          <div className="text-center text-sm text-neutral-500 mt-2">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
