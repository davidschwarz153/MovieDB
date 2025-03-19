import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState("admin");
  const [password, setPassword] = useState("admin");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      if (isRegistering) {
        await register(email, password, name);
      } else {
        await login(email, password);
      }
      navigate("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid credentials");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md">
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
          {isRegistering ? "Create Account" : "Welcome Back"}
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegistering && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
                required
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            {isRegistering ? "Sign Up" : "Sign In"}
          </button>

          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="w-full text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            {isRegistering
              ? "Already have an account? Sign in"
              : "Don't have an account? Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
}
