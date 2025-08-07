import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    theme: "dark",
    currency: "INR",
    notifications: true,
    language: "en",
  });

  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const stored = localStorage.getItem("appSettings");
    if (stored) setSettings(JSON.parse(stored));
  }, []);

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    localStorage.setItem("appSettings", JSON.stringify(settings));
    setSavedMessage("✅ Settings saved locally.");
    setTimeout(() => setSavedMessage(""), 3000);
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">Settings</h2>

      {savedMessage && (
        <div className="text-sm text-green-400 bg-neutral-800 border border-neutral-700 p-3 rounded mb-6">
          {savedMessage}
        </div>
      )}

      <div className="space-y-5 bg-neutral-900 border border-neutral-800 p-6 rounded-lg shadow-md">
        {/* Theme */}
        <div>
          <Label className="mb-1 block">Theme</Label>
          <Select
            value={settings.theme}
            onValueChange={(val) => handleChange("theme", val)}
          >
            <SelectTrigger className="bg-neutral-800 text-white">
              <SelectValue placeholder="Select theme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="dark">Dark</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Currency */}
        <div>
          <Label className="mb-1 block">Currency</Label>
          <Select
            value={settings.currency}
            onValueChange={(val) => handleChange("currency", val)}
          >
            <SelectTrigger className="bg-neutral-800 text-white">
              <SelectValue placeholder="Select currency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INR">INR (₹)</SelectItem>
              <SelectItem value="USD">USD ($)</SelectItem>
              <SelectItem value="EUR">EUR (€)</SelectItem>
              <SelectItem value="GBP">GBP (£)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Language */}
        <div>
          <Label className="mb-1 block">Language</Label>
          <Select
            value={settings.language}
            onValueChange={(val) => handleChange("language", val)}
          >
            <SelectTrigger className="bg-neutral-800 text-white">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="hi">Hindi</SelectItem>
              <SelectItem value="fr">French</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notifications */}
        <div className="flex items-center justify-between">
          <Label>Enable Notifications</Label>
          <Switch
            checked={settings.notifications}
            onCheckedChange={(val) => handleChange("notifications", val)}
          />
        </div>

        <div className="pt-4 text-right">
          <Button onClick={handleSave}>Save Settings</Button>
        </div>
      </div>
    </div>
  );
}
