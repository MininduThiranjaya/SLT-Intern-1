import {
  Bus,
  CalendarDays,
  BookOpen,
  Users,
  TrendingUp,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../apis/apis";
import axios from "axios";
import { useState } from "react";

export default function Overview() {
  const navigate = useNavigate();
  const [dashBoard, setDashboard] = useState(null);

  const stats = [
    {
      label: "Total Buses",
      value: dashBoard?.totalBuses || 0,
      icon: Bus,
      up: true,
    },
    {
      label: "Active Schedules",
      value: dashBoard?.activeSchedules || 0,
      icon: CalendarDays,
      up: true,
    },
    {
      label: "Total Bookings",
      value: dashBoard?.totalBookings || 0,
      icon: BookOpen,
      up: true,
    },
    {
      label: "Registered Users",
      value: dashBoard?.rejectedBookings || 0,
      icon: Users,
      up: true,
    },
  ];

  const bookingStats = [
    {
      label: "Confirmed",
      value: dashBoard?.confirmedBookings || 0,
      icon: CheckCircle,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10 border-emerald-400/20",
    },
    {
      label: "Pending",
      value: dashBoard?.pendingBookings || 0,
      icon: Clock,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20",
    },
    {
      label: "Rejected",
      value: dashBoard?.rejectedBookings || 0,
      icon: XCircle,
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20",
    },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(API.common.verify, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data.status) {
          localStorage.removeItem("userToken");
          navigate("/");
        }
      } catch (err) {
        console.error(err);
        localStorage.removeItem("userToken");
        navigate("/");
      }
    };

    const fetchStats = async () => {
      const token = localStorage.getItem("userToken");
      if (!token) {
        navigate("/");
        return;
      }
      try {
        const res = await axios.get(API.admin.getStats, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDashboard(res.data.result);
      } catch (err) {
        console.error(err);
        localStorage.removeItem("userToken");
        navigate("/");
      }
    };
    fetchUser();
    fetchStats();
  }, []);
  return (
    <div style={fontDM}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={fontSyne}>
          Dashboard Overview
        </h1>
        <p className="text-[#7a7e96] text-sm">
          Welcome back, Admin. Here's what's happening today.
        </p>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {stats.map(({ label, value, icon: Icon, up }) => (
          <div
            key={label}
            className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl p-5 hover:border-yellow-400/30 transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-yellow-400/10 rounded-xl flex items-center justify-center border border-yellow-400/20">
                <Icon size={18} className="text-yellow-400" />
              </div>
              <div className="flex items-center gap-1 text-emerald-400 text-xs font-medium">
                <TrendingUp size={12} />
                {up ? "▲" : "▼"}
              </div>
            </div>
            <div
              className="text-2xl font-bold text-white mb-1"
              style={fontSyne}
            >
              {value}
            </div>
            <div className="text-xs text-[#7a7e96] mb-1">{label}</div>
          </div>
        ))}
      </div>

      {/* status */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {bookingStats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className={`rounded-2xl border p-5 ${bg}`}>
            <div className="flex items-center gap-3">
              <Icon size={22} className={color} />
              <div>
                <div className={`text-xl font-bold ${color}`} style={fontSyne}>
                  {value.toLocaleString()}
                </div>
                <div className="text-xs text-[#9a9eb8]">{label} Bookings</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
