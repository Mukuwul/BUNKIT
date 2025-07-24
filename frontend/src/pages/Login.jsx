import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });
      const { user, token } = res.data;
      login(user, token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#181824] via-[#232738] to-[#181824] font-sans">
      <div className="w-full max-w-md bg-[#212133] rounded-2xl shadow-2xl p-8 border border-[#31314a]">
        <div className="flex flex-col items-center mb-8">
          <span className="text-4xl mb-3">📚</span>
          <h1 className="text-2xl font-bold text-white mb-2">Login</h1>
          <p className="text-gray-400 text-sm">Sign in to Bunkit</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <input
            type="email"
            className="w-full py-3 px-4 rounded-md border border-[#2c2c40] bg-[#24243a] text-gray-100 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full py-3 px-4 rounded-md border border-[#2c2c40] bg-[#24243a] text-gray-100 text-sm placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 outline-none transition"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <button
            type="submit"
            className="
              w-full py-3
              bg-gradient-to-tr from-indigo-500 via-purple-700 to-indigo-700
              text-white text-base font-semibold rounded-lg
              transition-all duration-200
              shadow-lg
              hover:from-indigo-600 hover:via-purple-800 hover:to-indigo-800
              hover:shadow-xl
              focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:ring-offset-2
              active:scale-95
              tracking-wide
            "
          >
            Log In
          </button>
          <p className="pt-2 text-center text-[15px] text-gray-400">
            Don't have an account?{" "}
            <span
              className="text-indigo-400 hover:underline cursor-pointer"
              onClick={() => navigate("/register")}
            >
              Sign Up
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
