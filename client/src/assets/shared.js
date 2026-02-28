// common styles
export const S = {
  card:     "bg-white rounded-3xl shadow-[0_8px_40px_rgba(0,0,0,0.18)] p-6",
  label:    "block text-[0.73rem] font-semibold text-[#7a7e96] tracking-[0.08em] uppercase mb-2",
  input:    "w-full bg-yellow-100 border border-yellow-200 rounded-xl pl-11 pr-4 py-3 text-[#0d0f1a] text-[0.92rem] placeholder-[#9a9eb8] outline-none focus:ring-2 focus:ring-yellow-400 transition-all",
  select:   "w-full bg-yellow-100 border border-yellow-200 rounded-xl pl-11 pr-4 py-3 text-[#0d0f1a] text-[0.92rem] outline-none focus:ring-2 focus:ring-yellow-400 transition-all appearance-none",
  btnAmber: "w-full py-3.5 rounded-xl font-bold text-[#0d0f1a] bg-yellow-400 hover:bg-yellow-300 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 shadow-[0_4px_18px_rgba(251,191,36,0.45)]",
  btnGhost: "px-5 py-2.5 rounded-xl font-semibold text-[0.85rem] text-[#7a7e96] hover:bg-yellow-50 transition-all",
  badge: (status) =>
    status === "confirmed" ? "bg-yellow-100 text-yellow-700 border border-yellow-300"
    : status === "completed" ? "bg-green-100 text-green-700 border border-green-300"
    : "bg-red-100 text-red-500 border border-red-200",
};

export const fontSyne = { fontFamily: "'Syne', 'Helvetica Neue', sans-serif" };
export const fontBody = { fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" };
