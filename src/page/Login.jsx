import { useEffect, useState } from "react";
import { auth, provider } from "../firebase";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [uid, setUid] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Check token validity on page load
  useEffect(() => {
    const checkToken = async () => {
      const token = Cookies.get("Token");
      if (!token) return;

      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/user/me`,
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (res.data && res.data.role) {
          if (res.data.role === "Student")
            navigate(`/StDash/${res.data.uid}`);
          else if (res.data.role === "Teacher")
            navigate(`/teacherDash/${res.data.uid}`);
          else navigate("/dashboard");
        } else {
          Cookies.remove("Token");
        }
      } catch (err) {
        console.error("Invalid or expired token ❌", err);
        Cookies.remove("Token");
      }
    };

    checkToken();
  }, [navigate]);

  // -------------------------------
  // 📧 Email/Password Login
  // -------------------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const token = await result.user.getIdToken(true);

      // ✅ Store token for 7 days
      Cookies.set("Token", token, { expires: 7 });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRole(res.data.user.role || "");
      setUid(res.data.user._id);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🔵 Google Login
  // -------------------------------
  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const token = await result.user.getIdToken(true);

      Cookies.set("Token", token, { expires: 7 });

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/login`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRole(res.data.user.role || "");
      setUid(res.data.user._id);
      setLoggedIn(true);
    } catch (err) {
      console.error(err);
      alert("Google Login Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🧩 Role Selection
  // -------------------------------
  const handleRoleSelect = async (selectedRole) => {
    setLoading(true);
    try {
      const token = Cookies.get("Token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/update-role`,
        { role: selectedRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRole(res.data.user.role || selectedRole);
    } catch (err) {
      console.error(err);
      alert("Role update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  // -------------------------------
  // 🚀 Redirect based on role
  // -------------------------------
  useEffect(() => {
    if (!loggedIn || !role) return;

    if (role === "Student") navigate(`/StDash/${uid}`);
    else if (role === "Teacher") navigate(`/teacherDash/${uid}`);
    else navigate("/dashboard");
  }, [loggedIn, role, uid, navigate]);

  // -------------------------------
  // ⏳ Loading screen
  // -------------------------------
  if (loading)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-lg text-gray-600">
        Please wait...
      </div>
    );

  // -------------------------------
  // 🧠 Login Form
  // -------------------------------
  if (!loggedIn && role === "")
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
          <h2 className="text-2xl font-bold text-center mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-gray-700">Password</label>
              <input
                type="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition"
            >
              Login
            </button>
          </form>

          <div className="mt-6">
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 bg-white border py-2 rounded-lg hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Login with Google
            </button>
          </div>

          <p className="text-center text-gray-600 mt-4">
            Don’t have an account?{" "}
            <a href="/register" className="text-blue-500 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </div>
    );

  // -------------------------------
  // 🎯 Role Selection UI
  // -------------------------------
  if (loggedIn && role === "")
    return (
      <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">
          Select Your Role
        </h1>

        <div className="flex flex-col md:flex-row gap-8">
          <div
            className="bg-white shadow-lg rounded-2xl p-6 w-60 text-center hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleRoleSelect("Teacher")}
          >
            <h2 className="text-xl font-semibold text-blue-600">Teacher</h2>
          </div>

          <div
            className="bg-white shadow-lg rounded-2xl p-6 w-60 text-center hover:scale-105 transition-transform cursor-pointer"
            onClick={() => handleRoleSelect("Student")}
          >
            <h2 className="text-xl font-semibold text-green-600">Student</h2>
          </div>
        </div>
      </section>
    );

  return null;
}
