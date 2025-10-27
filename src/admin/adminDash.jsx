import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
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
    getTeachers();
    fetchStudents();
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
      <Sidebar />

      <div className="flex-1 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Admin</span>
            <div className="w-8 h-8 bg-blue-100 flex items-center justify-center rounded-full text-blue-600 font-semibold">
              A
            </div>
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Students</h2>
            <p className="text-3xl font-bold">{students.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Teachers</h2>
            <p className="text-3xl font-bold">{teachers.length}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Courses</h2>
            <p className="text-3xl font-bold">{courses.length}</p>
          </div>
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Students Table */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
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

          {/* Teachers Table */}
          <div className="bg-white p-4 rounded-lg shadow-sm">
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
      </div>
    </div>
  );
}
