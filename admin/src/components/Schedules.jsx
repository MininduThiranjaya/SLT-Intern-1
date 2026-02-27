import { useEffect, useState } from "react";
import { Plus, Trash2, X, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import axios from "axios";
import API from "../apis/apis";
import { useNavigate } from "react-router-dom";

const statusBadge = (status) => {
  const map = {
    active: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    full: "bg-orange-400/15 text-orange-400 border-orange-400/30",
    cancelled: "bg-red-400/15 text-red-400 border-red-400/30",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${map[status] || map.active}`;
};

const emptyForm = { busNumber: "", date: "" };

export default function Schedules() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [selectedBus, setSelectedBus] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [buses, setBuses] = useState();
  const [schedules, setSchedules] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [toast, setToast] = useState(null);

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

  async function fetchAllDetails() {
    try {
      const busRes = await axios.get(API.common.getBuses);
      const scheduleRes = await axios.get(API.common.getSchedule);
      const schedules = scheduleRes.data.result.flatMap((bus) =>
        bus.BusSchedules.map((schedule) => ({
          id: schedule.id,
          busNumber: bus.busNumber,
          from: bus.from,
          to: bus.to,
          date: schedule.scheduleDate,
          departure: bus.departure,
          arrival: bus.arrival,
          fare: bus.price,
          seats: bus.numberOfSeats,
          booked: schedule.seatsBooked,
          status: bus.isAvailable,
        })),
      );
      setBuses(busRes.data.result);
      setSchedules(schedules);
    } catch (e) {
      console.log(e);
    }
  }

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!form.date || !form.busNumber) return;
      const res = await axios.post(API.admin.addSchedule, form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setRefresh((pre) => !pre);
      showToast("Schedule created");
      setShowModal(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("userToken");
      // if(token)
      const res = await axios.delete(API.admin.deleteSchedule, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          id,
        },
      });
      if (res.data.result) {
        showToast("Schedule removed", "error");
        setRefresh((pre) => !pre);
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    fetchAllDetails();
    fetchUser();
  }, [refresh]);

  return (
    <div style={fontDM}>
      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium shadow-lg border
          ${toast.type === "error" ? "bg-red-900/80 text-red-300 border-red-500/40" : "bg-emerald-900/80 text-emerald-300 border-emerald-500/40"}`}
        >
          {toast.type === "error" ? (
            <AlertCircle size={15} />
          ) : (
            <CheckCircle size={15} />
          )}
          {toast.msg}
        </div>
      )}

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={fontSyne}>
            Schedules
          </h1>
          <p className="text-[#7a7e96] text-sm">
            {schedules.length > 0 ? schedules.length : 0} schedules total
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-[#0d0f1a] rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-[0_4px_14px_rgba(251,191,36,0.4)]"
        >
          <Plus size={17} /> Create Schedule
        </button>
      </div>

      <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {[
                  "Bus",
                  "Route",
                  "Date",
                  "Departure",
                  "Arrival",
                  "Fare",
                  "Seats",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-4 text-[#7a7e96] text-xs font-medium uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {schedules.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-[#2a2d3e]/50 hover:bg-[#252840] transition-colors"
                >
                  <td className="px-5 py-4 text-yellow-400 font-medium whitespace-nowrap">
                    {s.busNumber}
                  </td>
                  <td className="px-5 py-4 text-white whitespace-nowrap">
                    {s.from} → {s.to}
                  </td>
                  <td className="px-5 py-4 text-[#9a9eb8] whitespace-nowrap">
                    {s.date}
                  </td>
                  <td className="px-5 py-4 text-white whitespace-nowrap">
                    <div className="flex items-center gap-1">
                      <Clock size={12} className="text-yellow-400" />
                      {s.departure}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-[#9a9eb8] whitespace-nowrap">
                    {s.arrival}
                  </td>
                  <td className="px-5 py-4 text-white whitespace-nowrap">
                    LKR {s.fare}
                  </td>
                  <td className="px-5 py-4 whitespace-nowrap">
                    <span className="text-white">{s.booked}</span>
                    <span className="text-[#7a7e96]"> / {s.seats}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={statusBadge(s.status)}>{s.status}</span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="p-2 rounded-lg bg-[#2a2d3e] hover:bg-red-400/20 hover:text-red-400 text-[#9a9eb8] transition"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-3xl p-8 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={fontSyne}>
                Create Schedule
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBus(null);
                  setForm(null);
                }}
                className="text-[#7a7e96] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                  Bus
                </label>
                <select
                  value={selectedBus?.busNumber ? selectedBus.busNumber : ""}
                  onChange={(e) => {
                    const selection = e.target.value;
                    setForm({ ...form, busNumber: selection });
                    const select = buses.filter(
                      (bus) => bus.busNumber === selection,
                    );
                    setSelectedBus(select[0]);
                  }}
                  className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                >
                  <option value="" className="bg-[#1c1f2e]">
                    Select a Bus
                  </option>
                  {buses.map((b) => (
                    <option
                      key={b.busNumber}
                      value={b.busNumber}
                      className="bg-[#1c1f2e]"
                    >
                      {b.busNumber}
                    </option>
                  ))}
                </select>
              </div>

              {selectedBus ? (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "From",
                        key: "from",
                        placeholder: "e.g. Colombo",
                      },
                      { label: "To", key: "to", placeholder: "e.g. Kandy" },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={selectedBus[key]}
                          disabled={true}
                          placeholder={placeholder}
                          className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                      Date
                    </label>
                    <input
                      type="date"
                      value={form.date}
                      onChange={(e) =>
                        setForm({ ...form, date: e.target.value })
                      }
                      className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition [color-scheme:dark]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Departure Time",
                        key: "departure",
                        placeholder: "e.g. 06:00 AM",
                      },
                      {
                        label: "Arrival Time",
                        key: "arrival",
                        placeholder: "e.g. 09:30 AM",
                      },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                          {label}
                        </label>
                        <input
                          type="text"
                          value={selectedBus[key]}
                          disabled={true}
                          placeholder={placeholder}
                          className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        label: "Fare (LKR)",
                        key: "price",
                        placeholder: "e.g. 450",
                      },
                      {
                        label: "Total Seats",
                        key: "numberOfSeats",
                        placeholder: "e.g. 45",
                      },
                    ].map(({ label, key, placeholder }) => (
                      <div key={key}>
                        <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                          {label}
                        </label>
                        <input
                          type="number"
                          value={selectedBus[key]}
                          disabled={true}
                          placeholder={placeholder}
                          className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-not-allowed"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#9a9eb8] mb-2">
                      Status
                    </label>
                    <select
                      value={selectedBus.isAvailable}
                      disabled={true}
                      className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition cursor-not-allowed"
                    >
                      <option
                        value={selectedBus.isAvailable}
                        className="bg-[#1c1f2e] capitalize"
                      >
                        {selectedBus.isAvailable === "active"
                          ? "Active"
                          : "Inactive"}
                      </option>
                    </select>
                  </div>
                </>
              ) : (
                <></>
              )}
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedBus(null);
                  setForm(null);
                }}
                className="flex-1 py-3 rounded-xl border border-[#2a2d3e] text-[#9a9eb8] hover:bg-[#252840] hover:text-white transition font-medium text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleSave();
                }}
                className="flex-1 py-3 rounded-xl bg-yellow-400 text-[#0d0f1a] font-semibold text-sm hover:bg-yellow-300 transition shadow-[0_4px_14px_rgba(251,191,36,0.3)]"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
