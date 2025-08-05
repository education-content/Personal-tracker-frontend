// src/pages/Register.jsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-semibold">
            Create an account
          </CardTitle>
          <p className="text-neutral-400 text-sm mt-1">
            Please fill in your details to register
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">Name</label>
            <Input
              type="text"
              placeholder="John Doe"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">Email</label>
            <Input
              type="email"
              placeholder="m@example.com"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">Mobile Number</label>
            <Input
              type="tel"
              placeholder="+1 234 567 890"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-neutral-300 text-sm">Confirm Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
            />
          </div>
          <Button className="w-full bg-white text-black hover:bg-neutral-200 mt-2">
            Create account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
