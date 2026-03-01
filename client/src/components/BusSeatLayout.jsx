import { useState } from "react";
import { X, Bus, Users, CheckCircle } from "lucide-react";
import { fontSyne } from "../assets/shared";

// helpers
function buildRows(total) {
  const rows = [];
  let n = 1;
  while (n <= total) {
    const rem = total - n + 1;
    if (rem <= 5) {
      rows.push({
        seats: Array.from({ length: rem }, (_, i) => n + i),
        isLastRow: true,
      });
      break;
    }
    rows.push({ left: [n, n + 1], right: [n + 2, n + 3], isLastRow: false });
    n += 4;
  }
  return rows;
}

// seatBox
function SeatBox({ number, status, onClick }) {
  const base =
    "w-9 h-8 rounded-lg flex flex-col items-center justify-center border m-0.5 transition-all duration-150 select-none text-[10px] font-bold";
  const map = {
    available:
      base +
      " bg-white border-gray-200 text-gray-500 hover:border-yellow-400 hover:bg-yellow-50 hover:text-yellow-700 cursor-pointer shadow-sm",

    otherBooked:
      base + " bg-red-100 border-red-300 text-red-500 cursor-not-allowed",

    myBooked:
      base + " bg-blue-200 border-blue-400 text-blue-600 cursor-not-allowed",

    selected:
      base +
      " bg-yellow-400 border-yellow-400 text-[#0d0f1a] cursor-pointer shadow-[0_2px_10px_rgba(251,191,36,0.45)]",
  };

  const headrest = {
    available: "bg-gray-200",

    otherBooked: "bg-red-300",

    myBooked: "bg-blue-400",

    selected: "bg-yellow-600/30",
  };
  return (
    <button
      onClick={onClick}
      disabled={status === "otherBooked" || status === "myBooked"}
      className={map[status]}
    >
      <div className={`w-5 h-0.5 rounded-full mb-1 ${headrest[status]}`} />
      {number}
    </button>
  );
}

