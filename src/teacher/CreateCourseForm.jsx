import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, useNavigate } from "react-router-dom";

const CreateCourseForm = () => {
  const [title, setTitle] = useState("");
  const [fees, setFees] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [lessons, setLessons] = useState([{ title: "", videoId: "", duration: "" }]);
  const [isEditing, setIsEditing] = useState(false);

  const { teacherId, id } = useParams();
  const token = Cookies.get("Token");
  const navigate = useNavigate();

  // ✅ Fetch existing course if editing
  useEffect(() => {
    if (id) {
      const fetchCourse = async () => {
        try {
          const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/course/coursebyid`, { id });
          const data = res.data;

          setTitle(data.title || "");
          setFees(data.fees || "");
          setLessons(data.lessons?.length ? data.lessons : [{ title: "", videoId: "", duration: "" }]);
          if (data.thumbnail) setPreview(`${import.meta.env.VITE_API_URL}${data.thumbnail}`);
          setIsEditing(true);
        } catch (err) {
          console.error("❌ Error fetching course:", err);
        }
      };
      fetchCourse();
    }
  }, [id]);

  // ✅ Handle lessons
  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const addLesson = () => setLessons([...lessons, { title: "", videoId: "", duration: "" }]);
  const removeLesson = (index) => setLessons(lessons.filter((_, i) => i !== index));

  // ✅ Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token || !teacherId) {
      alert("❌ Teacher ID या Token missing है!");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("fees", fees);
    formData.append("lessons", JSON.stringify(lessons));
    if (file) formData.append("thumbnail", file);
    if (isEditing) formData.append("id", id);

    console.log("📦 Sending FormData:");
    for (let [key, val] of formData.entries()) console.log(`${key} →`, val);

    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const res = isEditing
        ? await axios.put(`${import.meta.env.VITE_API_URL}/api/course/update`, formData, { headers })
        : await axios.post(`${import.meta.env.VITE_API_URL}/api/course/create/${teacherId}`, formData, { headers });

      if (res.data.success) {
        alert(isEditing ? "✅ Course updated successfully!" : "✅ Course created successfully!");
        navigate(`/teacherDash/${teacherId}/dash`);
      } else {
        alert(res.data.message || "❌ Operation failed!");
      }
    } catch (error) {
      console.error("❌ Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating/updating course");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-extrabold text-center text-gray-800">
          {isEditing ? "Update Course" : "Create Course"}
        </h2>

        <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
          {/* Title */}
          <div>
            <label>Course Name</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>

          {/* Fees */}
          <div>
            <label>Fees (₹)</label>
            <input
              type="number"
              value={fees}
              onChange={(e) => setFees(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border rounded-md"
            />
          </div>

          {/* File Upload */}
          <div>
            <label>Upload Thumbnail</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png"
              onChange={(e) => {
                const selected = e.target.files[0];
                setFile(selected);
                setPreview(URL.createObjectURL(selected));
              }}
              className="w-full mt-2 border-2"
            />
            {preview && (
              <img
                src={preview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-md mt-3 border"
              />
            )}
          </div>

          {/* Lessons */}
          <div>
            <label>Lessons</label>
            {lessons.map((lesson, i) => (
              <div key={i} className="mt-3 border p-3 rounded-md bg-gray-50">
                <input
                  type="text"
                  placeholder="Lesson Title"
                  value={lesson.title}
                  onChange={(e) => handleLessonChange(i, "title", e.target.value)}
                  className="w-full px-2 py-1 border rounded-md mb-2"
                />
                <input
                  type="text"
                  placeholder="YouTube Video ID"
                  value={lesson.videoId}
                  onChange={(e) => handleLessonChange(i, "videoId", e.target.value)}
                  className="w-full px-2 py-1 border rounded-md mb-2"
                />
                <input
                  type="text"
                  placeholder="Duration (e.g. 10:30)"
                  value={lesson.duration}
                  onChange={(e) => handleLessonChange(i, "duration", e.target.value)}
                  className="w-full px-2 py-1 border rounded-md"
                />
                {lessons.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeLesson(i)}
                    className="mt-2 text-red-600 text-sm"
                  >
                    ❌ Remove Lesson
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addLesson}
              className="mt-3 px-4 py-2 bg-green-500 text-white rounded-md"
            >
              ➕ Add Lesson
            </button>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className={`w-full px-4 py-2 text-lg text-white rounded-md ${
              isEditing ? "bg-blue-600 hover:bg-blue-700" : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {isEditing ? "Update Course" : "Create Course"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateCourseForm;
