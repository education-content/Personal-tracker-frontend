import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import api from "../api";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function ProfileForm() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    mobile_no: "",
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId) {
        setMessage("❌ User not found in localStorage");
        return;
      }

      setLoading(true);
      try {
        const res = await api.get("/profile");
        setProfile(res.data);
      } catch (err) {
        console.error("Failed to load profile", err);
        setMessage("Failed to load profile ❌");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [userId]);

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const confirmUpdate = async () => {
    setSaving(true);
    setShowConfirm(false);
    setMessage("");

    try {
      await api.put("/profile", {
        name: profile.name,
        mobile_no: profile.mobile_no,
      });
      setMessage("✅ Profile updated successfully");
    } catch (err) {
      console.error("Update failed", err);
      setMessage("❌ Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowConfirm(true); // Show confirmation modal
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {message && (
          <div className="text-sm text-green-400 bg-neutral-800 p-2 rounded">
            {message}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={profile.name}
            onChange={handleChange}
            disabled={loading}
            className="bg-neutral-800 text-white border-neutral-700"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-neutral-800 text-white border-neutral-700 cursor-not-allowed"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="mobile_no">Mobile Number</Label>
          <Input
            id="mobile_no"
            name="mobile_no"
            value={profile.mobile_no}
            onChange={handleChange}
            disabled={loading}
            className="bg-neutral-800 text-white border-neutral-700"
          />
        </div>

        <Button type="submit" className="w-full" disabled={saving || loading}>
          {saving ? "Saving..." : "Update Profile"}
        </Button>
      </form>

      {/* ✅ Confirmation Dialog */}
      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)} // ✅ Correct
        onConfirm={confirmUpdate}
        title="Update Profile?"
        description="Are you sure you want to save the changes to your profile?"
      />

    </>
  );
}
