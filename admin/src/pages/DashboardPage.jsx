import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Overview from "../components/Overview";
import ManageBuses from "../components/ManageBuses";
import Schedules from "../components/Schedules";
import Bookings from "../components/Bookings";
import Users from "../components/Users";
import { fontDM } from "../assets/shared";

const pages = {
  overview: Overview,
  buses: ManageBuses,
  schedules: Schedules,
  bookings: Bookings,
  users: Users,
};

export default function Dashboard() {
  const [activePage, setActivePage] = useState("overview");
  const ActiveComponent = pages[activePage] || Overview;

  return (
    <div className="min-h-screen bg-[#161826] flex" style={fontDM}>
      {/* sidebar */}
      <Sidebar active={activePage} setActive={setActivePage} />

      {/* main */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="sticky top-0 z-10 bg-[#161826]/80 backdrop-blur-md border-b border-[#2a2d3e] px-8 py-4 flex items-center justify-between">
          <div className="capitalize text-[#9a9eb8] text-sm">
            Admin
            <span className="text-white font-medium">
              {activePage === "overview" ? "Dashboard" : activePage}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400/15 border border-yellow-400/30 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-xs font-bold">A</span>
            </div>
            <span className="text-[#9a9eb8] text-sm">Admin</span>
          </div>
        </div>

        {/* page content */}
        <div className="p-8">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
