import { useState } from "react";
import {
  Bus,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  ShieldCheck,
} from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import { useNavigate } from "react-router-dom";
import API from "../apis/apis";
import axios from "axios";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@bus.com");
  const [password, setPassword] = useState("admin123");
  const [showPw, setShowPw] = useState(false);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setError("");

      if (!email && !password) {
        setError("All fields are required");
        return;
      }

      setStatus("loading");
      const res = await axios.post(API.common.login, {
        email: email,
        password: password,
      });
      console.log(res);
      if (res.data.result.userRole.includes("admin")) {
        localStorage.setItem("userToken", res.data.result.token);
        navigate("/dashboard");
      }
      setStatus("idle");
    } catch (e) {
      console.log(e);
      setStatus("idle");
    }
  };

  return (
    <div
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[#161826] px-4"
      style={fontDM}
    >
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-yellow-400/10 blur-[100px]" />

      <div className="relative z-10 w-full max-w-[460px]">
        <div className="bg-[#1c1f2e] border border-[#2a2d3e] backdrop-blur-xl rounded-3xl shadow-2xl p-10">
          <div className="flex items-center gap-3 mb-9">
            <div className="w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center shadow-[0_4px_18px_rgba(251,191,36,0.5)]">
              <Bus size={24} className="text-[#0d0f1a]" />
            </div>
            <div>
              <div
                className="font-extrabold text-[1.3rem] text-yellow-500 tracking-tight"
                style={fontSyne}
              >
                RideBook
              </div>
              <div className="text-[0.68rem] text-yellow-400 tracking-[0.1em] uppercase mt-0.5">
                Admin Portal
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-yellow-400/10 border border-yellow-400/30 rounded-xl px-4 py-2.5 mb-7">
            <ShieldCheck size={15} className="text-yellow-400 flex-shrink-0" />
            <span className="text-xs text-yellow-300 font-medium">
              Administrator Access Only
            </span>
          </div>

          <h1
            className="font-bold text-3xl text-yellow-400 mb-1.5"
            style={fontSyne}
          >
            Admin Sign In
          </h1>
          <p className="text-sm text-[#7a7e96] mb-8">
            Manage buses, schedules, bookings and users.
          </p>

          {error && (
            <div className="flex items-center gap-2 bg-red-900/30 border border-red-500/40 text-red-400 text-xs px-4 py-3 rounded-xl mb-5">
              <AlertCircle size={14} className="flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8]"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ridebook.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>
            </div>

            <div className="mb-7">
              <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8]"
                />
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] hover:text-yellow-400 transition"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#0d0f1a] hover:bg-yellow-300 transition-all duration-200 shadow-[0_6px_20px_rgba(251,191,36,0.4)] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {status === "loading" ? (
                <>
                  <span className="w-4 h-4 border-2 border-[#0d0f1a] border-t-transparent rounded-full animate-spin" />
                  Signing in…
                </>
              ) : (
                "Sign In as Admin →"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
