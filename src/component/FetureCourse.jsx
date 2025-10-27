import React, { useEffect, useState } from "react";
import Navbar from "../component/Header";
import axios from "axios";
import Cookies from "js-cookie";
import { Link, useNavigate } from "react-router-dom";

export default function FeaturedCourses() {
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [isPaid, setIsPaid] = useState({});
  const [userId, setUserId] = useState(null);
  const nav = useNavigate();

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
        setUserId(res.data._id);
        setEnrolledCourses(res.data.enrolledCourses || []);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}api/course/allcourse`
        );
        if (res.data.success) setCourses(res.data.data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };
    fetchCourses();
  }, []);

  const isEnrolled = (id) =>
    enrolledCourses?.some((c) => c === id || c?._id === id) ||
    isPaid[id] === true;

  const handlePayment = async (course) => {
    try {
      const token = Cookies.get("Token");
      if (!token) return nav("/login");

      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}api/payment/order`,
        { amount: course.fees, courseId: course._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: "rzp_live_RSbqXqGXXLi8VP",
        amount: data.amount,
        currency: data.currency,
        name: course.title,
        description: course.title,
        image: `${import.meta.env.VITE_API_URL}${course.thumbnail}`,
        order_id: data.id,
        handler: async function (response) {
          try {
            const verify = await axios.post(
              `${import.meta.env.VITE_API_URL}api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                courseId: course._id,
                userId,
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
          }
        },
        theme: { color: "#6b21a8" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log("❌ Payment Error:", error);
    }
  };

  return (
    <>
      <section className="py-16 bg-gray-50 ">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Featured Courses
          </h2>
          <p className="text-gray-600 mb-10 max-w-2xl mx-auto">
            Discover our most popular courses, carefully curated by industry experts
            to help you achieve your learning goals.
          </p>

          {/* ✅ Courses Grid */}
          
  <div className=" flex  justify-between">
    {courses.length > 0 ? (
      courses.slice(0,4).map((course) => (
        <div
          key={course._id}
          className="bg-white basis-[24%] rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1"
        >
          <img
            src={`${import.meta.env.VITE_API_URL}${course.thumbnail}`}
            alt={course.title}
            className="w-full h-40 object-cover"
          />
          <div className="p-4">
            <h3 className="text-lg font-semibold capitalize">
              {course.title}
            </h3>
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


   <Link to={"/allcourse"}> <button className=" mx-auto mt-5 rounded-sm py-2 px-8 text-white font-bold bg-gray-600">View All </button></Link>
        </div>
      </section>
    </>
  );
}
