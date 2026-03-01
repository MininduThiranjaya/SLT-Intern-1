import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../apis/apis";

const PaymentFail = () => {
  const navigate = useNavigate()
  const params = new URLSearchParams(window.location.search);
  const [ticketDetails, setTicketDetails] = useState("")
  const bookingId = params.get("bookingId");
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchBookingDetails = async (bookingId) => {
      try{
        useState(true)
        const token = localStorage.getItem('userToken')
        const res = await axios.get(API.user.getSpecificBooking, {
          params: { bookingId },
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        if(res.data.status) {
          const booking = res.data.result.map((b) => ({
            bookingId: b.id,
            status: b.status,
            totalPrice: b.totalPrice,
            bookedAt: b.createdAt,

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
          setTicketDetails(booking)
          setLoading(false)
        }
      }
      catch(e){
          setLoading(false)
      }
    }

    fetchBookingDetails(bookingId)
  }, [bookingId])
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      {
        loading && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="w-16 h-16 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )
      }
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Failed</h1>
        <p className="text-gray-500 text-sm mb-6">
          We were unable to process your payment. Please check your payment details and try again.
        </p>

        {/* Amount */}
        <div className="bg-red-50 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Amount</p>
          <p className="text-3xl font-bold text-red-500">LKR {ticketDetails?.totalPrice}</p>
        </div>

        {/* Error Info */}
        <div className="text-left space-y-3 mb-8 border-t border-gray-100 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Transaction ID</span>
            <span className="text-gray-700 font-medium">{ticketDetails?.stripePaymentId}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Bus Number</span>
            <span className="text-gray-700 font-medium">{ticketDetails?.busNumber}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Booked At</span>
            <span className="text-gray-700 font-medium">{ticketDetails?.bookedAt}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Seats</span>
            <span className="text-gray-700 font-medium">{ticketDetails?.seats?.join(", ")}</span>
          </div>
        </div>

        {/* Buttons */}
        <button 
          onClick={() => navigate('/dashboard')}
          className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mb-3"
        >
          Try Again
        </button>

      </div>
    </div>
  );
};

export default PaymentFail;
