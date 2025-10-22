import { useNavigate } from "react-router-dom";

export default function PaymentCancelPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex justify-center items-center p-4">
      <div className="max-w-xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Cancel Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
        </div>

        {/* Cancel Message */}
        <h1 className="text-3xl font-bold text-center text-red-600 mb-2">
          Payment Cancelled
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Your payment was cancelled. Don't worry, your order is still saved and you can complete the payment later.
        </p>

        {/* Info Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <svg
              className="w-6 h-6 text-yellow-600 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <h3 className="font-semibold text-yellow-800 mb-1">What happens next?</h3>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Your order remains in "pending" status</li>
                <li>• Items are still reserved in your cart</li>
                <li>• You can retry payment anytime</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate("/cart")}
            className="w-full h-12 bg-accent text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Go to Cart
          </button>
          <button
            onClick={() => navigate("/products")}
            className="w-full h-12 bg-white border-2 border-accent text-accent rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full h-12 bg-white border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}
