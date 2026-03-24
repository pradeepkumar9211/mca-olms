import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../../components/common/Navbar";
import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { studentSignin, instructorSignin, adminSignin, getMe } from "../../api/authApi";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "student",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let res;
      if (form.role === "student") res = await studentSignin({ email: form.email, password: form.password });
      else if (form.role === "instructor") res = await instructorSignin({ email: form.email, password: form.password });
      else res = await adminSignin({ email: form.email, password: form.password });

      const token = res.data.data.token;

      const demo = await getMe(token);

      // decode role from JWT payload
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userData = { role: form.role, name: demo.data.data.name, ...payload };
      login(userData, token);
      toast.success("Logged in successfully!");

      if (form.role === "student") navigate("/student/dashboard");
      else if (form.role === "instructor") navigate("/instructor/dashboard");
      else navigate("/admin/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm w-full max-w-md p-8">

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* role selector */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">I am a</label>
            <div className="grid grid-cols-3 gap-2">
              {["student", "instructor", "admin"].map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setForm({ ...form, role: r })}
                  className={`py-2 rounded-lg text-sm font-medium capitalize border transition-colors ${form.role === r
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-600 border-gray-300 hover:border-blue-400"
                    }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          New student?{" "}
          <Link to="/signup/student" className="text-blue-600 hover:underline">Sign up</Link>
          {" · "}
          <Link to="/signup/instructor" className="text-blue-600 hover:underline">Join as instructor</Link>
        </p>
      </div>
    </div>
    </>

  );
}

export default Login;