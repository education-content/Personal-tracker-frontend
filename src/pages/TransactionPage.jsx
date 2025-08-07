import React, { useEffect, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import api from "../api";
import AddTransactionDialog from "@/components/AddTransactionDialog";

export default function TransactionsPage() {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [filter, setFilter] = useState({ type: "", category: "" });

    const fetchTransactions = async () => {
        try {
            const res = await api.get("/transactions", { params: filter });
            setTransactions(res.data);
        } catch (err) {
            console.error("Error fetching transactions", err);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await api.get("/categories");
            setCategories(res.data);
        } catch (err) {
            console.error("Error fetching categories", err);
        }
    };

    useEffect(() => {
        fetchTransactions();
        fetchCategories();
    }, [filter]);

    return (
        <div className="max-w-5xl mx-auto p-6 text-white">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Transactions</h2>
                <AddTransactionDialog
                    onSuccess={() => fetchTransactions()}
                    categories={categories}
                    refreshCategories={fetchCategories}
                />
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-4">
                <Select
                    value={filter.type || "all"}
                    onValueChange={(val) =>
                        setFilter({ ...filter, type: val === "all" ? "" : val })
                    }
                >
                    <SelectTrigger className="w-[180px] text-white bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Filter by Type" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white">
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="credit">Credit</SelectItem>
                        <SelectItem value="debit">Debit</SelectItem>
                        <SelectItem value="info">Info</SelectItem>
                        <SelectItem value="shared">Shared</SelectItem>
                    </SelectContent>
                </Select>

                <Select
                    value={filter.category || "all"}
                    onValueChange={(val) =>
                        setFilter({ ...filter, category: val === "all" ? "" : val })
                    }
                >
                    <SelectTrigger className="w-[200px] text-white bg-gray-900 border-gray-700">
                        <SelectValue placeholder="Filter by Category" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-900 text-white">
                        <SelectItem value="all">All Categories</SelectItem>
                        {categories.map((cat) => (
                            <SelectItem key={cat.id} value={String(cat.id)}>
                                {cat.name}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Table */}
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-white">Date</TableHead>
                        <TableHead className="text-white">Type</TableHead>
                        <TableHead className="text-white">Amount</TableHead>
                        <TableHead className="text-white">Category</TableHead>
                        <TableHead className="text-white">Description</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {transactions.length > 0 ? (
                        transactions.map((txn) => (
                            <TableRow key={txn.id}>
                                <TableCell>{format(new Date(txn.transaction_date), "d-MMM-yyyy")}</TableCell>
                                <TableCell>{txn.type}</TableCell>
                                <TableCell>₹{txn.amount}</TableCell>
                                <TableCell>{txn.category_name}</TableCell>
                                <TableCell>{txn.description || "-"}</TableCell>
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center text-white">
                                No transactions found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
}
