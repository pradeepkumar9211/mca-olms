import { useState } from "react";
import toast from "react-hot-toast";
// import Navbar from "../../components/common/Navbar";
import StudentLayout from "../../components/common/StudentLayout";

import { useAuth } from "../../context/AuthContext";
import { updateStudentProfile } from "../../api/dashboardApi";
import { changePassword } from "../../api/authApi";

function StudentProfile() {
  const { user, login, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);

  const [form, setForm] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
  });

  const [pwForm, setPwForm] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateStudentProfile(form);
      login({ ...user, ...form }, token);
      toast.success("Profile updated!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwLoading(true);
    try {
      await changePassword(pwForm);
      toast.success("Password changed successfully!");
      setPwForm({ oldPassword: "", newPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <StudentLayout>

    
    <div className="min-h-screen bg-gray-50">
      {/* <Navbar /> */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">My Profile</h1>

        {/* profile form */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal info</h2>

          {/* avatar preview */}
          {form.avatar && (
            <img
              src={form.avatar}
              alt="avatar"
              className="w-16 h-16 rounded-full object-cover mb-4 border border-gray-200"
            />
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full name</label>
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
              <input
                value={form.avatar}
                onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                placeholder="https://..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? "Saving..." : "Save changes"}
            </button>
          </form>
        </div>

        {/* change password */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Change password</h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <input
                type="password"
                value={pwForm.oldPassword}
                onChange={(e) => setPwForm({ ...pwForm, oldPassword: e.target.value })}
                placeholder="••••••••"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input
                type="password"
                value={pwForm.newPassword}
                onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                placeholder="Min 8 characters"
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              disabled={pwLoading}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-gray-900 disabled:opacity-50 transition-colors"
            >
              {pwLoading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </div>
    </StudentLayout>
  );
}

export default StudentProfile;
// ```

// ---

// All 6 student pages done! ✅

// **Test these flows:**
// ```
// /student/dashboard    → stats + recent courses
// /student/enrollments  → enrolled courses with progress
// /student/learn/:id    → video/pdf viewer + mark watched
// /student/wishlist     → wishlist management
// /student/payments     → payment history table
// /student/profile      → update profile + change password