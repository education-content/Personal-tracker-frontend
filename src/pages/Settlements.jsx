import React, { useEffect, useState } from "react";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function SettlementsPage() {
  const [settlements, setSettlements] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      const { data } = await api.get("/settlements/pending");
      setSettlements(data);
    } catch (err) {
      console.error("Failed to load settlements", err);
      toast.error("Failed to load settlements");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async (settlementId) => {
    if (!window.confirm("Are you sure you want to mark this as paid? The other person will need to confirm it.")) return;

    try {
      await api.post(`/settlements/settle`, { settlement_id: settlementId });
      toast.success("Marked as paid. Waiting for confirmation.");
      fetchSettlements();
    } catch (err) {
      console.error("Failed to mark as paid", err);
      toast.error("Failed to mark as paid");
    }
  };

  const handleConfirm = async (settlementId) => {
    if (!window.confirm("Confirm that you received the payment? This will finalize the settlement.")) return;

    try {
      await api.post(`/settlements/confirm`, { settlement_id: settlementId });
      toast.success("Settlement confirmed.");
      fetchSettlements();
    } catch (err) {
      console.error("Failed to confirm settlement", err);
      toast.error("Failed to confirm settlement.");
    }
  };

  const handleCancelRequest = async (settlementId) => {
    if (!window.confirm("Are you sure you want to cancel this settlement request?")) return;

    try {
      await api.post(`/settlements/cancel`, { settlement_id: settlementId });
      toast.success("Settlement request cancelled.");
      fetchSettlements();
    } catch (err) {
      console.error("Failed to cancel request", err);
      toast.error("Failed to cancel request.");
    }
  };

  if (loading) return <div className="text-white p-4">Loading...</div>;

  return (
    <div className="p-6 text-white max-w-3xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold mb-4">Your Settlements</h1>

      {settlements.length === 0 ? (
        <p>No pending settlements 🎉</p>
      ) : (
        settlements.map((settle) => (
          <Card key={settle.id} className="bg-gray-900 border border-gray-700 shadow-md rounded-lg">
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between items-center">
                <div className="text-lg font-semibold break-all">
                  {settle.description || "No description provided"}
                </div>
                {settle.transaction_date && (
                  <div className="text-sm text-gray-400">
                    {new Date(settle.transaction_date).toLocaleDateString()}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <strong>With:</strong> {settle.friend_name || "Unknown"}
                </div>
                <div>
                  <strong>Total:</strong>{" "}
                  {settle.total_amount != null
                    ? `₹${Number(settle.total_amount).toFixed(2)}`
                    : "N/A"}
                </div>
                <div>
                  <strong>You Owe:</strong>{" "}
                  {settle.amount_owed != null
                    ? (
                      <span className="text-green-400 font-medium">
                        ₹{Number(settle.amount_owed).toFixed(2)}
                      </span>
                    )
                    : "N/A"}
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  {settle.is_settled ? (
                    <span className="text-green-400">✅ Settled</span>
                  ) : (
                    <span className="text-yellow-400">
                      🕗 Pending {settle.is_confirmed ? "Confirmation" : "Payment"}
                    </span>
                  )}
                </div>
                {settle.settled_on && (
                  <div className="col-span-2 text-sm text-gray-400">
                    Settled on {new Date(settle.settled_on).toLocaleString()}
                  </div>
                )}
              </div>

              {!settle.is_settled && (
                <div className="flex gap-2 pt-2 flex-wrap">
                  {settle.owed_by_user === user.id ? (
                    <>
                      <Button
                        onClick={() => handleMarkAsPaid(settle.id)}
                        variant="default"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        Mark as Paid
                      </Button>
                      <Button
                        onClick={() => handleCancelRequest(settle.id)}
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        Cancel Request
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConfirm(settle.id)}
                      variant="default"
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Confirm Payment
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}
