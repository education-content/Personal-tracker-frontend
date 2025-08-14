// src/pages/SettlementsPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

const formatCurrency = (n) => {
  const num = Number(n);
  return isNaN(num) ? "₹0.00" : `₹${num.toFixed(2)}`;
};

const formatDate = (d) => {
  if (!d) return "Unknown date";
  const dt = new Date(d);
  return isNaN(dt.getTime())
    ? "Unknown date"
    : dt.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

export default function SettlementsPage() {
  const [summary, setSummary] = useState([]);
  const [loadingSummary, setLoadingSummary] = useState(true);
  const [breakupsCache, setBreakupsCache] = useState({});
  const [loadingBreakup, setLoadingBreakup] = useState(false);
  const [openFriendId, setOpenFriendId] = useState(null);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  useEffect(() => {
    fetchSummary();
  }, []);

  async function fetchSummary() {
    setLoadingSummary(true);
    try {
      const { data } = await api.get("/settlements/summary");
      setSummary(Array.isArray(data) ? data : []);
      console.log("Fetched settlements summary:", data);
    } catch (err) {
      console.error("Error fetching settlements summary:", err);
      toast.error("Failed to load settlements summary");
      setSummary([]);
    } finally {
      setLoadingSummary(false);
    }
  }

  async function fetchPendingConfirmations() {
    try {
      const { data } = await api.get("/settlements/pending");
      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error("Error fetching pending confirmations:", err);
      return [];
    }
  }

  async function fetchBreakupFor(friendId) {
    if (!friendId) return;
    if (breakupsCache[friendId]) return breakupsCache[friendId];

    setLoadingBreakup(true);
    try {
      // Fetch breakup
      const { data: breakupRaw } = await api.get(`/settlements/breakup/${friendId}`);
      const normalizedBreakup = (Array.isArray(breakupRaw) ? breakupRaw : []).map((it) => ({
        settlement_id: it.settlement_id,
        transaction_id: it.transaction_id,
        description: it.description?.trim() || "Settlement transaction",
        transaction_date: it.transaction_date,
        amount_owed: Number(it.amount_owed || 0),
        is_settled: !!it.is_settled,
        is_claimed: !!it.is_claimed,
        confirmed: !!it.is_confirmed_by_receiver,
        claimed_by: it.claimed_by || null,
        paid_by:
          it.paid_by === "you" || it.paid_by === "them"
            ? it.paid_by
            : it.paid_by === user?.id
            ? "you"
            : "them",
      }));

      // Fetch pending confirmations and merge if they match this friend
      const pendingList = await fetchPendingConfirmations();
      const pendingForFriend = pendingList
        .filter((p) => p.payer_id && p.settlement_id)
        .filter((p) =>
          normalizedBreakup.some((b) => b.settlement_id === p.settlement_id)
        )
        .map((p) => ({
          ...normalizedBreakup.find((b) => b.settlement_id === p.settlement_id),
          is_settled: true,
          is_claimed: true,
          confirmed: false,
          claimed_by: p.payer_id,
        }));

      // Merge, replacing any duplicates with pending state
      const mergedBreakup = normalizedBreakup.map((b) => {
        const pending = pendingForFriend.find(
          (pf) => pf.settlement_id === b.settlement_id
        );
        return pending || b;
      });

      setBreakupsCache((prev) => ({ ...prev, [friendId]: mergedBreakup }));
      return mergedBreakup;
    } catch (err) {
      console.error("Error fetching breakup:", err);
      toast.error("Failed to load breakup");
      return [];
    } finally {
      setLoadingBreakup(false);
    }
  }

  const openBreakupModal = async (friendId) => {
    setOpenFriendId(friendId);
    await fetchBreakupFor(friendId);
  };

  const closeBreakupModal = () => setOpenFriendId(null);

  const getPendingIdsUserOwes = (breakdown) =>
    breakdown
      .filter((it) => !it.is_settled && it.paid_by === "them")
      .map((it) => it.settlement_id);

  const getClaimsWaitingConfirmation = (breakdown) =>
    breakdown
      .filter(
        (it) =>
          it.is_settled &&
          it.is_claimed &&
          !it.confirmed &&
          it.claimed_by !== user?.id
      )
      .map((it) => it.settlement_id);

  const handleMarkAsPaid = async (friendId) => {
    const breakdown = breakupsCache[friendId] || [];
    const pendingIds = getPendingIdsUserOwes(breakdown);
    if (!pendingIds.length) return toast("Nothing pending to mark as paid");
    if (!window.confirm("Mark as paid? The other person will need to confirm."))
      return;

    try {
      await api.post("/settlements/claim", {
        friend_id: friendId,
        settlement_ids: pendingIds,
      });
      toast.success("Marked as paid. Waiting for confirmation.");
      const updated = breakdown.map((it) =>
        pendingIds.includes(it.settlement_id)
          ? { ...it, is_settled: true, is_claimed: true, claimed_by: user?.id }
          : it
      );
      setBreakupsCache((prev) => ({ ...prev, [friendId]: updated }));
      fetchSummary();
    } catch (err) {
      console.error("Claim failed:", err);
      toast.error("Failed to mark as paid");
    }
  };

const handleConfirm = async (friendId) => {
  const breakdown = breakupsCache[friendId] || [];
  const toConfirm = getClaimsWaitingConfirmation(breakdown);

  console.log("📤 Sending settlement_ids to backend:", toConfirm);

  if (!toConfirm.length) {
    toast("No claims to confirm");
    return;
  }

  if (!window.confirm("Confirm receipt of payment? This will finalize the settlement.")) {
    return;
  }

  try {
    const { data } = await api.post("/settlements/confirm", {
      settlement_ids: toConfirm
    });

    console.log("✅ Backend response:", data);

    if (data.failed?.length) {
      toast.error(`Some confirmations failed: ${data.failed.join(", ")}`);
    }
    if (data.confirmed?.length) {
      toast.success(`${data.confirmed.length} settlements confirmed`);
    }

    const updated = breakdown.map((it) =>
      data.confirmed?.includes(it.settlement_id)
        ? { ...it, confirmed: true, is_settled: true, is_confirmed_by_receiver: 1 }
        : it
    );

    setBreakupsCache((prev) => ({ ...prev, [friendId]: updated }));
    fetchSummary();
  } catch (err) {
    console.error("❌ Confirm failed:", err.response?.data || err.message);
    toast.error(err.response?.data?.error || "Failed to confirm");
  }
};



  const handleReject = async (friendId) => {
    const breakdown = breakupsCache[friendId] || [];
    const toReject = getClaimsWaitingConfirmation(breakdown);
    if (!toReject.length) return toast("No claims to reject");
    if (!window.confirm("Reject the claim? This will revert them to unpaid.")) return;

    try {
      await api.post("/settlements/reject", { settlement_ids: toReject });
      toast.success("Rejected");
      const updated = breakdown.map((it) =>
        toReject.includes(it.settlement_id)
          ? {
              ...it,
              is_settled: false,
              is_claimed: false,
              claimed_by: null,
              confirmed: false,
            }
          : it
      );
      setBreakupsCache((prev) => ({ ...prev, [friendId]: updated }));
      fetchSummary();
    } catch (err) {
      console.error("Reject failed:", err);
      toast.error("Failed to reject claim");
    }
  };

  const computeNetFor = (breakdown) =>
    (breakdown || []).reduce((acc, it) => {
      const amt = Number(it.amount_owed || 0);
      return acc + (it.paid_by === "you" ? amt : -amt);
    }, 0);

  if (!user) {
    return <div className="p-6 text-white">Please login to see settlements.</div>;
  }

  return (
    <div className="p-6 text-white max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Settlements</h1>

      {loadingSummary ? (
        <div className="text-gray-400">Loading summary...</div>
      ) : summary.length === 0 ? (
        <div className="text-gray-400">No settlements found.</div>
      ) : (
        summary.map((s) => {
          const breakup = breakupsCache[s.friend_id] || [];
          const netTotal = computeNetFor(breakup.length ? breakup : s.breakdown || []);
          const pendingIds = getPendingIdsUserOwes(breakup);
          const waitingConfirmIds = getClaimsWaitingConfirmation(breakup);

          return (
            <Card key={s.friend_id} className="bg-gray-900 border border-gray-700">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-semibold">{s.friend_name}</div>
                    <div className="text-sm text-gray-400">
                      {breakup.length
                        ? `${breakup.length} items`
                        : s.count
                        ? `${s.count} items`
                        : ""}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-sm text-gray-400">Net</div>
                      <div
                        className={`text-lg font-semibold ${
                          netTotal > 0
                            ? "text-green-400"
                            : netTotal < 0
                            ? "text-red-400"
                            : "text-gray-300"
                        }`}
                      >
                        {netTotal === 0
                          ? "Settled"
                          : netTotal > 0
                          ? `They owe ${formatCurrency(netTotal)}`
                          : `You owe ${formatCurrency(Math.abs(netTotal))}`}
                      </div>
                    </div>

                    <Dialog
                      open={openFriendId === s.friend_id}
                      onOpenChange={(open) =>
                        open ? openBreakupModal(s.friend_id) : closeBreakupModal()
                      }
                    >
                      <DialogTrigger asChild>
                        <Button variant="outline">View Breakdown</Button>
                      </DialogTrigger>
                      <DialogContent className="bg-gray-900 text-white max-w-3xl">
                        <DialogTitle>Breakdown with {s.friend_name}</DialogTitle>
                        <div className="mt-3 space-y-3 max-h-[50vh] overflow-y-auto">
                          {loadingBreakup && openFriendId === s.friend_id ? (
                            <div className="text-gray-400">Loading...</div>
                          ) : (breakupsCache[s.friend_id] || []).length === 0 ? (
                            <div className="text-gray-400">No items</div>
                          ) : (
                            (breakupsCache[s.friend_id] || []).map((it) => (
                              <div
                                key={it.settlement_id}
                                className="p-3 bg-gray-800 rounded-md border border-gray-700"
                              >
                                <div className="text-sm">{it.description}</div>
                                <div className="text-xs text-gray-400">
                                  {formatDate(it.transaction_date)}
                                </div>
                                <div
                                  className={`text-sm mt-1 ${
                                    it.paid_by === "them"
                                      ? "text-red-400"
                                      : "text-green-400"
                                  }`}
                                >
                                  {it.paid_by === "them"
                                    ? `You owe ${formatCurrency(it.amount_owed)}`
                                    : `They owe ${formatCurrency(it.amount_owed)}`}
                                </div>
                                <div className="text-xs text-gray-500">
                                  Status:{" "}
                                  {!it.is_settled
                                    ? "Pending"
                                    : it.is_claimed && !it.confirmed
                                    ? "Pending Confirmation"
                                    : "Settled"}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                          {pendingIds.length > 0 && netTotal < 0 && (
                            <Button
                              variant="outline"
                              onClick={() => handleMarkAsPaid(s.friend_id)}
                            >
                              Mark as Paid
                            </Button>
                          )}
                          {waitingConfirmIds.length > 0 && (
                            <>
                              <Button
                                variant="default"
                                onClick={() => handleConfirm(s.friend_id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                variant="destructive"
                                onClick={() => handleReject(s.friend_id)}
                              >
                                Reject
                              </Button>
                            </>
                          )}
                          <Button variant="secondary" onClick={closeBreakupModal}>
                            Close
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}

      <div className="text-xs text-gray-500 mt-6">
        Note: "Mark as Paid" creates a claim which the recipient must confirm. Once
        confirmed, balances will be updated.
      </div>
    </div>
  );
}
