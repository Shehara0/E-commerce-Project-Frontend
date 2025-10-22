import { useEffect, useState } from "react";
import { TbTrash } from "react-icons/tb";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from "axios";

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Colombo");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to checkout");
      navigate("/login");
      return;
    } else {
      axios
        .get(import.meta.env.VITE_BACKEND_URL + "/api/user", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((res) => {
          setUser(res.data);
          setName(res.data.name);
          console.log(res.data);
        })
        .catch((err) => {
          console.error(err);
          toast.error("Failed to fetch user details");
        });
    }
  }, []);

  const [cart, setCart] = useState(location.state?.items || []);
  
  if (location.state?.items == null) {
    toast.error("Please select items to checkout");
    navigate("/products");
  }

  function getTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += item.quantity * item.price;
    });
    return total;
  }

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (token == null) {
      toast.error("Please login to place an order");
      navigate("/login");
      return;
    }
    
    if (name === "" || address === "" || phone === "") {
      toast.error("Please fill all the fields");
      return;
    }

    setLoading(true);

    const order = {
      address: address,
      phone: phone,
      city: city,
      paymentMethod: "payhere",
      items: [],
    };

    cart.forEach((item) => {
      order.items.push({
        productId: item.productId,
        qty: item.quantity,
      });
    });

    try {
      const response = await axios.post(
        import.meta.env.VITE_BACKEND_URL + "/api/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Order created successfully");
      console.log("Order Response:", response.data);

      // Initialize PayHere payment
      if (response.data.payhereData) {
        initiatePayHerePayment(response.data.payhereData);
      }

    } catch (err) {
      console.error(err);
      toast.error("Failed to place order");
    } finally {
      setLoading(false);
    }
  }

  function initiatePayHerePayment(payhereData) {
    // PayHere payment callbacks
    window.payhere.onCompleted = function(orderId) {
      console.log("Payment completed. OrderID:", orderId);
      toast.success("Payment Successful!");
      
      // Clear cart from localStorage
      localStorage.removeItem("cart");
      
      // Redirect to success page
      navigate("/payment-success", { state: { orderId: orderId } });
    };

    window.payhere.onDismissed = function() {
      console.log("Payment dismissed");
      toast.error("Payment was cancelled");
    };

    window.payhere.onError = function(error) {
      console.log("Payment error:", error);
      toast.error("Payment failed: " + error);
    };

    // Start PayHere payment
    window.payhere.startPayment(payhereData);
  }

  return (
    <div className="w-[100vw] max-w-[100vw] min-h-screen flex flex-col px-[10px] py-[40px] items-center bg-gray-50">
      <h1 className="text-3xl font-bold text-accent mb-8">Checkout</h1>

      {/* Cart Items */}
      <div className="w-full max-w-[900px]">
        {cart.map((item, index) => {
          return (
            <div
              key={item.productId}
              className="w-full h-[200px] md:h-[100px] mb-4 bg-white shadow-lg rounded-lg flex flex-row items-center relative overflow-hidden"
            >
              <div className="md:w-[100px] w-[200px] justify-center items-center flex flex-col">
                <img
                  src={item.image}
                  className="w-[100px] h-[100px] object-cover"
                  alt={item.name}
                />
                <div className="h-full flex-col justify-center pl-[10px] md:hidden flex">
                  <span className="font-bold text-center md:text-left">
                    {item.name}
                  </span>
                  <span className="font-semibold text-center md:text-left">
                    LKR {item.price.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                </div>
              </div>

              <div className="w-[320px] h-full flex-col justify-center pl-[10px] hidden md:flex">
                <span className="font-bold">{item.name}</span>
                <span className="font-semibold text-gray-600">
                  LKR {item.price.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <div className="w-[190px] h-full text-4xl md:text-md flex flex-row justify-center items-center">
                <button
                  className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-accent text-white cursor-pointer hover:bg-blue-400 transition"
                  onClick={() => {
                    const newCart = [...cart];
                    newCart[index].quantity -= 1;
                    if (newCart[index].quantity <= 0) {
                      newCart.splice(index, 1);
                    }
                    setCart(newCart);
                  }}
                >
                  -
                </button>
                <span className="mx-[15px] font-semibold">{item.quantity}</span>
                <button
                  className="flex justify-center items-center w-[35px] h-[35px] rounded-lg bg-accent text-white cursor-pointer hover:bg-blue-400 transition"
                  onClick={() => {
                    const newCart = [...cart];
                    newCart[index].quantity += 1;
                    setCart(newCart);
                  }}
                >
                  +
                </button>
              </div>

              <div className="w-[190px] text-2xl md:text-lg h-full flex justify-end items-center pr-[10px]">
                <span className="font-bold text-accent">
                  LKR {(item.quantity * item.price).toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>

              <button
                className="w-[35px] h-[35px] absolute top-[5px] right-[5px] md:top-[32px] md:right-[-45px] cursor-pointer bg-red-600 shadow-lg rounded-full flex justify-center items-center text-white border-[2px] border-red-600 hover:bg-white hover:text-red-600 transition"
                onClick={() => {
                  const newCart = [...cart];
                  newCart.splice(index, 1);
                  setCart(newCart);
                }}
              >
                <TbTrash className="text-lg" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Total Section */}
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-lg p-6 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold">Total:</span>
          <span className="text-3xl font-bold text-accent">
            LKR {getTotal().toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>

      {/* Shipping Details Form */}
      <div className="w-full max-w-[900px] bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4 text-accent">Shipping Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Full Name *</label>
            <input
              className="w-full h-[45px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">Phone Number *</label>
            <input
              className="w-full h-[45px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              type="tel"
              placeholder="07XXXXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:col-span-2">
            <label className="text-sm font-semibold mb-2">Delivery Address *</label>
            <textarea
              className="w-full h-[80px] border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-semibold mb-2">City *</label>
            <input
              className="w-full h-[45px] border border-gray-300 rounded-lg px-4 focus:ring-2 focus:ring-accent focus:border-transparent outline-none"
              type="text"
              placeholder="Colombo"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>
        </div>

        {/* Payment Info */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-semibold text-green-800">Secure Payment with PayHere</span>
          </div>
          <p className="text-sm text-green-700 mt-2">
            You'll be redirected to PayHere secure payment gateway
          </p>
        </div>

        {/* Place Order Button */}
        <button
          onClick={placeOrder}
          disabled={loading || cart.length === 0}
          className="w-full h-[55px] mt-6 cursor-pointer rounded-lg shadow-lg text-white text-lg font-semibold bg-accent border-[2px] border-accent hover:bg-white hover:text-accent disabled:bg-gray-400 disabled:border-gray-400 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Processing...
            </span>
          ) : (
            "Proceed to Payment"
          )}
        </button>
      </div>
    </div>
  );
}