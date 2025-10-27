// src/pages/About.jsx
import React from "react";
import Navbar from "../component/Header";
import Footer from "../component/footer";

const About = () => {
  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="flex flex-col-reverse md:flex-row items-center gap-10 px-6 lg:px-20 py-16">
        {/* Text Section */}
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-800">
            About <span className="text-purple-600">LearnHub</span>
          </h1>
          <p className="text-gray-600 mt-6 leading-relaxed">
            LearnHub is an online learning platform that helps learners acquire
            new skills, achieve their goals, and grow their careers. With thousands
            of expert-led courses and an engaging community, we are committed to
            making learning accessible for everyone, anywhere.
          </p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-600">10,000+</h2>
              <p className="text-gray-600 text-sm">Courses</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-600">500K+</h2>
              <p className="text-gray-600 text-sm">Students</p>
            </div>
            <div className="text-center">
              <h2 className="text-2xl font-bold text-purple-600">95%</h2>
              <p className="text-gray-600 text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Image Section */}
        <div className="flex-1">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="About LearnHub"
            className="rounded-2xl shadow-lg"
          />
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 lg:px-20 py-12 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Our <span className="text-purple-600">Mission</span>
          </h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Our mission is to empower learners around the world by providing
            high-quality education that is flexible, affordable, and effective.
            We believe knowledge should be accessible to everyone regardless of
            their background.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Our <span className="text-purple-600">Vision</span>
          </h2>
          <p className="text-gray-600 mt-3 leading-relaxed">
            Our vision is to become the world’s most trusted learning community,
            where learners and instructors come together to share knowledge,
            skills, and experiences that shape the future.
          </p>
        </div>
      </section>
    </div>
    <Footer/>
    </>
  );
};

export default About;
