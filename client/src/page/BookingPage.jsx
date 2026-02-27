import { useState } from "react";
import {
  Search,
  MapPin,
  Clock,
  ArrowLeftRight,
  Star,
  Bus,
  ChevronRight,
  CheckCircle,
  User,
  Phone,
} from "lucide-react";
import { S, fontSyne } from "../assets/shared";
import BusSeatLayout from "../components/BusSeatLayout";
import axios from "axios";
import API from "../apis/apis";
import toast from "react-hot-toast";

export default function BookingPage({ currentUser }) {
  const cities = ["Colombo", "Kandy", "Galle", "Jaffna", "Matara", "Negombo"];
  const [fromCity, setFromCity] = useState("");
  const [toCity, setToCity] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [searchResults, setSearchResults] = useState(null);
  const [selectedBus, setSelectedBus] = useState(null);
  const [step, setStep] = useState(1); // steps
  const [passengerName, setPassengerName] = useState(
    currentUser?.userName ?? "",
  );
  const [passengerPhone, setPassengerPhone] = useState(
    currentUser?.phoneNumber ?? "",
  );
  const [seatPref, setSeatPref] = useState("Window");
  const [bookingId, setBookingId] = useState("");

  // seat layout modal
  const [showSeatLayout, setShowSeatLayout] = useState(false);
  const [pendingBus, setPendingBus] = useState(null);
  const [chosenSeats, setChosenSeats] = useState([]);

  // handlers
  const handleSearch = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!fromCity || !toCity || !travelDate) return;
      const res = await axios.post(
        API.user.search,
        {
          fromCity: fromCity.toLowerCase(),
          toCity: toCity.toLowerCase(),
          travelDate,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const schedules = res.data.result.flatMap((bus) =>
        bus.BusSchedules.map((schedule) => ({
          busId: bus.id,
          scheduleId: schedule.id,
          busNumber: bus.busNumber,
          from: bus.from,
          to: bus.to,
          date: schedule.scheduleDate,
          departure: bus.departure,
          arrival: bus.arrival,
          price: bus.price,
          numberOfSeats: bus.numberOfSeats,
          booked:
            schedule.myBookedSeats.length + schedule.otherBookedSeats.length,
          available:
            bus.numberOfSeats -
            (schedule.myBookedSeats.length + schedule.otherBookedSeats.length),
          myBookedSeats: schedule.myBookedSeats.map(Number),
          otherBookedSeats: schedule.otherBookedSeats.map(Number),
          bookedSeats: [
            ...schedule.myBookedSeats,
            ...schedule.otherBookedSeats,
          ].map(Number),
          status: bus.isAvailable,
        })),
      );
      setSearchResults(schedules);
      setSelectedBus(null);
      setStep(1);
    } catch (e) {
      console.log(e);
    }
  };

  const handleSwap = () => {
    const tmp = fromCity;
    setFromCity(toCity);
    setToCity(tmp);
  };

  // open seat layout while booking
  const handleBook = (bus) => {
    setPendingBus(bus);
    setChosenSeats([]);
    setShowSeatLayout(true);
  };

  // seat confirmed in seat layout
  const handleSeatsConfirmed = (seats) => {
    setChosenSeats(seats);
    setShowSeatLayout(false);
    setSelectedBus(pendingBus);
    setStep(2);
  };

  const handleConfirm = async () => {
    try {
      const token = localStorage.getItem("userToken");
      if (!selectedBus.busNumber || !selectedBus.scheduleId || !chosenSeats)
        return;
      const res = await axios.post(
        API.user.seatBooking,
        {
          busNumber: selectedBus.busNumber,
          scheduleId: selectedBus.scheduleId,
          seats: chosenSeats,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if(res.data.status) {
        toast.success(res.data.message)
        setBookingId("BK-" + (Math.floor(Math.random() * 90000) + 10000));
        setStep(3);
      }
    } catch (e) {
      toast.error(e.response.data.message)
      setStep(2);
    }
  };

  const handleReset = () => {
    setStep(1);
    setSearchResults(null);
    setSelectedBus(null);
    setPendingBus(null);
    setChosenSeats([]);
    setPassengerName(currentUser?.userName ?? "");
    setPassengerPhone(currentUser?.phoneNumber ?? "");
    setBookingId("");
  };

  function formatTime12h(time24) {
    const [hours, minutes] = time24.split(":").map(Number);
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 === 0 ? 12 : hours % 12;
    return `${hours12}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }

  function getDuration(depature, arrival) {
    const [depatureHour, depatureMinute] = depature.split(":").map(Number);
    const [arrivalHour, arrivalMinute] = arrival.split(":").map(Number);

    let hours = arrivalHour - depatureHour;
    let minutes = arrivalMinute - depatureMinute;

    if (minutes < 0) {
      minutes += 60;
      hours -= 1;
    }
    if (hours < 0) {
      hours += 24;
    }

    return `${hours}h ${minutes}m`;
  }

  return (
    <div>
      {/* seat layout */}
      {showSeatLayout && pendingBus && (
        <BusSeatLayout
          bus={pendingBus}
          onConfirm={handleSeatsConfirmed}
          onClose={() => setShowSeatLayout(false)}
        />
      )}

      <div className="mb-8">
        <p className="text-[0.75rem] text-yellow-500 tracking-[0.1em] uppercase font-semibold mb-1">
          Find your ride
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          style={fontSyne}
        >
          Where are you <span className="text-yellow-400">going?</span>
        </h2>
      </div>

      {/* search */}
      <div className={`${S.card} mb-6`}>
        <h3 className="font-bold text-[#0d0f1a] mb-5" style={fontSyne}>
          Search Buses
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* from */}
          <div>
            <label className={S.label}>From</label>
            <div className="relative">
              <MapPin
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] pointer-events-none"
              />
              <select
                value={fromCity}
                onChange={(e) => setFromCity(e.target.value)}
                className={S.select}
              >
                <option value="">Select city</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className={S.label}>To</label>
              <div className="relative">
                <MapPin
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] pointer-events-none"
                />
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className={S.select}
                >
                  <option value="">Select city</option>
                  {cities.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <button
              onClick={handleSwap}
              title="Swap cities"
              className="w-11 h-11 bg-yellow-100 hover:bg-yellow-200 border border-yellow-200 rounded-xl flex items-center justify-center text-yellow-600 transition-all hover:rotate-180 duration-300 flex-shrink-0"
            >
              <ArrowLeftRight size={17} />
            </button>
          </div>

          <div className="sm:col-span-2">
            <label className={S.label}>Travel Date</label>
            <div className="relative">
              <Clock
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] pointer-events-none"
              />
              <input
                type="date"
                value={travelDate}
                onChange={(e) => setTravelDate(e.target.value)}
                className={`${S.input} pl-11`}
                style={{ colorScheme: "light" }}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleSearch}
          className={`${S.btnAmber} flex items-center justify-center gap-2`}
        >
          <Search size={17} /> Search Buses
        </button>
      </div>

      {/* details*/}
      {step === 2 && selectedBus && (
        <div className={`${S.card} mb-6 border-2 border-yellow-300`}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 bg-yellow-400 rounded-xl flex items-center justify-center font-bold text-[#0d0f1a] text-sm">
              2
            </div>
            <h3 className="font-bold text-[#0d0f1a]" style={fontSyne}>
              Passenger Details
            </h3>
          </div>

          {/* bus summary */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-2xl p-4 mb-4 flex items-start justify-between flex-wrap gap-3">
            <div>
              <div className="font-bold text-[#0d0f1a] text-sm">
                {selectedBus.busNumber}
              </div>
              <div className="text-[#7a7e96] text-xs mt-0.5">
                {selectedBus.from} → {selectedBus.to} · {selectedBus.departure}
              </div>
              {/* chosen seats */}
              {chosenSeats.length > 0 && (
                <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
                  <span className="text-[#9a9eb8] text-xs">Seats:</span>
                  {chosenSeats
                    .sort((a, b) => a - b)
                    .map((s) => (
                      <span
                        key={s}
                        className="bg-yellow-400 text-[#0d0f1a] text-[10px] font-bold px-1.5 py-0.5 rounded-md"
                      >
                        {s}
                      </span>
                    ))}
                  <button
                    onClick={() => {
                      setShowSeatLayout(true);
                      setPendingBus(selectedBus);
                    }}
                    className="text-yellow-600 text-[10px] underline ml-1 hover:text-yellow-500"
                  >
                    Change
                  </button>
                </div>
              )}
            </div>
            <div className="text-yellow-600 font-bold text-lg">
              LKR {(chosenSeats.length * selectedBus.price).toLocaleString()}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
            <div>
              <label className={S.label}>Full Name</label>
              <div className="relative">
                <User
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] pointer-events-none"
                />
                <input
                  type="text"
                  value={passengerName}
                  onChange={(e) => setPassengerName(e.target.value)}
                  placeholder="John Doe"
                  className={S.input}
                />
              </div>
            </div>
            <div>
              <label className={S.label}>Phone Number</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9a9eb8] text-xs pointer-events-none">
                  <Phone size={17} />
                </span>
                <input
                  type="tel"
                  value={passengerPhone}
                  onChange={(e) => setPassengerPhone(e.target.value)}
                  placeholder="+94 77 000 0000"
                  className={S.input}
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleConfirm}
              className="flex-1 min-w-[140px] py-3.5 rounded-xl font-bold text-[#0d0f1a] bg-yellow-400 hover:bg-yellow-300 transition-all shadow-[0_4px_14px_rgba(251,191,36,0.35)] flex items-center justify-center gap-2"
            >
              <CheckCircle size={17} /> Confirm Booking
            </button>
            <button
              onClick={() => {
                setStep(1);
                setSelectedBus(null);
              }}
              className="px-6 py-3.5 rounded-xl font-semibold text-[#7a7e96] border border-gray-200 hover:bg-gray-50 transition-all text-sm"
            >
              ← Back
            </button>
          </div>
        </div>
      )}

      {/* booking Success */}
      {step === 3 && (
        <div className={`${S.card} mb-6 text-center`}>
          <div className="w-16 h-16 bg-green-100 rounded-2xl mx-auto flex items-center justify-center mb-5">
            <CheckCircle size={32} className="text-green-500" />
          </div>
          <h3
            className="font-bold text-2xl text-[#0d0f1a] mb-1"
            style={fontSyne}
          >
            Booking Confirmed!
          </h3>
          <p className="text-[#7a7e96] text-sm mb-2">
            Your ticket has been booked successfully.
          </p>
          <div className="inline-block bg-yellow-50 border border-yellow-200 rounded-xl px-5 py-2 mb-2">
            <span className="text-[#7a7e96] text-xs">Booking ID: </span>
            <span className="font-bold text-yellow-600">{bookingId}</span>
          </div>
          {chosenSeats.length > 0 && (
            <div className="flex items-center justify-center gap-1.5 flex-wrap mb-2">
              <span className="text-[#9a9eb8] text-xs">Seats:</span>
              {chosenSeats
                .sort((a, b) => a - b)
                .map((s) => (
                  <span
                    key={s}
                    className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-0.5 rounded-md border border-yellow-200"
                  >
                    {s}
                  </span>
                ))}
            </div>
          )}
          <div className="text-sm text-[#7a7e96] mb-6">
            {selectedBus?.busNumber} · {selectedBus?.from} → {selectedBus?.to} ·{" "}
            {selectedBus?.departure}
          </div>
          <button
            onClick={handleReset}
            className={`${S.btnAmber} max-w-xs mx-auto`}
          >
            Book Another Journey
          </button>
        </div>
      )}

      {/* search */}
      {searchResults !== null && step === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-white" style={fontSyne}>
              {searchResults.length > 0
                ? `${searchResults.length} bus${searchResults.length !== 1 ? "es" : ""} found`
                : "No buses found"}
            </h3>
            {fromCity && toCity && (
              <span className="text-yellow-400 text-sm font-semibold">
                {fromCity} → {toCity}
              </span>
            )}
          </div>

          {searchResults.length === 0 && (
            <div className={`${S.card} text-center py-12`}>
              <div className="w-14 h-14 bg-gray-100 rounded-2xl mx-auto flex items-center justify-center mb-4">
                <Search size={24} className="text-gray-300" />
              </div>
              <p className="text-[#7a7e96] font-semibold">
                No buses available for this route.
              </p>
              <p className="text-[#7a7e96] text-sm mt-1">
                Try a different date or route.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {searchResults.map((bus) => (
              <div
                key={bus.busNumber}
                className={`${S.card} hover:shadow-[0_12px_48px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5`}
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-3 flex-wrap">
                      <span
                        className="font-bold text-[#0d0f1a] text-base"
                        style={fontSyne}
                      >
                        {bus.busNumber}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#0d0f1a]">
                          {formatTime12h(bus.departure)}
                        </div>
                        <div className="text-xs text-[#7a7e96]">{bus.from}</div>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1">
                        <div className="text-xs text-[#7a7e96]">
                          {getDuration(bus.departure, bus.arrival)}
                        </div>
                        <div className="w-full flex items-center gap-1">
                          <div className="h-px flex-1 bg-gray-200" />
                          <Bus size={14} className="text-yellow-400" />
                          <div className="h-px flex-1 bg-gray-200" />
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-xl font-bold text-[#0d0f1a]">
                          {formatTime12h(bus.arrival)}
                        </div>
                        <div className="text-xs text-[#7a7e96]">{bus.to}</div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-yellow-500">
                        LKR {bus.price}
                      </div>
                      <div className="text-xs text-[#7a7e96]">per seat</div>
                    </div>
                    <div className="text-xs">
                      {bus.numberOfSeats === 0 ? (
                        <span className="text-red-500 font-semibold">
                          Sold out
                        </span>
                      ) : (
                        <span className="text-green-600 font-semibold">
                          {bus.available} seats left
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleBook(bus)}
                      disabled={bus.seats === 0}
                      className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                        bus.seats === 0
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-yellow-400 hover:bg-yellow-300 text-[#0d0f1a] shadow-[0_4px_12px_rgba(251,191,36,0.3)] hover:-translate-y-0.5"
                      }`}
                    >
                      {bus.seats === 0 ? "Full" : "Book Now"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
