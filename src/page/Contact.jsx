import React, { useState } from "react";
import Navbar from "../component/Header";
import Footer from "../component/footer";
import axios from "axios";
import Cookies from "js-cookie";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      const token = Cookies.get("Token"); // ✅ get token from cookie
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/email/send`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResponseMsg("✅ Message sent successfully!");
      setFormData({ name: "", subject: "", message: "" });
    } catch (error) {
      console.error("Error:", error);
      setResponseMsg("❌ Failed to send message. Try again!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-6 lg:px-8 py-16 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Get in <span className="text-purple-600">Touch</span>
            </h1>
            <p className="mt-4 text-gray-600">
              Have questions or need help? Fill out the form or reach us directly
              through the details below. We’d love to hear from you.
            </p>

            <div className="mt-8 space-y-4">
              <p className="text-gray-700">
                📍 Address: 123 Learning St, New Delhi, India
              </p>
              <p className="text-gray-700">📧 Email: support@learnhub.com</p>
              <p className="text-gray-700">📞 Phone: +91 98765 43210</p>
            </div>
          </div>

          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d"
              alt="Contact"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </section>

        {/* Contact Form */}
        <section className="bg-white shadow-md rounded-2xl max-w-4xl mx-auto p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Send us a Message
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your Name"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Subject"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <textarea
              rows="5"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            ></textarea>

            <button
              type="submit"
              disabled={loading}
              className={`${
                loading ? "bg-gray-400" : "bg-purple-600 hover:bg-purple-700"
              } text-white px-6 py-3 rounded-lg font-medium transition`}
            >
              {loading ? "Sending..." : "Send Message →"}
            </button>

            {responseMsg && (
              <p className="mt-4 text-center text-gray-700">{responseMsg}</p>
            )}
          </form>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Contact;
