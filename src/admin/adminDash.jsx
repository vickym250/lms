import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Tooltip, Legend);

export default function AdminDashboard() {
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [totalEarning, setTotalEarning] = useState(0);

  // FETCH TEACHERS
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

  // FETCH STUDENTS
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

// FETCH COURSES + TOTAL EARNING CALCULATION
const fetchCourses = async () => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_URL}/api/course/allcourse`
    );

    if (res.data.success) {
      const allCourses = res.data.data;
      setCourses(allCourses);

      // 🔥 Total Earnings From Courses
      let total = 0;

      allCourses.forEach((course) => {
        const studentsCount =
          course.enrolledStudents?.length ||   // If enrolledStudents exists
          course.students?.length ||           // If students array exists
          0;

        const price = course.price || 0;

        total += studentsCount * price;
      });

      setTotalEarning(total);
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

  // 🔹 Monthly Earning Data (Dummy logic based on student joining date)
  const monthlyLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const monthlyEarningData = [5000, 8000, 6500, 9000, 7500, 11000];

  const monthlyChart = {
    labels: monthlyLabels,
    datasets: [
      {
        label: "Monthly Earnings (₹)",
        data: monthlyEarningData,
        backgroundColor: "rgba(37, 99, 235, 0.5)",
      },
    ],
  };

  // 🔹 Course-wise Revenue Pie Chart
  const courseLabels = courses.map((c) => c.title);
  const courseRevenue = courses.map((c) => c.price || 1000);

  const coursePieData = {
    labels: courseLabels,
    datasets: [
      {
        data: courseRevenue,
        backgroundColor: ["#2563eb", "#16a34a", "#dc2626", "#9333ea", "#f59e0b"],
      },
    ],
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
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

          <div className="bg-white p-4 rounded-lg shadow-sm text-center">
            <h2 className="text-gray-600 text-sm">Total Earnings</h2>
            <p className="text-3xl font-bold text-green-600">₹ {totalEarning}</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Monthly Earnings Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Monthly Earnings</h2>
            <Bar data={monthlyChart} />
          </div>

          {/* Course Revenue Pie Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">Course-wise Revenue</h2>
            <Pie data={coursePieData} />
          </div>
        </div>
      </div>
    </div>
  );
}
