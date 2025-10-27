import React, { useEffect, useState } from "react";
import { FaGraduationCap } from "react-icons/fa";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const Navbar = () => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [userId, setUserId] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("Token");
        if (!token) return;

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setUserData(res.data);
        setUserId(res.data._id);
      } catch (error) {
        console.error("❌ User fetch error:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    Cookies.remove("Token");
    setUserData(null);
    navigate("/login");
  };

  // ✅ Role-based Dashboard navigation
  const handleDashboard = (role) => {
    if (!userData) return;
    if (userData.role === "Teacher") {
      navigate(`/teacherDash/${userId}`);
    } else {
      navigate(`/stdash/${userId}`);
    }
  };

  const linkClasses = (path) =>
    location.pathname === path
      ? "text-indigo-600 font-semibold border-b-2 border-indigo-600 pb-1"
      : "text-gray-600 hover:text-indigo-600";

  return (
    <nav className="flex justify-between items-center px-8 py-3 bg-white shadow-sm">
      {/* Left - Logo */}
      <div className="flex items-center space-x-2">
        <div className="bg-indigo-600 p-2 rounded-lg text-white">
          <FaGraduationCap size={20} />
        </div>
        <h1 className="text-lg font-bold">LearnHub</h1>
      </div>

      {/* Middle - Links */}
      <div className="hidden md:flex space-x-8 font-medium">
        <Link to="/" className={linkClasses("/")}>
          Home
        </Link>
        <Link to="/allcourse" className={linkClasses("/allcourse")}>
          Courses
        </Link>
        <Link to="/about" className={linkClasses("/about")}>
          About
        </Link>
        <Link to="/contact" className={linkClasses("/contact")}>
          Contact
        </Link>
      </div>

      {/* Right - User or Login */}
      {userData ? (
        <div className="flex items-center space-x-4">
          {/* Dashboard Button (Role-based) */}
          <button
            onClick={handleDashboard}
            className="bg-green-500 text-white px-4 py-1.5 rounded-lg hover:bg-green-600"
          >
            Dashboard
          </button>

          <img
            src={userData.photo || "https://via.placeholder.com/40"}
            alt="User"
            className="w-10 h-10 rounded-full object-cover border"
          />
          <span className="font-medium text-gray-700">{userData.name}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">
          <button className="bg-indigo-600 text-white px-5 py-1.5 rounded-lg hover:bg-indigo-700">
            Sign In
          </button>
        </Link>
      )}
    </nav>
  );
};

export default Navbar;
