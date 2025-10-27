import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import {
  FaGraduationCap,
  FaUser,
  FaBook,
  FaChartLine,
  FaCertificate,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import Cookies from "js-cookie";
import axios from "axios";

export default function Sidebar() {
  const [userData, setUserData] = useState({});
  const [isOpen, setIsOpen] = useState(false); // ✅ Mobile sidebar toggle
  const navigate = useNavigate();
  const { id } = useParams("id");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("Token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data._id) {
          if (res.data._id !== id) {
            Cookies.remove("Token");
            navigate("/login");
            return;
          }
          setUserData(res.data);
          console.log(res.data.picture);
          
        } else {
          Cookies.remove("Token");
          navigate("/login");
        }
      } catch (err) {
        console.error("Error fetching user:", err);
        Cookies.remove("Token");
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate, id]);
 

  
  const handleLogout = () => {
    Cookies.remove("Token");
    navigate("/login");
  };

  if (!userData) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* 🔹 Mobile Menu Button */}
      <button
        className={`md:hidden fixed top-4  ${isOpen ? "left-50" : "left-4"} left-4 z-50 bg-indigo-600 text-white p-2 rounded-md`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed md:static top-0 left-0 h-full w-64 bg-white border-r p-4 flex flex-col justify-between transform transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        <div>
          {/* Profile */}
          <div className="flex items-center gap-3 mb-6">
           <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            <img src={ userData.picture} className=" w-full h-full rounded-full"></img>
          </div>
            <div>
              <h2 className="font-semibold">{userData.name}</h2>
              <p className="text-sm text-gray-500">
                {userData.role || "Student"}
              </p>
            </div>
          </div>

          {/* Menu */}
          <nav className="space-y-2">
            <NavLink
              to="stdash"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "hover:bg-gray-100"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FaBook /> Dashboard
            </NavLink>

            <NavLink
              to="all"
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded-lg ${
                  isActive
                    ? "bg-indigo-50 text-indigo-600 font-medium"
                    : "hover:bg-gray-100"
                }`
              }
              onClick={() => setIsOpen(false)}
            >
              <FaChartLine /> All Course
            </NavLink>

           

           
          </nav>
        </div>

        {/* Logout */}
        <button
          onClick={() => {
            handleLogout();
            setIsOpen(false);
          }}
          className="flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-lg"
        >
          <FaSignOutAlt /> Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 md:ml-0 ml-0">
        <Outlet />
      </main>

      {/* Overlay (Mobile Only) */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
}
