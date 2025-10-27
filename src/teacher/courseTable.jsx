import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function CourseTable() {
  const { teacherId } = useParams();

  const [editing, setEditing] = useState(null);
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({ title: '', students: '' });
  
  // 🔹 Courses Fetch Function
  const fetchCourses = async () => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/showcourse`, { teacherId });
      setCourses(res.data.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  // 🔹 Initial Load
  useEffect(() => {
    fetchCourses();
  }, [teacherId]);

  // 🔹 Delete Course with Confirmation + Refresh
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("⚠️ Are you sure you want to delete this course?");
    if (!confirmDelete) return; // ❌ user cancelled

    try {
      await axios.put("http://localhost:5000/api/course/delete", { id });
      alert("✅ Course deleted successfully!");
      await fetchCourses(); // 🔄 Refresh after delete
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("❌ Something went wrong while deleting!");
    }
  };

  

  const saveEdit = (id) => {
    setCourses(prev =>
      prev.map(c =>
        c._id === id ? { ...c, title: form.title, studentsEnrolled: Array(Number(form.students)).fill({}) } : c
      )
    );
    setEditing(null);
    setForm({ title: '', students: '' });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
      <h3 className="text-lg font-medium mb-4">Courses</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left table-auto">
          <thead>
            <tr className="text-sm text-gray-500 border-b">
              <th className="py-2 w-28">Image</th>
              <th className="py-2">Course Title</th>
              <th className="py-2 w-36">Students Enrolled</th>
              <th className="py-2 w-48">Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.map(course => (
              <tr key={course._id} className="border-b">
                {/* 🔹 Course Image */}
                <td className="py-3">
                  <img
                   src={`${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                    alt={course.title}
                    className="w-20 h-12 object-cover rounded border"
                  />
                </td>

                {/* 🔹 Course Title */}
                <td className="py-3">
                  {editing === course._id ? (
                    <input
                      className="border rounded px-2 py-1 w-full"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    />
                  ) : (
                    <div className="font-medium">{course.title}</div>
                  )}
                </td>

                {/* 🔹 Students Count */}
                <td className="py-3">
                  {editing === course._id ? (
                    <input
                      className="border rounded px-2 py-1 w-24"
                      value={form.students}
                      onChange={e => setForm(f => ({ ...f, students: e.target.value }))}
                    />
                  ) : (
                    <div>{course.studentsEnrolled?.length || 0}</div>
                  )}
                </td>

                {/* 🔹 Actions */}
                <td className="py-3">
                  {editing === course._id ? (
                    <div className="flex gap-2">
                      <button onClick={() => saveEdit(course._id)} className="px-3 py-1 bg-green-600 text-white rounded">Save</button>
                      <button onClick={() => { setEditing(null); setForm({ title: '', students: '' }); }} className="px-3 py-1 bg-gray-200 rounded">Cancel</button>
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <Link to={`/teacherDash/${teacherId}/createcourse/${course._id}`}><button className="px-3 py-1 bg-gray-100 rounded border">Edit</button></Link>
                      <button onClick={() => handleDelete(course._id)} className="px-3 py-1 bg-red-500 text-white rounded">Delete</button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
