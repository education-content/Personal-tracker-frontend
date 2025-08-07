import React, { useState,useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import api from "../api";



export default function AddTransactionDialog({ onSuccess, categories }) {
  const [open, setOpen] = useState(false);
  const [addingCustomCategory, setAddingCustomCategory] = useState(false);
  const [friends, setFriends] = useState([]);


  useEffect(() => {
    const fetchFriends = async () => {
      if (!open) return;

      try {
        const { data } = await api.get("/friends");
        setFriends(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load friends:", err);
        setFriends([]);
      }
    };

    fetchFriends();
  }, [open]);

  const [form, setForm] = useState({
    amount: "",
    type: "expense",
    category_name: "",
    transaction_date: new Date().toISOString().split("T")[0],
    description: "",
    shared_with: "",
    shared_amount: "",
    is_settled: false,
  });

  const handleAddTransaction = async () => {
    try {
      if (!form.amount || !form.category_name.trim()) {
        alert("Please fill out amount and category");
        return;
      }

      const payload = {
        amount: Number(form.amount),
        type: form.type,
        category_name: form.category_name.trim(),
        transaction_date: form.transaction_date,
        description: form.description,
      };

      if (form.type === "shared") {
        payload.is_shared = true;
        payload.shared_with = form.shared_with;
        payload.shared_amount = Number(form.shared_amount);
        payload.is_settled = form.is_settled;
      }

      await api.post("/transactions", payload);

      setOpen(false);
      setAddingCustomCategory(false);
      setForm({
        amount: "",
        type: "expense",
        category_name: "",
        transaction_date: new Date().toISOString().split("T")[0],
        description: "",
        shared_with: "",
        shared_amount: "",
        is_settled: false,
      });

      onSuccess();
      toast.success("Transaction Added successfully!");
    } catch (err) {
      console.error("Error adding transaction", err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Transaction</Button>
      </DialogTrigger>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Transaction</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Amount */}
          <div>
            <Label className="text-white">Amount</Label>
            <Input
              type="number"
              value={form.amount}
              onChange={(e) => setForm({ ...form, amount: e.target.value })}
              className="text-white placeholder:text-gray-400 bg-gray-800 border-gray-600"
            />
          </div>

          {/* Type */}
          <div>
            <Label className="text-white">Type</Label>
            <Select
              value={form.type}
              onValueChange={(val) => setForm({ ...form, type: val })}
            >
              <SelectTrigger className="w-full text-white bg-gray-800 border-gray-600">
                <SelectValue placeholder="Select Type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 text-white">
                <SelectItem value="credit">Credit</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="shared">Shared</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <Label className="text-white">Category</Label>
            {categories.length > 0 && !addingCustomCategory ? (
              <>
                <Select
                  value={form.category_name}
                  onValueChange={(val) =>
                    setForm({ ...form, category_name: val })
                  }
                >
                  <SelectTrigger className="w-full text-white bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.name}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="link"
                  className="text-xs p-0 mt-1 text-white"
                  onClick={() => {
                    setAddingCustomCategory(true);
                    setForm({ ...form, category_name: "" });
                  }}
                >
                  + Add Custom Category
                </Button>
              </>
            ) : (
              <>
                <Input
                  placeholder="Enter new category name"
                  value={form.category_name}
                  onChange={(e) =>
                    setForm({ ...form, category_name: e.target.value })
                  }
                  className="text-white placeholder:text-gray-400 bg-gray-800 border-gray-600"
                />
                {categories.length > 0 && (
                  <Button
                    variant="link"
                    className="text-xs p-0 mt-1 text-white"
                    onClick={() => {
                      setAddingCustomCategory(false);
                      setForm({ ...form, category_name: "" });
                    }}
                  >
                    ← Choose from existing
                  </Button>
                )}
              </>
            )}
          </div>

          {/* Date */}
          <div>
            <Label className="text-white">Date</Label>
            <Input
              type="date"
              value={form.transaction_date}
              onChange={(e) =>
                setForm({ ...form, transaction_date: e.target.value })
              }
              className="text-white bg-gray-800 border-gray-600"
            />
          </div>

          {/* Description */}
          <div>
            <Label className="text-white">Description</Label>
            <Input
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="text-white bg-gray-800 border-gray-600"
            />
          </div>

          {/* Shared fields */}
          {form.type === "shared" && (
            <>
              <div>
                <Label className="text-white">Shared With</Label>
                <Select
                  value={form.shared_with}
                  onValueChange={(val) =>
                    setForm({ ...form, shared_with: val })
                  }
                >
                  <SelectTrigger className="w-full text-white bg-gray-800 border-gray-600">
                    <SelectValue placeholder="Select User" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 text-white">
                    {friends.map((user) => (
                      <SelectItem key={user.id} value={String(user.id)}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-white">Amount Owed by Them</Label>
                <Input
                  type="number"
                  value={form.shared_amount}
                  onChange={(e) =>
                    setForm({ ...form, shared_amount: e.target.value })
                  }
                  className="text-white placeholder:text-gray-400 bg-gray-800 border-gray-600"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_settled}
                  onChange={(e) =>
                    setForm({ ...form, is_settled: e.target.checked })
                  }
                  className="w-4 h-4"
                />
                <Label className="text-white">Mark as Settled</Label>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="pt-6">
          <Button onClick={handleAddTransaction}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
