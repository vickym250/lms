import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";
import HomePage from "./page/HomePage";

import CoursePage from "./page/Coursepaly";
import PaymentPage from "./page/Payment";
import AllCourses from "./page/AllCourse";
import LoginPage from "./page/Login";
import About from "./page/About";
import Contact from "./page/Contact";
import CreateCourseForm from "./teacher/CreateCourseForm";
import TeacherDashboard from "./teacher/Dashboard";
import DashComponent from "./teacher/DashComponent";

import Sidebar from "./student/Sidebar";
import Dashboard from "./student/student";
import ViewCourse from "./student/AllCourse";
import AdminDashboard from "./admin/adminDash";
import AdminLogin from "./page/Admin";
import AllStudent from "./admin/AllStudent";
import AllTeacher from "./admin/AllTeacher";



const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/admin/dash",
    element:<AdminDashboard/>,
  },
  {
    path: "/admin",
    element:<AdminLogin/>,
  },
  {
    path: "/admin/allstudent",
    element:<AllStudent/>,
  },
  {
    path: "/admin/allteacher",
    element:<AllTeacher/>,
  },
   {
    path: "/stdash/:id",
    element: <Sidebar/>, // parent component
    children: [
      {
      index: true, // jab /teacherDash pe aaye
      element: <Navigate to="stdash" replace />, // URL automatically /teacherDash/dash ho jayega
    },
      {
        path: "stdash/", // nested route
        element: <Dashboard/>,
      },
      {
        path: "all/", // nested route
        element: <ViewCourse/>,
      },
      
      
      // You can add more nested routes here like "allcourses", "students", etc.
    ],
  },
  {
    path: "/course/:Id/:lessonId",   // ✅ same as sidebar Link
    element: <CoursePage />,
  },
  {
    path: "/payment/:CourseId",   // ✅ same as sidebar Link
    element: <PaymentPage/>
  },
  {
    path: "/allcourse",   // ✅ same as sidebar Link
    element: <AllCourses/>
  },
  {
    path: "/login",   // ✅ same as sidebar Link
    element: <LoginPage/>
  },
  {
    path: "/about",   // ✅ same as sidebar Link
    element: <About/>
  },
  {
    path: "/contact",   // ✅ same as sidebar Link
    element: <Contact/>
  },
  {
    path: "/creat_course",   // ✅ same as sidebar Link
    element: <CreateCourseForm/>
  },

  {
    path: "/teacherDash/:teacherId",
    element: <TeacherDashboard />, // parent component
    children: [
      {
      index: true, // jab /teacherDash pe aaye
      element: <Navigate to="dash" replace />, // URL automatically /teacherDash/dash ho jayega
    },
      {
        path: "createcourse/:id?", // nested route
        element: <CreateCourseForm />,
      },
      {
        path: "dash/", // nested route
        element: <DashComponent/>,
      },
      // You can add more nested routes here like "allcourses", "students", etc.
    ],
  },

]);

export default function App() {
  return <RouterProvider router={router} />;
}
