import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { LogIn, GraduationCap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetchUserRole(token);
    }
  }, []);

  const fetchUserRole = async (token: string) => {
    try {
      const response = await fetch("http://localhost:5000/auth/me", {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error("Failed to fetch user role");
      
      const data = await response.json();
      
      // Check if user data exists
      if (data?.user) {
        // The backend always returns the user role, so we can use this data
        // Note that navigation is the same for both admin and non-admin users 
        // based on your original code
        if(data.user.role === "admin") {
          navigate("/admin");
        } else {  
        navigate("/dashboard");}
      } else {
        setError("Invalid user data received");
        localStorage.removeItem("token");
      }
    } catch (err) {
      console.error("Error fetching user role:", err);
      setError("Session expired. Please log in again.");
      localStorage.removeItem("token");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user)); // Store user info

      fetchUserRole(data.token);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-white to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-row items-center justify-center space-x-12">
          {/* Left Side */}
          <div className="w-1/2 flex flex-col items-start space-y-8">
            <Link to="/" className="flex items-center space-x-2">
              <GraduationCap className="h-12 w-12 text-indigo-600" />
              <span className="text-2xl font-bold">NITJ Alumni</span>
            </Link>
            <h2 className="text-3xl font-extrabold text-gray-900">Welcome Back</h2>
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <Link to="/register" className="text-indigo-600">Create one now</Link>
            </p>

            {/* Error Message */}
            {error && <div className="text-red-600">{error}</div>}

            {/* Login Form */}
            <form className="space-y-4 w-full" onSubmit={handleSubmit}>
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-2 border rounded"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full p-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>
          </div>

          {/* Right Side */}
          <div className="w-1/2 hidden md:flex justify-center">
            <img
              src="/pic.jpg"
              alt="Login Illustration"
              className="w-96 h-auto object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
