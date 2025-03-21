/**
 * Login Component
 * 
 * This component handles both user authentication and registration.
 * It features a dynamic form that switches between login and signup modes,
 * displays success/error messages, and includes a dynamic background image.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import { useUser } from "../../context/UserContext";
import { useBackground } from "../../context/BackgroundContext";

export default function Login() {
  const navigate = useNavigate();
  const { createUser, login, users } = useUser();
  const { backgroundImage, isLoading: backgroundLoading } = useBackground();
  
  const [isRegistering, setIsRegistering] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  /**
   * Handles input changes in the form fields
   * Clears any existing messages when user starts typing
   */
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage(null);
  };

  /**
   * Handles form submission for both login and registration
   * Includes validation, user creation, and success/error messaging
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    try {
      if (isRegistering) {
        // Check for existing email during registration
        if (users.some(user => user.email === formData.email)) {
          setMessage({
            type: 'error',
            text: 'Username already exists. Please try a different email.'
          });
          return;
        }

        // Create new user and handle success
        await createUser(formData);
        setMessage({
          type: 'success',
          text: 'Account created successfully! Logging you in...'
        });
        
        // Short delay for UX
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Automatic login after registration
        await login(formData.email, formData.password);
        
        // Delayed navigation to show success message
        setTimeout(() => {
          navigate("/home");
        }, 2500);
      } else {
        // Handle regular login
        if (!users.some(user => user.email === formData.email)) {
          setMessage({
            type: 'error',
            text: 'You are not signed up. Please create an account first.'
          });
          return;
        }
        await login(formData.email, formData.password);
        navigate("/home");
      }
    } catch (err) {
      if (err instanceof Error) {
        setMessage({
          type: 'error',
          text: err.message
        });
      }
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
            : 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: backgroundLoading ? 0.5 : 1,
        }}
      >
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
      </div>

      <div className="min-h-screen flex items-center justify-center p-4 relative z-10">
        {/* Back to Home Button */}
        <button
          onClick={() => navigate('/home')}
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
            <div className={`${
              message.type === 'success' 
                ? 'bg-green-500/10 border-l-4 border-green-500 text-green-400'
                : 'bg-red-500/10 border-l-4 border-red-500 text-red-400'
            } p-3 rounded-lg mb-4 flex items-center gap-2 text-sm`}>
              {message.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
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
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-slate-700/30 text-white rounded-lg focus:ring-2 focus:ring-purple-500 outline-none placeholder-slate-400 border border-slate-600/30"
                required
                placeholder="Enter your password"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/50"
            >
              {isRegistering ? "Sign Up" : "Sign In"}
            </button>

            {/* Toggle between Login/Register */}
            <button
              type="button"
              onClick={() => {
                setIsRegistering(!isRegistering);
                setFormData({ name: "", email: "", password: "" });
                setMessage(null);
              }}
              className="w-full text-sm text-purple-300 hover:text-purple-200 transition-colors"
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
