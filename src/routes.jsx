import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import DashboardContent from "./pages/Dashboard/DashboardContent";
import ProfilePage from "./pages/Profile";
import BankDetailsPage from "./pages/BankDetails";
import SettingsPage from "./pages/Settings";
import PrivateRoute from "./components/PrivateRoutes";
import AuthRedirect from "./components/AuthRedirect";
import TransactionsPage from "./pages/TransactionPage";
import FriendsPage from "./pages/Friends";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<AuthRedirect><Login /></AuthRedirect>} />
      <Route path="/register" element={<Register />} />

      {/* 🔒 Protected Dashboard Route */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      >
        {/* 🧩 Nested routes inside Dashboard */}
        <Route index element={<DashboardContent />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="transaction" element={<TransactionsPage />} />
        <Route path="bank-details" element={<BankDetailsPage />} />
         <Route path="friends" element={<FriendsPage />} />
        {/* <Route path="settings" element={<SettingsPage />} /> */}
      </Route>
    </Routes>
  );
}
