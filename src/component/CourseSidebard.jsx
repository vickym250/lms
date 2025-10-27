import { Link } from "react-router-dom";

export default function CourseSidebar({ Id, lessons, lessonId }) {
  return (
    <aside className="w-72 bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-4">Course Lessons</h2>
      <ul className="space-y-2">
        {lessons.map((lesson) => (
          <li key={lesson.id}>
            <Link
              to={`/courseplay/${Id}/${lesson.id}`}
              className={`block p-3 rounded-lg ${
                lessonId === lesson.id
                  ? "bg-indigo-100 text-indigo-600 font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              {lesson.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
