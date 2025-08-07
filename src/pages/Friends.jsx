import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import api from "../api";
import ConfirmDialog from "@/components/ConfirmDialog";

const FriendsPage = () => {
  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [email, setEmail] = useState("");

  // Confirmation state
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  const fetchFriends = async () => {
    try {
      const { data } = await api.get("/friends");
      setFriends(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load friends:", err);
      setFriends([]);
    }
  };

  const fetchRequests = async () => {
    try {
      const { data } = await api.get("/friends/requests");
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to load friend requests");
      setRequests([]);
    }
  };

  useEffect(() => {
    fetchFriends();
    fetchRequests();
  }, []);

  const handleSendRequest = async () => {
    try {
      await api.post("/friends/request", { email });
      toast.success("Friend request sent");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to send request");
    }
  };

  const handleRespond = async (request_id, action) => {
    try {
      await api.post("/friends/respond", {
        request_id,
        action,
      });
      toast.success(`Request ${action === "accept" ? "accepted" : "rejected"}`);
      fetchRequests();
      fetchFriends();
    } catch (err) {
      toast.error("Failed to update request");
    }
  };

  const confirmRemoveFriend = (friend_id) => {
    setPendingRemoveId(friend_id);
    setConfirmOpen(true);
  };

  const performRemoveFriend = async () => {
    if (!pendingRemoveId) return;

    try {
      await api.delete(`/friends/${pendingRemoveId}`);
      toast.success("Friend removed");
      fetchFriends();
    } catch (err) {
      toast.error("Failed to remove friend");
    } finally {
      setConfirmOpen(false);
      setPendingRemoveId(null);
    }
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">Friends</h2>

      {/* Add friend */}
      <div className="flex items-center gap-2">
        <Input
          placeholder="Friend's email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSendRequest}>Send Request</Button>
      </div>

      {/* Requests */}
      {requests.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xl font-medium">Friend Requests</h3>
          {requests.map((req) => (
            <Card key={req.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>{req.sender_name} ({req.sender_email})</span>
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => handleRespond(req.id, "accept")}
                  >
                    Accept
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRespond(req.id, "reject")}
                  >
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Friend List */}
      <div className="space-y-4">
        <h3 className="text-xl font-medium">Your Friends</h3>
        {friends.length === 0 ? (
          <p className="text-muted-foreground">No friends yet.</p>
        ) : (
          friends.map((friend) => (
            <Card key={friend.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>{friend.name} ({friend.email})</span>
                <Button
                  variant="outline"
                  onClick={() => confirmRemoveFriend(friend.id)}
                >
                  Remove
                </Button>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Confirmation Dialog */}
      <ConfirmDialog
        open={confirmOpen}
        onConfirm={performRemoveFriend}
        onCancel={() => {
          setConfirmOpen(false);
          setPendingRemoveId(null);
        }}
        title="Remove Friend?"
        description="Are you sure you want to remove this friend? This action cannot be undone."
      />
    </div>
  );
};

export default FriendsPage;
