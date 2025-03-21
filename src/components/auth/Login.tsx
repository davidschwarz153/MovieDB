/**
 * Login Component
 *
 * This component handles both user authentication and registration.
 * It features a dynamic form that switches between login and signup modes,
 * displays success/error messages, and includes a dynamic background image.
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useBackground } from "../../context/BackgroundContext";

export default function Login() {
  const navigate = useNavigate();
  const { createUser, login, users } = useUser();
  const { backgroundImage, isLoading: backgroundLoading } = useBackground();

  const [isRegistering, setIsRegistering] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (showSuccessMessage) {
      const timer = setTimeout(() => {
        setShowSuccessMessage(false);
        setIsRegistering(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessMessage]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  const validateForm = () => {
    if (isRegistering && !formData.name.trim()) {
      setMessage({ type: "error", text: "Please enter your name" });
      return false;
    }
    if (!formData.email.trim()) {
      setMessage({ type: "error", text: "Please enter your email" });
      return false;
    }
    if (!formData.password) {
      setMessage({ type: "error", text: "Please enter your password" });
      return false;
    }
    return true;
  };

  const handleRegistration = async () => {
    try {
      // Check for existing email
      if (users.some((user) => user.email === formData.email)) {
        setMessage({
          type: "error",
          text: "Email already exists. Please try a different email.",
        });
        return false;
      }

      // Create new user
      await createUser({
        ...formData,
        role: "user",
        status: "active",
      });

      setShowSuccessMessage(true);
      setMessage({
        type: "success",
        text: `Welcome to MovieDB, ${formData.name}! 🎬`,
      });

      // Automatic login after registration
      await login(formData.email, formData.password);

      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text: "Registration failed. Please try again.",
      });
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      await login(formData.email, formData.password);
      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Login failed. Please try again.",
      });
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      if (isRegistering) {
        const success = await handleRegistration();
        if (success) {
          // Wait to show welcome message before redirecting
          setTimeout(() => {
            navigate("/Home");
          }, 2000);
        }
      } else {
        const success = await handleLogin();
        if (success) {
          navigate("/Home");
        }
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: "An unexpected error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      {/* Dynamic Background */}
      <div
        className="fixed inset-0 z-0 transition-all duration-1000"
        style={{
          backgroundImage: backgroundImage
            ? `url(${backgroundImage})`
            : "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: backgroundLoading ? 0.5 : 1,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate("/home")}
          className="absolute top-4 left-4 text-white/80 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="w-full max-w-md bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-slate-700/20">
          {/* Form Title */}
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isRegistering ? "Create Account" : "Welcome Back"}
          </h2>

          {/* Success/Error Message Display */}
          {message && (
            <div
              className={`${
                message.type === "success"
                  ? "bg-green-500/10 border-l-4 border-green-500 text-green-400"
                  : "bg-red-500/10 border-l-4 border-red-500 text-red-400"
              } p-3 rounded-lg mb-4 flex items-center gap-2 text-sm`}
            >
              {message.type === "success" ? (
                <CheckCircle size={16} />
              ) : (
                <AlertCircle size={16} />
              )}
              {message.text}
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Conditional Name Field for Registration */}
            {isRegistering && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-slate-200 mb-1"
                >
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-400 border border-slate-600/30"
                  required={isRegistering}
                  placeholder="Enter your name"
                  disabled={isProcessing}
                />
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-400 border border-slate-600/30"
                required
                placeholder="Enter your email"
                disabled={isProcessing}
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-200 mb-1"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-slate-700/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-400 border border-slate-600/30 pr-10"
                  required
                  placeholder="Enter your password"
                  disabled={isProcessing}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering
                ? isProcessing
                  ? "Creating Account..."
                  : "Create Account"
                : "Sign In"}
            </button>

            {/* Toggle between Login/Register */}
            <button
              type="button"
              disabled={isProcessing || showSuccessMessage}
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormData({ name: "", email: "", password: "" });
                setMessage(null);
              }}
              className="w-full text-sm text-purple-300 hover:text-purple-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isRegistering
                ? "Already have an account? Sign in"
                : "Don't have an account? Sign up"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
