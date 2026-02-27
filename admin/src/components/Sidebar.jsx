import {
  Bus,
  CalendarDays,
  BookOpen,
  Users,
  LogOut,
  LayoutDashboard,
  ChevronRight,
} from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../apis/apis";
import axios from "axios";

const navItems = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "buses", label: "Manage Buses", icon: Bus },
  { key: "schedules", label: "Schedules", icon: CalendarDays },
  { key: "bookings", label: "Bookings", icon: BookOpen },
  { key: "users", label: "Users", icon: Users },
];

export default function Sidebar({ active, setActive }) {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

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
        console.log(err);
        localStorage.removeItem("userToken");
        navigate("/");
      }
    };
    fetchUser();
  }, []);
  return (
    <aside
      className="fixed left-0 top-0 h-full w-64 bg-[#1c1f2e] border-r border-[#2a2d3e] flex flex-col z-20"
      style={fontDM}
    >
      <div className="flex items-center gap-3 px-6 py-7 border-b border-[#2a2d3e]">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center shadow-[0_4px_14px_rgba(251,191,36,0.45)]">
          <Bus size={20} className="text-[#0d0f1a]" />
        </div>
        <div>
          <div
            className="font-extrabold text-yellow-500 text-[1.1rem] leading-tight"
            style={fontSyne}
          >
            RideBook
          </div>
          <div className="text-[0.6rem] text-yellow-400/70 tracking-[0.12em] uppercase">
            Admin Portal
          </div>
        </div>
      </div>

      {/* navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => setActive(key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group
                ${
                  isActive
                    ? "bg-yellow-400/15 text-yellow-400 border border-yellow-400/30"
                    : "text-[#9a9eb8] hover:bg-[#252840] hover:text-white border border-transparent"
                }`}
            >
              <Icon
                size={18}
                className={
                  isActive
                    ? "text-yellow-400"
                    : "text-[#7a7e96] group-hover:text-white"
                }
              />
              <span className="flex-1 text-left">{label}</span>
              {isActive && (
                <ChevronRight size={14} className="text-yellow-400/60" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="px-3 pb-6">
        <div className="border-t border-[#2a2d3e] pt-4">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9a9eb8] hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
