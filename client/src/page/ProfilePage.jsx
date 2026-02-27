import { User, LogOut, Shield, Trash2 } from "lucide-react";
import { S, fontSyne } from "../assets/shared";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import API from "../apis/apis";

export default function ProfilePage({ currentUser }) {
  const navigate = useNavigate();
  const utcString = currentUser.createdAt ?? "";
  const date = new Date(utcString);

  const onLogout = () => {
    localStorage.removeItem("userToken");
    navigate("/");
  };

  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  };

  const fields = [
    { label: "User Name", value: currentUser?.userName ?? "", disabled: false },
    { label: "Email", value: currentUser?.email ?? "", disabled: true },
    { label: "Phone", value: currentUser?.phoneNumber ?? "", disabled: false },
    {
      label: "Created At",
      value: date.toLocaleString("en-US", options) ?? "",
      disabled: true,
    },
    {
      label: "User Roles",
      value: currentUser.userRole.join("/") ?? "",
      disabled: true,
    },
  ];

  const deleteAccount = async function () {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.delete(API.user.deleteUser, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.data.result) {
        onLogout();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <p className="text-[0.75rem] text-yellow-500 tracking-[0.1em] uppercase font-semibold mb-1">
          Account
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          style={fontSyne}
        >
          My Profile
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-4">
          <div className={`${S.card} text-center`}>
            <div className="w-20 h-20 bg-yellow-400 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-[0_4px_18px_rgba(251,191,36,0.4)]">
              <span className="text-3xl font-bold text-[#0d0f1a]">
                {currentUser?.userName ?? "A"}
              </span>
            </div>
            <h3
              className="font-bold text-[#0d0f1a] text-lg mb-0.5"
              style={fontSyne}
            >
              {currentUser?.userName}
            </h3>
            <p className="text-[#7a7e96] text-sm mb-4">{currentUser?.email}</p>
          </div>

          <div className={S.card}>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-[#7a7e96] font-semibold uppercase tracking-wider">
                Active Session
              </span>
            </div>
            <p className="text-[#7a7e96] text-xs mb-4">
              Signed in as{" "}
              <span className="text-[#0d0f1a] font-semibold">
                {currentUser?.name}
              </span>
            </p>
            <button
              onClick={onLogout}
              className="w-full py-3 rounded-xl border-2 border-gray-200 hover:border-red-300 text-[#7a7e96] hover:text-red-500 font-semibold text-sm transition-all flex items-center justify-center gap-2 group"
            >
              <LogOut
                size={15}
                className="group-hover:translate-x-0.5 transition-transform"
              />
              Sign Out
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-5">
          <div className={S.card}>
            <div className="flex items-center gap-2 mb-5">
              <div className="w-8 h-8 bg-yellow-100 rounded-xl flex items-center justify-center">
                <User size={16} className="text-yellow-600" />
              </div>
              <h4 className="font-bold text-[#0d0f1a]" style={fontSyne}>
                Personal Information
              </h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map((f) => (
                <div key={f.label}>
                  <label className={S.label}>{f.label}</label>
                  <div className={S.input} style={{ paddingLeft: "1rem" }}>
                    {f.value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className={`${S.card} border border-red-200`}>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-red-100 rounded-xl flex items-center justify-center">
                <Shield size={16} className="text-red-500" />
              </div>
              <h4 className="font-bold text-red-500" style={fontSyne}>
                Danger Zone
              </h4>
            </div>
            <p className="text-[#7a7e96] text-sm mb-4">
              Permanently delete your account and all associated data. This
              action cannot be undone.
            </p>
            <button
              onClick={deleteAccount}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-red-300 text-red-500 font-semibold text-sm hover:bg-red-50 transition-all"
            >
              <Trash2 size={15} /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
