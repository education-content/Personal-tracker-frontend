// src/pages/Register.jsx
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_no: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, mobile_no, password, confirmPassword } = formData;

    if (!name || !email || !password) {
      return toast.error("All required fields must be filled.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);

    try {

      await axios.post("https://personal-tracker-backend-6v56.onrender.com/auth/register", {
        name,
        email,
        mobile_no,
        password
      });

      toast.success("Registration successful! You can now log in.");

      setFormData({
        name: "",
        email: "",
        mobile_no: "",
        password: "",
        confirmPassword: "",
      });
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <Card className="w-full max-w-md bg-neutral-900 border-neutral-800">
        <CardHeader>
          <CardTitle className="text-white text-2xl font-semibold">
            Create an account
          </CardTitle>
          <p className="text-neutral-400 text-sm mt-1">
            Please fill in your details to register
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label className="text-neutral-300 text-sm">Name</Label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300 text-sm">Email</Label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="m@example.com"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300 text-sm">Mobile Number</Label>
              <Input
                name="mobile_no"
                type="tel"
                value={formData.mobile_no}
                onChange={handleChange}
                placeholder="9876543210"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300 text-sm">Password</Label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-neutral-300 text-sm">Confirm Password</Label>
              <Input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••"
                className="bg-neutral-800 border-neutral-700 text-neutral-100 placeholder-neutral-500"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-white text-black hover:bg-neutral-200 mt-2"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create account"}
            </Button>

            <p className="text-sm text-center text-neutral-400 mt-4">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-white hover:underline"
              >
                Log in
              </a>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
