import React, { useState, useEffect, useRef, use } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!username || !password) {
      setError("Please enter username and password");
      return;
    }

    // Mock authentication
    if (username === "admin" && password === "password") {
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  }

  const timeoutRef = useRef(null);

  useEffect(() => {
    if (showPassword) {
      timeoutRef.current = setTimeout(() => setShowPassword(false), 2000);
    }
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [showPassword]);

  return (
    // console.log("Rendering Login Page"),  
    <div className="min-h-screen px-4 py-8 sm:py-12 md:py-16 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="w-full max-w-2xl ">
        {/* Header Section - Fixed height to prevent shifting */}
        <div className="mb-1 lg:mb-8 sm:mb-10 text-center min-h-[200px] sm:min-h-[220px] md:min-h-[240px] flex flex-col justify-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-gray-900 mb-3 sm:mb-4">
            Welcome
          </h1>
          <h2 className="text-base sm:text-lg md:text-xl font-medium text-gray-700 mb-2 whitespace-nowrap overflow-hidden text-ellipsis px-2">
            Application Discovery & Service Registry
          </h2>
          <p className="text-sm sm:text-base text-blue-500">Sign in to continue</p>
        </div>

        {/* Form Section */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg max-w-md mx-auto">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                autoComplete="username"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                  className="w-full px-4 py-2.5 sm:py-3 border border-gray-300 rounded-lg pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                  autoComplete="current-password"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-500 hover:text-gray-700 transition"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="min-h-[30px]">
              {error ? (
                <div className="text-red-600 text-sm bg-red-50 px-4 py-1 rounded-lg border border-red-200">
                  {error}
                </div>
              ) : null}
            </div>

            <button
              onClick={handleSubmit}
              className="w-full py-3 sm:py-3.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 active:bg-indigo-800 transition shadow-md hover:shadow-lg"
            >
              Sign in
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}