import React, { useEffect, useState } from 'react'
import CourseTable from './courseTable';
import { data, useParams } from 'react-router-dom';
import axios from 'axios';

export default function DashComponent() {

  let { teacherId } = useParams()
  let [courses, setcourses] = useState([])
  let [tstudent, setstudent] = useState()
  let [erning, seterning] = useState(0)



  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/showcourse`,
          { teacherId }
        );
        const data = res.data.data;
        setcourses(data);


        // Loop through data properly
        let enrol = 0;
        let feest = 0;

        for (let i = 0; i < data.length; i++) {
          const students = data[i].studentsEnrolled.length;
          enrol += students;
          feest += students * data[i].fees; // correct logic
        }

        setstudent(enrol);
       seterning( feest);








      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, [teacherId]);




  return (
    <>
      {/* Dashboard Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-600">Teacher Panel</div>
      </div>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Courses Created</div>
          <div className="text-2xl font-semibold mt-2">{courses.length}</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Students Enrolled</div>
          <div className="text-2xl font-semibold mt-2">{tstudent}</div>
        </div>



        {/* 💰 Earning Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="text-sm text-gray-500">Total Earnings</div>
          <div className="text-2xl font-semibold mt-2 text-green-600">₹{erning}</div>

        </div>
      </div>

      {/* Student Progress Overview */}


      {/* Courses Table */}
      <CourseTable />
    </>
  );
}
