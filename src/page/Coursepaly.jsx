import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function CoursePage() {
  const { Id, lessonId } = useParams();
  const navigate = useNavigate();
console.log(Id);

  const [course, setCourse] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [userId, setUserId] = useState(null);
  const [progress, setProgress] = useState(0);

  // ✅ Fetch user data from token
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = Cookies.get("Token");
        if (!token) {
          localStorage.removeItem("userId");
          navigate("/login");
          return;
        }

        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data._id) {
          setUserId(res.data._id);
          localStorage.setItem("userId", res.data._id);
          console.log("✅ User Data:", res.data);
        } else {
          Cookies.remove("Token");
          localStorage.removeItem("userId");
          navigate("/login");
        }
      } catch (error) {
        console.error("❌ Error fetching user:", error);
        Cookies.remove("Token");
        localStorage.removeItem("userId");
        navigate("/login");
      }
    };

    const savedId = localStorage.getItem("userId");
    if (savedId) setUserId(savedId);
    else fetchUserData();
  }, [navigate]);

  // ✅ Fetch course data
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/course/coursebyid`,
          { Id }
        );
        setCourse(res.data);
        console.log(res.data);
        
      } catch (err) {
        console.error("❌ Error fetching course:", err);
      }
    };
    if (Id) fetchCourse();
  }, [Id]);

  // ✅ Load existing progress for this user
  useEffect(() => {
    if (!userId || !course) return;

    try {
      const userProgress = course.studentsProgress?.find(
        (s) => s.studentId === userId
      );

      if (userProgress) {
        setProgress(userProgress.progress);
        const count = Math.round(
          (userProgress.progress / 100) * course.lessons.length
        );
        const completed = course.lessons
          .slice(0, count)
          .map((l) => l._id);
        setCompletedLessons(completed);
      }
    } catch (err) {
      console.error("❌ Error loading user progress:", err);
    }
  }, [userId, course]);

  // ✅ Extract YouTube videoId safely
  const extractVideoId = (url) => {
    const regex =
      /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]+)/;
    const match = url?.match(regex);
    return match ? match[1] : null;
  };

  // ✅ Convert lessons safely
  const lessons =
    course?.lessons?.map((lesson, index) => ({
      id: lesson._id || `lesson-${index}`,
      title: lesson.title || `Lesson ${index + 1}`,
      videoId: extractVideoId(lesson.videoId),
    })) || [];

  const currentLesson =
    lessons.find((l) => l.id === lessonId) ||
    lessons[0] || { title: "No lessons available", videoId: null };

  // ✅ Handle checkbox (complete/incomplete)
  const handleCheckboxChange = async (lessonId) => {
    const updatedLessons = completedLessons.includes(lessonId)
      ? completedLessons.filter((id) => id !== lessonId)
      : [...completedLessons, lessonId];

    setCompletedLessons(updatedLessons);

    const percent = Math.round(
      (updatedLessons.length / lessons.length) * 100
    );
    setProgress(percent);

    // ✅ Send progress to backend
    if (userId) {
      try {
        await axios.put(
          `${import.meta.env.VITE_API_URL}/api/course/progress`,
          {
            userId,
            courseId: Id,
            percent,
          }
        );
        console.log("✅ Progress updated:", percent);
      } catch (error) {
        console.error("❌ Error updating progress:", error);
      }
    }
  };

  if (!course) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600">
        Loading course...
      </div>
    );
  }

  // ✅ UI
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-r border-gray-200 p-5 shadow-md flex flex-col">
        <h2 className="text-xl font-bold mb-5">{course.title}</h2>

        {/* Progress Bar */}
        <div className="mb-5">
          <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm mt-1 text-gray-600">{progress}% completed</p>
        </div>

        {/* Lessons List */}
        <ul className="space-y-3 flex-1 overflow-y-auto">
          {lessons.map((lesson) => (
            <li
              key={lesson.id}
              className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition ${
                lesson.id === (lessonId || lessons[0]?.id)
                  ? "bg-blue-100 text-blue-600"
                  : "hover:bg-gray-100"
              }`}
            >
              <Link
                to={`/course/${Id}/${lesson.id}`}
                className="flex items-center gap-2 w-full"
              >
                <input
                  type="checkbox"
                  checked={completedLessons.includes(lesson.id)}
                  onChange={() => handleCheckboxChange(lesson.id)}
                  className="w-4 h-4 cursor-pointer accent-blue-500"
                />
                <span>{lesson.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </aside>

      {/* Main Video Section */}
      <main className="flex-1 p-6">
         <div className="flex justify-end mb-4">
    <button
      onClick={() => navigate(`/stdash/${userId}`)}
      className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
    >
      ← Back to Dashboard
    </button>
  </div>
        <h1 className="text-2xl font-bold mb-4">{currentLesson.title}</h1>
        {currentLesson.videoId ? (
          <div className="aspect-video w-10/12 mx-auto rounded-xl overflow-hidden shadow-lg">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${currentLesson.videoId}`}
              title={currentLesson.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <p className="text-gray-500 text-center mt-10">
            No video available for this lesson.
          </p>
        )}
      </main>
    </div>
  );
}
