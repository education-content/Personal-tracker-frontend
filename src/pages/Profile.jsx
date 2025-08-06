import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import ProfileForm from "@/components/ProfileForm";

export default function ProfilePage() {
  return (
    <main className="p-6 space-y-6">
      <Card className="bg-neutral-900 border-neutral-800 text-white max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileForm />
        </CardContent>
      </Card>
    </main>
  );
}
