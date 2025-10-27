import axios from "axios";
import React, { useEffect, useState } from "react";
import { useEffectEvent } from "react";
import { NavLink, Outlet, useNavigate, useParams } from "react-router-dom";
import Cookies from "js-cookie";

export default function TeacherDashboard() {

  const { teacherId } = useParams(); 
  
  const [user,setuser]=useState({})
  let navigate =useNavigate()
  
  useEffect(() => {

    const token = Cookies.get("Token")
    const getuser = () => {

      axios.post(`${import.meta.env.VITE_API_URL}/api/user/me`,
        {},
        { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => {
          setuser(res.data);

        })
    }
    getuser()




  }, [])
   let logout=()=>{
       Cookies.remove("Token");
           navigate("/login");
   }
 
  
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r h-screen sticky top-0 p-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
            <img src={ user.picture} className=" w-full h-full rounded-full"></img>
          </div>
          <div>
            <div className="font-semibold">{ user.name}</div>
            <div className="text-sm text-gray-500"> {user.role}</div>
          </div>
        </div>

        <nav className="space-y-2">
          <NavLink
            to={`/teacherDash/${teacherId}/dash`} // ✅ full path with teacherId
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md font-medium ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Dashboard
          </NavLink>

          <NavLink
            to={`createcourse`} // ✅ fixed path
            className={({ isActive }) =>
              `block px-3 py-2 rounded-md font-medium ${isActive
                ? "bg-indigo-50 text-indigo-700"
                : "text-gray-700 hover:bg-gray-100"
              }`
            }
          >
            Create Course
          </NavLink>
        </nav>

        <div onClick={logout} className="mt-8 text-sm text-red-500 cursor-pointer">Logout</div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
}