// busSeatLayout
export default function BusSeatLayout({ bus, onConfirm, onClose }) {
  const total = bus?.numberOfSeats ?? 40;
  const rows = buildRows(total);
  const [selected, setSelected] = useState([]);
  const booked = bus?.booked ?? 0;
  const available = total - booked;
  const alreadyBooked = bus?.bookedSeats ?? 0;
  const myBookedSeats = bus?.myBookedSeats ?? [];
  const otherBookedSeats = bus?.otherBookedSeats ?? [];
  const totalPrice = selected.length * (bus?.price ?? 0);

  const getStatus = (n) => {
    if (myBookedSeats.includes(n)) return "myBooked";
    if (otherBookedSeats.includes(n)) return "otherBooked";
    if (selected.includes(n)) return "selected";
    return "available";
  };

  const toggle = (n) => {
    if (alreadyBooked.includes(n)) return;
    setSelected((p) => (p.includes(n) ? p.filter((s) => s !== n) : [...p, n]));
  };

  return (
    // overlay
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center px-4"
      style={{ fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}
    >
      <div
        className="absolute inset-0 bg-[#0d0f1a]/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-xs bg-white rounded-2xl shadow-[0_24px_80px_rgba(0,0,0,0.25)] border border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center shadow-[0_3px_10px_rgba(251,191,36,0.35)]">
              <Bus size={15} className="text-[#0d0f1a]" />
            </div>
            <div>
              <h2
                className="font-bold text-[#0d0f1a] text-[0.85rem] leading-tight"
                style={fontSyne}
              >
                Select Your Seats
              </h2>
              <p className="text-[0.65rem] text-[#9a9eb8] mt-0.5">
                {bus?.busNumber} · {bus?.from} → {bus?.to} · {bus?.departure}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
          >
            <X size={13} />
          </button>
        </div>

        {/* body */}
        <div className="overflow-y-auto">
          <div className="flex flex-col items-center px-3 py-2">
            <div className="flex w-full gap-1.5 mb-2">
              {[
                { label: "Total", value: total, cls: "text-[#0d0f1a]" },
                { label: "Booked", value: booked, cls: "text-rose-500" },
                { label: "Available", value: available, cls: "text-emerald-600"},
              ].map(({ label, value, cls }) => (
                <div
                  key={label}
                  className="flex-1 bg-gray-50 border border-gray-100 rounded-xl py-1.5 flex flex-col items-center"
                >
                  <span
                    className={`text-base font-black ${cls}`}
                    style={fontSyne}
                  >
                    {value}
                  </span>
                  <span className="text-[#9a9eb8] text-[9px] uppercase tracking-widest mt-0.5">
                    {label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-2">
              {[
                { cls: "bg-gray-100 border-gray-400", label: "Available" },
                { cls: "bg-yellow-400 border-yellow-400", label: "Selected" },
                { cls: "bg-red-300 border-gray-200", label: "Booked" },
                { cls: "bg-blue-300 border-gray-200", label: "My Bookings" },
              ].map(({ cls, label }) => (
                <div key={label} className="flex items-center gap-1">
                  <div
                    className={`w-3 h-3 rounded-md border shadow-sm ${cls}`}
                  />
                  <span className="text-[#9a9eb8] text-[10px]">{label}</span>
                </div>
              ))}
            </div>

            {/* bus body */}
            <div className="bg-gray-50 border border-gray-100 rounded-2xl overflow-hidden w-full">
              <div className="bg-white border-b border-gray-100 px-3 py-1.5 flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">🚌</span>
                  <span className="text-[#9a9eb8] text-[9px] font-semibold uppercase tracking-widest">
                    Driver
                  </span>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-gray-200 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
                </div>
              </div>

              <div className="flex justify-end px-3 py-1 border-b border-gray-100/60">
                <div className="flex items-center gap-1 bg-emerald-50 border border-emerald-200 rounded-full px-2 py-0.5">
                  <div className="w-1 h-1 rounded-full bg-emerald-500" />
                  <span className="text-emerald-600 text-[9px] font-semibold">
                    Door
                  </span>
                </div>
              </div>

              {/* col headers */}
              <div className="flex items-center justify-center px-2 pt-1 pb-0">
                <div className="flex">
                  {["A", "B"].map((c) => (
                    <div
                      key={c}
                      className="w-9 m-0.5 flex items-center justify-center"
                    >
                      <span className="text-gray-300 text-[9px] font-semibold">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="w-7" />
                <div className="flex">
                  {["C", "D"].map((c) => (
                    <div
                      key={c}
                      className="w-9 m-0.5 flex items-center justify-center"
                    >
                      <span className="text-gray-300 text-[9px] font-semibold">
                        {c}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* rows */}
              <div className="px-2 pb-2">
                {rows.map((row, i) => {
                  if (row.isLastRow) {
                    return (
                      <div
                        key={i}
                        className="flex justify-center mt-1.5 border-t border-gray-100 pt-1.5"
                      >
                        {row.seats.map((n) => (
                          <SeatBox
                            key={n}
                            number={n}
                            status={getStatus(n)}
                            onClick={() => toggle(n)}
                          />
                        ))}
                      </div>
                    );
                  }
                  return (
                    <div key={i} className="flex items-center justify-center">
                      <div className="flex">
                        {row.left.map((n) => (
                          <SeatBox
                            key={n}
                            number={n}
                            status={getStatus(n)}
                            onClick={() => toggle(n)}
                          />
                        ))}
                      </div>
                      <div className="w-7 flex items-center justify-center">
                        <span className="text-gray-300 text-[9px]">
                          {i + 1}
                        </span>
                      </div>
                      <div className="flex">
                        {row.right.map((n) => (
                          <SeatBox
                            key={n}
                            number={n}
                            status={getStatus(n)}
                            onClick={() => toggle(n)}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* selected */}
            {selected.length > 0 && (
              <div className="w-full mt-2 bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-1.5 flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5">
                  <Users size={12} className="text-yellow-500 flex-shrink-0" />
                  <span className="text-yellow-700 text-xs font-semibold">
                    {[...selected].sort((a, b) => a - b).join(", ")}
                  </span>
                </div>
                <span
                  className="font-black text-yellow-600 text-sm flex-shrink-0"
                  style={fontSyne}
                >
                  LKR {totalPrice.toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="px-4 py-2.5 border-t border-gray-100">
          {selected.length > 0 ? (
            <div className="flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <div className="text-[#9a9eb8] text-[10px]">
                  {selected.length} seat{selected.length > 1 ? "s" : ""}{" "}
                  selected
                </div>
                <div
                  className="font-black text-[#0d0f1a] text-base leading-tight"
                  style={fontSyne}
                >
                  LKR {totalPrice.toLocaleString()}
                </div>
              </div>
              <button
                onClick={() => onConfirm(selected)}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs text-[#0d0f1a] bg-yellow-400 hover:bg-yellow-300 transition-all shadow-[0_4px_12px_rgba(251,191,36,0.35)] hover:-translate-y-0.5 active:translate-y-0 flex-shrink-0"
              >
                <CheckCircle size={13} />
                Confirm {selected.length} Seat{selected.length > 1 ? "s" : ""}
              </button>
            </div>
          ) : (
            <p className="text-center text-[#9a9eb8] text-xs py-0.5">
              Tap any available seat above to select it
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
