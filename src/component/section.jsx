import React from "react";
import { FaBookOpen, FaUsers, FaAward } from "react-icons/fa";

const Hero = () => {
  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-6 grid md:grid-cols-2 items-center gap-10">
        
        {/* Left Content */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight text-gray-900">
            Learn Anytime, <span className="text-indigo-600">Anywhere</span>
          </h1>
          <p className="text-gray-600 mt-4">
            Join thousands of learners today and unlock your potential with our
            expert-led courses and interactive learning experiences.
          </p>

          {/* Buttons */}
          <div className="mt-6 flex space-x-4">
            <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700">
              Browse Courses →
            </button>
            <button className="flex items-center border border-gray-300 px-6 py-3 rounded-lg hover:bg-gray-100">
              ▶ Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="mt-12 grid grid-cols-3 gap-6">
            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <FaBookOpen size={24} />
              </div>
              <h3 className="font-bold text-lg mt-2">10,000+</h3>
              <p className="text-gray-500 text-sm">Courses</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <FaUsers size={24} />
              </div>
              <h3 className="font-bold text-lg mt-2">500K+</h3>
              <p className="text-gray-500 text-sm">Students</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="bg-indigo-100 p-3 rounded-xl text-indigo-600">
                <FaAward size={24} />
              </div>
              <h3 className="font-bold text-lg mt-2">95%</h3>
              <p className="text-gray-500 text-sm">Success Rate</p>
            </div>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex justify-center md:justify-end">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
            alt="Students Learning"
            className="rounded-2xl shadow-xl"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;
