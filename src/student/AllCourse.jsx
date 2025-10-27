import React, { useEffect, useState } from "react";
import Navbar from "../component/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

export default function AllCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isPaid, setIsPaid] = useState({});
  const [userId, setUserId] = useState(null); // ✅ for backend _id
  const nav = useNavigate();

  // 🔹 Fetch user data (for _id + enrolledCourses)
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("Token");
        if (!token) return;

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setUserId(res.data._id); // ✅ store MongoDB _id
        setEnrolledCourses(res.data.enrolledCourses || []);
        console.log("✅ User Data:", res.data);
      } catch (error) {
        console.error("❌ Error fetching user:", error);
      }
    };

    fetchUserData();
  }, []);

  // 🔹 Fetch all courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/course/allcourse`
        );
        if (res.data.success) setCourses(res.data.data);
      } catch (error) {
        console.error("❌ Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  // 🔹 Check if course enrolled
  const isEnrolled = (id) =>
    enrolledCourses?.some((c) => c === id || c?._id === id) ||
    isPaid[id] === true;

  // 🔹 Handle Razorpay payment
  const handlePayment = async (course) => {
    try {
      const token = Cookies.get("Token");
      if (!token) return nav("/login");

      // ✅ 1. Create Razorpay order
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/payment/order`,
        { amount: course.fees, courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ 2. Setup Razorpay checkout
      const options = {
        key: "rzp_live_RSbqXqGXXLi8VP" , // 🔹 from .env
        amount: data.amount,
        currency: data.currency,
        name: course.title,
        description: course.title,
        image: `${import.meta.env.VITE_API_URL}${course.thumbnail}`,
        order_id: data.id,
        handler: async function (response) {
          try {
            // ✅ 3. Verify payment on backend
            const verify = await axios.post(
              `${import.meta.env.VITE_API_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
                userId, // ✅ send MongoDB user _id
              },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            if (verify.data.success) {
              alert("✅ Payment Successful & Enrolled!");
              setIsPaid((prev) => ({ ...prev, [course._id]: true }));
              setEnrolledCourses((prev) => [...prev, course._id]);
            } else {
              alert("❌ Payment verification failed!");
            }
          } catch (err) {
            console.log("❌ Verify Error:", err);
            alert("Verification failed, please try again.");
          }
        },
        theme: { color: "#6b21a8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("❌ Payment Error:", error);
      alert("Payment failed, please try again.");
    }
  };

  return (
    <>
      
      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">
            Explore All <span className="text-purple-600">Courses</span>
          </h1>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {courses.length > 0 ? (
              courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-lg transition"
                >
                  <img
                    src={`${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                    alt={course.title}
                    className="w-full h-40 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{course.title}</h3>
                    <p className="text-gray-500 text-sm mb-2">
                      by {course.teacherId?.name || "Instructor"}
                    </p>
                    <p className="font-bold text-purple-600 mb-3">
                      ₹{course.fees}
                    </p>

                    {isEnrolled(course._id) ? (
                      <button
                        onClick={() => nav(`/course/${course._id}/1`)}
                        className="w-full py-2 bg-green-600 text-white rounded-lg cursor-pointer"
                      >
                        Continue ▶️
                      </button>
                    ) : (
                      <button
                        onClick={() => handlePayment(course)}
                        className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                      >
                        Enroll Now
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                No courses available 😕
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
