import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Clock, Filter, Search } from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import axios from "axios";
import API from "../apis/apis";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

const statusConfig = {
  CONFIRMED: {
    label: "CONFIRMED",
    icon: CheckCircle,
    badge: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
  },
  PENDING: {
    label: "PENDING",
    icon: Clock,
    badge: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30",
  },
  CANCELLED: {
    label: "CANCELLED",
    icon: XCircle,
    badge: "bg-red-400/15 text-red-400 border-red-400/30",
  },
};

export default function Bookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("all");
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
      console.error(err);
      localStorage.removeItem("userToken");
      navigate("/");
    }
  };

  async function featchBookings() {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(API.admin.getAllBookings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookings = res.data.result?.map((b) => ({
        bookingId: b.id,
        status: b.status,
        totalPrice: b.totalPrice,
        bookedAt: b.createdAt,

        userId: b.User?.id,
        userName: b.User?.userName,
        email: b.User?.email,
        phoneNumber: b.User?.phoneNumber,

        scheduleId: b.BusSchedule?.id,
        scheduleDate: b.BusSchedule?.scheduleDate,

        busNumber: b.BusSchedule?.Bus?.busNumber,
        from: b.BusSchedule?.Bus?.from,
        to: b.BusSchedule?.Bus?.to,
        departure: b.BusSchedule?.Bus?.departure,
        arrival: b.BusSchedule?.Bus?.arrival,
        price: b.BusSchedule?.Bus?.price,

        seats: b?.BookingSeats?.map((s) => s.seatNumber) || [],
      }));
      setBookings(bookings || []);
    } catch (e) {
      console.log(e);
    }
  }

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.put(
        API.admin.updateBookingStatus,
        {
          bookingId: id,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.status) {
        toast.success(res.data.message)
        featchBookings();
        fetchUser();
      }
    } catch (e) {
      toast.error(e.response.data.message)
    }
  };

  const filtered = bookings?.filter((b) => {
    const matchFilter = filter === "all" || b.status === filter;
    const matchSearch =
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.busNumber.toLowerCase().includes(search.toLowerCase()) ||
      b.userName.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const counts = {
    all: bookings?.length || 0,
    PENDING: bookings?.filter((b) => b.status === "PENDING").length || 0,
    CONFIRMED: bookings?.filter((b) => b.status === "CONFIRMED").length || 0,
    CANCELLED: bookings?.filter((b) => b.status === "CANCELLED").length || 0,
  };

  useEffect(() => {
    featchBookings();
  }, []);

  return (
    <div style={fontDM}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-1" style={fontSyne}>
          Bookings
        </h1>
        <p className="text-[#7a7e96] text-sm">
          {bookings?.length || 0} total bookings
        </p>
      </div>

      {/* filter */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        {Object.entries(counts).map(([key, count]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all capitalize
              ${
                filter === key
                  ? "bg-yellow-400/15 text-yellow-400 border-yellow-400/40"
                  : "bg-[#1c1f2e] text-[#9a9eb8] border-[#2a2d3e] hover:border-[#3a3d4e] hover:text-white"
              }`}
          >
            {key === "all" ? <Filter size={13} /> : null}
            {key}{" "}
            <span
              className={`text-xs px-1.5 py-0.5 rounded-md ${filter === key ? "bg-yellow-400/20" : "bg-[#2a2d3e]"}`}
            >
              {count}
            </span>
          </button>
        ))}

        {/* search */}
        <div className="relative ml-auto">
          <Search
            size={14}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a7e96]"
          />
          <input
            type="text"
            placeholder="Search bookings..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 rounded-xl bg-[#1c1f2e] border border-[#2a2d3e] text-white placeholder-[#6b6f86] text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition w-56"
          />
        </div>
      </div>

      {/* bookings  */}
      <div className="space-y-3">
        {filtered?.length === 0 && (
          <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl p-12 text-center text-[#7a7e96]">
            No bookings found
          </div>
        )}
        {filtered?.map((b) => {
          const statusConfiguration = statusConfig[b.status];
          const StatusIcon = statusConfiguration.icon;
          return (
            <div
              key={b.bookingId}
              className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl p-5 hover:border-yellow-400/20 transition-all"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-yellow-400 font-mono font-medium text-sm">
                      {b.busNumber}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfiguration.badge}`}
                    >
                      <StatusIcon size={11} />
                      {statusConfiguration.label}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-white font-semibold mb-0.5">
                        {b.userName}
                      </div>
                      <div className="text-[#7a7e96] text-xs mb-3">
                        {b.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-white font-semibold mb-0.5">
                        Booked seats
                      </div>
                      <div className="text-[#7a7e96] text-xs mb-3">
                        {b.seats.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-[#7a7e96] text-xs mb-0.5">Route</div>
                      <div className="text-white text-sm">
                        {b.from} - {b.to}
                      </div>
                    </div>
                    <div>
                      <div className="text-[#7a7e96] text-xs mb-0.5">Bus</div>
                      <div className="text-white text-sm">{b.busNumber}</div>
                    </div>
                    <div>
                      <div className="text-[#7a7e96] text-xs mb-0.5">
                        Travel Date
                      </div>
                      <div className="text-white text-sm">{b.scheduleDate}</div>
                    </div>
                    <div>
                      <div className="text-[#7a7e96] text-xs mb-0.5">
                        Seats * Fare
                      </div>
                      <div className="text-white text-sm">
                        {b.seats.length} * LKR {b.price} ={" "}
                        <span className="text-yellow-400 font-semibold">
                          LKR {b.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="text-[#7a7e96] text-xs mt-3">
                    Booked on {b.bookedAt}
                  </div>
                </div>

                {/* actions */}
                {b.status === "PENDING" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => updateStatus(b.bookingId, "CONFIRMED")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition text-sm font-medium"
                    >
                      <CheckCircle size={14} /> Accept
                    </button>
                    <button
                      onClick={() => updateStatus(b.bookingId, "CANCELLED")}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition text-sm font-medium"
                    >
                      <XCircle size={14} /> Reject
                    </button>
                  </div>
                )}
                {b.status !== "PENDING" && (
                  <button
                    onClick={() => updateStatus(b.bookingId, "PENDING")}
                    className="shrink-0 px-4 py-2 rounded-xl bg-[#2a2d3e] text-[#9a9eb8] border border-[#3a3d4e] hover:text-white transition text-xs font-medium"
                  >
                    Reset to Pending
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
