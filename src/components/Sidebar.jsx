import React from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  BarChart,
  User,
  LogOut,
  List,
  Folder,
  Handshake,
  Activity,
  Settings,
  CreditCard
} from "lucide-react"; // ← include Settings icon

export default function Sidebar({ onLogout, showLogoutDialog, setShowLogoutDialog }) {
  return (
    <aside className="w-full md:w-64 bg-neutral-900 border-r border-neutral-800 p-6">
      <Link to='/dashboard'><h2 className="text-2xl font-semibold mb-8 text-white">Dashboard</h2></Link>
      <nav className="space-y-4">
        <Link to="/dashboard/profile">
          <Button
            variant="ghost"
            className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
          >
            <User className="w-4 h-4 mr-2" />
            Profile
          </Button>
        </Link>

        <Link to ="/dashboard/analytics">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <BarChart className="w-4 h-4 mr-2" />
          Analytics
        </Button>
        </Link>

        <Link to="/dashboard/bank-details">
          <Button
            variant="ghost"
            className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Bank Details
          </Button>
        </Link>

        <Link to="/dashboard/transaction">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <List className="w-4 h-4 mr-2" />
          Transactions
        </Button>
        </Link>
        <Link to="settlements">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <Handshake className="w-4 h-4 mr-2" />
          Settlements
        </Button>
        </Link>

        <Link to="/dashboard/shared-expenses">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <Activity className="w-4 h-4 mr-2" />
          Shared Expenses
        </Button>
        </Link>

        <Link to="/dashboard/friends">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <Folder className="w-4 h-4 mr-2" />
          Friends
        </Button>
        </Link>

        <Link to="/dashboard/settings">
        <Button
          variant="ghost"
          className="w-full justify-start text-neutral-300 hover:text-white cursor-pointer"
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </Button>
        </Link>
      </nav>

      <div className="mt-10">
        <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
          <DialogTrigger asChild>
            <Button variant="destructive" className="w-full justify-start cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-neutral-900 border border-neutral-800 text-white">
            <DialogHeader>
              <DialogTitle>Confirm Logout</DialogTitle>
            </DialogHeader>
            <p className="text-neutral-400">Are you sure you want to log out?</p>
            <DialogFooter className="mt-4">
              <Button
                variant="outline"
                onClick={() => setShowLogoutDialog(false)}
                className="cursor-pointer hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={onLogout}
                className="cursor-pointer hover:bg-red-700 transition-colors"
              >
                Logout
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </aside>
  );
}
