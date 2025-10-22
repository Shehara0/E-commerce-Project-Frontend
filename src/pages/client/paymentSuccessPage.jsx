import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

export default function PaymentSuccessPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const orderId = location.state?.orderId;

  useEffect(() => {
    if (orderId) {
      const token = localStorage.getItem("token");
      
      axios
        .get(
          import.meta.env.VITE_BACKEND_URL + "/api/orders/order/" + orderId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then((res) => {
          setOrder(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [orderId]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex justify-center items-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-8">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center animate-bounce">
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
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold text-center text-green-600 mb-2">
          Payment Successful!
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Thank you for your purchase. Your order has been confirmed.
        </p>

        {/* Order Details */}
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto"></div>
          </div>
        ) : order ? (
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Order ID:</span>
                <span className="font-semibold">{order.orderID}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Payment Status:</span>
                <span className="font-semibold text-green-600 capitalize">
                  {order.paymentStatus}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Total Amount:</span>
                <span className="font-bold text-lg">
                  LKR {order.total.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">Items:</h3>
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-semibold">
                    LKR {(item.price * item.qty).toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              ))}
            </div>

            {/* Delivery Address */}
            <div className="border-t pt-4 mt-4">
              <h3 className="font-semibold mb-2">Delivery Address:</h3>
              <p className="text-gray-600">{order.address}</p>
              <p className="text-gray-600">Phone: {order.phone}</p>
            </div>
          </div>
        ) : (
          <div className="text-center text-gray-600">
            Unable to load order details
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate("/products")}
            className="flex-1 h-12 bg-accent text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Continue Shopping
          </button>
          <button
            onClick={() => navigate("/")}
            className="flex-1 h-12 bg-white border-2 border-accent text-accent rounded-lg font-semibold hover:bg-gray-50 transition"
          >
            Go to Home
          </button>
        </div>
      </div>
    </div>
  );
}