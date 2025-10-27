import React from "react";
import { FaBookOpen } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-[#0b1120] text-gray-300 py-12">
      <div className="container mx-auto px-6 grid md:grid-cols-4 gap-10">
        
        {/* Logo & Description */}
        <div>
          <div className="flex items-center space-x-2 text-white text-xl font-bold mb-4">
            <FaBookOpen className="text-indigo-500" />
            <span>LearnHub</span>
          </div>
          <p className="text-gray-400 text-sm">
            Empowering learners worldwide with high-quality online education.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-400">About Us</a></li>
            <li><a href="#" className="hover:text-indigo-400">Courses</a></li>
            <li><a href="#" className="hover:text-indigo-400">Instructors</a></li>
            <li><a href="#" className="hover:text-indigo-400">Blog</a></li>
          </ul>
        </div>

        {/* Support Links */}
        <div>
          <h3 className="text-white font-semibold mb-4">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="#" className="hover:text-indigo-400">Help Center</a></li>
            <li><a href="#" className="hover:text-indigo-400">Contact Us</a></li>
            <li><a href="#" className="hover:text-indigo-400">Terms of Service</a></li>
            <li><a href="#" className="hover:text-indigo-400">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-white font-semibold mb-4">Contact Info</h3>
          <ul className="space-y-2 text-sm">
            <li>support@learnhub.com</li>
            <li>1-800-LEARN-HUB</li>
            <li>San Francisco, CA</li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="mt-10 border-t border-gray-700 pt-6 text-center text-sm text-gray-500">
        © 2024 LearnHub. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
