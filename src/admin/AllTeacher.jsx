 import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios';
 
 export default function AllTeacher() {

  const [courses, setCourses] = useState([]);

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Teachers
  const getTeachers = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/get`);
      if (res.data && res.data.teachers) {
        setTeachers(res.data.teachers);
      }
    } catch (error) {
      console.error("❌ Error fetching teachers:", error);
    }
  };

  // 🔹 Fetch Students


  // 🔹 Fetch Courses
  const fetchCourses = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/course/allcourse`);
      if (res.data.success) {
        setCourses(res.data.data);
      }
    } catch (error) {
      console.error("❌ Error fetching courses:", error);
    }
  };

  useEffect(() => {
    getTeachers();
   
    fetchCourses();
  }, []);

  // 🔹 Delete Teacher
  const handleDeleteTeacher = async (id) => {
    if (!window.confirm("Are you sure you want to delete this teacher?")) return;
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher/deleteTeacher`, { id });
      await getTeachers(); // refresh
      alert("✅ Teacher deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting teacher:", error);
      alert("Failed to delete teacher");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Delete Student
  

   return (
    <div className="flex min-h-screen bg-gray-50">
<Sidebar/>

 <div className="w-[90%] bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Teachers</h3>
            <table className="w-full text-sm border">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2 text-center">Courses</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {teachers.slice(0, 5).map((t) => {
                  const createdCount = courses.filter(
                    (c) => c.teacherId === t._id || c.teacherId === t.uid
                  ).length;

                  return (
                    <tr key={t._id} className="border-b hover:bg-gray-50">
                      <td className="py-1">{t.name || "N/A"}</td>
                      <td className="py-1">{t.email || "N/A"}</td>
                      <td className="py-1 text-center">{createdCount}</td>
                      <td className="py-1 text-center">
                        <button
                          onClick={() => handleDeleteTeacher(t._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                          disabled={loading}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {teachers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-2 text-gray-500">
                      No teachers found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

    </div>
   )
 }
 