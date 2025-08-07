import React, { useEffect, useState } from "react";
import api from "../api";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card";
import { Select, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export default function SharedExpenses() {
  const [expenses, setExpenses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [participantFilter, setParticipantFilter] = useState("All");
  const [roleFilter, setRoleFilter] = useState("All");

  useEffect(() => {
    const fetchSharedExpenses = async () => {
      try {
        const res = await api.get("/shared-expenses");
        setExpenses(res.data);
        setFiltered(res.data);

        // Extract unique participants
        const names = new Set();
        res.data.forEach((exp) =>
          exp.participants.forEach((p) => names.add(p.name))
        );
        setParticipants(["All", ...Array.from(names)]);
      } catch (err) {
        console.error("Failed to load shared expenses", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSharedExpenses();
  }, []);

  useEffect(() => {
    let result = [...expenses];

    // Filter by participant
    if (participantFilter !== "All") {
      result = result.filter((exp) =>
        exp.participants.some((p) => p.name === participantFilter)
      );
    }

    // Filter by role
    if (roleFilter === "You owe") {
      result = result.filter((exp) => exp.your_share > 0);
    } else if (roleFilter === "You are owed") {
      result = result.filter((exp) => exp.paid_by === exp.current_user_id && exp.total_owed_to_you > 0);
    } else if (roleFilter === "No balance") {
      result = result.filter((exp) => exp.your_share === 0 && exp.paid_by !== exp.current_user_id);
    }

    setFiltered(result);
  }, [participantFilter, roleFilter, expenses]);

  return (
    <div className="space-y-8 p-4 md:p-8 max-w-6xl mx-auto text-white">
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <CardTitle>Shared Expenses</CardTitle>

          <div className="flex flex-wrap gap-4 items-center">
            {/* Participant Filter */}
            <div>
              <label className="text-sm block mb-1 text-gray-300">Filter by Participant</label>
              <select
                value={participantFilter}
                onChange={(e) => setParticipantFilter(e.target.value)}
                className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
              >
                {participants.map((name, i) => (
                  <option key={i} value={name}>{name}</option>
                ))}
              </select>
            </div>

            {/* Role Filter */}
            <div>
              <label className="text-sm block mb-1 text-gray-300">Filter by Your Role</label>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-gray-800 text-white border border-gray-600 rounded px-2 py-1"
              >
                <option value="All">All</option>
                <option value="You owe">You owe</option>
                <option value="You are owed">You are owed</option>
                <option value="No balance">No balance</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="text-gray-400">Loading...</div>
          ) : filtered.length === 0 ? (
            <div className="text-gray-500">No matching expenses found.</div>
          ) : (
            <table className="w-full text-sm table-auto">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="py-2 text-left">Date</th>
                  <th className="text-left">Description</th>
                  <th className="text-left">Paid By</th>
                  <th className="text-left">Total</th>
                  <th className="text-left">Participants</th>
                  <th className="text-left">Amount Owed By Each</th>
                  <th className="text-left">Your Role</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((exp) => (
                  <tr
                    key={exp.transaction_id}
                    className="border-b border-gray-800 align-top"
                  >
                    <td className="py-2 pr-4">
                      {exp.transaction_date_formatted ||
                        new Date(exp.transaction_date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                    </td>
                    <td className="py-2 pr-4">{exp.description}</td>
                    <td className="py-2 pr-4">{exp.paid_by_name}</td>
                    <td className="py-2 pr-4">₹{parseFloat(exp.amount).toFixed(2)}</td>
                    <td className="py-2 pr-4 space-y-1">
                      {exp.participants.map((p, idx) => (
                        <div key={idx} className="text-sm">{p.name}</div>
                      ))}
                    </td>
                    <td className="py-2 pr-4 space-y-1">
                      {exp.participants.map((p, idx) => (
                        <div key={idx} className="text-sm">
                          ₹{parseFloat(p.amount_owed).toFixed(2)}
                        </div>
                      ))}
                    </td>
                    <td className="whitespace-nowrap py-2 pr-4">
                      {exp.paid_by === exp.current_user_id ? (
                        <span className="text-green-400 font-semibold">
                          You paid <br />
                          <span className="text-xs font-normal">
                            Owed by others: ₹{parseFloat(exp.total_owed_to_you || 0).toFixed(2)}
                          </span>
                        </span>
                      ) : exp.your_share > 0 ? (
                        <span className="text-red-400 font-semibold">
                          You owe <br />
                          <span className="text-xs font-normal">
                            ₹{parseFloat(exp.your_share).toFixed(2)}
                          </span>
                        </span>
                      ) : (
                        <span className="text-gray-400">No balance</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
