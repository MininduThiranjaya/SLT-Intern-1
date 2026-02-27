import { Bus, Home, Ticket, User, LogOut, X } from "lucide-react";
import {useNavigate} from 'react-router-dom'

const tabs = [
  { id: "booking", label: "Book",    icon: <Home size={18} /> },
  { id: "tickets", label: "Tickets", icon: <Ticket size={18} /> },
  { id: "profile", label: "Profile", icon: <User size={18} /> },
];

// sidebar
export function Sidebar({ activeTab, setActiveTab, currentUser }) {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };
  return (
    <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 bg-[#0d0f1a] border-r border-white/[0.06] z-40 px-5 py-8">
      <div className="flex items-center gap-3 mb-10 px-1">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_4px_14px_rgba(251,191,36,0.4)]">
          <Bus size={20} className="text-[#0d0f1a]" />
        </div>
        <div>
          <div className="font-extrabold text-yellow-400 text-[1.1rem] tracking-tight leading-none">
            RideBook
          </div>
          <div className="text-[0.65rem] text-yellow-600 tracking-[0.1em] uppercase mt-0.5">
            Bus Seat Booking
          </div>
        </div>
      </div>

      {/* navigation */}
      <nav className="flex flex-col gap-1 flex-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-[0.9rem] font-semibold transition-all duration-200 text-left ${
              activeTab === tab.id
                ? "bg-yellow-400 text-[#0d0f1a] shadow-[0_4px_14px_rgba(251,191,36,0.3)]"
                : "text-[#7a7e96] hover:bg-white/[0.05] hover:text-white"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-white/[0.06] pt-5">
        <div className="flex items-center gap-3 mb-4 px-1">
          <div className="w-9 h-9 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-[#0d0f1a] text-sm flex-shrink-0">
            {currentUser?.userName}
          </div>
          <div className="overflow-hidden">
            <div className="text-white text-[0.85rem] font-semibold leading-tight truncate">
              {currentUser?.userName}
            </div>
            <div className="text-[#7a7e96] text-[0.72rem] truncate">
              {currentUser?.email}
            </div>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-[0.88rem] font-semibold text-[#7a7e96] hover:bg-red-500/10 hover:text-red-400 transition-all group"
        >
          <LogOut size={17} className="group-hover:translate-x-0.5 transition-transform" />
          Sign Out
        </button>
      </div>
    </div>
  );
}

// Mobile Header
export function MobileHeader({ mobileMenuOpen, setMobileMenuOpen }) {
  return (
    <header className="md:hidden fixed top-0 left-0 right-0 z-40 bg-[#0d0f1a] border-b border-white/[0.06] px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center">
          <Bus size={16} className="text-[#0d0f1a]" />
        </div>
        <span className="font-extrabold text-yellow-400 text-base">RideBook</span>
      </div>
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="text-[#7a7e96] hover:text-white transition-colors p-1"
      >
        {mobileMenuOpen ? (
          <X size={22} />
        ) : (
          <span className="flex flex-col gap-1.5">
            <span className="w-5 h-0.5 bg-current block" />
            <span className="w-5 h-0.5 bg-current block" />
            <span className="w-5 h-0.5 bg-current block" />
          </span>
        )}
      </button>
    </header>
  );
}

// Mobile Menu Drawer 
export function MobileMenu({ activeTab, setActiveTab, currentUser }) {
  const navigate = useNavigate()

  const onLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };
  return (
    <div className="md:hidden fixed inset-0 z-30 bg-[#0d0f1a] pt-16 px-5 pb-8 flex flex-col">
      {/* User info */}
      <div className="flex items-center gap-3 bg-white/[0.04] rounded-2xl p-4 mb-6">
        <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-[#0d0f1a]">
          {currentUser?.userName}
        </div>
        <div>
          <div className="text-white font-semibold text-sm">{currentUser?.userName}</div>
          <div className="text-[#7a7e96] text-xs">{currentUser?.email}</div>
        </div>
      </div>

      {/* Nav */}
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => { setActiveTab(tab.id) }}
          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-base font-semibold mb-1 transition-all ${
            activeTab === tab.id
              ? "bg-yellow-400 text-[#0d0f1a]"
              : "text-[#7a7e96] hover:bg-white/[0.05]"
          }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}

      {/* Logout */}
      <div className="mt-auto border-t border-white/[0.06] pt-4">
        <button
          onClick={onLogout}
          className="flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl text-base font-semibold text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  );
}
