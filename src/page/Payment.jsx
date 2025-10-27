import { useState } from "react";
import Navbar from "../component/Header";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  return (
    <>  
      <Navbar/>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid md:grid-cols-2 gap-6">
        
        {/* Course Summary */}
        <div className="bg-white shadow-lg border rounded-2xl p-6 space-y-4">
          <h2 className="text-xl font-bold">Course Summary</h2>
          <div className="flex items-center gap-4">
            <img
              src="https://via.placeholder.com/100"
              alt="Course"
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div>
              <h3 className="font-semibold">Complete React Developer 2024</h3>
              <p className="text-gray-500 text-sm">by LearnHub</p>
            </div>
          </div>

          <div className="border-t pt-4 flex justify-between">
            <p className="font-medium">Course Price</p>
            <p className="font-bold text-lg">₹499</p>
          </div>
          <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-lg">
            Apply Coupon
          </button>
        </div>

        {/* Payment Form */}
        <div className="bg-white shadow-lg border rounded-2xl p-6 space-y-6">
          <h2 className="text-xl font-bold">Payment Details</h2>

          {/* Payment Method */}
          <div className="space-y-3">
            <label className="font-medium">Select Payment Method</label>
            <div className="flex gap-3">
              {["card", "upi", "paypal"].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`px-4 py-2 rounded-lg border ${
                    paymentMethod === method
                      ? "bg-purple-600 text-white"
                      : "bg-white text-gray-700"
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Card Payment */}
          {paymentMethod === "card" && (
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full border p-2 rounded-lg"
              />
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="w-1/2 border p-2 rounded-lg"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="w-1/2 border p-2 rounded-lg"
                />
              </div>
              <input
                type="text"
                placeholder="Card Holder Name"
                className="w-full border p-2 rounded-lg"
              />
            </div>
          )}

          {/* UPI Payment */}
          {paymentMethod === "upi" && (
            <input
              type="text"
              placeholder="Enter UPI ID (example@upi)"
              className="w-full border p-2 rounded-lg"
            />
          )}

          {/* PayPal */}
          {paymentMethod === "paypal" && (
            <p className="text-gray-600">You will be redirected to PayPal.</p>
          )}

          <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
            Complete Payment
          </button>
        </div>
      </div>
    </div>
    </>

  );
}
