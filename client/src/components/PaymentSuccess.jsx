import { useNavigate } from "react-router-dom";

const PaymentSuccess = () => {
  const navigate = useNavigate()
  const bookingId = params.get("bookingId");
  console.log(bookingId)
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg p-10 max-w-md w-full text-center">
        {/* Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mx-auto mb-6">
          <svg
            className="w-10 h-10 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {/* Text */}
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
        <p className="text-gray-500 text-sm mb-6">
          Your transaction has been completed successfully. A confirmation receipt has been sent to your email.
        </p>

        {/* Amount */}
        <div className="bg-green-50 rounded-xl px-6 py-4 mb-6">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">Amount Paid</p>
          <p className="text-3xl font-bold text-green-600">$249.00</p>
        </div>

        {/* Transaction Info */}
        <div className="text-left space-y-3 mb-8 border-t border-gray-100 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Transaction ID</span>
            <span className="text-gray-700 font-medium">#TXN8823410</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Date</span>
            <span className="text-gray-700 font-medium">Feb 28, 2026</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Payment Method</span>
            <span className="text-gray-700 font-medium">Visa •••• 4242</span>
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => navigate('/dashboard')}
          className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mb-3"
        >
          Go to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PaymentSuccess;
