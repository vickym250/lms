import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { FaStar, FaUsers, FaClock } from "react-icons/fa";

export default function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // student id from URL

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/student`, {
          studentId: id,
        });

        if (res.data.success) {
          setCourses(res.data.data);
          setTotalCourses(res.data.count);
        }
      } catch (err) {
        console.error("❌ Error fetching student courses:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [id]);

  if (loading) {
    return <div className="p-6 text-center text-gray-600">Loading...</div>;
  }

  return (
    <div className="flex-1 flex flex-col">
      <main className="p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Courses Enrolled</p>
            <h2 className="text-2xl font-bold">{totalCourses}</h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Hours Learned</p>
            <h2 className="text-2xl font-bold">{(totalCourses * 10).toFixed(1)}</h2>
          </div>
          <div className="bg-white p-4 rounded-xl shadow">
            <p className="text-sm text-gray-500">Certificates</p>
            <h2 className="text-2xl font-bold">{Math.floor(totalCourses / 2)}</h2>
          </div>
        </div>

        {/* Enrolled Courses */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {courses.map((course) => {
            const progress =
              course.studentsProgress?.find((p) => p.studentId === id)?.progress || 0;

            return (
              <Link to={`/course/${course._id}/1`} key={course._id}>
                <CourseCard
                  title={course.title}
                  author={course.teacherId || "Unknown"}
                  rating={course.rating || "4.8"}
                  students={course.studentsEnrolled.length}
                  duration={`${course.lessons?.length * 2 || 10}h`}
                  price={course.fees}
                  progress={progress}
                  img={`${import.meta.env.VITE_API_URL}${course.thumbnail}`}
                />
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}

// ✅ Reusable Course Card
function CourseCard({ title, author, rating, students, duration, price, progress, img }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-hidden hover:shadow-lg transition">
      <img src={img} alt={title} className="w-full h-36 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">by {author}</p>
        <div className="flex items-center gap-3 text-sm text-gray-600 mt-2">
          <span className="flex items-center gap-1">
            <FaStar className="text-yellow-500" /> {rating}
          </span>
          <span className="flex items-center gap-1">
            <FaUsers /> {students}
          </span>
          <span className="flex items-center gap-1">
            <FaClock /> {duration}
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-indigo-500 h-2 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-500 mt-1">Progress: {progress}%</p>
        </div>
        <p className="text-indigo-600 font-bold mt-3">₹{price}</p>
      </div>
    </div>
  );
}
