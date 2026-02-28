import { useEffect, useState } from "react";
import { Search, User, Mail, Phone, Calendar, BookOpen } from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import axios from "axios";
import API from "../apis/apis";
import { useNavigate } from "react-router-dom";

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

  const fetchUser = async () => {
    const token = localStorage.getItem("userToken");
    if (!token) {
      navigate("/");
      localStorage.removeItem("userToken");
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
      localStorage.removeItem("userToken");
      navigate("/");
    }
  };

  const filtered = users.filter((u) => {
    const matchFilter = "all";
    const matchSearch =
      u.userName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  function createDate(tempDate) {
    const date = new Date(tempDate);
    const onlyDate = date.toISOString().split("T")[0];
    return onlyDate;
  }

  async function featchUsers() {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(API.admin.getUsers, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.result);
    } catch (e) {
    }
  }

  useEffect(() => {
    featchUsers();
    fetchUser();
  }, []);

  return (
    <div style={fontDM}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={fontSyne}>
          Users
        </h1>
        <p className="text-[#7a7e96] text-sm">
          {users.length > 0 ? users.length : 0} registered passengers
        </p>
      </div>

      {/* filters */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize bg-[#1c1f2e] text-[#9a9eb8] border-[#2a2d3e] hover:border-[#3a3d4e] hover:text-white">
          All{" "}
          <span className={`text-xs px-1.5 py-0.5 rounded-md "bg-[#2a2d3e]"}`}>
            {users.length > 0 ? users.length : 0}
          </span>
        </div>

        <div className="relative ml-auto">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a7e96]"
          />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-[#1c1f2e] border border-[#2a2d3e] text-white placeholder-[#6b6f86] text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-56"
          />
        </div>
      </div>

      {/* table */}
      <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {["User", "Email", "Phone", "Joined", "Total Bookings"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-6 py-4 text-[#7a7e96] text-xs font-medium uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u.email}
                  className="border-b border-[#2a2d3e]/50 hover:bg-[#252840] transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-yellow-400/15 border border-yellow-400/30 flex items-center justify-center flex-shrink-0">
                        <User size={15} className="text-yellow-400" />
                      </div>
                      <span className="text-white font-medium">
                        {u.userName}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[#9a9eb8]">
                      <Mail size={12} />
                      {u.email}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[#9a9eb8]">
                      <Phone size={12} />
                      {u.phoneNumber}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-[#9a9eb8]">
                      <Calendar size={12} />
                      {createDate(u.createdAt)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-white">
                      <BookOpen size={12} className="text-yellow-400" />
                      {u.totalSeatsBooked}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-[#7a7e96]">
              No users found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
