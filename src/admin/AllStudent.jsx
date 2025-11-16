 import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import axios from 'axios';
 
 export default function AllStudent() {

  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Teachers


  // 🔹 Fetch Students
  const fetchStudents = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/getStu`);
      if (res.data && res.data.students) {
        setStudents(res.data.students);
       
        
      }
    } catch (error) {
      console.error("❌ Error fetching students:", error);
    }
  };

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
    
    fetchStudents();
    fetchCourses();
  }, []);

  // 🔹 Delete Teacher


  // 🔹 Delete Student
  const handleDeleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/teacher/deleteStudent`, { id });
      await fetchStudents(); // refresh
      alert("✅ Student deleted successfully");
    } catch (error) {
      console.error("❌ Error deleting student:", error);
      alert("Failed to delete student");
    } finally {
      setLoading(false);
    }
  };

   return (
    <div className="flex min-h-screen bg-gray-50">
<Sidebar/>

 <div className= " w-[90%] bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold mb-3">Students</h3>
            <table className="w-full text-sm border">
              <thead>
                <tr className="text-left border-b">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Course</th>
                  <th className="py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.slice(0, 5).map((stu) => (
                  <tr key={stu._id} className="border-b hover:bg-gray-50">
                    <td className="py-1">{stu.name || "N/A"}</td>
                    <td className="py-1">{stu.email || "N/A"}</td>
                    <td className="py-1">{stu.enrolledCourses?.length || "N/A"}</td>
                    <td className="py-1 text-center">
                      <button
                        onClick={() => handleDeleteStudent(stu._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs"
                        disabled={loading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-2 text-gray-500">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

    </div>
   )
 }
 