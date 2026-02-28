const PaymentFail = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
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
          <p className="text-3xl font-bold text-red-500">$249.00</p>
        </div>

        {/* Error Info */}
        <div className="text-left space-y-3 mb-8 border-t border-gray-100 pt-6">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Reason</span>
            <span className="text-red-500 font-medium">Insufficient Funds</span>
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
        <button className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 mb-3">
          Try Again
        </button>
      </div>
    </div>
  );
};

export default PaymentFail;
