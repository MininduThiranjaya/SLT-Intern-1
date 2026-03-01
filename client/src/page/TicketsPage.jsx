import { fontSyne } from "../assets/shared";
import { useEffect, useState } from "react";
import axios from "axios";
import API from "../apis/apis";

export default function TicketsPage() {
  const [myBookings, setMyBookings] = useState([]);
  const [loading, setLoadig] = useState(false)

  async function featchBookings() {
    try {
      const token = localStorage.getItem("userToken");
      const res = await axios.get(API.user.getMyBookings, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const bookings = res.data.result.map((b) => ({
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

        seats: b.BookingSeats?.map((s) => s.seatNumber) || [],
      }));
      setMyBookings(bookings);
    } catch (e) {
      console.log(e);
    }
  }

  const makePayment = async (b) => {
    try{
        setLoadig(true)
        const token = localStorage.getItem('userToken')
        const res2 = await axios.post(API.user.createPayment, {
        bookingId: b.bookingId,
        totalPrice: b.totalPrice,
        seats: b.seats,
        busNumber: b.busNumber
       }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (res2.data.status) {
          console.log(res2);
          setLoadig(false)
          window.location.href = res2.data.result.url;
        }
    }
    catch(e) {
      setLoadig(false)
    }
  } 

  useEffect(() => {
    featchBookings();
  }, []);

  return (
    <div>
      {
        loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      }
      <div className="mb-8">
        <p className="text-[0.75rem] text-yellow-500 tracking-[0.1em] uppercase font-semibold mb-1">
          Journey history
        </p>
        <h2
          className="text-3xl md:text-4xl font-bold text-white tracking-tight"
          style={fontSyne}
        >
          My Tickets
        </h2>
      </div>

      {/* ticket List */}
      <div className="space-y-4">
        {myBookings.map((b) => {
          return (
            <div
              key={b.bookingId}
              className="bg-white border border-gray-200 rounded-2xl p-5 hover:border-yellow-400/40 transition-all shadow-sm"
            >
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="text-black font-mono font-medium text-sm">
                      {b.busNumber}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border border-yellow-300 bg-yellow-400 text-black">
                      {b.status}  {b.status == "PENDING" && "If you unable to pay within an hour the reservation will be canceled(It will be available to someone to book the seats)"}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-black font-semibold mb-0.5">
                        {b.userName}
                      </div>
                      <div className="text-gray-400 text-xs mb-3">
                        {b.email}
                      </div>
                    </div>
                    <div>
                      <div className="text-black font-semibold mb-0.5">
                        Booked seats
                      </div>
                      <div className="text-gray-400 text-xs mb-3">
                        {b.seats.join(", ")}
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Route</div>
                      <div className="text-black text-sm">
                        {b.from} - {b.to}
                      </div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">Bus</div>
                      <div className="text-black text-sm">{b.busNumber}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">
                        Travel Date
                      </div>
                      <div className="text-black text-sm">{b.scheduleDate}</div>
                    </div>
                    <div>
                      <div className="text-gray-400 text-xs mb-0.5">
                        Seats * Fare
                      </div>
                      <div className="text-black text-sm">
                        {b.seats.length} * LKR {b.price} ={" "}
                        <span className="text-yellow-400 font-semibold">
                          LKR {b.totalPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-row justify-between">
                    <div className="text-gray-400 text-xs mt-3">
                      Booked on {b.bookedAt}
                    </div>
                    <div>
                      {b.status == "PENDING" && <button
                        onClick={() => makePayment(b)}
                        className="rounded-full p-2 border border-yellow-200 bg-yellow-300 text-black"
                      >
                        Make Payment
                      </button>}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
