import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/ConfirmDialog";
import api from "@/api";

export default function BankDetailsPage() {
  const [details, setDetails] = useState({
    bank_name: "",
    upi_id: "",
    balance: "",
  });

  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
  const fetchDetails = async () => {
    try {
      const res = await api.get("/bank-details");
      if (res.data) {
        setDetails({
          bank_name: res.data.bank_name || "",
          upi_id: res.data.upi_id || "",
          balance: res.data.balance || "",
        });
      }
    } catch (err) {
      console.error("Failed to fetch bank details", err);
    }
  };
  fetchDetails();
}, []);


  const handleChange = (e) => {
    setDetails({ ...details, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!details.balance || isNaN(details.balance)) {
      setMessage("❌ Balance must be a valid number.");
      return;
    }

    try {
      await api.post("/bank-details", {
        bank_name: details.bank_name,
        upi_id: details.upi_id,
        initial_balance: parseFloat(details.balance),
      });
      setMessage("✅ Bank details saved successfully.");
    } catch (err) {
      console.error("Save failed", err);
      setMessage("❌ Failed to save bank details.");
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-6 text-white">
      <h2 className="text-3xl font-bold mb-6 text-center">My Bank Details</h2>

      {message && (
        <div className="text-sm text-green-400 bg-neutral-800 border border-neutral-700 p-3 rounded mb-6">
          {message}
        </div>
      )}

      <div className="space-y-5 bg-neutral-900 border border-neutral-800 p-6 rounded-lg shadow-md">
        <div>
          <Label className="mb-1 block">Bank Name (Optional)</Label>
          <Input
            name="bank_name"
            value={details.bank_name}
            onChange={handleChange}
            placeholder="e.g., HDFC Bank"
            className="bg-neutral-800 text-white"
          />
        </div>

        <div>
          <Label className="mb-1 block">UPI ID (Optional)</Label>
          <Input
            name="upi_id"
            value={details.upi_id}
            onChange={handleChange}
            placeholder="e.g., yourname@upi"
            className="bg-neutral-800 text-white"
          />
        </div>

        <div>
          <Label className="mb-1 block">
            Balance <span className="text-red-500">*</span>
          </Label>
          <Input
            name="balance"
            value={details.balance}
            onChange={handleChange}
            type="number"
            placeholder="e.g., 12000"
            className="bg-neutral-800 text-white"
            required
          />
        </div>

        <div className="pt-4 text-right">
          <Button onClick={() => setShowConfirm(true)}>Save Bank Details</Button>
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={() => {
          setShowConfirm(false);
          handleSave();
        }}
        title="Confirm Save"
        description="Are you sure you want to update your bank details?"
      />
    </div>
  );
}
