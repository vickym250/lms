import React from "react";
import { FaTachometerAlt, FaUserGraduate, FaChalkboardTeacher, FaBook, FaCog, FaSignOutAlt } from "react-icons/fa";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const menuItems = [
    { name: "Dashboard", icon: <FaTachometerAlt />, path: "/admin/dash" },
    { name: "Students", icon: <FaUserGraduate />, path: "/admin/allstudent" },
    { name: "Teachers", icon: <FaChalkboardTeacher />, path: "/admin/allteacher" },
    { name: "Courses", icon: <FaBook />, path: "/admin/courses" },
    { name: "Settings", icon: <FaCog />, path: "/admin/settings" },
  ];

  return (
    <div className="w-64 bg-white border-r min-h-screen flex flex-col justify-between">
      <div>
        {/* Logo */}
        <div className="px-6 py-5 text-lg font-bold flex items-center gap-2">
          <span className="bg-blue-600 text-white rounded-lg p-2">L</span>
          LearnHub Admin
        </div>

        {/* Menu */}
        <nav className="mt-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 ${
                  isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
                }`
              }
            >
              {item.icon}
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Logout */}
      <div className="px-6 py-4 border-t">
        <button className="flex items-center gap-3 text-gray-700 hover:text-red-600">
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}
