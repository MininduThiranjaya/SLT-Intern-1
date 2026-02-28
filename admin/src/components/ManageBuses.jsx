import { useEffect, useState } from "react";
import {
  Plus,
  Bus,
  Pencil,
  Trash2,
  X,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { fontSyne, fontDM } from "../assets/shared";
import API from "../apis/apis";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast'

const statusBadge = (status) => {
  const map = {
    active: "bg-emerald-400/15 text-emerald-400 border-emerald-400/30",
    inactive: "bg-[#7a7e96]/15 text-[#7a7e96] border-[#7a7e96]/30",
  };
  return `inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${map[status] || map.inactive}`;
};

const emptyForm = {
  busNumber: "",
  from: "",
  to: "",
  departure: "",
  arrival: "",
  numberOfSeats: "",
  price: "",
  isAvailable: "active",
};

export default function ManageBuses() {
  const navigate = useNavigate();
  const [refresh, setRefresh] = useState(false);
  const [buses, setBuses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [originalBusData, setOriginalBusData] = useState(null);

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
    } catch (e) {
      localStorage.removeItem("userToken");
      navigate("/");
    }
  };

  async function fetchAllDetails() {
    try {
      const res = await axios.get(API.common.getBuses);
      setBuses(res.data.result);
    } catch (e) {
      console.log(e);
    }
  }

  const openAdd = () => {
    setForm(emptyForm);
    setEditId(null);
    setShowModal(true);
  };

  const openEdit = (bus) => {
    setForm({ ...bus });
    setOriginalBusData({ ...bus });
    setEditId(bus.busNumber);
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("userToken");
      // if(token)
      if (editId && originalBusData) {
        if (!editId) {
          toast.error("Someting went wrong")
          return;
        }
        const dataToSend = {};
        Object.keys(form).forEach((key) => {
          if (form[key] !== originalBusData[key]) {
            dataToSend[key] = form[key];
          }
        });

        if (Object.keys(dataToSend).length === 0) {
          toast.success("No changes made");
          return;
        }
        dataToSend.busNumber = editId;
        await axios.put(API.admin.updateBus, dataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Bus updated successfully");
      } else {
        if (
          !form.busNumber ||
          !form.from ||
          !form.to ||
          !form.departure ||
          !form.arrival ||
          !form.numberOfSeats ||
          !form.price ||
          !form.isAvailable
        ) {
          toast.error("All field required");
          return;
        }
        await axios.post(API.admin.addBus, form, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast.success("Bus added successfully");
      }
      setShowModal(false);
      setRefresh((pre) => !pre);
    } catch (e) {
      toast.error(e.response.data.message)
    }
  };

  const handleDelete = async (busNumber) => {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.delete(API.admin.deleteBus, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          busNumber,
        },
      });
      if (res.data.result) {
        toast.success(res.data.message)
        setRefresh((pre) => !pre);
      }
    } catch (e) {
      toast.error(e.response.data.message)
    }
  };

  useEffect(() => {
    fetchAllDetails();
    fetchUser();
  }, [refresh]);

  return (
    <div style={fontDM}>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1" style={fontSyne}>
            Manage Buses
          </h1>
          <p className="text-[#7a7e96] text-sm">
            {buses ? buses.length : 0} buses in fleet
          </p>
        </div>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-yellow-400 text-[#0d0f1a] rounded-xl font-semibold text-sm hover:bg-yellow-300 transition shadow-[0_4px_14px_rgba(251,191,36,0.4)]"
        >
          <Plus size={17} /> Add Bus
        </button>
      </div>

      <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#2a2d3e]">
                {[
                  "Bus Number",
                  "From",
                  "To",
                  "Departure",
                  "Arrival",
                  "Seats",
                  "Price",
                  "Status",
                  "Actions",
                ].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-4 text-[#7a7e96] text-xs font-medium uppercase tracking-wider"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {buses ? (
                buses?.map((bus) => (
                  <tr
                    key={bus.busNumber}
                    className="border-b border-[#2a2d3e]/50 hover:bg-[#252840] transition-colors"
                  >
                    <td className="px-6 py-4 text-yellow-400 font-mono font-medium">
                      {bus.busNumber}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {bus.from}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      {bus.to}
                    </td>
                    <td className="px-6 py-4 text-[#9a9eb8]">
                      {bus.departure}
                    </td>
                    <td className="px-6 py-4 text-[#9a9eb8]">{bus.arrival}</td>
                    <td className="px-6 py-4 text-white">
                      {bus.numberOfSeats} seats
                    </td>
                    <td className="px-6 py-4 text-white">Rs. {bus.price}</td>
                    <td className="px-6 py-4">
                      <span
                        className={statusBadge(
                          bus.isAvailable === "active" ? "active" : "inactive",
                        )}
                      >
                        {bus.isAvailable === "active"
                          ? "Available"
                          : "Unavailable"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(bus)}
                          className="p-2 rounded-lg bg-[#2a2d3e] hover:bg-yellow-400/20 hover:text-yellow-400 text-[#9a9eb8] transition"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(bus.busNumber)}
                          className="p-2 rounded-lg bg-[#2a2d3e] hover:bg-red-400/20 hover:text-red-400 text-[#9a9eb8] transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <>
                  <tr className="border-b border-[#2a2d3e]/50 hover:bg-[#252840] transition-colors">
                    <td
                      colSpan={9}
                      className="px-6 py-4 text-white font-medium text-center"
                    >
                      No bus found...
                    </td>
                  </tr>
                </>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#1c1f2e] border border-[#2a2d3e] rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white" style={fontSyne}>
                {editId ? "Edit Bus" : "Add New Bus"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#7a7e96] hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label>Bus Number</label>
                <input
                  type="text"
                  value={form.busNumber}
                  onChange={(e) =>
                    setForm({ ...form, busNumber: e.target.value })
                  }
                  placeholder="e.g. NB-1234"
                  className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                />
              </div>

              {[
                { label: "From", key: "from", placeholder: "e.g. Colombo" },
                { label: "To", key: "to", placeholder: "e.g. Kurunegala" },
                {
                  label: "Departure",
                  key: "departure",
                  placeholder: "e.g. Time",
                  type: "time",
                },
                {
                  label: "Arrival",
                  key: "arrival",
                  placeholder: "e.g. Time",
                  type: "time",
                },
                {
                  label: "Number of Seats",
                  key: "numberOfSeats",
                  placeholder: "e.g. 45",
                  type: "number",
                },
                {
                  label: "Price",
                  key: "price",
                  placeholder: "e.g. 2300",
                  type: "number",
                },
              ].map(({ label, key, placeholder, type = "text" }) => (
                <div key={key}>
                  <label>{label}</label>
                  <input
                    type={type}
                    value={form[key]}
                    onChange={(e) =>
                      setForm({ ...form, [key]: e.target.value })
                    }
                    placeholder={placeholder}
                    className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white placeholder-[#6b6f86] focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  />
                </div>
              ))}

              <div className="col-span-2">
                <label>Status</label>
                <select
                  value={form.isAvailable}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      isAvailable: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 rounded-xl bg-[#141624] border border-[#2a2d3e] text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 transition"
                >
                  {["active", "inactive"].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-3 mt-7">
              <button
                onClick={() => setShowModal(false)}
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
                {editId ? "Save Changes" : "Add Bus"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
